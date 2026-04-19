import type EntryOhos from './EntryOhos';
import { DataSet } from "@package:pkg_modules/.ohpm/@ohos+mpchart@3.0.27/pkg_modules/@ohos/mpchart/src/main/ets/components/data/DataSet";
import type IBarLineScatterCandleBubbleDataSet from '../interfaces/datasets/IBarLineScatterCandleBubbleDataSet';
import type { JArrayList } from '../utils/JArrayList';
/**
 * Baseclass of all DataSets for Bar-, Line-, Scatter- and CandleStickChart.
 *
 */
export default abstract class BarLineScatterCandleBubbleDataSet<T extends EntryOhos> extends DataSet<T> implements IBarLineScatterCandleBubbleDataSet<T> {
    /**
     * default highlight color
     */
    protected mHighLightColor: number = 0xffbb73;
    constructor(yVals: JArrayList<T> | null, label: string) {
        super(yVals, label);
    }
    /**
     * Sets the color that is used for drawing the highlight indicators. Dont
     * forget to resolve the color using ColorTemplate.colorRgb(...) or Color.Xxx or
     * ChartColor.rgb(...).
     *
     * @param color
     */
    public setHighLightColor(color: number): void {
        this.mHighLightColor = color;
    }
    public getHighLightColor(): number {
        return this.mHighLightColor;
    }
    protected copyTo(barLineScatterCandleBubbleDataSet: BarLineScatterCandleBubbleDataSet<T>): void {
        super.copyTo(barLineScatterCandleBubbleDataSet);
        barLineScatterCandleBubbleDataSet.mHighLightColor = this.mHighLightColor;
    }
}
