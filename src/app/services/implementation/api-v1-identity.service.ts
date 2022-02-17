import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { Jwt, TokenPair } from 'src/app/domain/token';
import { IIdentityService } from '../identity.service';

import { AuthResponse, IdentityApi } from 'src/contract/backend-v1';
import { ApiV1ServiceProvider } from '../api-v1-provider.service';
import { StatusService } from '../alert.service';
import { map } from 'rxjs/operators';
import { StorageService } from '../persistency.service';
import { assert } from '../../utils/assert';

const tokenPairStoreName = 'login';
interface PersistentTokenPair {
    refresh: string,
    jwt: string,
}

@Injectable({
    providedIn: 'root'
})
export class ApiV1IdentityService implements IIdentityService {

    private readonly api: IdentityApi;
    private readonly identity: BehaviorSubject<TokenPair | null> = new BehaviorSubject(null);

    constructor(
        apiProvider: ApiV1ServiceProvider,
        private readonly status: StatusService,
        private readonly storage: StorageService,
    ) {
        this.api = apiProvider.getIdentityApi();

        const keypair = storage.tryGet<PersistentTokenPair>(tokenPairStoreName);
        if (keypair) {
            this.identity.next({
                jwt: new Jwt(keypair.jwt),
                refreshToken: keypair.refresh
            });
        }
    }
    public get loggedIn(): Observable<boolean> {
        return this.identity.pipe(
            map(value => !!value)
        );
    }
    public isLoggedIn(): boolean {
        return this.identity.getValue() !== null;
    }

    public get tokenPair(): Observable<TokenPair | null> {
        return this.identity.asObservable();
    }

    public getTokenPair(): TokenPair | null {
        return this.identity.value;
    }

    public async login(email: string, password: string): Promise<TokenPair> {

        try {
            const authResult = await this.api.login({ userLoginRequest: { email, password } });

            assert(authResult.success);
            assert(authResult.token);
            assert(authResult.refreshToken);

            this.status.onlineStatus.next(true);
            this.pushTokenPair(authResult.token, authResult.refreshToken);

        } catch (err) {
            if (err instanceof Response) {
                const resp = err as Response;
                throw await resp.json();
            } else {
                this.status.onlineStatus.next(false);
                throw err;
            }
        }

        return this.identity.getValue() as TokenPair;
    }

    public async refresh(): Promise<TokenPair> {

        const tokenPair = this.identity.getValue();
        if (!tokenPair) {
            throw new Error('Invalid operation');
        }

        try {
            const authResult = await this.api.refresh({
                refreshTokenRequest: {
                    token: tokenPair.jwt.toString(),
                    refreshToken: tokenPair.refreshToken
                }
            });


            assert(authResult.success);
            assert(authResult.token);
            assert(authResult.refreshToken);

            this.status.onlineStatus.next(true);
            this.pushTokenPair(authResult.token, authResult.refreshToken);

        } catch (err) {
            if (err instanceof Response) {
                const resp = err as Response;
                throw await resp.json();
            } else {
                this.status.onlineStatus.next(false);
                throw err;
            }
        }

        return this.identity.getValue() as TokenPair;
    }

    private pushTokenPair(jwt: string, refreshToken: string) {
        this.storage.set<PersistentTokenPair>(tokenPairStoreName, {
            jwt: jwt.toString(),
            refresh: refreshToken,
        });
        this.identity.next({
            jwt: new Jwt(jwt),
            refreshToken: refreshToken,
        })
    }

    public logout() {
        this.storage.remove(tokenPairStoreName);
        this.identity.next(null);
    }
}
