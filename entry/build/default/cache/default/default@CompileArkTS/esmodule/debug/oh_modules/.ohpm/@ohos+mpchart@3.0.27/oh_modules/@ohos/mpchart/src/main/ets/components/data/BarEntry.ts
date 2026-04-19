import Range from "@package:pkg_modules/.ohpm/@ohos+mpchart@3.0.27/pkg_modules/@ohos/mpchart/src/main/ets/components/highlight/Range";
import type ChartPixelMap from './ChartPixelMap';
import EntryOhos from "@package:pkg_modules/.ohpm/@ohos+mpchart@3.0.27/pkg_modules/@ohos/mpchart/src/main/ets/components/data/EntryOhos";
export default class BarEntry extends EntryOhos {
    private mYVals: number[] | null = null;
    private mRanges: Range[] | null = null;
    private mNegativeSum: number = 0.0;
    private mPositiveSum: number = 0.0;
    constructor(x?: number, y?: number | number[], icon?: ChartPixelMap, data?: Object) {
        super(x, Array.isArray(y) ? BarEntry.calcSum(y) : y, icon, data);
        if (Array.isArray(y)) {
            this.mYVals = y;
            this.calcPosNegSum();
            this.calcRanges();
        }
    }
    public copy(): BarEntry {
        let data: Object | null = this.getData();
        if (data) {
            let copied = new BarEntry(this.getX(), this.getY(), undefined, data);
            if (this.mYVals) {
                copied.setVals(this.mYVals);
            }
            return copied;
        }
        else {
            let copied = new BarEntry(this.getX(), this.getY());
            if (this.mYVals) {
                copied.setVals(this.mYVals);
            }
            return copied;
        }
    }
    public getYVals(): number[] | null {
        return this.mYVals;
    }
    public setVals(vals: number[]): void {
        this.setY(BarEntry.calcSum(vals));
        this.mYVals = vals;
        this.calcPosNegSum();
        this.calcRanges();
    }
    public getY(): number {
        return super.getY();
    }
    public getRanges(): Range[] | null {
        return this.mRanges;
    }
    /**
     * Returns true if this BarEntry is stacked (has a values array), false if not.
     *
     * @return
     */
    public isStacked(): boolean {
        return !!this.mYVals;
    }
    /**
     * Use `getSumBelow(stackIndex)` instead.
     */
    public getBelowSum(stackIndex: number): number {
        return this.getSumBelow(stackIndex);
    }
    public getSumBelow(stackIndex: number): number {
        if (!this.mYVals)
            return 0;
        let remainder: number = 0;
        let index = this.mYVals.length;
        while (index > stackIndex && index >= 0) {
            remainder += this.mYVals[index];
            index--;
        }
        return remainder;
    }
    /**
     * Reuturns the sum of all positive values this entry (if stacked) contains.
     *
     * @return
     */
    public getPositiveSum(): number {
        return this.mPositiveSum;
    }
    /**
     * Returns the sum of all negative values this entry (if stacked) contains. (this is a positive number)
     *
     * @return
     */
    public getNegativeSum(): number {
        return this.mNegativeSum;
    }
    private calcPosNegSum(): void {
        if (this.mYVals == null) {
            this.mNegativeSum = 0;
            this.mPositiveSum = 0;
            return;
        }
        let sumNeg: number = 0;
        let sumPos: number = 0;
        for (let f of this.mYVals) {
            if (f <= 0)
                sumNeg += Math.abs(f);
            else
                sumPos += f;
        }
        this.mNegativeSum = sumNeg;
        this.mPositiveSum = sumPos;
    }
    /**
     * Calculates the sum across all values of the given stack.
     *
     * @param vals
     * @return
     */
    public static calcSum(vals: number[]): number {
        if (vals == null)
            return 0;
        let sum: number = 0;
        for (let f of vals)
            sum += f;
        return sum;
    }
    protected calcRanges(): void {
        let values: number[] | null = this.getYVals();
        if (values == null || values.length == 0)
            return;
        this.mRanges = new Array(values.length);
        let negRemain: number = -this.getNegativeSum();
        let posRemain: number = 0;
        for (let i = 0; i < this.mRanges.length; i++) {
            let value: number = values[i];
            if (value < 0) {
                this.mRanges[i] = new Range(negRemain, negRemain - value);
                negRemain -= value;
            }
            else {
                this.mRanges[i] = new Range(posRemain, posRemain + value);
                posRemain += value;
            }
        }
    }
}
