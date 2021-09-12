import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { IOTDevice, IOTInterfaceType, IOTSwitch } from '../model/device.model';

const DEVICES: IOTDevice[] = [
    {
        id: 'tqOYciHMZWZheVGK',
        ipAddress: '192.168.1.130',
        uptimeSeconds: 456,
        interfaces: [
            { id: '1', type: 'switch', state: false },
            { id: '2', type: 'switch', state: true },
            { id: '3', type: 'switch', state: false },
            { id: '4', type: 'switch', state: false },
        ]
    },
    {
        id: 'm2boUQM8jyVjWu3W',
        ipAddress: '192.168.1.131',
        uptimeSeconds: 123,
        interfaces: [
            { id: 'temperature', type: 'probe', value: 0.000001536849531 },
            { id: 'humidity', type: 'probe', value: 54.5821657505615585 },
        ]
    },
    { id: 'FkZUxUjRnMVLE1gU', ipAddress: '192.168.1.132',
        interfaces: [
            { id: 'current', type: 'probe', value: 1.648513 },
            { id: 'switch', type: 'switch', state: true }
        ]
},
    { id: 'IkNTHOxvZsRshCpB', ipAddress: '192.168.1.133' },
    { id: 'YgP62CdJmrrCrmud', ipAddress: '192.168.1.134' },
    { id: 'mjkTQLvb7BxHd-M2', ipAddress: '192.168.1.135' },
    { id: '8gcHYTCddn9jlaiX', ipAddress: '192.168.1.136' },
    { id: 'DkPxtov1D4uAr1VX', ipAddress: '192.168.1.137' },
    { id: '5y56HlhgGGhzxGz_', ipAddress: '192.168.1.138' },
    { id: 'VWM1TguhhOpl-qZi', ipAddress: '192.168.1.139' }
];

@Injectable({
    providedIn: 'root'
})
export class DeviceService {

    constructor() { }

    public getDevices(): Observable<IOTDevice[]> {
        return of(DEVICES);
    }
    public getDeviceById(id: string): Observable<IOTDevice> {
        return of(DEVICES.filter(dev => dev.id === id)[0]);
    }
}
