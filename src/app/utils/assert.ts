

export function assert(value: any, message?: string): asserts value {
    if (!value) {
        if (message) {
            console.error(message);
        }
        throw new Error('Assertion failed.');
    }
}

export function asserted<T>(value: T | null | undefined, message?: string) : T {
    assert(value, message);
    return value;
}