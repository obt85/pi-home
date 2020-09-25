import { HttpClient } from '@angular/common/http';
import { Component, Input, OnInit } from '@angular/core';

import { Chart, Highcharts } from 'angular-highcharts';
import * as moment from 'moment';

import { HighchartsTheme } from '../../../app/plugins/charts/highcharts-theme.model';
import { IProbe, IDHTData, IProbeChartType, ZoomPeriod } from '../../models/interfaces/probe.interface';
import { ISensorComponent } from '../../models/interfaces/sensor-component.interface';

@Component({
    selector: 'pih-dht22-sensor',
    templateUrl: 'dht22-sensor.component.html',
    styleUrls: ['dht22-sensor.component.scss']
})

export class DHT22SensorComponent implements OnInit, ISensorComponent {
    @Input() probe: IProbe;
    @Input() display: string = "normal";
    @Input() showCorrectData: boolean = false;

    private autoCorrectData = false;
    private isCorrectingData: boolean;
    private countCorrections: number;
    private percentCorrections: number;
    private startPeriod: moment.Moment;

    private originalData: Array<IDHTData>;
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
            this.selectedPeriod = period;
            this.setStartPeriod(period);
            // this.setPeriodToData(period);
            this.getData(this.probe).then(() => {
                this.populateInfoData();
                this.updateChart();
            });
        }
    }

    public correctData(): void {
        this.autoCorrectData = true;
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
            if (this.originalData != null) {
                this.probe.data.history = this.originalData.filter(d => moment(d.date) >= this.startPeriod);
            }
        }
    }

    private setStartPeriod(period: ZoomPeriod): void {
        switch(period) {
            case ZoomPeriod.today:
                this.startPeriod = moment().hour(0).minute(0).second(0).milliseconds(0);
                break;
            case ZoomPeriod.yesterday:
                this.startPeriod = moment().subtract(1, "days").hour(0).minute(0).second(0).milliseconds(0);
                break;
            case ZoomPeriod.last24Hours:
                this.startPeriod = moment().seconds(0).subtract(24, "hours");
                break;
            case ZoomPeriod.last48Hours:
                this.startPeriod = moment().subtract(2, "days");
                break;
            case ZoomPeriod.last7Days:
                this.startPeriod = moment().subtract(7, "days").hours(0).minutes(0).seconds(0).milliseconds(0);
                break;
            case ZoomPeriod.last30days:
                this.startPeriod = moment().subtract(30, "days").hours(0).minutes(0).seconds(0).milliseconds(0);
                break;
            default:
            case ZoomPeriod.year:
                this.startPeriod = moment(moment().year() + "-01-01").hours(0).minutes(0).seconds(0).milliseconds(0);
                break;
        }
    }

    private orderData(probe: IProbe): void {
        if (probe.data && probe.data.history && probe.data.history.length > 0) {
            probe.data.history.sort((a, b) => a.date.toString().localeCompare(b.date.toString()));
            this.originalData = [...probe.data.history];
        }
    }

    private getData(probe: IProbe): Promise<boolean> {
        return new Promise((resolve, reject) => {
            // if (probe.data.history != null) {
            //     resolve(true);
            // } else {
                if (probe.name == null) {
                    reject("Probe name is null !");
                } else {

                    let days = [];
                    if (this.selectedPeriod === ZoomPeriod.today) {
                        days.push(this.startPeriod.format('YYYY-MM-DD'));
                    } else {
                        let today = moment().hours(0).minutes(0).seconds(0).milliseconds(0);
                        let startDate = moment(this.startPeriod);
                        while (startDate.isSameOrBefore(today)) {
                            days.push(startDate.format('YYYY-MM-DD'));
                            startDate = startDate.add(1, "days");
                        }
                    }

                    this.originalData = [];
                    probe.data.history = [];

                    Promise.all(
                        days.map( day => this.http.get("assets/data/"+ probe.name + "/data_" + day + ".json").toPromise().then(
                            (result: IDHTData[]) => {
                                if (result != null && result.length > 0) {
                                    this.originalData = this.originalData.concat(result);
                                    probe.data.history = probe.data.history.concat(result);
                                }
                            }, error => {}
                        ))
                    ).then(
                        results => { this.orderData(probe); if (this.autoCorrectData) { this.correctData(); } resolve(true); },
                        errors => { this.orderData(probe); if (this.autoCorrectData) { this.correctData(); } resolve(true); }
                    )

                    // this.http.get("assets/data/"+ probe.name + "/data.json").toPromise().then(
                    //     (value: IDHTData[]) => {
                    //         if (value != null) {
                    //             probe.errors = [];
                    //             this.originalData = JSON.parse(JSON.stringify(value));
                    //             probe.data.history = JSON.parse(JSON.stringify(value));
                    //             // this.populateInfoData(probe, probe.data.history);
                    //             resolve(true);
                    //         } else {
                    //             probe.errors.push("File is null");
                    //             resolve(false);
                    //         }
                    //     },
                    //     error => {
                    //         reject(error);
                    //     }
                    // );
                }
            // }
        });
    }

    private populateInfoData(): void {
        let probe: IProbe = this.probe;
        let data: IDHTData[] = probe.data.history;
        if (data != null && data.length > 0) {
            // Current values
            let lastData = probe.data.history[probe.data.history.length-1];
            probe.data.current = {
                date: lastData.date,
                humidity: lastData.humidity,
                temp: lastData.temp
            }
            
            // Averages | Min - Max
            let tempAverage = 0;
            let tempMin = Math.min();
            let tempMax = Math.max();
            let humAverage = 0;
            let humMin = Math.min();
            let humMax = Math.max();
            data.forEach(v => {
                if (tempMin > v.temp) tempMin = v.temp;
                if (tempMax < v.temp) tempMax = v.temp;
                if (humMin > v.humidity) humMin = v.humidity;
                if (humMax < v.humidity) humMax = v.humidity;
                tempAverage += v.temp;
                humAverage += v.humidity;
            });
            probe.data.average = {
                temp: tempAverage / data.length,
                humidity: humAverage / data.length
            }
            probe.data.min = {
                temp: tempMin,
                humidity: humMin
            }
            probe.data.max = {
                temp: tempMax,
                humidity: humMax
            }
            // Trends
            probe.data.trend = {
                temp: null,
                humidity: null
            }
            let vl = data.length;
            if (vl > 2) {
                probe.data.trend.temp = (data[vl-1].temp - data[vl-2].temp);
                probe.data.trend.humidity = (data[vl-1].humidity - data[vl-2].humidity);
            }
        }

        this.probe.$data.next(this.probe.data);
    }

    private updateChart(): void {
        let chart = this.probe.charts.find(c => c.type == IProbeChartType.History);
        let data = this.probe.data;

        if (chart != null && chart.chart && chart.chart.ref && chart.chart.ref.series && data != null && data.history != null) {
            chart.chart.ref.series[0].setData(data.history.map(d => [ moment(d.date).valueOf(), d.temp]), true, true);
            chart.chart.ref.series[1].setData(data.history.map(d => [ moment(d.date).valueOf(), d.humidity]), true, true);
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
        let humColor = HighchartsTheme.DarkTheme.colors[0];
        let tempColor = HighchartsTheme.DarkTheme.colors[2];

        // SERIE TEMPERATURE
        let tempSerie = {
            color: tempColor,
            yAxis: 0,
            zIndex: 1,
            type: "spline",
            name: 'Température',
            tooltip: {
                enabled: true,
                pointFormat: 'T: {point.y:0.1f}°C'
            },
            // data: data.history.map(d => [ moment(d.date).valueOf(), d.temp])
            data: [ [ this.startPeriod.valueOf(), null ], [ moment().valueOf(), null ] ]
        } as Highcharts.SeriesOptions;

        // SERIE HUMIDITY
        let humiditySerie = {
            color: humColor,
            fillOpacity: 0.3,
            lineWidth: 0,
            yAxis: 1,
            type: "area",
            name: 'Humidity',
            tooltip: {
                enabled: true,
                pointFormat: '<br>H: {point.y:0.1f}%'
            },
            marker: {
                enabled: false
            },
            // data: data.history.map(d => [moment(d.date).valueOf(), d.humidity ])
            data: []
        } as Highcharts.SeriesChart;

        
        
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
                    tickInterval: 1,
                    title: { 
                        useHTML: true, 
                        text: "<div style='display:inline-block;width:10px;height:10px;background-color:"+tempColor+"'></div>&nbsp; <b>Température</b>" 
                    },
                    labels: {
                        format: "{value} °C"
                    }
                } as Highcharts.AxisOptions,
                {
                    min: 20,
                    // max: 100,
                    tickInterval: 5,
                    title: { 
                        useHTML: true, 
                        text: "<div style='display:inline-block;width:10px;height:10px;background-color:"+humColor+"'></div>&nbsp; <b>Humidité</b>" 
                    },
                    labels: {
                        format: "{value}%"
                    },
                    opposite: true,
                    
                } as Highcharts.AxisOptions
            ],
            series: [tempSerie, humiditySerie]
        };

        // CONSTRUCT CHARTS
        let chart = new Chart(options);

        let ci = probe.charts.findIndex(c => c.type == IProbeChartType.History);
        if (ci > -1) {
            probe.charts.splice(ci, 1);
        }
        probe.charts.push( { type: IProbeChartType.History, chart: chart } );
        
    }

    private _correctData(): void {
        let history = this.originalData;
        this.countCorrections = 0;
        history.forEach( (data: IDHTData, i) => {
            if (i > 2) {
                //temperature
                let lastAverages: number = (history[i-1].temp + history[i-2].temp) / 2;

                if ( (data.temp < (lastAverages / 1.5)) || (data.temp > (lastAverages * 1.5)) ) {
                    data.temp = (history[i-2].temp + history[i-1].temp) / 2;
                    this.countCorrections++;
                }

                //humidity
                let lastAveragesHum = (history[i-1].humidity + history[i-2].humidity) / 2;

                if ( (data.humidity < (lastAveragesHum / 1.5)) || (data.humidity > (lastAveragesHum * 1.5)) ) {
                    data.humidity = (history[i-2].humidity + history[i-1].humidity) / 2;
                    this.countCorrections++;
                }
            }
        });

        this.probe.data.history = JSON.parse(JSON.stringify(history));
        this.percentCorrections = ((this.countCorrections / 2 / this.probe.data.history.length) * 100);
    }
}
