import { Injectable } from '@angular/core';

@Injectable({
    providedIn: 'root'
})
export class RandomProvider {

    constructor() { }

    getToken(length: number) {
        const palette = 'abcdefghijklmnopqrstuvwxyz0123456789';
        var result = [];

        for (var i = 0; i < length; i++) {
            result.push(palette[Math.floor(Math.random() * palette.length)]);
        }

        return result.join('');
    }
}
