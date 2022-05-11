import { Injectable } from "@angular/core";
import { DashboardItem } from "../domain";
import { StorageService } from "./persistency.service";

const dashboardStateKey = 'dashboard';

type DashboardState = {
    id_ai: number;
    items: DashboardItem[];
};

@Injectable({
    providedIn: 'root',
})
export class DashboardService {

    private state: DashboardState;

    constructor(
        private readonly storage: StorageService
    ) {
        if (storage.hasKey(dashboardStateKey)) {
            this.state = storage.get(dashboardStateKey);
        } else {
            this.state = {
                id_ai: 0,
                items: [],
            };
            this.pushChanges();
        }
    }

    async getItems(): Promise<DashboardItem[]> {
        return this.state.items.map(x => ({ ...x }));
    }

    async createItem(): Promise<DashboardItem> {
        const item: DashboardItem = {
            id: this.state.id_ai++,
            type: "gauge",
            width: 1,
        };
        this.state.items.push(item);
        await this.pushChanges();
        return item;
    }

    async removeItem(item: DashboardItem) {
        const index = this.state.items.findIndex(i => i.id === item.id);
        this.state.items.splice(index, 1);
        await this.pushChanges();
    }

    async updateItem(item: DashboardItem) {
        const index = this.state.items.findIndex(i => i.id === item.id);
        this.state.items.splice(index, 1);
        await this.pushChanges();
    }

    async pushChanges() {
        this.storage.set(dashboardStateKey, this.state);
    }
}
