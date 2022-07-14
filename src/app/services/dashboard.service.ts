import { ChangeDetectorRef, Injectable } from "@angular/core";
import { BehaviorSubject, map, Observable, Subject } from "rxjs";
import { DashCardInfo, PersistentCard } from "../domain";
import { InterfaceService } from "./interface.service";
import { StorageService } from "./persistency.service";

const STATE_KEY = 'dashboard';

type DashboardState = {
    card_ai: number;
    cards: DashCardInfo[];
};

@Injectable({
    providedIn: 'root',
})
export class DashboardService {

    private card_ai: number = 0;
    private cardsSubject = new BehaviorSubject<PersistentCard[]>([]);
    private get cards() { return this.cardsSubject.value; }

    private onRemoveEvent = new Subject<PersistentCard>();
    get onRemove() { return this.onRemoveEvent.asObservable(); }

    constructor(
        private readonly storage: StorageService,
        private readonly ifdb: InterfaceService,
    ) {
        if (storage.hasKey(STATE_KEY)) {
            const state = storage.get<DashboardState>(STATE_KEY);

            this.card_ai = state.card_ai;
            this.cardsSubject = new BehaviorSubject([]);

            Promise.all(state.cards.map(c => PersistentCard.FromInfoWithSources(this, ifdb, c))).then(cards => {
                this.cardsSubject.next(cards);
            });
        }
    }

    async getCards(): Promise<PersistentCard[]> {
        return this.cards;
    }

    async getCard(cardId: number): Promise<PersistentCard | undefined> {
        return this.cards.find(c => c.id == cardId);
    }

    get cardStream(): Observable<PersistentCard[]> {
        return this.cardsSubject.asObservable();
    }

    async createCard(): Promise<PersistentCard> {
        const info: DashCardInfo = {
            id: this.card_ai++,
            type: "gauge",
            width: 1,
        };
        const card = await PersistentCard.FromInfoWithSources(this, this.ifdb, info);

        this.cards.push(card);
        await this.saveChanges();
        this.cardsSubject.next(this.cards);
        return card;
    }

    async removeCard(card: PersistentCard) {
        this.onRemoveEvent.next(card);
        const cards = this.cards.filter(i => i.id !== card.id);
        await this.saveChanges();
        this.cardsSubject.next(cards);
    }

    async updateCard(item: PersistentCard) {
        //const index = this.state.items.findIndex(i => i.id === item.id);
        const index = this.cards.indexOf(item);
        if (index === -1) throw new Error("Unknown card.");
        this.cards[index] = item;
        await this.saveChanges();
    }

    async saveChanges() {
        const state: DashboardState = {
            card_ai: this.card_ai,
            cards: this.cardsSubject.value.map(c => c.bareInfo()),
        };

        console.log('dashboard.service saving:', state);
        this.storage.set(STATE_KEY, state);
    }
}
