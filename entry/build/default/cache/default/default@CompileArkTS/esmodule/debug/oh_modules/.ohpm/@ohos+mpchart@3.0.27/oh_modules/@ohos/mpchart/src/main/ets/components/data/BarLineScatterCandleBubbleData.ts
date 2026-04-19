import type IBarLineScatterCandleBubbleDataSet from '../interfaces/datasets/IBarLineScatterCandleBubbleDataSet';
import { JArrayList } from "@package:pkg_modules/.ohpm/@ohos+mpchart@3.0.27/pkg_modules/@ohos/mpchart/src/main/ets/components/utils/JArrayList";
import ChartData from "@package:pkg_modules/.ohpm/@ohos+mpchart@3.0.27/pkg_modules/@ohos/mpchart/src/main/ets/components/data/ChartData";
import type EntryOhos from './EntryOhos';
/**
 * Baseclass for all Line, Bar, Scatter, Candle and Bubble data.
 *
 */
export default abstract class BarLineScatterCandleBubbleData<T extends IBarLineScatterCandleBubbleDataSet</*T extends */ EntryOhos>> extends ChartData<T> {
    constructor();
    constructor(sets: T[]);
    constructor(sets: JArrayList<T>);
    constructor(sets?: JArrayList<T> | T[]) {
        if (sets) {
            if (sets instanceof JArrayList) {
                super(sets as JArrayList<T>);
            }
            else {
                super(sets as T[]);
            }
        }
        else {
            super();
        }
    }
}
