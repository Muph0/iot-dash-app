import { Component, Input, OnInit } from '@angular/core';

@Component({
    selector: 'app-gauge-control',
    templateUrl: './gauge-control.component.html',
    styleUrls: ['./gauge-control.component.scss']
})
export class GaugeControlComponent implements OnInit {

    @Input() inSettings: boolean;

    constructor() { }

    ngOnInit(): void {
    }

}
