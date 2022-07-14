import { AfterViewChecked, AfterViewInit, Component, ElementRef, Input, NgZone, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Chart, ScatterDataPoint } from 'chart.js';
import { HistoryEntry, IotInterface, TimeSpan } from 'src/app/domain';
import { InterfaceService } from 'src/app/services/interface.service';
import * as DateFns from 'date-fns'
import * as Locales from 'date-fns/locale';
import { MediatorService } from 'src/app/services/mediator.service';
import { IEventSubscription } from 'src/app/utils';
import { HistoryEntryUpdateEvent } from 'src/app/domain/events';
import { ServerEventService } from 'src/app/services/server-event.service';

@Component({
    selector: 'app-history-chart',
    templateUrl: './history-chart.component.html',
    styles: [''],
})

export class HistoryChartComponent implements OnInit, OnDestroy, AfterViewInit, AfterViewChecked {

    @Input() iface: IotInterface;
    @ViewChild('chartCanvas') chartCanvas: ElementRef<HTMLCanvasElement>;

    chart: Chart<'line', ScatterDataPoint[], Date>;
    canvasHeight: number;
    maxPoints: number = 100;

    private readonly subs: IEventSubscription[] = [];

    constructor(
        private mediator: MediatorService,
        private ifsvc: InterfaceService,
        private zone: NgZone,
        serverEvents: ServerEventService,
    ) {
        serverEvents.startConnectionIfNotStarted();
        this.subs.push(mediator.addEventHandlers({
            historyEntryUpdate: this.onHistoryUpdate.bind(this),
        }));
    }
    ngAfterViewChecked(): void {
        //console.log('ngAfterViewChecked');
    }

    ngAfterViewInit(): void {
        let cvs = this.chartCanvas.nativeElement;
        this.zone.runOutsideAngular(() => this.configureChart(cvs));
    }

    ngOnInit(): void {
        this.initData();
    }

    ngOnDestroy(): void {
        for (let sub of this.subs) {
            sub.unsubscribe();
        }
        this.subs.splice(0);
    }


    private async initData() {
        const span = TimeSpan.fromMinutes(30);
        const data = await this.ifsvc.getLastData(this.iface, span, this.maxPoints);

        for (let entry of data.unwrap()) {
            this.pushEntry(entry);
            this.chart.data.labels!.push(DateFns.startOfMinute(entry.time));
        }
        for (let dataset of this.chart.data.datasets) {
            dataset.data.sort((a, b) => a.x - b.x);
        }
        this.chart.update('none');
    }

    private onHistoryUpdate(sender: object, event: HistoryEntryUpdateEvent) {
        if (event.interfaceId === this.iface.id) {
            this.pushEntry(event.entry);

            if (this.chart.data.datasets[0].data.length > 2 * this.maxPoints) {
                this.startFetch();
            } else {
                this.updateChart();
            }
        }
    }

    private updateChart() {
        this.zone.runOutsideAngular(() => {
            this.chart.update('none');
        });
    }

    private pushEntry(entry: HistoryEntry) {
        const datasetAvg = this.chart.data.datasets[0];
        const datasetMin = this.chart.data.datasets[1];
        const datasetMax = this.chart.data.datasets[2];

        datasetAvg.data.push({
            x: entry.time.getTime(),
            y: entry.value
        });
        datasetMin.data.push({
            x: entry.time.getTime(),
            y: entry.min
        });
        datasetMax.data.push({
            x: entry.time.getTime(),
            y: entry.max
        });
    }

    private zoomPanDebounce: any;
    private startFetch() {
        if (!this.iface.historyEnabled) return;

        const { min, max } = this.chart.scales.x;
        clearTimeout(this.zoomPanDebounce);
        this.zoomPanDebounce = setTimeout(async () => {
            const data = await this.ifsvc.getHistoryData(this.iface, new Date(min), new Date(max), this.maxPoints);
            for (let dataset of this.chart.data.datasets) {
                dataset.data = [];
            }
            for (let entry of data.unwrap()) {
                this.pushEntry(entry);
            }
            this.chart.stop();
            this.chart.update('none');
        }, 500);
    }

    private configureChart(canvas: HTMLCanvasElement) {
        const locale = Locales.cs;
        const cubicInterpolationMode: "monotone" | "default" = 'monotone';
        this.chart = new Chart(canvas, {
            type: 'line',
            data: {
                labels: [] as Date[],
                datasets: [{
                    label: 'Value',
                    cubicInterpolationMode,
                    borderColor: '#28D',
                    fill: false,
                    data: [] as ScatterDataPoint[],
                }, {
                    label: 'Min',
                    cubicInterpolationMode,
                    borderColor: '#CCC',
                    pointRadius: 0,
                    fill: -1,
                    data: [] as ScatterDataPoint[],
                }, {
                    label: 'Max',
                    cubicInterpolationMode,
                    borderColor: '#CCC',
                    pointRadius: 0,
                    fill: +1,
                    data: [] as ScatterDataPoint[],
                }]
            },
            options: {
                interaction: {
                    //intersect: false,
                    //axis: 'x',
                },
                responsive: true,
                maintainAspectRatio: false,
                parsing: false,
                scales: {
                    x: {
                        type: 'time',
                        time: {
                            minUnit: 'minute',
                            displayFormats: {
                                minute: 'HH:mm',
                            },
                        },
                        adapters: { date: { locale }, },
                        ticks: {
                            source: 'auto',
                            autoSkipPadding: 20,
                        },
                        bounds: 'data',
                    },
                },
                plugins: {
                    zoom: {
                        pan: {
                            enabled: true,
                            mode: 'x',
                            onPanComplete: this.startFetch.bind(this),
                        },
                        zoom: {
                            mode: 'x',
                            wheel: { enabled: true },
                            pinch: { enabled: true },
                            drag: { enabled: true, modifierKey: 'shift' },
                            onZoomComplete: this.startFetch.bind(this),
                        },
                        limits: {
                            x: {
                                minRange: 1000 * 5
                            }
                        }
                    }
                }
            }
        });
    }
}

