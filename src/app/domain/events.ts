import { HistoryEntryUpdate } from "src/contract/backend-v1";
import { HistoryEntry } from "./history-entry.model";

export type AppEvent
    = TestEvent
    | HistoryEntryUpdateEvent;

export interface HistoryEntryUpdateEvent {
    name: 'historyEntryUpdate';
    entry: HistoryEntry;
    interfaceId: string;
}
export interface TestEvent {
    name: 'test';
}