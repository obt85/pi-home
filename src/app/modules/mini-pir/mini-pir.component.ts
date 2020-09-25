import { Component, Input, OnInit, AfterViewInit } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { IProbe, IProbeType } from '../../models/interfaces/probe.interface';
import { ISensorComponent } from '../../models/interfaces/sensor-component.interface';

@Component({
    selector: 'pih-mini-pir',
    templateUrl: 'mini-pir.component.html',
    styleUrls: ['mini-pir.component.scss']
})
export class MiniPIRComponent implements OnInit, ISensorComponent {
    @Input() probe: IProbe;
    @Input() display: string = "normal";

    public value: number;
    public delay: number; // miliseconds

    constructor(private http: HttpClient) {
        this.delay = 1000;
        this.value = 0;
    }

    ngOnInit() {
        if (this.probe && this.probe.type != IProbeType.MINIPIR) {
            console.error('Probe is not of type Mini PIR !');
            return;
        }

        this.getValue();
    }

    private getValue(): void {
        this.probe.errors = [];
        if (this.probe.httpRequest != null) {
            this.http.get(this.probe.httpRequest)
            .toPromise()
            .catch(error => {this.catchError(error); return })
            .then(
                (response: number) => {
                    if (typeof response === "number") {
                        this.value = response;
                    } else {
                        this.catchError("Error: " + response);
                    }
                    setTimeout(() => { this.getValue() }, this.delay)
                },
                error => {
                    this.catchError(error);
                    setTimeout(() => { this.getValue() }, this.delay)
                }
            );
        }
    }

    private catchError(error: any): void {
        this.value = 2;
        this.probe.errors.push(error);
    }

    public correctData(): void {
    }

    private getHeaders(): HttpHeaders {
        return new HttpHeaders({
            "Content-Type": "application/json",
            "Accept-Language": "en",
            "Pragma": "no-cache"
        });
    }

}
