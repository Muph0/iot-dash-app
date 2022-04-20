import { Injectable } from '@angular/core';
import { HubConnection, HubConnectionBuilder } from '@microsoft/signalr';
import { HistoryEntryUpdate } from 'src/contract/backend-v1';
import { ContractDomainMapping } from 'src/contract/mappings/contract-domain-mapping';
import { IotInterface } from '../domain';
import { AppEvent, HistoryEntryUpdateEvent } from '../domain/events';
import { MediatorService } from './mediator.service';

@Injectable({ providedIn: 'root' })
export class ServerEventService {

    private readonly hubConnection: HubConnection;
    constructor(
        private readonly mediator: MediatorService,
    ) {
        this.hubConnection = new HubConnectionBuilder()
            .withUrl(`https://localhost:5001/api/v1/eventstream`)
            .build();

        this.startConnection();
    }

    private startConnection() {
        this.hubConnection.on('newdata', (serverEvent: HistoryEntryUpdate) => {
            //console.log('newdata:', event);
            const event: AppEvent = {
                name: 'historyEntryUpdate',
                interfaceId: serverEvent.interfaceId,
                entry: ContractDomainMapping.MapHistory(serverEvent.entry),
            };
            this.mediator.sendEvent(this, event);
        });

        this.hubConnection.start()
            .then(() => console.log('Connection started'))
            .catch(err => console.log('Error while starting connection: ' + err));
    }
}
