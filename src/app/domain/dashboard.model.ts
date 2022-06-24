import { DashboardService } from "../services/dashboard.service";

export interface DashCardInfo {
    readonly id: number;
    type: 'gauge' | 'chart';
    width: 1 | 2 | 3 | 4 | 5 | 6;
    readonly sources?: readonly string[];
};

export class PersistentCard implements DashCardInfo {

    constructor(
        private db: DashboardService,
        fromInfo: DashCardInfo
    ) {
        this.id = fromInfo.id;
        this._type = fromInfo.type;
        this._width = fromInfo.width;
        this._sources = fromInfo.sources ? [...fromInfo.sources] : [];
    }

    public readonly id: number;

    private _type: DashCardInfo['type'];
    get type() { return this._type; }
    set type(value: DashCardInfo['type']) {
        this._type = value;
        this.persist();
    }

    private _width: DashCardInfo['width'];
    get width() { return this._width; }
    set width(value: DashCardInfo['width']) {
        this._width = value;
        this.persist();
    }

    private _sources: string[];
    get sources() { return Object.freeze([...this._sources]); }
    get sourceIndices() { return this._sources.map((v, i) => i); }

    addSource(source: string) {
        this._sources.push(source);
        this.persist();
    }
    removeSource(idx: number) {
        this._sources.splice(idx, 1);
        this.persist();
    }
    updateSource(idx: number, source: string) {
        this._sources[idx] = source;
        this.persist();
    }

    remove() {
        this.db.removeCard(this);
    }

    bareInfo(): DashCardInfo {
        return {
            id: this.id,
            type: this.type,
            width: this.width,
            sources: this.sources,
        }
    }

    private persist() {
        this.db.updateCard(this);
    }
}