import { NgModule } from '@angular/core';
import { IntFormatPipe } from './int-format.pipe';
import { NumberFormatPipe } from './number-format.pipe';


@NgModule({
    imports: [],
    exports: [
        NumberFormatPipe,
        IntFormatPipe
    ],
    declarations: [
        NumberFormatPipe,
        IntFormatPipe
    ],
    providers: [],
})
export class PipesModule { }
