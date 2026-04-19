import type ChartPixelMap from './ChartPixelMap';
export default abstract class BaseEntry {
    /** the y value */
    private y: number = 0;
    /** optional spot for additional data this Entry represents */
    private mData: Object | null = null;
    /** optional icon image */
    private mIcon: ChartPixelMap | null = null;
    constructor(y?: number, icon?: ChartPixelMap, data?: Object) {
        if (y) {
            this.y = y;
        }
        if (icon) {
            this.mIcon = icon;
        }
        if (data) {
            this.mData = data;
        }
    }
    /**
     * Returns the y value of this Entry.
     *
     * @return
     */
    public getY(): number {
        return this.y;
    }
    /**
     * Sets the icon drawable
     *
     * @param icon
     */
    public setIcon(icon: ChartPixelMap): void {
        this.mIcon = icon;
    }
    /**
     * Returns the icon of this Entry.
     *
     * @return
     */
    public getIcon(): ChartPixelMap | null {
        return this.mIcon;
    }
    /**
     * Sets the y-value for the Entry.
     *
     * @param y
     */
    public setY(y: number): void {
        this.y = y;
    }
    /**
     * Returns the data, additional information that this Entry represents, or
     * null, if no data has been specified.
     *
     * @return
     */
    public getData(): Object | null {
        return this.mData;
    }
    /**
     * Sets additional data this Entry should represent.
     *
     * @param data
     */
    public setData(data: Object): void {
        this.mData = data;
    }
}
