import { environment } from "src/environments/environment";


export class TimeSpan {

    public readonly days: number;
    public readonly hours: number;
    public readonly minutes: number;
    public readonly seconds: number;
    public readonly millis: number;
    public readonly totalMillis: number;
    constructor(millis: number) {

        this.totalMillis = millis;

        this.days = Math.floor(millis / (1000 * 60 * 60 * 24));
        millis -= this.days * (1000 * 60 * 60 * 24);

        this.hours = Math.floor(millis / (1000 * 60 * 60));
        millis -= this.hours * (1000 * 60 * 60);

        this.minutes = Math.floor(millis / (1000 * 60));
        millis -= this.minutes * (1000 * 60);

        this.seconds = Math.floor(millis / (1000));
        millis -= this.seconds * (1000);

        this.millis = millis;
    }

    static fromSeconds(seconds: number): TimeSpan {
        return new TimeSpan(seconds * 1000);
    }
    static fromMinutes(minutes: number): TimeSpan {
        return new TimeSpan(minutes * 60 * 1000);
    }
    static fromHours(hours: number): TimeSpan {
        return new TimeSpan(hours * 60 * 60 * 1000);
    }
    static fromDays(days: number): TimeSpan {
        return new TimeSpan(days * 24 * 60 * 60 * 1000);
    }

    public toString(): string {
        const string = this.toStringFull();
        var start = string.split('').findIndex(c => c !== '0' && c !== '.' && c !== ':');
        if (start !== -1) {
            return string.substring(start);
        } else {
            return '0';
        }
    }
    public toStringFull(): string {
        const f = (length: number) => (v: number) => v.toString().padStart(length, '0');

        function templateEach<T>(func: (value: T) => string) {
            return (templates: TemplateStringsArray, ...values: T[]) =>
                values.map(func).map((v, i) => templates[i] + v).join('') + templates[templates.length - 1];
        }

        return templateEach<string | number>(v => v.toString().padStart(2, '0'))
            `${this.days}.${this.hours}:${this.minutes}:${this.seconds}.${this.millis.toString().padStart(3, '0')}`;
    }

    public valueOf(): number {
        return this.totalMillis;
    }

    public addTo(date: Date): Date {
        return new Date(date.valueOf() + this.valueOf());
    }
    public subFrom(date: Date): Date {
        return new Date(date.valueOf() - this.valueOf());
    }
}

if (!environment.production) {
    (window as any).TimeSpan = TimeSpan;
}