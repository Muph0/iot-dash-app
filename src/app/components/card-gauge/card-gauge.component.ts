import { Component, Input, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { PersistentCard } from 'src/app/domain';
import { assert } from 'src/app/utils';

@Component({
    selector: 'app-card-gauge',
    templateUrl: './card-gauge.component.html',
    styleUrls: ['./card-gauge.component.scss']
})
export class GaugeControlComponent implements OnInit {

    @Input() inSettings: boolean;
    @Input() card: PersistentCard;

    constructor() { }

    form: {
        width: FormControl;
        type: FormControl;
    };

    ngOnInit(): void {
        assert(this.card, 'Dashboard item: No control given.');


    }

}
