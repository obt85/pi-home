import { Pipe, PipeTransform } from "@angular/core";

@Pipe({
    name: "pihNumberFormat",
})
export class NumberFormatPipe implements PipeTransform {
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

        return (Math.round(value * 100) / 100).toString().replace(".", format ? format : this.numberDecimalSeparator);
    }
}
