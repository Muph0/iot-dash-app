import { TimeSpan } from "./time-span";

export interface TokenPair {

    jwt: Jwt;
    refreshToken: string;

}

export const enum JwtClaims {
    Algorithm = 'alg',
    Type = 'typ',
    Subject = 'sub',
    JsonTokenId = 'jti',
    Expires = 'exp',
    IssuedAt = 'iat',
    Id = 'id',
}

export class Jwt {

    private readonly header: { readonly [key: string]: string }
    private readonly payload: { readonly [key: string]: string }
    private readonly original: string;

    constructor(token: string) {
        const err = new Error('Invalid token format.');

        const parts = token.split('.');
        if (parts.length !== 3) throw err;

        this.original = token;

        try {
            this.header = JSON.parse(atob(parts[0]));
            this.payload = JSON.parse(atob(parts[1]));
        } catch (error) {
            throw err;
        }
    }
    public toString(): string {
        return this.original;
    }

    public hasClaim(claim: JwtClaims) {
        return claim in this.header || claim in this.payload;
    }

    private getRequiredClaim(claim: JwtClaims): string {
        if (!this.hasClaim(claim)) {
            throw new Error(`Token does not contain claim "${claim}".`);
        }
        return this.header[claim] || this.payload[claim];
    }

    public issuedAt(): Date {
        const claim = this.getRequiredClaim(JwtClaims.IssuedAt);
        return new Date(Number.parseInt(claim) * 1000);
    }

    /**
     * Extract expiration date information from token.
     * @returns The expiration date of the token.
     */
    public expires(): Date {
        const claim = this.getRequiredClaim(JwtClaims.Expires);
        return new Date(Number.parseInt(claim) * 1000);
    }

    public timeLeft(): TimeSpan {
        if (this.isExpired()) {
            return new TimeSpan(0);
        }
        return new TimeSpan(this.expires().valueOf() - new Date().valueOf());
    }

    public isExpired(): boolean {
        return new Date() > this.expires();
    }

    public getSubject(): string {
        return this.getRequiredClaim(JwtClaims.Subject);
    }
}