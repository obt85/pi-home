import { Component, Input, OnInit, AfterViewInit } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { AppService } from '../../app.service';

import { IProbe, IProbeType, ILocationType, IDHTData, IProbeChartType, ZoomPeriod, IRelay } from '../../models/interfaces/probe.interface';
import { ISensorComponent } from '../../models/interfaces/sensor-component.interface';

@Component({
    selector: 'pih-relay',
    templateUrl: 'relay.component.html',
    styleUrls: ['relay.component.scss']
})
export class RelayComponent implements OnInit {
    @Input() relay: IRelay;
    @Input() display: string = "normal";

    constructor(private http: HttpClient) {}

    ngOnInit() {
        if (this.relay && this.relay.type != IProbeType.RELAY) {
            console.error('Probe is not of type Relay !');
            return;
        }

    }

    public triggerRelay(position?: number): void {
        if (position != null) {
            this.relay.position = position;
        } else {
            if (this.relay.position == null || this.relay.position == 0) {
                this.relay.position = 1;
            } else {
                this.relay.position = 0;
            }
        }

        this.postRequest();
    }

    private postRequest(): void {
        this.http.post(
            this.relay.httpRequest,
            JSON.stringify({ gpio: this.relay.gpio, position: this.relay.position })
        )
        .toPromise()
        .catch(error => {
            // console.log("Post error: ", error);
        })
        .then(
            (response: any) => {
                this.relay.position = parseInt(response);
            }
        );
    }
}
