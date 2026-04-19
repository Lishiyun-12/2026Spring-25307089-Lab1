import Utils from "@package:pkg_modules/.ohpm/@ohos+mpchart@3.0.27/pkg_modules/@ohos/mpchart/src/main/ets/components/utils/Utils";
import BaseEntry from "@package:pkg_modules/.ohpm/@ohos+mpchart@3.0.27/pkg_modules/@ohos/mpchart/src/main/ets/components/data/BaseEntry";
import type ChartPixelMap from './ChartPixelMap';
/**
 * Class representing one entry in the chart. Might contain multiple values.
 * Might only contain a single value depending on the used constructor.
 *
 */
export default class EntryOhos extends BaseEntry {
    private x: number = 0.0;
    constructor(x?: number, y?: number, icon?: ChartPixelMap, data?: Object) {
        super(y, icon, data);
        this.x = x ? x : 0;
    }
    /**
     * Returns the x-value of this Entry object.
     *
     * @return
     */
    public getX(): number {
        return this.x;
    }
    /**
     * Sets the x-value of this Entry object.
     *
     * @param x
     */
    public setX(x: number): void {
        this.x = x;
    }
    /**
     * returns an exact copy of the entry
     *
     * @return
     */
    public copy(): EntryOhos {
        let data: Object | null = this.getData();
        if (data === null) {
            return new EntryOhos(this.x, this.getY());
        }
        else {
            return new EntryOhos(this.x, this.getY(), undefined, data);
        }
    }
    /**
     * Compares value, xIndex and data of the entries. Returns true if entries
     * are equal in those points, false if not. Does not check by hash-code like
     * it's done by the "equals" method.
     *
     * @param e
     * @return
     */
    public equalTo(e: EntryOhos): boolean {
        if (!e)
            return false;
        if (e.getData() != this.getData())
            return false;
        if (Math.abs(e.x - this.x) > Utils.FLOAT_EPSILON)
            return false;
        if (Math.abs(e.getY() - this.getY()) > Utils.FLOAT_EPSILON)
            return false;
        return true;
    }
    /**
     * returns a string representation of the entry containing x-index and value
     */
    public toString(): String {
        return "Entry, x: " + this.x + " y: " + this.getY();
    }
    public describeContents(): number {
        return 0;
    }
}
