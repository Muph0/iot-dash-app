import { Component, ElementRef, ViewChild } from '@angular/core';
//import { Toast } from 'bootstrap';
import { AlertMessage } from './domain/alert-message';
import { StatusService } from './services/status.service';

import { Collapse, Tooltip } from 'bootstrap';

import { Toast } from 'bootstrap';
import { IIdentityService } from './services/identity.service';
import { Jwt } from './domain/token';
import { environment } from 'src/environments/environment';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss']
})
export class AppComponent {
    title = 'iot-dash-app';
    messages: AlertMessage[] = [];
    offline = false;

    @ViewChild("navbarItems") navbarItems: ElementRef;

    constructor(
        private readonly alerts: StatusService,
        public readonly identity: IIdentityService
    ) { }

    ngOnInit() {
        this.alerts.subscribe({
            next: msg => {
                this.messages.push(msg);
                setTimeout(() => {
                    const toast = new Toast(msg.getElement());
                    toast.show();
                }, 0);
            }
        });
        this.alerts.onlineStatus.subscribe(status => {
            this.offline = !status;
        });

        document.querySelectorAll('[data-bs-placement][title]').forEach(elem => {
            const tooltip = Tooltip.getOrCreateInstance(elem);
        });

        if (!environment.production) {
            console.warn("Running in development mode.");
        }
    }

    collapseNavbar() {
        const elem = this.navbarItems.nativeElement as HTMLElement;

        if (elem.classList.contains('show')) {
            const coll = Collapse.getOrCreateInstance(elem);
            coll.hide();
        }
    }
}
