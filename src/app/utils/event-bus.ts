import { assert } from "./assert";

export const enum SubscriptionState {
    Active, Suspended, Cancelled
}

export interface ISubscription {
    unsubscribe(): void;
}

export interface IEventSubscription extends ISubscription {
    get state(): SubscriptionState;
    suspend(): void;
    resume(): void;
}

export interface IEventSource<TEvent extends IEvent> {
    addEventHandlers(handlers: EventHanders<TEvent>): IEventSubscription;
    sendEvent(sender: Object, event: TEvent): void;
}

interface IEvent {
    name: string;
}

export type EventHandler<TEvent extends IEvent>
    = (sender: Object, evt: TEvent) => void;
export type EventHanders<TEvent extends IEvent> = {
    [N in TEvent['name']]?: EventHandler<Extract<TEvent, { name: N }>>
};

export class EventBus<TEvent extends IEvent> implements IEventSource<TEvent> {

    public static Subscription = class Subscription implements IEventSubscription {

        private state_: SubscriptionState;
        constructor(
            public readonly handlers: EventHanders<any>,
            public readonly bus: EventBus<any>
        ) { }

        get state(): SubscriptionState { return this.state_; }
        suspend(): void {
            assert(this.state_ !== SubscriptionState.Cancelled);
            this.bus.suspend(this);
            this.state_ = SubscriptionState.Suspended;
        }
        resume(): void {
            assert(this.state_ !== SubscriptionState.Cancelled);
            this.state_ = SubscriptionState.Active;
            this.bus.resume(this);
        }
        unsubscribe(): void {
            if (this.state_ !== SubscriptionState.Cancelled) {
                this.bus.unsubscribe(this);
                this.state_ = SubscriptionState.Cancelled;
            }
        }
    }

    private subs = new Set<IEventSubscription>();
    private handlerMap = new Map<string, Set<EventHandler<IEvent>>>();

    public owns(sub: IEventSubscription): boolean { return this.subs.has(sub); }
    public addEventHandlers(handlers: EventHanders<TEvent>): IEventSubscription {
        const sub = new EventBus.Subscription(handlers, this);
        this.subs.add(sub);
        this.resume(sub);
        return sub;
    }
    public sendEvent(sender: Object, event: TEvent): void {
        const list = this.handlerMap.get(event.name);
        if (list) for (let handler of list) {
            handler(sender, event);
        }
    }

    ////////////////
    // private:
    private unsubscribe(subi: EventBus.Subscription): void {
        if (!this.subs.has(subi))
            throw new Error('The subscription doesnt come from this bus.');
        this.suspend(subi);
        this.subs.delete(subi);
    }

    private suspend(subi: EventBus.Subscription) {
        let name: TEvent['name'];
        for (name in subi.handlers) {
            const handler = subi.handlers[name];
            let list = this.handlerMap.get(name);
            if (list) {
                assert(handler);
                list.delete(handler);
            }
        }
    }

    private resume(subi: EventBus.Subscription) {
        let name: TEvent['name'];
        for (name in subi.handlers) {
            const handler = subi.handlers[name];
            assert(handler);
            let list = this.handlerMap.get(name);
            if (list) {
                list.add(handler);
            } else {
                this.handlerMap.set(name, new Set([handler]))
            }
        }
    }
}

export namespace EventBus {
    type SubscriptionCtor = typeof EventBus.Subscription;
    export type Subscription = SubscriptionCtor extends new (...args: any) =>
        infer R ? R : any
}

