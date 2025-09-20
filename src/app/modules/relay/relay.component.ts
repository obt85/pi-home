import { Component, Input, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { IProbeType, IRelay } from '../../models/interfaces/probe.interface';
import { environment } from '../../../environments/environment';

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
        this.getCurrentPosition();
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
            // this.relay.httpRequest,
            environment.apiRelay,
            JSON.stringify({ gpio: this.relay.gpio, position: this.relay.position })
        )
        .toPromise()
        .catch(error => {
            // console.log("Post error: ", error);
        })
        .then(
            (response: {gpio: number, position: number, state: number}) => {
                // this.relay.position = response.position;
                this.getCurrentPosition();
            }
        );
    }

    getCurrentPosition() {
        this.http.get<Array<number>>(environment.apiRelay).toPromise().then((value: any) => {
            this.relay.position = value[this.relay.gpio];
        });
    }
}
