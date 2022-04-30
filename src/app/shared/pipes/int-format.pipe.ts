import { Pipe, PipeTransform } from "@angular/core";

@Pipe({
    name: "pihIntFormat",
})
export class IntFormatPipe implements PipeTransform {
    private numberDecimalSeparator: string;

    constructor() {
        this.numberDecimalSeparator = ',';
    }

    public transform(value: any, format: string): string {
        if (value == null) {
            return null;
        }
        if (value === "NaN") {
            return null;
        }
        if (typeof(value) !== "number") {
            try {
                value = parseFloat(value);
            } catch (e) {
                return value;
            }
        }
        if (isNaN(value)) {
            return null;
        }

        return (<number>value).toFixed(0);
    }
}
