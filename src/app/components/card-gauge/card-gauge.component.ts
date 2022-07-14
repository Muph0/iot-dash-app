import { Component, Input, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { PersistentCard } from 'src/app/domain';
import { HistoryEntryUpdateEvent } from 'src/app/domain/events';
import { MediatorService } from 'src/app/services/mediator.service';
import { assert, IEventSubscription } from 'src/app/utils';

@Component({
    selector: 'app-card-gauge',
    templateUrl: './card-gauge.component.html',
    styleUrls: ['./card-gauge.component.scss']
})
export class GaugeControlComponent implements OnInit {

    @Input() inSettings: boolean;
    @Input() card: PersistentCard;

    private readonly subs: IEventSubscription[] = [];

    constructor(
        private mediator: MediatorService,
    ) { }

    form: {
        width: FormControl;
        type: FormControl;
    };

    ngOnInit(): void {
        assert(this.card, 'Dashboard item: No control given.');
        this.subs.push(this.mediator.addEventHandlers({
            historyEntryUpdate: this.onHistoryUpdate.bind(this),
        }));
    }

    private onHistoryUpdate(sender: object, event: HistoryEntryUpdateEvent) {
        for (let iface of this.card.sources) {
            if (!iface) continue;

            if (event.interfaceId === iface.id) {
                iface.value = event.entry.value;
            }
        }
    }

}
