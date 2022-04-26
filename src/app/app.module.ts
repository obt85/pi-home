import { CommonModule } from '@angular/common';
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { AppComponent } from './app.component';
import { DHTSensorModule } from './modules/dht22-sensor/dht22-sensor.module';
import { HomePlanComponent } from './modules/home-plan/home-plan.component';
import { GridsterModule } from 'angular-gridster2';
import { AppService } from './app.service';
import { ChartModule } from 'angular-highcharts';
import { PhotoResistorModule } from './modules/photo-resistor/photo-resistor.module';
import { RelayModule } from './modules/relay/relay.module';
import { MiniPIRModule } from './modules/mini-pir/mini-pir.module';
import { TempOverviewComponent } from './modules/temp-overview/temp-overview.component';
import { VMCModule } from './modules/vmc/vmc.module';

@NgModule({
  declarations: [
    AppComponent,
    HomePlanComponent,
    TempOverviewComponent
  ],
  imports: [
    CommonModule,
    BrowserModule,
    HttpClientModule,
    FormsModule,
    GridsterModule,
    DHTSensorModule,
    MiniPIRModule,
    ChartModule,
    RelayModule,
    PhotoResistorModule,
    VMCModule
  ],
  exports: [
  ],
  providers: [
    HttpClient,
    AppService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
