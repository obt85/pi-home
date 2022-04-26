import { HttpClient } from '@angular/common/http';
import { Component, Input, OnInit } from '@angular/core';

import { Chart, Highcharts } from 'angular-highcharts';
import * as moment from 'moment';

import { HighchartsTheme } from '../../plugins/charts/highcharts-theme.model';
import { IProbeChartType, ZoomPeriod, IVmc, IVmcDataValue, IVmcFilterData } from '../../models/interfaces/probe.interface';
import { ISensorComponent } from '../../models/interfaces/sensor-component.interface';

@Component({
    selector: 'pih-vmc',
    templateUrl: 'vmc.component.html',
    styleUrls: ['vmc.component.scss']
})

export class VMCComponent implements OnInit, ISensorComponent {
    @Input() probe: IVmc;
    @Input() display: string = "normal";
    @Input() showCorrectData: boolean = false;

    private isCorrectingData: boolean;
    private countCorrections: number;
    private percentCorrections: number;
    private startPeriod: moment.Moment;

    private originalData: Array<IVmcDataValue>;
    public selectedPeriod: ZoomPeriod;
    public filters: Array<IVmcFilterData>;
    public filters2: Array<IVmcFilterData>;

    constructor(private http: HttpClient) {
        this.selectedPeriod = ZoomPeriod.today;
        this.setStartPeriod(this.selectedPeriod);
    }

    ngOnInit() {
        this.filters = [
            { key: "temperatureExterieurEntree", label: "Temp. air insuflé en entrée de VMC", checked: true, color: HighchartsTheme.DarkTheme.colors[0], yAxis: 0, unit: '°C' },
            { key: "temperatureExterieurSortie", label: "Temp. air insuflé en sortie de VMC", checked: true, color: HighchartsTheme.DarkTheme.colors[0], yAxis: 0, unit: '°C' },
            { key: "temperatureInterieurEntree", label: "Temp. air extrait en entrée de VMC", checked: true, color: HighchartsTheme.DarkTheme.colors[2], yAxis: 0, unit: '°C' },
            { key: "temperatureInterieurSortie", label: "Temp. air extrait en sortie de VMC", checked: true, color: HighchartsTheme.DarkTheme.colors[2], yAxis: 0, unit: '°C' },
            { key: "iaq", label: "Qualité de l'air", unit: "ppm", checked: true, color: HighchartsTheme.DarkTheme.colors[5], yAxis: 1},
            { key: "co2", label: "CO2", unit: "ppm", checked: true, color: HighchartsTheme.DarkTheme.colors[6], yAxis: 1},
        ];

        this.filters2 = [
            { key: "filterRemainingTime", label: "", unit: "days"},
            { key: "filterUsedTime", label: "", unit: "days"},
            
            { key: "iaq", label: "", unit: "ppm"},
            { key: "co2", label: "", unit: "ppm"},

            { key: "currentVentilationLevel", label: ""},
            { key: "currentProgramLevel", label: ""},
            { key: "bypassLevel", label: "", unit: "%"},
            
            { key: "etaFanActive", label: "",
            { key: "supFanActive", label: ""},
            { key: "supFanSpeed", label: "", unit: "rpm"},
            { key: "etaFanSpeed", label: "", unit: "rpm"},
            { key: "supFanVoltage", label: "", unit: "V"},
            { key: "etaFanVoltage", label: "", unit: "V"},
            { key: "currentEtaAirflow", label: "", unit: "m³/h"},
            { key: "currentSupAirflow", label: "", unit: "m³/h"},
            { key: "targetEtaAirflow", label: "", unit: "m³/h"},
            { key: "targetSupAirflow", label: "", unit: "m³/h"},
            { key: "measuredEtaAirflow", label: "", unit: "m³/h"},
            { key: "measuredSupAirflow", label: "", unit: "m³/h"},

            { key: "humiditeInterieur", label: "", unit: "%"},
            { key: "humiditeExterieur", label: "", unit: "%"},

            { key: "etaConstantFlowSensorValue", label: ""},
            { key: "supConstantFlowSensorValue", label: ""},
            
            { key: "qualiSensorPollutionAlert", label: ""},
            { key: "qualiSensorErrorCount", label: ""},
            
            
        ];

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

    private getData(probe: IVmc): Promise<boolean> {
        return new Promise((resolve, reject) => {
            if (probe.data.history != null) {
                resolve(true);
            } else {
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
                            (result: IVmcDataValue[]) => {
                                if (result != null && result.length > 0) {
                                    this.originalData = this.originalData.concat(result);
                                    probe.data.history = probe.data.history.concat(result);
                                }
                            }, error => {}
                        ))
                    );

                    
                    // this.http.get("assets/data/"+ probe.name +"/data" + day + ".json").toPromise().then(
                    //     (value: IVmcDataValue[]) => {
                    //         if (value != null) {
                    //             probe.errors = [];
                    //             this.originalData = JSON.parse(JSON.stringify(value));
                    //             probe.data.history = JSON.parse(JSON.stringify(value));
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
            }
        });
    }

    private populateInfoData(): void {
        let probe: IVmc = this.probe;
        let data: IVmcDataValue[] = probe.data.history;
        if (data != null && data.length > 0) {
            // Current values
            let lastData = probe.data.history[probe.data.history.length-1];
            probe.data.current = {
                date: lastData.date,
                temperatureExterieurEntree: parseInt(lastData.temperatureExterieurEntree.toString()),
                temperatureExterieurSortie: parseInt(lastData.temperatureExterieurSortie.toString()),
                temperatureInterieurEntree: parseInt(lastData.temperatureInterieurEntree.toString()),
                temperatureInterieurSortie: parseInt(lastData.temperatureInterieurSortie.toString()),
                filterRemainingTime: lastData.filterRemainingTime,
                etaFanActive: lastData.etaFanActive,
                currentEtaAirflow: lastData.currentEtaAirflow,
                bypassLevel: lastData.bypassLevel,
                humiditeInterieur: lastData.humiditeInterieur,
                etaConstantFlowSensorValue: lastData.etaConstantFlowSensorValue,
                supFanActive: lastData.supFanActive,
                supConstantFlowSensorValue: lastData.supConstantFlowSensorValue,
                qualiSensorPollutionAlert: lastData.qualiSensorPollutionAlert,
                supFanSpeed: lastData.supFanSpeed,
                currentProgramLevel: lastData.currentProgramLevel,
                etaFanSpeed: lastData.etaFanSpeed,
                supFanVoltage: lastData.supFanVoltage,
                filterUsedTime: lastData.filterUsedTime,
                humiditeExterieur: lastData.humiditeExterieur,
                currentVentilationLevel: lastData.currentVentilationLevel,
                measuredEtaAirflow: lastData.measuredEtaAirflow,
                measuredSupAirflow: lastData.measuredSupAirflow,
                targetSupAirflow: lastData.targetSupAirflow,
                qualiSensorErrorCount: lastData.qualiSensorErrorCount,
                etaFanVoltage: lastData.etaFanVoltage,
                currentSupAirflow: lastData.currentSupAirflow,
                targetEtaAirflow: lastData.targetEtaAirflow,
                iaq: lastData.iaq,
                co2: lastData.co2
            }

            this.filters.filter(f => f.checked).forEach(f => {
                if (lastData[f.label] != null)
                    probe.data.current[f.key] = lastData[f.label];
            });
            // Averages | Min - Max
            // let resAverage = 0;
            // let resMin = Math.min();
            // let resMax = Math.max();
            // data.forEach(v => {
            //     if (resMin > v.resistance) resMin = v.resistance;
            //     if (resMax < v.resistance) resMax = v.resistance;
            //     resAverage += v.resistance;
            // });
            // probe.data.average = {
            //     resistance: resAverage / data.length
            // }
            // probe.data.min = {
            //     resistance: resMin
            // }
            // probe.data.max = {
            //     resistance: resMax
            // }
            // // Trends
            // probe.data.trend = {
            //     resistance: null
            // }
            // let vl = data.length;
            // if (vl > 2) {
            //     probe.data.trend.resistance = (data[vl-1].resistance - data[vl-2].resistance);
            // }
        }
    }

    private updateChart(): void {
        let chart = this.probe.charts.find(c => c.type == IProbeChartType.History);
        let data = this.probe.data;

        if (chart != null && chart.chart && chart.chart.ref && chart.chart.ref.series && data != null && data.history != null) {
            
            this.filters.filter(f => f.checked).forEach((f,i) => {
                if (chart.chart.ref.series[i] != null) {
                    chart.chart.ref.series[i].setData(data.history.map(d => [ moment(d.date).valueOf(), parseFloat(d[f.key])]), true, true);
                }
            });
            // chart.chart.ref.series[0].setData(data.history.map(d => [ moment(d.date).valueOf(), d.temperatureExterieurEntree]), true, true);
            // chart.chart.ref.series[1].setData(data.history.map(d => [ moment(d.date).valueOf(), d.temperatureExterieurSortie]), true, true);
            // chart.chart.ref.series[2].setData(data.history.map(d => [ moment(d.date).valueOf(), d.temperatureInterieurEntree]), true, true);
            // chart.chart.ref.series[3].setData(data.history.map(d => [ moment(d.date).valueOf(), d.temperatureInterieurSortie]), true, true);
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
        // let serieColor1 = HighchartsTheme.DarkTheme.colors[1];
        let blueColor = HighchartsTheme.DarkTheme.colors[0];
        let redColor = HighchartsTheme.DarkTheme.colors[2];

        // SERIE temperatureExterieurEntree
        // let serie1 = {
        //     // color: resColor,
        //     yAxis: 0,
        //     zIndex: 1,
        //     type: "spline",
        //     name: 'Resistance',
        //     tooltip: {
        //         enabled: true,
        //         pointFormat: 'R(ms): {point.y}'
        //     },
        //     data: [ [ this.startPeriod.valueOf(), null ], [ moment().valueOf(), null ] ]
        // } as Highcharts.SeriesOptions;

        let series = this.filters.filter(f => f.checked).map(f => {
            let serie1 = {
                color: f.color,
                yAxis: f.yAxis,
                // zIndex: 1,
                type: "line",
                name: f.label,
                tooltip: {
                    enabled: true,
                    pointFormat: f.label + ': {point.y} '+ f.unit +' <br>',
                    valueDecimals: 0,
                },
                data: [ [ this.startPeriod.valueOf(), null ], [ moment().valueOf(), null ] ]
            } as Highcharts.SeriesOptions;
            return serie1;
        });

        // CHART OPTIONS
        let options: Highcharts.Options = {
            legend: {
                enabled: true,
                // reversed: true
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
            // plotOptions: {
            //     series: {
            //         stacking: 'normal'
            //     }
            // },
            xAxis: {
                type: 'datetime'
            },
            yAxis: [
                {
                    // min: 0,
                    // max: 50,
                    // reversed: true,
                    tickInterval: 1,
                    // title: { 
                    //     useHTML: true, 
                    //     text: "<div style='display:inline-block;width:10px;height:10px;background-color:"+serie1.color+"'></div>&nbsp; <b>Résistance (ms)</b>"
                    // },
                    labels: {
                        format: "{value} °C"
                    }
                } as Highcharts.AxisOptions,
                {
                    // min: 0,
                    // max: 50,
                    // reversed: true,
                    tickInterval: 100,
                    // title: { 
                    //     useHTML: true, 
                    //     text: "<div style='display:inline-block;width:10px;height:10px;background-color:"+serie1.color+"'></div>&nbsp; <b>Résistance (ms)</b>"
                    // },
                    labels: {
                        format: "{value} ppm"
                    },
                    opposite: true
                } as Highcharts.AxisOptions
            ],
            series: series
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
