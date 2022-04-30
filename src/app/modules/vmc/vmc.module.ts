import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { VMCComponent } from './vmc.component';
import { VMCDetailsComponent } from './vmc-details.component';
import { PipesModule } from '../../shared/pipes/pipes.module';

@NgModule({
    imports: [
        BrowserModule,
        PipesModule
    ],
    exports: [
        VMCComponent,
        VMCDetailsComponent
    ],
    declarations: [
        VMCComponent,
        VMCDetailsComponent
    ],
    providers: [],
})
export class VMCModule {

}