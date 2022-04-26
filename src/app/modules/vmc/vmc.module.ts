import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { VMCComponent } from './vmc.component';
import { PipesModule } from '../../shared/pipes/pipes.module';

@NgModule({
    imports: [
        BrowserModule,
        PipesModule
    ],
    exports: [
        VMCComponent
    ],
    declarations: [
        VMCComponent
    ],
    providers: [],
})
export class VMCModule {

}