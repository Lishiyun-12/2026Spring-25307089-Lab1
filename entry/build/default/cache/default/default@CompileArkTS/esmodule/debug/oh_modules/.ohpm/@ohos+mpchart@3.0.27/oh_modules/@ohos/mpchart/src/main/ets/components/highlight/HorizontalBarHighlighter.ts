import type { EntryOhos, IDataSet, Rounding } from '../../../../..';
import type BarData from '../data/BarData';
import type BarDataProvider from '../interfaces/dataprovider/BarDataProvider';
import type IBarDataSet from '../interfaces/datasets/IBarDataSet';
import { JArrayList } from "@package:pkg_modules/.ohpm/@ohos+mpchart@3.0.27/pkg_modules/@ohos/mpchart/src/main/ets/components/utils/JArrayList";
import MPPointD from "@package:pkg_modules/.ohpm/@ohos+mpchart@3.0.27/pkg_modules/@ohos/mpchart/src/main/ets/components/utils/MPPointD";
import BarHighlighter from "@package:pkg_modules/.ohpm/@ohos+mpchart@3.0.27/pkg_modules/@ohos/mpchart/src/main/ets/components/highlight/BarHighlighter";
import Highlight from "@package:pkg_modules/.ohpm/@ohos+mpchart@3.0.27/pkg_modules/@ohos/mpchart/src/main/ets/components/highlight/Highlight";
export default class HorizontalBarHighlighter extends BarHighlighter {
    constructor(chart: BarDataProvider) {
        super(chart);
    }
    getHighlight(x: number, y: number): Highlight | null {
        let barData: BarData | null = this.mChart.getBarData();
        if (!barData) {
            return null;
        }
        let pos: MPPointD = this.getValsForTouch(y, x);
        let high: Highlight | null = this.getHighlightForX(pos.y, y, x);
        if (high == null) {
            return null;
        }
        let set: IBarDataSet | null = barData.getDataSetByIndex(high.getDataSetIndex());
        if (set && set.isStacked()) {
            return this.getStackedHighlight(high, set, pos.y, pos.x);
        }
        MPPointD.recycleInstance(pos);
        return high;
    }
    protected buildHighlights(set: IDataSet<EntryOhos>, dataSetIndex: number, xVal: number, rounding: Rounding): JArrayList<Highlight> {
        if (!this.mChart) {
            return new JArrayList();
        }
        let highlights: JArrayList<Highlight> = new JArrayList<Highlight>();
        //noinspection unchecked
        let entries: JArrayList<EntryOhos> = set.getEntriesForXValue(xVal);
        if (entries.size() == 0) {
            // Try to find closest x-value and take all entries for that x-value
            const closest: EntryOhos | null = set.getEntryForXValue(xVal, Number.NaN, rounding);
            if (closest != null) {
                //noinspection unchecked
                entries = set.getEntriesForXValue(closest.getX());
            }
        }
        if (entries.size() == 0)
            return highlights;
        for (let i = 0; i < entries.length(); i++) {
            let e = entries.get(i);
            if (!this.mChart) {
                continue;
            }
            let trans = this.mChart.getTransformer(set.getAxisDependency());
            if (!trans) {
                continue;
            }
            let pixels: MPPointD = trans.getPixelForValues(e.getY(), e.getX());
            highlights.add(new Highlight(e.getX(), e.getY(), dataSetIndex, 0, 0, pixels.x, pixels.y, set.getAxisDependency()));
            MPPointD.recycleInstance(pixels);
        }
        return highlights;
    }
    getDistance(x1: number, y1: number, x2: number, y2: number): number {
        return Math.abs(y1 - y2);
    }
}
