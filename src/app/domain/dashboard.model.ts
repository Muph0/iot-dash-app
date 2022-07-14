import { DashboardService } from "../services/dashboard.service";
import { InterfaceService } from "../services/interface.service";
import { IotInterface } from "./interface.model";

export interface DashCardInfo {
    readonly id: number;
    type: 'gauge' | 'chart';
    width: 1 | 2 | 3 | 4 | 5 | 6;
    readonly sources?: readonly string[];
};

type CardSource = IotInterface | null

export class PersistentCard {

    constructor(
        private db: DashboardService,
        private ifdb: InterfaceService,
        fromInfo: DashCardInfo,
    ) {
        this.id = fromInfo.id;
        this._type = fromInfo.type;
        this._width = fromInfo.width;
        this._sources = [];
    }

    static async FromInfoWithSources(db: DashboardService, ifdb: InterfaceService, fromInfo: DashCardInfo) {
        const result = new PersistentCard(db,ifdb, fromInfo);
        if (fromInfo.sources)
            await result.getSources(fromInfo.sources);

        return result;
    }

    public readonly id: number;

    private _type: DashCardInfo['type'];
    get type() { return this._type; }
    set type(value: DashCardInfo['type']) {
        this._type = value;
    }

    private _width: DashCardInfo['width'];
    get width() { return this._width; }
    set width(value: DashCardInfo['width']) {
        this._width = value;
    }

    private _sources: CardSource[];
    get sources() { return Object.freeze([...this._sources]); }
    get sourceIndices() { return this._sources.map((v, i) => i); }

    addSource(source: CardSource) {
        this._sources.push(source);
    }
    removeSource(idx: number) {
        this._sources.splice(idx, 1);
    }
    updateSource(idx: number, source: CardSource) {
        this._sources[idx] = source;
    }

    remove() {
        this.db.removeCard(this);
    }

    bareInfo(): DashCardInfo {
        return {
            id: this.id,
            type: this.type,
            width: this.width,
            sources: this.sources.filter(x => x).map(iface => iface!.id),
        }
    }

    private async getSources(ids: readonly string[]) {
        const results = await Promise.all(ids.map(id => this.ifdb.getInterfaceById(id)));
        this._sources = results.map(r => r.ok ? r.unwrap() : null);
    }

    public persist() {
        this.db.updateCard(this);
    }
}