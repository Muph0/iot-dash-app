import { Injectable } from "@angular/core";
import { assert } from "../utils/assert";


@Injectable({
    providedIn: 'root'
})
export class StorageService {

    public hasKey(key: string): boolean {
        return localStorage.getItem(key) !== null;
    }
    public get<T>(key: string): T {
        const value = localStorage.getItem(key);
        assert(value);
        return JSON.parse(value);
    }
    public tryGet<T>(key: string): T | null {
        const value = localStorage.getItem(key);
        return value ? JSON.parse(value) : value;
    }
    public set<T>(key: string, value: T): void {
        localStorage.setItem(key, JSON.stringify(value));
    }
    public remove(key: string): boolean {
        const result = this.hasKey(key);
        localStorage.removeItem(key);
        return result;
    }

}