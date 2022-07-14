import { AfterViewInit, Component, ElementRef, Input, NgZone, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Chart, Point } from "chart.js";
import * as DateFns from 'date-fns'
import * as Locales from 'date-fns/locale';
import { debounceTime, Subscription } from 'rxjs';
import { IotInterface, PersistentCard } from 'src/app/domain';
import { InterfaceService } from 'src/app/services/interface.service';
import { assert } from 'src/app/utils';

/**
 * Represents an UI input control that contains information about dashboard
 * card data source.
 */
@Component({
    selector: 'app-card-src-box',
    // <div class="input-group mb-3">
    //     <span class="input-group-text btn btn-outline-danger" (click)="delete()">&#x2716;</span>
    // </div>
    template: `
        <select class="form-control" [formControl]="input">
            <option *ngFor="let iface of ifaces" value="{{iface.id}}"
                [selected]="iface.id === input.value">{{iface.topic}}</option>
        </select>
    `,
    styles: [`
    :host {
        flex-grow: 1;
    }
    `],
})
export class CardSourceBoxComponent implements OnInit, OnDestroy {

    @Input() card: PersistentCard;
    @Input() index: number;

    input: FormControl;
    private subs: Subscription[] = [];

    constructor(private ifdb: InterfaceService) { }

    ifaces: IotInterface[];

    ngOnInit(): void {
        assert(this.card, 'No card given.');
        assert(this.index !== undefined, 'No index given.');

        this.input = new FormControl(this.card.sources[this.index]?.id);
        this.subs.push(this.input.valueChanges.pipe(debounceTime(500)).subscribe(async (id: string) => {
            var iface = await this.ifdb.getInterfaceById(id);
            this.card.updateSource(this.index, iface.unwrap());
            this.card.persist();
        }));

        this.ifdb.getAll().then(ifaces => this.ifaces = ifaces);
    }
    ngOnDestroy(): void {
        for (let sub of this.subs) {
            sub.unsubscribe();
        }
    }
}
