import { Injectable, Injector } from "@angular/core";
import { Configuration, IdentityApi, InterfaceApi } from "src/contract/backend-v1";
import { environment } from "src/environments/environment";
import { AuthenticationMiddleware } from "../middleware/authentication.mw";
import { IIdentityService } from "./identity.service";

@Injectable({
    providedIn: 'root',
})
export class ApiV1ServiceProvider {

    private identity?: IdentityApi;
    private interfaces?: InterfaceApi;
    private configuration?: Configuration;

    constructor(private readonly injector: Injector) {

    }

    public getConfig(): Configuration {
        if (!this.configuration) {
            this.configuration = new Configuration({
                basePath: environment.backendBasePath,
                middleware: [
                    this.injector.get(AuthenticationMiddleware)
                ],
            });
        }

        return this.configuration;
    }
    public getIdentityApi(): IdentityApi {
        if (!this.identity) {
            this.identity = new IdentityApi(this.getConfig());
        }

        return this.identity;
    }

    public getInterfaceApi(): InterfaceApi {
        if (!this.interfaces) {
            this.interfaces = new InterfaceApi(this.getConfig());
        }

        return this.interfaces;
    }

}