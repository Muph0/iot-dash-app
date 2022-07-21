import { Injectable } from "@angular/core";
import { BehaviorSubject, PartialObserver, Subject } from "rxjs";
import { AlertMessage } from "../domain/alert-message";

@Injectable({
    providedIn: 'root'
})
export class StatusService {

    private messages = new Subject<AlertMessage>();
    public readonly onlineStatus = new BehaviorSubject<boolean>(true);

    public showError(message: string) {
        this.showMessage(new AlertMessage(message, 'danger', 'Error'));
    }

    public showMessage(msg: AlertMessage) {
        this.messages.next(msg);
    }

    public subscribe(observer: PartialObserver<AlertMessage>) {
        return this.messages.subscribe(observer);
    }
}