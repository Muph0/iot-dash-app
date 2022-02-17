import { Component, OnInit } from '@angular/core';
import { range, Subject } from 'rxjs';
import { map, share } from 'rxjs/operators';

@Component({
    selector: 'app-dashboard',
    templateUrl: './dashboard.component.html',
    styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {

    constructor() { }

    ngOnInit(): void {
    }

}
