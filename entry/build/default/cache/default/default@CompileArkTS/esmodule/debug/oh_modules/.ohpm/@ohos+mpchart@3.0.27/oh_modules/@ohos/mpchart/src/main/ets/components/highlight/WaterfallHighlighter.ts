import type WaterfallData from '../data/WaterfallData';
import type WaterfallDataProvider from '../interfaces/dataprovider/WaterfallDataProvider';
import MPPointD from "@package:pkg_modules/.ohpm/@ohos+mpchart@3.0.27/pkg_modules/@ohos/mpchart/src/main/ets/components/utils/MPPointD";
import ChartHighlighter from "@package:pkg_modules/.ohpm/@ohos+mpchart@3.0.27/pkg_modules/@ohos/mpchart/src/main/ets/components/highlight/ChartHighlighter";
import type Highlight from './Highlight';
export default class WaterfallHighlighter extends ChartHighlighter<WaterfallDataProvider> {
    constructor(chart: WaterfallDataProvider) {
        super(chart);
    }
    public getHighlight(x: number, y: number): Highlight | null {
        let high: Highlight | null = super.getHighlight(x, y);
        if (high == null) {
            return null;
        }
        let pos: MPPointD = super.getValsForTouch(x, y);
        let waterfallData: WaterfallData | null = this.mChart.getWaterfallData();
        if (!waterfallData) {
            return null;
        }
        MPPointD.recycleInstance(pos);
        return high;
    }
    protected getDistance(x1: number, y1: number, x2: number, y2: number): number {
        return Math.abs(x1 - x2);
    }
    protected getData(): WaterfallData | null {
        return this.mChart.getWaterfallData();
    }
}
