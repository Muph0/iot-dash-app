import { Component, OnInit } from '@angular/core';
import { range, Subject } from 'rxjs';
import { map, share } from 'rxjs/operators';
import { DashboardItem } from 'src/app/domain';
import { DashboardService } from 'src/app/services/dashboard.service';

@Component({
    selector: 'app-dashboard',
    templateUrl: './dashboard.component.html',
    styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {

    controls: DashboardItem[];

    constructor(
        private db: DashboardService,
    ) { }

    ngOnInit(): void {
        this.fetchControls();
    }

    private async fetchControls() {
        this.controls = await this.db.getItems();
    }

    async addItemClickHandler() {
        this.controls.push(await this.db.createItem());
    }

    classListForControl(item: DashboardItem) {
        return [
            'dash-item',
            'wid-' + item.width,
            (item.type === 'chart') && 'grow',
        ].filter(x => x).join(' ');
    }
}
