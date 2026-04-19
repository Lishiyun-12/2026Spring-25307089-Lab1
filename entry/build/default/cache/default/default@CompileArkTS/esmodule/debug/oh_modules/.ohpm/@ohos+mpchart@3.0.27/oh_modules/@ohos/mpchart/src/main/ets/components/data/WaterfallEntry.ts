import BarEntry from "@package:pkg_modules/.ohpm/@ohos+mpchart@3.0.27/pkg_modules/@ohos/mpchart/src/main/ets/components/data/BarEntry";
import type ChartPixelMap from './ChartPixelMap';
export class WaterfallHighlight {
    private minY: number = 0;
    private maxY: number = 0;
    private color: string | number = "#ff0000";
    constructor(minY: number, maxY: number, color?: string | number) {
        this.minY = minY;
        this.maxY = maxY;
        if (color != undefined) {
            this.color = color;
        }
    }
    getMinY() {
        return this.minY;
    }
    getMaxY() {
        return this.maxY;
    }
    getColor() {
        return this.color;
    }
    setColor(color: string | number) {
        this.color = color;
    }
}
export default class WaterfallEntry extends BarEntry {
    private mMinY: number = 0;
    private mMaxY: number = 0;
    private mHighlights: WaterfallHighlight[] = [];
    constructor(x?: number, minY?: number, maxY?: number, icon?: ChartPixelMap, data?: Object, ...highlights: WaterfallHighlight[]) {
        super(x, maxY, icon, data);
        this.mMinY = minY ? minY : 0;
        this.mMaxY = maxY ? maxY : 0;
        this.mHighlights = highlights;
    }
    public getMinY(): number {
        return this.mMinY;
    }
    public getMaxY(): number {
        return super.getY();
    }
    public getHighlights(): WaterfallHighlight[] {
        return this.mHighlights;
    }
    public setHighlights(...highlights: WaterfallHighlight[]): void {
        for (const highlight of highlights) {
            let exists = false;
            for (const existingHighlight of this.mHighlights) {
                if (existingHighlight.getMinY() === highlight.getMinY() &&
                    existingHighlight.getMaxY() === highlight.getMaxY() &&
                    existingHighlight.getColor() === highlight.getColor()) {
                    exists = true;
                    break;
                }
            }
            if (!exists) {
                this.mHighlights.push(highlight);
            }
        }
    }
}
