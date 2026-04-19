import BarLineScatterCandleBubbleData from "@package:pkg_modules/.ohpm/@ohos+mpchart@3.0.27/pkg_modules/@ohos/mpchart/src/main/ets/components/data/BarLineScatterCandleBubbleData";
import type ICandleDataSet from '../interfaces/datasets/ICandleDataSet';
import { JArrayList } from "@package:pkg_modules/.ohpm/@ohos+mpchart@3.0.27/pkg_modules/@ohos/mpchart/src/main/ets/components/utils/JArrayList";
export default class CandleData extends BarLineScatterCandleBubbleData<ICandleDataSet> {
    constructor();
    constructor(dataSets: JArrayList<ICandleDataSet>);
    constructor(dataSets: ICandleDataSet[]);
    constructor(dataSets?: JArrayList<ICandleDataSet> | ICandleDataSet[]) {
        if (!dataSets) {
            super();
        }
        else {
            if (dataSets instanceof JArrayList) {
                super(dataSets as JArrayList<ICandleDataSet>);
            }
            else {
                super(dataSets as ICandleDataSet[]);
            }
        }
    }
}
