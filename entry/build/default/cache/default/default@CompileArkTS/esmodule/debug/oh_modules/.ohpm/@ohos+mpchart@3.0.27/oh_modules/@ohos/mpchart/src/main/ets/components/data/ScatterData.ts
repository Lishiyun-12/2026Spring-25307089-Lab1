import type IScatterDataSet from '../interfaces/datasets/IScatterDataSet';
import type { JArrayList } from '../utils/JArrayList';
import BarLineScatterCandleBubbleData from "@package:pkg_modules/.ohpm/@ohos+mpchart@3.0.27/pkg_modules/@ohos/mpchart/src/main/ets/components/data/BarLineScatterCandleBubbleData";
export class ScatterData extends BarLineScatterCandleBubbleData<IScatterDataSet> {
    constructor(dataSets?: JArrayList<IScatterDataSet>) {
        super(dataSets as JArrayList<IScatterDataSet>);
    }
    /**
     * Returns the maximum shape-size across all DataSets.
     *
     * @return
     */
    public getGreatestShapeSize() {
        let max = 0;
        for (let i = 0; i < this.mDataSets.size(); i++) {
            const set = this.mDataSets.get(i);
            const size = set.getScatterShapeSize();
            if (size > max)
                max = size;
        }
        return max;
    }
}
