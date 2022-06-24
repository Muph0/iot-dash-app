import { AfterViewInit, Component, ElementRef, Input, NgZone, OnInit, ViewChild } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Chart, Point } from "chart.js";
import * as DateFns from 'date-fns'
import * as Locales from 'date-fns/locale';
import { PersistentCard } from 'src/app/domain';
import { assert } from 'src/app/utils';

@Component({
    selector: 'app-card-src-box',
    template: `
        <div class="input-group mb-3">
            <input class="form-control" (blur)="save()" [formControl]="input" />
            <span class="input-group-text btn btn-outline-danger" (click)="delete()">&#x2716;</span>
        </div>
    `,


    styles: [``],
})
export class CardSourceBoxComponent implements OnInit {

    @Input() card: PersistentCard;
    @Input() index: number;

    input: FormControl;

    ngOnInit(): void {
        assert(this.card, 'No card given.');
        assert(this.index !== undefined, 'No index given.');

        this.input = new FormControl(this.card.sources[this.index]);
    }

    save() {
        this.card.updateSource(this.index, this.input.value);
        console.log('save', this.card);
    }

    delete() {
        this.card.removeSource(this.index);
    }
}
