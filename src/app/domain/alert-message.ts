import { assert } from "src/app/utils/assert";

export type AlertClass
    = 'primary'
    | 'secondary'
    | 'success'
    | 'danger'
    | 'warning'
    | 'info'
    | 'light'
    | 'dark';

export class AlertMessage {

    public readonly id: string;
    public readonly created = new Date();

    constructor(
        public readonly html: string,
        public readonly type: AlertClass,
        public readonly title: string,
        public readonly icon?: string,
        public readonly exitButtonIcon?: string,
        public readonly onExit?: () => void,

    ) {
        this.id = btoa(new Array(3).fill(0).map(v => Math.random()).toString()).substring(0, 16);

        switch (type) {
            case 'danger':
            case 'warning':
                this.icon = icon || 'exclamation-triangle-fill';
                break;

            default:
                break;
        }
    }

    getElement(): HTMLElement {
        const elem = document.getElementById('toast-' + this.id);
        assert(elem);
        return elem;
    }

}