import { Component, Input, OnInit } from '@angular/core';
import { DashboardItem } from 'src/app/domain';
import { assert } from 'src/app/utils';

@Component({
    selector: 'app-dash-item',
    templateUrl: './dash-item.component.html',
    styleUrls: ['./dash-item.component.scss']
})
export class DashItemComponent implements OnInit {

    constructor() { }

    @Input() control: DashboardItem;
    inSettings = false;

    ngOnInit(): void {
        assert(this.control, 'Dashboard item: No control given.');
    }

}
