import BarBuffer from "@package:pkg_modules/.ohpm/@ohos+mpchart@3.0.27/pkg_modules/@ohos/mpchart/src/main/ets/components/buffer/BarBuffer";
import type IBarDataSet from '../interfaces/datasets/IBarDataSet';
import type WaterfallEntry from '../data/WaterfallEntry';
export default class WaterfallBuffer extends BarBuffer {
    private arrayTop: Array<number> = [];
    private arrayBottom: Array<number> = [];
    public getArrayTop(): Array<number> {
        return this.arrayTop;
    }
    public getArrayBottom(): Array<number> {
        return this.arrayBottom;
    }
    public feed(data: IBarDataSet): void {
        let size: number = data.getEntryCount() * this.phaseX;
        let barWidthHalf: number = this.mBarWidth / 2;
        this.arrayTop = [];
        this.arrayBottom = [];
        for (let i = 0; i < size; i++) {
            let e: WaterfallEntry | null = data.getEntryForIndex(i) as WaterfallEntry;
            if (e == null)
                continue;
            let x: number = e.getX();
            let y1: number = e.getMinY();
            let y2: number = e.getMaxY();
            let minY = Math.max(y1, y2);
            let maxY = Math.min(y1, y2);
            let bottom = this.mInverted ? maxY : minY;
            let top = this.mInverted ? minY : maxY;
            this.arrayTop.push(e.getMaxY());
            this.arrayBottom.push(e.getMinY());
            this.addWaterfall(x - barWidthHalf, top * this.phaseY, x + barWidthHalf, bottom * this.phaseY);
        }
        this.reset();
    }
    protected addWaterfall(left: number, top: number, right: number, bottom: number): void {
        this.buffer[this.index++] = left;
        this.buffer[this.index++] = top;
        this.buffer[this.index++] = right;
        this.buffer[this.index++] = bottom;
    }
}
