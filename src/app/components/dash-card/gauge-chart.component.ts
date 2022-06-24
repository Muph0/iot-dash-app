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
    private data: number[];

    constructor(
        private zone: NgZone,
    ) {
        this.data = [5, 10, 6, 2, 1];
    }

    ngAfterViewInit(): void {
        this.zone.runOutsideAngular(() => this.initChart());
    }

    private initChart() {
        this.chart = new Chart(this.chartRef.nativeElement, {
            type: 'gauge' as any,
            data: {
                //labels: ['Success', 'Warning', 'Warning', 'Error'],
                datasets: [{
                    data: this.data,
                    value: 3.14,
                    backgroundColor: ['green', 'yellow', 'orange', 'red'],
                    borderWidth: 2
                }]
            },
            options: {
                responsive: true,
                title: {
                    display: true,
                    text: 'Gauge chart'
                },
                layout: {
                    padding: {
                        bottom: 30
                    }
                },
                needle: {
                    // Needle circle radius as the percentage of the chart area width
                    radiusPercentage: 2,
                    // Needle width as the percentage of the chart area width
                    widthPercentage: 3.2,
                    // Needle length as the percentage of the interval between inner radius (0%) and outer radius (100%) of the arc
                    lengthPercentage: 80,
                    // The color of the needle
                    color: 'rgba(0, 0, 0, 1)'
                },
                valueLabel: {
                    formatter: Math.round
                }
            }
        });
    }

}
