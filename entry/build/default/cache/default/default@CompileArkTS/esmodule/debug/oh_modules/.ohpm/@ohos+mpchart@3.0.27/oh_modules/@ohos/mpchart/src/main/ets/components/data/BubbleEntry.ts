import type ChartPixelMap from './ChartPixelMap';
import EntryOhos from "@package:pkg_modules/.ohpm/@ohos+mpchart@3.0.27/pkg_modules/@ohos/mpchart/src/main/ets/components/data/EntryOhos";
export default class BubbleEntry extends EntryOhos {
    private mSize: number = 0.0;
    constructor(x: number, y?: number, size?: number, icon?: ChartPixelMap, data?: Object) {
        super(x, y, icon, data);
        this.mSize = size ? size : 0;
    }
    public copy(): BubbleEntry {
        let data: Object | null = this.getData();
        if (!data) {
            return new BubbleEntry(this.getX(), this.getY(), this.mSize);
        }
        else {
            return new BubbleEntry(this.getX(), this.getY(), this.mSize, undefined, data);
        }
    }
    public getSize(): number {
        return this.mSize;
    }
    public setSize(size: number): void {
        this.mSize = size;
    }
}
;
