import { Component, ViewChildren, QueryList, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { AppService } from './app.service';
import { IProbe, IRelay } from './models/interfaces/probe.interface';
import { ISensorComponent } from './models/interfaces/sensor-component.interface';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  @ViewChildren("sensorComponent") sensorComponents: QueryList<ISensorComponent>;

  public probes: (IProbe | IRelay)[];
  
  constructor(appService: AppService) {
    this.probes = appService.getProbes();
  }

  public correctAllData(): void {
    this.sensorComponents.forEach(compo => {
      compo.correctData()
    });
  }
}
