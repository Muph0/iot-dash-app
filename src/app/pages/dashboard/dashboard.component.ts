import { Component, OnDestroy, OnInit } from '@angular/core';
import { range, Subject, Subscription } from 'rxjs';
import { map, share } from 'rxjs/operators';
import { DashCardInfo, PersistentCard } from 'src/app/domain';
import { DashboardService } from 'src/app/services/dashboard.service';

@Component({
    selector: 'app-dashboard',
    templateUrl: './dashboard.component.html',
    styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit, OnDestroy {

    private subs: Subscription[];
    cards: PersistentCard[];

    constructor(
        private db: DashboardService,
    ) { }

    ngOnInit(): void {
        this.subs = [...this.subscribeAll()];
    }
    ngOnDestroy(): void {
        for (let sub of this.subs) {
            sub.unsubscribe();
        }
    }

    private *subscribeAll() {
        yield this.db.cardStream.subscribe(cards => {
            this.cards = cards;
        });
    }

    addItemClickHandler() {
        this.db.createCard();
    }

    classListForCard(card: DashCardInfo) {
        return [
            'dash-item',
            'wid-' + card.width,
            (card.type === 'chart') && 'grow',
        ].filter(x => x).join(' ');
    }
}
