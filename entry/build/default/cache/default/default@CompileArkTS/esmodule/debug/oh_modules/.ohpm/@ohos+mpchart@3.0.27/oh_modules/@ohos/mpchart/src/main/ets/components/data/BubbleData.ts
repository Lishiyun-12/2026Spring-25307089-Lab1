import type IBubbleDataSet from '../interfaces/datasets/IBubbleDataSet';
import type { JArrayList } from '../utils/JArrayList';
import BarLineScatterCandleBubbleData from "@package:pkg_modules/.ohpm/@ohos+mpchart@3.0.27/pkg_modules/@ohos/mpchart/src/main/ets/components/data/BarLineScatterCandleBubbleData";
export default class BubbleData extends BarLineScatterCandleBubbleData<IBubbleDataSet> {
    constructor(sets?: JArrayList<IBubbleDataSet>) {
        super(sets as JArrayList<IBubbleDataSet>);
    }
    /**
     * Sets the width of the circle that surrounds the bubble when highlighted
     * for all DataSet objects this data object contains, in vp.
     *
     * @param width
     */
    public setHighlightCircleWidth(width: number): void {
        if (this.mDataSets) {
            let dataSource = this.mDataSets.dataSource;
            for (let sets of dataSource) {
                sets.setHighlightCircleWidth(width);
            }
        }
    }
}
