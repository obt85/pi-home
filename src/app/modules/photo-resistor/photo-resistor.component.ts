import { HttpClient } from '@angular/common/http';
import { Component, Input, OnInit } from '@angular/core';

import { Chart, Highcharts } from 'angular-highcharts';
import * as moment from 'moment';

import { HighchartsTheme } from '../../../app/plugins/charts/highcharts-theme.model';
import { IProbeType, IProbeChartType, ZoomPeriod } from '../../models/interfaces/probe.interface';
import { AppService } from '../../app.service';
import { ISensorComponent } from '../../models/interfaces/sensor-component.interface';
import { IPhotoResistor, IPhotoResistorData, IPhotoResistorDataValue } from './../../models/interfaces/probe.interface';
import { environment } from '../../../environments/environment';

@Component({
    selector: 'pih-photo-resistor',
    templateUrl: 'photo-resistor.component.html',
    styleUrls: ['photo-resistor.component.scss']
})

export class PhotoResistorComponent implements OnInit, ISensorComponent {
    @Input() probe: IPhotoResistor;
    @Input() display: string = "normal";
    @Input() showCorrectData: boolean = false;

    private isCorrectingData: boolean;
    private countCorrections: number;
    private percentCorrections: number;
    private startPeriod: moment.Moment;

    private originalData: Array<IPhotoResistorDataValue>;
    public selectedPeriod: ZoomPeriod;

    constructor(private http: HttpClient) {
        this.selectedPeriod = ZoomPeriod.today;
        this.setStartPeriod(this.selectedPeriod);
   }

    ngOnInit() {
        if (this.probe != null && this.probe.data.history == null) {
            this.drawChart();
            this.getData(this.probe).then(value => {
                if (value == true) {
                    this.setPeriodToData(this.selectedPeriod);
                    // this.correctData();
                    this.populateInfoData();
                    this.updateChart();
                }
            });
        }
    }

    public changePeriod(period: ZoomPeriod): void {
        if (period != this.selectedPeriod) {
            this.setPeriodToData(period);
            this.populateInfoData();
            this.updateChart();
        }
    }

    public correctData(): void {
        this.isCorrectingData = true;
        this._correctData();
        this.setPeriodToData(this.selectedPeriod);
        this.populateInfoData();
        this.updateChart();
        setTimeout(() => {
            this.isCorrectingData = false;
        }, 5);
    }

    private setPeriodToData(period: ZoomPeriod): void {
        this.selectedPeriod = period;
        if (period == ZoomPeriod.All) {
            this.probe.data.history = JSON.parse(JSON.stringify(this.originalData));
        } else {
            this.setStartPeriod(period);
            this.probe.data.history = this.originalData.filter(d => moment(d.date) >= this.startPeriod);
        }
    }

    private setStartPeriod(period: ZoomPeriod): void {
        switch(period) {
            case ZoomPeriod.today:
                this.startPeriod = moment().hour(0).minute(0).second(0);
                break;
            case ZoomPeriod.yesterday:
                this.startPeriod = moment().subtract(1, "days").hour(0).minute(0).second(0);
                break;
            case ZoomPeriod.last24Hours:
                this.startPeriod = moment().seconds(0).subtract(24, "hours");
                break;
            case ZoomPeriod.last48Hours:
                this.startPeriod = moment().subtract(2, "days");
                break;
            case ZoomPeriod.last7Days:
                this.startPeriod = moment().subtract(7, "days").hours(0).minutes(0).seconds(0);
                break;
            case ZoomPeriod.last30days:
                this.startPeriod = moment().subtract(30, "days").hours(0).minutes(0).seconds(0);
                break;
            default:
            case ZoomPeriod.year:
                this.startPeriod = moment(moment().year() + "-01-01");
                break;
        }
    }

    private getData(probe: IPhotoResistor): Promise<boolean> {
        return new Promise((resolve, reject) => {
            if (probe.data.history != null) {
                resolve(true);
            } else {
                if (probe.name == null) {
                    reject("Probe name is null !");
                } else {
                    this.http.get(environment.apiData + "/assets/data/"+ probe.name +"/data.json").toPromise().then(
                        (value: IPhotoResistorDataValue[]) => {
                            if (value != null) {
                                probe.errors = [];
                                this.originalData = JSON.parse(JSON.stringify(value));
                                probe.data.history = JSON.parse(JSON.stringify(value));
                                resolve(true);
                            } else {
                                probe.errors.push("File is null");
                                resolve(false);
                            }
                        },
                        error => {
                            reject(error);
                        }
                    );
                }
            }
        });
    }

    private populateInfoData(): void {
        let probe: IPhotoResistor = this.probe;
        let data: IPhotoResistorDataValue[] = probe.data.history;
        if (data != null && data.length > 0) {
            // Current values
            let lastData = probe.data.history[probe.data.history.length-1];
            probe.data.current = {
                date: lastData.date,
                resistance: lastData.resistance
            }
            // Averages | Min - Max
            let resAverage = 0;
            let resMin = Math.min();
            let resMax = Math.max();
            data.forEach(v => {
                if (resMin > v.resistance) resMin = v.resistance;
                if (resMax < v.resistance) resMax = v.resistance;
                resAverage += v.resistance;
            });
            probe.data.average = {
                resistance: resAverage / data.length
            }
            probe.data.min = {
                resistance: resMin
            }
            probe.data.max = {
                resistance: resMax
            }
            // Trends
            probe.data.trend = {
                resistance: null
            }
            let vl = data.length;
            if (vl > 2) {
                probe.data.trend.resistance = (data[vl-1].resistance - data[vl-2].resistance);
            }
        }
    }

    private updateChart(): void {
        let chart = this.probe.charts.find(c => c.type == IProbeChartType.History);
        let data = this.probe.data;

        if (chart != null && chart.chart && chart.chart.ref && chart.chart.ref.series && data != null && data.history != null) {
            chart.chart.ref.series[0].setData(data.history.map(d => [ moment(d.date).valueOf(), d.resistance]), true, true);
        }
    }

    private drawChart(): void {
        let probe = this.probe;
            
        // Apply theme
        Highcharts.setOptions(HighchartsTheme.DarkTheme);

        // Set global options
        Highcharts.setOptions({
            global: {
            useUTC: false
            },
            lang: HighchartsTheme.LangFR
        });

        // let data = probe.data;
        let resColor = HighchartsTheme.DarkTheme.colors[1];

        // SERIE RESISTANCE
        let resSerie = {
            color: resColor,
            yAxis: 0,
            zIndex: 1,
            type: "spline",
            name: 'Resistance',
            tooltip: {
                enabled: true,
                pointFormat: 'R(ms): {point.y}'
            },
            data: [ [ this.startPeriod.valueOf(), null ], [ moment().valueOf(), null ] ]
        } as Highcharts.SeriesOptions;

        // CHART OPTIONS
        let options: Highcharts.Options = {
            legend: {
                enabled: false
            },
            chart: {
                // type: 'line'
                zoomType: 'x'
            },
            title: {
                align: 'left',
                text: ' History',
                style: {
                    color: "transparent",
                    fontSize: "5px"
                }
            },
            tooltip: {
                shared: true,
                // split: true
            },
            credits: {
                enabled: false
            },
            xAxis: {
                type: 'datetime'
            },
            yAxis: [
                {
                    // min: 0,
                    // max: 50,
                    // reversed: true,
                    tickInterval: 1,
                    title: { 
                        useHTML: true, 
                        text: "<div style='display:inline-block;width:10px;height:10px;background-color:"+resColor+"'></div>&nbsp; <b>Résistance (ms)</b>"
                    },
                    labels: {
                        format: "{value} ms"
                    }
                } as Highcharts.AxisOptions
            ],
            series: [resSerie]
        };

        // CONSTRUCT CHARTS
        let chart = new Chart(options);

        let ci = probe.charts.findIndex(c => c.type == IProbeChartType.History);
        if (ci > -1) {
            probe.charts.splice(ci, 1);
        }
        probe.charts.push( { type: IProbeChartType.History, chart: chart } );
        
    }

    private readJSON(url): any {
        let xhr = new XMLHttpRequest();
        let json = {};
        xhr.open("GET", url, false);
        xhr.send(null);
        if (xhr.status === 200) {
            return JSON.parse(xhr.responseText);
        } else {
            return false;
        }
    };

    private _correctData(): void {
    //     let history = this.originalData;
    //     this.countCorrections = 0;
    //     history.forEach( (data: IDHTData, i) => {
    //         if (i > 2) {
    //             //temperature
    //             let lastAverages: number = (history[i-1].temp + history[i-2].temp) / 2;

    //             if ( (data.temp < (lastAverages / 1.5)) || (data.temp > (lastAverages * 1.5)) ) {
    //                 data.temp = (history[i-2].temp + history[i-1].temp) / 2;
    //                 this.countCorrections++;
    //             }

    //             //humidity
    //             let lastAveragesHum = (history[i-1].humidity + history[i-2].humidity) / 2;

    //             if ( (data.humidity < (lastAveragesHum / 1.5)) || (data.humidity > (lastAveragesHum * 1.5)) ) {
    //                 data.humidity = (history[i-2].humidity + history[i-1].humidity) / 2;
    //                 this.countCorrections++;
    //             }
    //         }
    //     });

    //     this.probe.data.history = JSON.parse(JSON.stringify(history));
    //     this.percentCorrections = ((this.countCorrections / 2 / this.probe.data.history.length) * 100);
    }
}
