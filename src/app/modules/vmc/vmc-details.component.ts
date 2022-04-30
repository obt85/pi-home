import { HttpClient } from '@angular/common/http';
import { Component, Input, OnInit } from '@angular/core';

import { Chart, Highcharts } from 'angular-highcharts';
import * as moment from 'moment';

import { HighchartsTheme } from '../../plugins/charts/highcharts-theme.model';
import { IProbeChartType, ZoomPeriod, IVmc, IVmcDataValue, IVmcFilterData, IProbe } from '../../models/interfaces/probe.interface';
import { ISensorComponent } from '../../models/interfaces/sensor-component.interface';

@Component({
    selector: 'pih-vmc-details',
    templateUrl: 'vmc-details.component.html',
    styleUrls: ['vmc-details.component.scss']
})

export class VMCDetailsComponent implements OnInit {
    @Input() probe: IVmc;

    constructor(private http: HttpClient) {
    }

    ngOnInit() {
    }

}
