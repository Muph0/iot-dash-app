import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { IOTDevice, IOTInterfaceType } from 'src/app/model/device.model';
import { DeviceService } from '../../services/device.service';

@Component({
    selector: 'app-device-list',
    templateUrl: './device-list.component.html',
    styleUrls: ['./device-list.component.scss']
})
export class DeviceListComponent implements OnInit {

    constructor(
        private deviceService: DeviceService,
        private router: Router
    ) { }

    public devices$: Observable<IOTDevice[]>;

    ngOnInit(): void {

        this.devices$ = this.deviceService.getDevices();
    }

    describeDeviceType(device: IOTDevice): string {

        if (!device.interfaces) {
            return;
        }

        var types: IOTInterfaceType[] = [];
        for (let iface of device.interfaces) {
            if (types.indexOf(iface.type) === -1) {
                types.push(iface.type);
            }
        }

        if (types.length > 2) {
            return '(mix)';
        }

        return types.join(', ');
    }

    goToDevice(device: IOTDevice) {
        this.router.navigate(['device', device.id]);
    }

}
