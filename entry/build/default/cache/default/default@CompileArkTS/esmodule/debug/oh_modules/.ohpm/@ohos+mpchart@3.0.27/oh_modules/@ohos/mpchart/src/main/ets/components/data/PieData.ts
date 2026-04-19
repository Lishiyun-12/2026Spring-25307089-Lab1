import type Highlight from '../highlight/Highlight';
import type IPieDataSet from '../interfaces/datasets/IPieDataSet';
import type { JArrayList } from '../utils/JArrayList';
import ChartData from "@package:pkg_modules/.ohpm/@ohos+mpchart@3.0.27/pkg_modules/@ohos/mpchart/src/main/ets/components/data/ChartData";
import type EntryOhos from './EntryOhos';
import Utils from "@package:pkg_modules/.ohpm/@ohos+mpchart@3.0.27/pkg_modules/@ohos/mpchart/src/main/ets/components/utils/Utils";
import { LogUtil } from "@package:pkg_modules/.ohpm/@ohos+mpchart@3.0.27/pkg_modules/@ohos/mpchart/src/main/ets/components/utils/LogUtil";
/**
 * A PieData object can only represent one DataSet. Unlike all other charts, the
 * legend labels of the PieChart are created from the x-values array, and not
 * from the DataSet labels. Each PieData object can only represent one
 * PieDataSet (multiple PieDataSets inside a single PieChart are not possible).
 *
 */
export default class PieData extends ChartData<IPieDataSet> {
    constructor(dataSet?: IPieDataSet) {
        if (dataSet) {
            super([dataSet]);
        }
        else {
            super();
        }
    }
    // public PieData(IPieDataSet dataSet) {
    //     super(dataSet);
    // }
    /**
     * Sets the PieDataSet this data object should represent.
     *
     * @param dataSet
     */
    public setDataSet(dataSet: IPieDataSet): void {
        if (this.mDataSets) {
            this.mDataSets.clear();
            this.mDataSets.add(dataSet);
            this.notifyDataChanged();
        }
    }
    /**
     * Returns the DataSet this PieData object represents. A PieData object can
     * only contain one DataSet.
     *
     * @return
     */
    public getDataSet(): IPieDataSet {
        return this.mDataSets.get(0);
    }
    // @Override
    public getDataSets(): JArrayList<IPieDataSet> {
        let dataSets: JArrayList<IPieDataSet> = super.getDataSets();
        if (dataSets.size() < 1) {
            LogUtil.log("mpchart", "Found multiple data sets while pie chart only allows one");
        }
        return dataSets;
    }
    /**
     * The PieData object can only have one DataSet. Use getDataSet() method instead.
     *
     * @param index
     * @return
     */
    // @Override
    public getDataSetByIndex(index: number): IPieDataSet | null {
        return index == 0 ? this.getDataSet() : null;
    }
    // @Override
    public getDataSetByLabel(label: string, ignorecase: boolean): IPieDataSet | null {
        return ignorecase ? Utils.equalsIgnoreCase(label, this.mDataSets.get(0).getLabel()) ? this.mDataSets.get(0)
            : null : label == this.mDataSets.get(0)
            .getLabel() ? this.mDataSets.get(0) : null;
    }
    // @Override
    public getEntryForHighlight(highlight: Highlight): EntryOhos {
        return this.getDataSet().getEntryForIndex(/*(int) */ highlight.getX());
    }
    /**
     * Returns the sum of all values in this PieData object.
     *
     * @return
     */
    public getYValueSum(): number {
        let sum: number = 0;
        for (let i: number = 0; i < this.getDataSet().getEntryCount(); i++)
            sum += this.getDataSet().getEntryForIndex(i).getY();
        return sum;
    }
}
