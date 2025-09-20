import { Component, Input, OnInit } from '@angular/core';

import { IProbe, IProbeType } from '../../models/interfaces/probe.interface';
import { ISensorComponent } from '../../models/interfaces/sensor-component.interface';
import { PirService, PirState } from './pir.service';

@Component({
    selector: 'pih-mini-pir',
    templateUrl: 'mini-pir.component.html',
    styleUrls: ['mini-pir.component.scss']
})
export class MiniPIRComponent implements OnInit, ISensorComponent {
    @Input() probe: IProbe;
    @Input() display: string = "normal";

    public value: number;
    public delay: number; // milliseconds

    constructor(private pirService: PirService) {
        this.delay = 1000;
        this.value = 0;
    }

    ngOnInit() {
        if (this.probe && this.probe.type !== IProbeType.MINIPIR) {
            console.error('Probe is not of type Mini PIR !');
            return;
        }

        this.getValue();
    }

    private getValue(): void {
        this.probe.errors = [];

        if (this.probe.gpio != null) {
            // Angular 5 subscribe syntax
            this.pirService.getPirState(this.probe.gpio)
                .subscribe(
                    (response: PirState) => {
                        if (response && typeof response.state === 'number') {
                            this.value = response.state;
                        } else if (response.error) {
                            this.catchError(response.error);
                        } else {
                            this.catchError('Invalid response format');
                        }
                        setTimeout(() => { this.getValue() }, this.delay);
                    },
                    (err) => {
                        this.catchError(err);
                        setTimeout(() => { this.getValue() }, this.delay);
                    }
                );
        }
    }

    private catchError(error: any): void {
        this.value = 2; // état d’erreur visible
        this.probe.errors.push(error);
    }

    public correctData(): void {
        // Optionnel : logique pour corriger la valeur si nécessaire
    }
}
