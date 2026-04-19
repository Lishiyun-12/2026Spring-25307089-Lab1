import type IAxisValueFormatter from './IAxisValueFormatter';
import type AxisBase from '../components/AxisBase';
import HashMap from "@ohos:util.HashMap";
export default class DefaultAxisValueFormatter implements IAxisValueFormatter {
    /**
     * the number of decimal digits this formatter uses
     */
    protected digits: number = 0;
    textCache = new HashMap<number, string>();
    /**
     * Constructor that specifies to how many digits the value should be
     * formatted.
     *
     * @param digits
     */
    constructor(digits: number) {
        this.digits = digits;
    }
    public getFormattedValue(value: number, axis: AxisBase): string {
        // avoid memory allocations here (for performance)
        if (value == undefined || value == null) {
            return '';
        }
        const textSizeTemp = this.textCache.get(value);
        if (textSizeTemp) {
            return textSizeTemp;
        }
        else {
            const result = (Math.round(value * 10) / 10).toString();
            this.textCache.set(value, result);
            return result;
        }
    }
    /**
     * Returns the number of decimal digits this formatter uses or -1, if unspecified.
     *
     * @return
     */
    public getDecimalDigits(): number {
        return this.digits;
    }
}
