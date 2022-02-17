import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { TokenPair } from "../domain/token";

export abstract class IIdentityService {

    public abstract isLoggedIn(): boolean;
    public abstract getTokenPair(): TokenPair | null;
    public abstract get tokenPair(): Observable<TokenPair | null>;
    public abstract get loggedIn(): Observable<boolean>;

    public abstract login(email: string, password: string): Promise<TokenPair>;
    public abstract refresh(): Promise<TokenPair>;
    public abstract logout(): void;

}