import type ChartPixelMap from './ChartPixelMap';
import EntryOhos from "@package:pkg_modules/.ohpm/@ohos+mpchart@3.0.27/pkg_modules/@ohos/mpchart/src/main/ets/components/data/EntryOhos";
export default class CandleEntry extends EntryOhos {
    private mShadowHigh: number = 0.0;
    private mShadowLow: number = 0.0;
    private mClose: number = 0.0;
    private mOpen: number = 0.0;
    constructor(x: number, shadowH: number, shadowL: number, open: number, close: number, icon?: ChartPixelMap, data?: object) {
        super(x, (shadowH + shadowL) / 2.0, icon, data);
        this.mShadowHigh = shadowH ? shadowH : 0;
        this.mShadowLow = shadowL ? shadowL : 0;
        this.mOpen = open ? open : 0;
        this.mClose = close ? close : 0;
    }
    public getShadowRange(): number {
        return Math.abs(this.mShadowHigh - this.mShadowLow);
    }
    public getBodyRange(): number {
        return Math.abs(this.mOpen - this.mClose);
    }
    public getY(): number {
        return super.getY();
    }
    public copy(): CandleEntry {
        let data: object | null = this.getData();
        if (!data) {
            return new CandleEntry(this.getX(), this.mShadowHigh, this.mShadowLow, this.mOpen, this.mClose);
        }
        else {
            return new CandleEntry(this.getX(), this.mShadowHigh, this.mShadowLow, this.mOpen, this.mClose, undefined, data);
        }
    }
    public getHigh(): number {
        return this.mShadowHigh;
    }
    public setHigh(shadowH: number): void {
        this.mShadowHigh = shadowH;
    }
    public getLow(): number {
        return this.mShadowLow;
    }
    public setLow(shadowL: number): void {
        this.mShadowLow = shadowL;
    }
    public getClose(): number {
        return this.mClose;
    }
    public setClose(close: number): void {
        this.mClose = close;
    }
    public getOpen(): number {
        return this.mOpen;
    }
    public setOpen(open: number): void {
        this.mOpen = open;
    }
}
;
