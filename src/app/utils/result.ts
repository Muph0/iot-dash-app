export type Ok<T> = { ok: true, value: T };
export type Err = { ok: false, errors: string[] };

export type Result<T> = (Ok<T> | Err) & IUnwrappable<T>;

export namespace Result {
    export function Ok<T>(value: T): Result<T> {
        return new p_Result(true, value, undefined);
    }
    export function Err<T>(errors: string[]): Result<T> {

        return new p_Result<false, T>(false, undefined, errors);
    }
}

interface IUnwrappable<T> {
    unwrap(): T;
}

class p_Result<B, T> implements IUnwrappable<T> {

    public readonly value: T;
    public readonly errors: string[];

    constructor(
        public readonly ok: B,
        value: T | undefined,
        errors: string[] | undefined,
    ) {
        if (ok) {
            this.value = value!;
        } else {
            this.errors = errors!;
        }
    }

    unwrap(): T {
        if (this.ok) {
            return this.value as T;
        } else {
            throw new Error(this.errors?.join(", "));
        }
    }
}