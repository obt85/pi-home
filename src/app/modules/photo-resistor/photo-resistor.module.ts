import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { PhotoResistorComponent } from './photo-resistor.component';
import { PipesModule } from '../../shared/pipes/pipes.module';

@NgModule({
    imports: [
        BrowserModule,
        PipesModule
    ],
    exports: [
        PhotoResistorComponent
    ],
    declarations: [
        PhotoResistorComponent
    ],
    providers: [],
})
export class PhotoResistorModule {

}