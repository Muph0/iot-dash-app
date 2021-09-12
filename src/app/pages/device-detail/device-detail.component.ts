import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { combineLatest, Observable } from 'rxjs';
import { mergeMap } from 'rxjs/operators';
import { IOTDevice } from 'src/app/model/device.model';
import { DeviceService } from 'src/app/services/device.service';

@Component({
    selector: 'app-device-detail',
    templateUrl: './device-detail.component.html',
    styleUrls: ['./device-detail.component.scss']
})
export class DeviceDetailComponent implements OnInit {

    constructor(
        private route: ActivatedRoute,
        private deviceService: DeviceService
    ) { }

    public device: IOTDevice;
    public testvalue: boolean = false;

    ngOnInit(): void {
        this.route.paramMap.pipe(
            mergeMap(params => this.deviceService.getDeviceById(params.get('id')))
        ).subscribe({next: device => {
            this.device = device;
        }})
    }

    precision(x: number, places: number) {
        const order = Math.pow(10, Math.floor(Math.log10(x)) - Math.floor(places) + 1);
        return Math.floor(x / order) * order;
    }

}
