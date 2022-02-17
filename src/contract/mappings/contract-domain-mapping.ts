import * as Contract from "../backend-v1";
import * as Domain from "../../app/domain";


export class ContractDomainMapping {
    static MapInterface(contract: Contract.IotInterface): Domain.IotInterface {
        return new Domain.IotInterface(
            contract.id,
            contract.kind,
            contract.value,
            contract.historyEnabled,
            contract.topic || undefined,
            contract.expression || undefined,
        );
    }
    static MapHistory(contract: Contract.HistoryEntry): Domain.HistoryEntry {
        return {
            time: ContractDomainMapping.UTCtoLocal(contract.timeUTC),
            value: contract.average,
            min: contract.min,
            max: contract.max,
        };
    }
    static UTCtoLocal(utc: Date): Date {
        return new Date(utc.getTime() + new Date().getTimezoneOffset());
    }
}

