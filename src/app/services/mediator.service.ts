import { Injectable } from "@angular/core";
import { AppEvent, HistoryEntryUpdateEvent } from "../domain/events";
import { EventBus, EventHanders, IEventSource, IEventSubscription } from "../utils";


@Injectable({ providedIn: 'root' })
export class MediatorService implements IEventSource<AppEvent> {
    private bus = new EventBus<AppEvent>();

    public addEventHandlers(handlers: EventHanders<AppEvent>): IEventSubscription {
        return this.bus.addEventHandlers(handlers);
    }
    public sendEvent(sender: Object, event: AppEvent): void {
        //console.log('mediator event:', event, 'from:', sender);
        return this.bus.sendEvent(sender, event);
    }
}