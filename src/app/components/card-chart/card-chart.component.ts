import { Component, ElementRef, Input, NgZone, OnInit, ViewChild } from '@angular/core';
import { Chart } from 'chart.js';
import { PersistentCard } from 'src/app/domain';
import * as Locales from 'date-fns/locale';
import { HistoryEntryUpdateEvent } from 'src/app/domain/events';
import { MediatorService } from 'src/app/services/mediator.service';
import { ISubscription } from 'src/app/utils';

@Component({
    selector: 'app-card-chart',
    templateUrl: 'card-chart.component.html',
    styles: [''],
})
export class CardChartComponent implements OnInit {

    private _inSettings: boolean;
    @Input() set inSettings(value: boolean) {
        this._inSettings = value;
        if (!value) {
            this.prepareDatasets();
        }
    }
    get inSettings(): boolean {
        return this._inSettings;
    }

    @Input() card: PersistentCard;

    ngOnInit(): void {
    }

    @ViewChild('chartCanvas')
    private canvasRef: ElementRef;
    private chart: Chart;
    private subs: ISubscription[] = [];
    maxPoints: number = 100;

    constructor(
        private zone: NgZone,
        private mediator: MediatorService,
    ) {
        this.subs.push(mediator.addEventHandlers({
            historyEntryUpdate: this.onHistoryUpdate.bind(this),
        }));
    }

    private onHistoryUpdate(sender: object, event: HistoryEntryUpdateEvent) {
        this.prepareDatasets();

        for (let iface of this.card.sources) {
            if (iface && iface.id == event.interfaceId) {

                var ds = this.getDatasetFor(iface.topic!);
                if (ds) {
                    ds.data.push({
                        x: event.entry.time.getTime(),
                        y: event.entry.value,
                    });
                }

                // this.pushEntry(event.entry);
                // if (this.chart.data.datasets[0].data.length > 2 * this.maxPoints) {
                //     this.startFetch();
                // } else {
                //     this.updateChart();
                // }
            }
        }
    }

    private prepareDatasets() {
        if (!this.chart) return;

        // delete missing ones
        this.chart.data.datasets = this.chart.data.datasets.filter(
            data => this.card.sources.find(
                src => src?.topic === data.label
            ));

        // add new ones
        for (let src of this.card.sources) {
            if (!this.chart.data.datasets.find(data => data.label === src?.topic)) {
                this.chart.data.datasets.push({
                    label: src?.topic,
                    data: [],
                    stepped: src?.isOutput,
                })
            }
        }

        this.chart.update();
    }

    private getDatasetFor(topic: string) {
        return this.chart.data.datasets.find(ds => ds.label === topic);
    }

    ngAfterViewInit(): void {
        this.initChart();
    }

    private initChart() {
        console.log(Object.getPrototypeOf(this), 'initChart()');
        this.zone.runOutsideAngular(() => {
            this.chart = new Chart(this.canvasRef.nativeElement, {
                type: 'line',
                data: {
                    datasets: []
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    scales: {
                        x: {
                            type: 'time',
                            time: {
                                minUnit: 'minute',
                                displayFormats: {
                                    minute: 'HH:mm',
                                },
                            },
                            adapters: { date: { locale: Locales.cs }, },
                            ticks: {
                                source: 'auto',
                                autoSkipPadding: 20,
                            },
                            bounds: 'data',
                        },
                    }
                }
            });

            this.prepareDatasets();
        });
    }

}
