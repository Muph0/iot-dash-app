import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { TokenPair } from "../domain/token";
import * as Contract from "../../contract/backend-v1";
import { ApiV1ServiceProvider } from "./api-v1-provider.service";
import * as Domain from "../domain";
import { Result, assert } from "src/app/utils";
import { ContractDomainMapping } from "src/contract/mappings/contract-domain-mapping";
import { HistoryEntry, IotInterface, IotInterfaceKind, TimeSpan } from "../domain";


type AsyncResult<T> = Promise<Result<T>>
type PartialInterface = Partial<Contract.IotInterface> & { id: string; }

@Injectable({
    providedIn: 'root',
})
export class InterfaceService {


    private ifapi: Contract.InterfaceApi;

    private cache: Map<string, Domain.IotInterface> = new Map();

    constructor(
        private provider: ApiV1ServiceProvider
    ) {
        this.ifapi = provider.getInterfaceApi();
    }

    async getAll() {
        let backendResponse = await this.unwrapHttpError(() => this.ifapi.getInterfaces());
        return backendResponse.map(iface => ContractDomainMapping.MapInterface(iface));
    }

    async unwrapHttpError<TResponse>(fn: () => Promise<TResponse>): Promise<TResponse> {
        let backendResponse: TResponse;
        try {
            backendResponse = await fn();
        } catch (fetchResponse) {
            if (fetchResponse instanceof Response) {
                backendResponse = await fetchResponse.json();
            } else {
                throw fetchResponse;
            }
        }
        return backendResponse;
    }

    async patchInterface(patch: PartialInterface): AsyncResult<Domain.IotInterface> {
        let backendResponse = await this.unwrapHttpError(() => this.ifapi.updateInterface({
            ifaceId: patch.id,
            interfacePatchRequest: patch,
        }));

        if (backendResponse.success) {
            return Result.Ok(
                ContractDomainMapping.MapInterface(backendResponse._interface!)
            );
        } else {
            return Result.Err(backendResponse.errors!);
        }
    }

    async removeInterface(iface: Domain.IotInterface): AsyncResult<void> {
        let backendResponse = await this.unwrapHttpError(() => this.ifapi.deleteInterface({
            ifaceId: iface.id,
        }));

        if (backendResponse.success) {
            return Result.Ok(undefined);
        } else {
            return Result.Err(backendResponse.errors!);
        }
    }

    async createInterface(): AsyncResult<Domain.IotInterface> {
        let backendResponse = await this.unwrapHttpError(() => this.ifapi.createInterface({
            interfaceCreateRequest: {
                kind: IotInterfaceKind.Probe,
                historyEnabled: false,
            }
        }));

        if (backendResponse.success) {
            return Result.Ok(ContractDomainMapping.MapInterface(backendResponse._interface!));
        } else {
            return Result.Err(backendResponse.errors!);
        }
    }

    getLastData(iface: IotInterface, span: TimeSpan, pts?: number) {
        const to = new Date();
        const from = span.subFrom(to);
        return this.getHistoryData(iface, from, to, pts);
    }
    async getHistoryData(iface: IotInterface, from: Date, to: Date, pts?: number): AsyncResult<HistoryEntry[]> {
        let backendResponse = await this.unwrapHttpError(() => this.ifapi.getHistory({
            ifaceId: iface.id,
            historyRequest: {
                fromUTC: from,
                toUTC: to,
                pointCount: pts,
            },
        }));

        if (backendResponse.success) {
            const data: Contract.HistoryEntry[] = backendResponse.values!;
            const mapping = ContractDomainMapping.MapHistory;
            return Result.Ok(data.map(mapping));
        } else {
            return Result.Err(backendResponse.errors!);
        }
    }
}