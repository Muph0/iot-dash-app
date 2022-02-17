import { AfterViewChecked, AfterViewInit, Component, ElementRef, Input, NgZone, OnInit, ViewChild } from '@angular/core';
import { Chart, ScatterDataPoint } from 'chart.js';
import { IotInterface, TimeSpan } from 'src/app/domain';
import { HistoryEntry } from 'src/app/domain/history-entry.model';
import { InterfaceService } from 'src/app/services/interface.service';
import { SortedMap } from 'src/app/utils/sorted-map';
import * as DateFns from 'date-fns'
import * as Locales from 'date-fns/locale';

@Component({
    selector: 'app-history-chart',
    templateUrl: './history-chart.component.html',
    styleUrls: ['./history-chart.component.scss']
})

export class HistoryChartComponent implements OnInit, AfterViewInit, AfterViewChecked {

    @Input() iface: IotInterface;


    chart: Chart<'line', ScatterDataPoint[], Date>;
    canvasHeight: number;

    @ViewChild('chartCanvas') chartCanvas: ElementRef<HTMLCanvasElement>;

    constructor(
        private ifsvc: InterfaceService,
        private zone: NgZone,
    ) { }
    ngAfterViewChecked(): void {
        console.count('ngAfterViewChecked');
    }

    ngAfterViewInit(): void {
        console.count('ngAfterViewInit');
        let cvs = this.chartCanvas.nativeElement;
        this.zone.runOutsideAngular(() => this.initChart(cvs));
    }

    ngOnInit(): void {
        this.initData();
    }

    private initChart(canvas: HTMLCanvasElement) {
        const locale = Locales.cs;

        this.chart = new Chart(canvas, {
            type: 'line',
            data: {
                labels: [] as Date[],
                datasets: [{
                    label: 'Dataset with point data',
                    cubicInterpolationMode: 'monotone',
                    borderColor: 'green',
                    fill: false,
                    data: [] as ScatterDataPoint[],
                }]
            },
            options: {
                interaction: {
                    intersect: false,
                    axis: 'x',
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
                        adapters: { date: { locale: locale }, },
                        ticks: {
                            source: 'auto',
                            autoSkipPadding: 20,
                        },
                        bounds: 'data',
                    },

                }
            }
        });
    }

    private async initData() {
        const span = TimeSpan.fromMinutes(30);
        const data = await this.ifsvc.getLastData(this.iface, span);
        const dataset = this.chart.data.datasets[0];

        for (let entry of data.unwrap()) {
            dataset.data.push({
                x: entry.time.getTime(),
                y: entry.value
            });
            this.chart.data.labels!.push(DateFns.startOfMinute(entry.time));
        }
        this.chart.update();
    }

}
