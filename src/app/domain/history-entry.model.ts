
export interface DataPoint<T> {
    readonly value: T;
    readonly min: T;
    readonly max: T;
}

export interface HistoryEntry extends DataPoint<number> {
    readonly time: Date;
}


