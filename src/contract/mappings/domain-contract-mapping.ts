import * as Contract from "../backend-v1";
import * as Domain from "../../app/domain";


export class DomainContractMapping {
    static MapInterface(domain: Domain.IotInterface): Partial<Contract.IotInterface> {
        return {
            id: domain.id,
            kind: domain.kind,
            topic: domain.topic,
            expression: domain.expression,
            value: domain.value,
        }
    }
}

