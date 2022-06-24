import { AfterViewInit, Component, ElementRef, NgZone, OnInit, ViewChild } from '@angular/core';
import { Chart, Point } from "chart.js";
import * as DateFns from 'date-fns'
import * as Locales from 'date-fns/locale';

@Component({
    selector: 'app-gauge-chart',
    template: `<canvas #chart height="220"></canvas>`,
    styles: [`:host {
        display: block;
        position: relative;
        width: 100%;
        height: 90%;
    }`],
})
export class GaugeChartComponent implements AfterViewInit {

    @ViewChild('chart')
    private chartRef: ElementRef;
    private chart: Chart;
    private data: Point[];

    constructor(
        private zone: NgZone,
    ) {
        this.data = [{ x: 1, y: 5 }, { x: 2, y: 10 }, { x: 3, y: 6 }, { x: 4, y: 2 }, { x: 4.1, y: 6 }];
    }

    ngAfterViewInit(): void {
        this.zone.runOutsideAngular(() => this.initChart());
    }

    private initChart() {
        this.chart = new Chart(this.chartRef.nativeElement, {
            type: 'line',
            data: {
                datasets: [{
                    label: 'Interesting Data',
                    data: this.data,
                    fill: false
                }]
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
    }

}
