import * as Contract from "../backend-v1";
import * as Domain from "../../app/domain";
import { InterfaceService } from "src/app/services/interface.service";


export class ContractDomainMapping {
    static MapInterface(contract: Contract.IotInterface, db: InterfaceService): Domain.IotInterface {
        return new Domain.IotInterface(
            db,
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
    static UTCtoLocal(utc: Date | string | number): Date {
        return new Date(new Date(utc).getTime() + new Date().getTimezoneOffset());
    }
}

