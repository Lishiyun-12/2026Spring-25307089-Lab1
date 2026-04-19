import type BarEntry from '../data/BarEntry';
import type IBarDataSet from '../interfaces/datasets/IBarDataSet';
import BarBuffer from "@package:pkg_modules/.ohpm/@ohos+mpchart@3.0.27/pkg_modules/@ohos/mpchart/src/main/ets/components/buffer/BarBuffer";
export default class HorizontalBarBuffer extends BarBuffer {
    constructor(size: number, dataSetCount: number, containsStacks: boolean) {
        super(size, dataSetCount, containsStacks);
    }
    feed(data: IBarDataSet) {
        let size: number = data.getEntryCount() * this.phaseX;
        let barWidthHalf = this.mBarWidth / 2;
        for (let i = 0; i < size; i++) {
            let e: BarEntry = data.getEntryForIndex(i);
            if (e == null)
                continue;
            let x: number = e.getX();
            let y: number = e.getY();
            let vals = e.getYVals();
            if (!this.mContainsStacks || vals == null) {
                let bottom = x - barWidthHalf;
                let top = x + barWidthHalf;
                let left: number = 0, right: number = 0;
                if (this.mInverted) {
                    left = y >= 0 ? y : 0;
                    right = y <= 0 ? y : 0;
                }
                else {
                    right = y >= 0 ? y : 0;
                    left = y <= 0 ? y : 0;
                }
                // multiply the height of the rect with the phase
                if (right > 0)
                    right *= this.phaseY;
                else
                    left *= this.phaseY;
                this.addBar(left, top, right, bottom);
            }
            else {
                let posY = 0;
                let negY = -e.getNegativeSum();
                let yStart = 0;
                //fill the stack
                for (let k = 0; k < vals.length; k++) {
                    let value = vals[k];
                    if (value >= 0) {
                        y = posY;
                        yStart = posY + value;
                        posY = yStart;
                    }
                    else {
                        y = negY;
                        yStart = negY + Math.abs(value);
                        negY += Math.abs(value);
                    }
                    let bottom = x - barWidthHalf;
                    let top = x + barWidthHalf;
                    let left: number = 0, right: number = 0;
                    if (this.mInverted) {
                        left = y >= yStart ? y : yStart;
                        right = y <= yStart ? y : yStart;
                    }
                    else {
                        right = y >= yStart ? y : yStart;
                        left = y <= yStart ? y : yStart;
                    }
                    // multiply the height of the rect with the phase
                    right *= this.phaseY;
                    left *= this.phaseY;
                    this.addBar(left, top, right, bottom);
                }
            }
        }
        this.reset();
    }
}
