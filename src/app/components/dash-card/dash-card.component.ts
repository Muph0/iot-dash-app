import { AfterViewChecked, Component, Input, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { DashCardInfo as DashCardInfo, PersistentCard } from 'src/app/domain';
import { HistoryEntryUpdateEvent } from 'src/app/domain/events';
import { DashboardService } from 'src/app/services/dashboard.service';
import { MediatorService } from 'src/app/services/mediator.service';
import { RandomProvider } from 'src/app/services/random-provider.service';
import { ServerEventService } from 'src/app/services/server-event.service';
import { assert, ISubscription } from 'src/app/utils';

@Component({
    selector: 'app-dash-card',
    templateUrl: './dash-card.component.html',
    styleUrls: ['./dash-card.component.scss']
})
export class DashCardComponent implements OnInit, OnDestroy {

    constructor(
        private fb: FormBuilder,
        private rng: RandomProvider,
        private db: DashboardService,
        serverEvents: ServerEventService,
    ) {
        serverEvents.startConnectionIfNotStarted();
        this.id = rng.getToken(8);
    }

    @Input() cardId: PersistentCard['id'];
    card: PersistentCard;
    inSettings = false;
    id: string;

    form: {
        width: FormControl;
        type: FormControl;
    };

    private readonly subs: ISubscription[] = [];

    ngOnInit(): void {
        assert(this.cardId !== undefined, 'Dashboard item: No control given.');
        this.initAsync();
    }
    ngOnDestroy(): void {
        for (let sub of this.subs) {
            sub.unsubscribe();
        }
        this.subs.splice(0);
    }

    async initAsync() {
        var card = await this.db.getCard(this.cardId);
        assert(card);
        this.card = card;

        this.form = {
            width: new FormControl(this.card.width),
            type: new FormControl(this.card.type),
        };

        this.subs.push(this.form.width.valueChanges.subscribe(value => {
            this.card.width = value;
            this.card.persist();
        }));
        this.subs.push(this.form.type.valueChanges.subscribe(value => {
            this.card.type = value;
            this.card.persist();
        }));
    }


    deleteSelf() {
        this.db.removeCard(this.card);
    }

    removeSource(id: number) {
        this.card.removeSource(id);
        this.card.persist();
    }
}
