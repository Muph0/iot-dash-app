import * as Contract from 'src/contract/backend-v1';
import { InterfaceService } from '../services/interface.service';
export { InterfaceKind as IotInterfaceKind } from 'src/contract/backend-v1'

export class IotInterface {
    constructor(
        private db: InterfaceService,
        readonly id: string,
        public kind: Contract.InterfaceKind,
        public value: number,
        public historyEnabled: boolean,
        public topic?: string,
        public expression?: string,
    ) { }

    get isOutput() {
        return this.kind === Contract.InterfaceKind.Switch;
    }

    async saveChanges() {
        this.db.patchInterface(this);
    }
    updateFrom(contract: Contract.IotInterface) {
        this.kind = contract.kind;
        this.value = contract.value;
        this.historyEnabled = contract.historyEnabled;
        this.topic = contract.topic ?? undefined;
        this.expression = contract.expression ?? undefined;
    }
}


