import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { MiniPIRComponent } from './mini-pir.component';
import { PirService } from './pir.service';

@NgModule({
    imports: [
        BrowserModule,
    ],
    exports: [
        MiniPIRComponent
    ],
    declarations: [
        MiniPIRComponent
    ],
    providers: [PirService],
})
export class MiniPIRModule {

}