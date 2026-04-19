import type ILineDataSet from '../interfaces/datasets/ILineDataSet';
import { JArrayList } from "@package:pkg_modules/.ohpm/@ohos+mpchart@3.0.27/pkg_modules/@ohos/mpchart/src/main/ets/components/utils/JArrayList";
import BarLineScatterCandleBubbleData from "@package:pkg_modules/.ohpm/@ohos+mpchart@3.0.27/pkg_modules/@ohos/mpchart/src/main/ets/components/data/BarLineScatterCandleBubbleData";
/**
 * Data object that encapsulates all data associated with a LineChart.
 *
 */
export default class LineData extends BarLineScatterCandleBubbleData<ILineDataSet> {
    public constructor();
    public constructor(dataSets: ILineDataSet[]);
    public constructor(dataSets: JArrayList<ILineDataSet>);
    public constructor(dataSets?: JArrayList<ILineDataSet> | ILineDataSet[]) {
        if (dataSets) {
            if (dataSets instanceof JArrayList) {
                super(dataSets as JArrayList<ILineDataSet>);
            }
            else {
                super(dataSets as ILineDataSet[]);
            }
        }
        else {
            super();
        }
    }
}
