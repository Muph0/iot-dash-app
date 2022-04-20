import { Component, OnInit } from '@angular/core';
import { IotInterface } from 'src/app/domain';
import { InterfaceService } from 'src/app/services/interface.service';
import { ContractDomainMapping } from 'src/contract/mappings/contract-domain-mapping';

@Component({
    selector: 'app-interface-list',
    templateUrl: './interface-list.component.html',
    styleUrls: ['./interface-list.component.scss']
})
export class InterfaceListComponent implements OnInit {

    interfaces: IotInterface[];
    expanded: { [key: string]: boolean } = {};

    constructor(
        private ifservice: InterfaceService,
    ) { }

    async ngOnInit(): Promise<void> {
        await this.updateInterfaces();
    }

    async updateInterfaces() {
        this.interfaces = await this.ifservice.getAll();
    }

    togExpand(elem: HTMLElement) {
        elem.classList.toggle('expand');
    }

    async addInterface() {
        let result = await this.ifservice.createInterface();
        if (result.ok) {
            this.interfaces.push(result.value);
        } else {
            console.error(result);
        }
    }

    async deleteInterface(iface: IotInterface) {
        let result = await this.ifservice.removeInterface(iface);
        if (result.ok) {
            await this.updateInterfaces();
        }
    }
}
