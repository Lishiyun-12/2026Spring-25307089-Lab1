import type IValueFormatter from './IValueFormatter';
import type EntryOhos from '../data/EntryOhos';
import type ViewPortHandler from '../utils/ViewPortHandler';
/**
 * Default formatter used for formatting values inside the chart. Uses a DecimalFormat with
 * pre-calculated number of digits (depending on max and min value).
 *
 *
 */
export default class DefaultValueFormatter implements IValueFormatter {
    /**
     * DecimalFormat for formatting
     */
    //protected  mFormat:DecimalFormat;
    protected mDecimalDigits: number = 0;
    /**
     * Constructor that specifies to how many digits the value should be
     * formatted.
     *
     * @param digits
     */
    constructor(digits: number) {
        this.setup(digits);
    }
    /**
     * Sets up the formatter with a given number of decimal digits.
     *
     * @param digits
     */
    public setup(digits: number): void {
        this.mDecimalDigits = digits;
    }
    public getFormattedValue(value: number, entry: EntryOhos, dataSetIndex: number, viewPortHandler: ViewPortHandler): string {
        // put more logic here ...
        // avoid memory allocations here (for performance reasons)
        return (Math.round(value * 10) / 10).toString();
    }
    /**
     * Returns the number of decimal digits this formatter uses.
     *
     * @return
     */
    public getDecimalDigits(): number {
        return this.mDecimalDigits;
    }
}
