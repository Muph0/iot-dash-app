import { Inject, Injectable, Injector } from "@angular/core";
import { FetchParams, Middleware, RequestContext } from "src/contract/backend-v1";
import { Jwt } from "../domain/token";
import { IIdentityService } from "../services/identity.service";


@Injectable({ providedIn: 'root' })
export class AuthenticationMiddleware implements Middleware {

    constructor(injector: Injector) {
        this.injected$ = new Promise((resolve, reject) => {
            setTimeout(() => {
                this.auth = injector.get(IIdentityService);
                resolve();
            }, 0);
        });
    }
    private auth: IIdentityService;
    private readonly injected$: Promise<void>;

    async pre(context: RequestContext): Promise<FetchParams | void> {
        await this.injected$;

        if (this.auth.isLoggedIn() && !context.url.endsWith('identity/refresh')) {
            const headers = context.init.headers || {} as any;
            var token = this.auth.getTokenPair()?.jwt as Jwt;

            if (token.isExpired()) {
                try {
                    const newPair = await this.auth.refresh();
                    token = newPair.jwt;
                } catch (err) {
                    this.auth.logout();
                    if (err.errors) {
                        err.errors.push('You will need to log in again.');
                    }
                }
            }

            headers['Authorization'] = `Bearer ${token.toString()}`;
        }

    }

}