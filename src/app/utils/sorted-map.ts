

export class SortedMap<K, V> implements Map<K, V> {
    private internal: Map<K, V>;
    private sorted: boolean = true;
    public readonly comparer: (a: [K, V], b: [K, V]) => number;

    constructor(entries?: readonly (readonly [K, V])[] | null, comparer?: ((a: [K, V], b: [K, V]) => number) | null) {
        this.internal = new Map(entries);
        this.comparer = comparer || ((a: [any, any], b: [any, any]) => {
            if (a[0] < b[0]) return -1;
            if (a[0] > b[0]) return 1;
            if (a[0] <= b[0] || a[0] === b[0]) return 0;
            return a[0] - b[0];
        });
    }

    private ensureSorted() {
        if (!this.sorted) {
            this.internal = new Map([...this.internal].sort(this.comparer))
        }
        this.sorted = true;
    }

    clear(): void {
        this.internal.clear();
        this.sorted = true;
    }
    delete(key: K): boolean {
        return this.internal.delete(key);
    }
    forEach(callbackfn: (value: V, key: K, map: Map<K, V>) => void, thisArg?: any): void {
        this.ensureSorted();
        this.internal.forEach(callbackfn, thisArg);
    }
    get(key: K): V | undefined {
        return this.internal.get(key);
    }
    has(key: K): boolean {
        return this.internal.has(key);
    }
    set(key: K, value: V): this {
        if (!this.internal.has(key)) this.sorted = false;
        this.internal.set(key, value);
        return this;
    }
    get size(): number {
        return this.internal.size;
    }
    entries(): IterableIterator<[K, V]> {
        this.ensureSorted();
        return this.internal.entries();
    }
    keys(): IterableIterator<K> {
        this.ensureSorted();
        return this.internal.keys();
    }
    values(): IterableIterator<V> {
        this.ensureSorted();
        return this.internal.values();
    }
    [Symbol.iterator](): IterableIterator<[K, V]> {
        this.ensureSorted();
        return this.internal[Symbol.iterator]();
    }
    get [Symbol.toStringTag]() {
        return this.internal[Symbol.toStringTag];
    }

}