

import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { AppService, ROOM_CHAMBRE1, ROOM_CHAMBRE3, ROOM_SDB, ROOM_CUISINE, ROOM_BUANDERIE, ROOM_PETIT_SALON, ROOM_BUREAU, ROOM_GRENIER, ROOM_CAVE1, ROOM_CAVE2, ROOM_CAVE3, ROOM_CHAMBRE2 } from '../../app.service';
import { IProbeType, IProbe } from '../../models/interfaces/probe.interface';

import { Chart, Highcharts } from 'angular-highcharts';
import { HighchartsTheme } from '../../plugins/charts/highcharts-theme.model';


@Component({
    selector: 'pih-temp-overview',
    templateUrl: 'temp-overview.component.html',
    styleUrls: [ 'temp-overview.component.scss' ]
})
export class TempOverviewComponent implements OnInit {
    public probes: IProbe[];
    public chartTemp: Chart;
    public chartHum: Chart;
    private rooms: Highcharts.DataPoint[] = [];

    constructor(private appService: AppService) { }
    
    ngOnInit() {
        this.rooms = [
            { name: ROOM_CHAMBRE1, y: null },
            { name: ROOM_CHAMBRE2, y: null },
            { name: ROOM_CHAMBRE3, y: null },
            { name: ROOM_SDB, y: null },
            { name: ROOM_CUISINE, y: null },
            { name: ROOM_BUANDERIE, y: null },
            { name: ROOM_PETIT_SALON, y: null },
            { name: ROOM_BUREAU, y: null },
            { name: ROOM_GRENIER, y: null },
            { name: ROOM_CAVE2, y: null },
            // { name: ROOM_CAVE3, y: null }
        ];

        this.probes = this.appService.getProbes().filter(p => p.type === IProbeType.DHT22 && this.rooms.some(r => r.name === p.location.name)) as IProbe[];
            
        this.drawChart();
        this.subscribeToData();
    }

    private subscribeToData(): void {
        this.probes.forEach(probe => {
            probe.$data.asObservable().subscribe(data => {
                if (data.current) {
                    if (data.current.temp) {
                        let p = this.chartTemp.ref.series[0].data.find(d => d.name === probe.location.name);
                        if (p != null) {
                            p.update(Math.round(data.current.temp), true);
                        }
                    }
                    if (data.current.humidity) {
                        let p = this.chartHum.ref.series[0].data.find(d => d.name === probe.location.name);
                        if (p != null) {
                            p.update(Math.round(data.current.humidity), true);
                        }
                    }
                }
            });
        });
    }

    public drawChart(): void {
        Highcharts.setOptions(HighchartsTheme.DarkTheme);

        // Set global options
        Highcharts.setOptions({
            global: {
            useUTC: false
            },
            lang: HighchartsTheme.LangFR
        });

        // CONSTRUCT CHARTS
        this.chartTemp = new Chart(this.getChartTempOptions());
        this.chartHum = new Chart(this.getChartHumidityOptions());
    }

    private getChartTempOptions(): Highcharts.Options {
        let tempColor = HighchartsTheme.DarkTheme.colors[2];
        // DRAW TEMP SERIE
        let tempSerie = {
            color: tempColor,
            yAxis: 0,
            name: "Températures de la maison",
            tooltip: {
                enabled: false,
                // pointFormat: 'T: {point.y:0.1f}°C'
            },
            dataLabels: {
                enabled: true,
                format: "{point.y:0.0f}"
            },
            data: []
        } as Highcharts.SeriesOptions;

        this.rooms.forEach(room => {
            tempSerie.data.push(room);
        });

        return {
            legend: {
                enabled: false
            },
            chart: {
                type: 'column'
            },
            title: {
                align: 'left',
                text: 'Températures de la maison',
                style: {
                    color: "transparent",
                    fontSize: "5px"
                }
            },
            tooltip: {
                // shared: true,
                // split: true
            },
            credits: {
                enabled: false
            },
            xAxis: {
                type: 'category',
                labels: {
                    style: {
                        fontSize: '1.1em'
                    }
                }
            },
            yAxis: [
                {
                    min: 10,
                    max: 30,
                    title: { 
                        useHTML: true, 
                        text: "<div style='display:inline-block;width:10px;height:10px;background-color:"+tempColor+"'></div>&nbsp; <b>Température</b>" 
                    },
                    labels: {
                        format: "{value} °C"
                    },
                    plotLines: [
                        {
                            color: 'green', // Color value
                            value: 20, // Value of where the line will appear
                            width: 2, // Width of the line    
                            label: {
                                text: '20°',
                                align: 'right',
                                x: -10
                            }
                        },
                        {
                            color: 'red', // Color value
                            value: 30, // Value of where the line will appear
                            width: 2, // Width of the line    
                            label: {
                                text: '30°',
                                align: 'right',
                                x: -10
                            }
                        },
                        {
                            color: 'orange', // Color value
                            value: 25, // Value of where the line will appear
                            width: 2, // Width of the line    
                            label: {
                                text: '25°',
                                align: 'right',
                                x: -10
                            }
                        },
                        {
                            color: 'blue', // Color value
                            value: 16, // Value of where the line will appear
                            width: 2, // Width of the line    
                            label: {
                                text: '16°',
                                align: 'right',
                                x: -10
                            }
                        },
                    ]
                } as Highcharts.AxisOptions
            ],
            series: [tempSerie]
        };
    }

    private getChartHumidityOptions(): Highcharts.Options {
        let humColor = HighchartsTheme.DarkTheme.colors[0];

        // DRAW HUM SERIE
        let humSerie = {
            color: humColor,
            yAxis: 0,
            name: "Humidités de la maison",
            tooltip: {
                enabled: false,
                // pointFormat: 'H: {point.y:0.1f}%'
            },
            dataLabels: {
                enabled: true,
                format: "{point.y:0.0f}"
            },
            data: []
        } as Highcharts.SeriesOptions;

        this.rooms.forEach(room => {
            humSerie.data.push(room);
        });
        
        return {
            legend: {
                enabled: false
            },
            chart: {
                type: 'column'
            },
            title: {
                align: 'left',
                text: 'Températures de la maison',
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
                type: 'category',
                labels: {
                    style: {
                        fontSize: '1.1em'
                    }
                }
            },
            yAxis: [
                {
                    min: 20,
                    max: 80,
                    tickInterval: 5,
                    title: { 
                        useHTML: true, 
                        text: "<div style='display:inline-block;width:10px;height:10px;background-color:"+humColor+"'></div>&nbsp; <b>Humidité</b>" 
                    },
                    labels: {
                        format: "{value}%"
                    },
                    // opposite: true,
                    plotBands: [{
                        color: 'rgba(68,169,168, 0.2)', // Color value
                        from: 40, // Start of the plot band
                        to: 70 // End of the plot band
                    }]
                    
                } as Highcharts.AxisOptions
            ],
            series: [humSerie]
        };
    }
}
