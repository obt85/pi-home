import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { DHT22SensorComponent } from './dht22-sensor.component';
import { PipesModule } from '../../shared/pipes/pipes.module';

@NgModule({
    imports: [
        BrowserModule,
        PipesModule
    ],
    exports: [
        DHT22SensorComponent
    ],
    declarations: [
        DHT22SensorComponent
    ],
    providers: [],
})
export class DHTSensorModule {

}