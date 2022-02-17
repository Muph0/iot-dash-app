import { Observable } from "rxjs";

/**
 * Convert an observable to a promise.
 * @param o The observable to subscribe.
 * @returns A promise that resolves when the observable emits first value.
 */
export function firstToPromise<T>(o: Observable<T>): Promise<T> {
    return new Promise((resolve, reject) => {
        var sub = o.subscribe({
            next: t => {resolve(t); setTimeout(() => { sub.unsubscribe(); }, 0); },
            error: err => { reject(err); setTimeout(() => { sub.unsubscribe(); }, 0); },
        });
    });
}