import { InterfaceKind as IotInterfaceKind } from 'src/contract/backend-v1';
export { InterfaceKind as IotInterfaceKind } from 'src/contract/backend-v1'

export class IotInterface {
    constructor(
        public id: string,
        public kind: IotInterfaceKind,
        public value: number,
        public historyEnabled: boolean,
        public topic?: string,
        public expression?: string,
    ) { }

    get isOutput() {
        return this.kind === IotInterfaceKind.Switch;
    }
}


