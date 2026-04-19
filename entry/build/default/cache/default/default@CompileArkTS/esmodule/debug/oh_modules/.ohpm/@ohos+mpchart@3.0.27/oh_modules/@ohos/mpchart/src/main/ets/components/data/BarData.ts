import type IBarDataSet from '../interfaces/datasets/IBarDataSet';
import type { JArrayList } from '../utils/JArrayList';
import type BarEntry from './BarEntry';
import BarLineScatterCandleBubbleData from "@package:pkg_modules/.ohpm/@ohos+mpchart@3.0.27/pkg_modules/@ohos/mpchart/src/main/ets/components/data/BarLineScatterCandleBubbleData";
/**
 * Data object that represents all data for the BarChart.
 *
 */
export default class BarData extends BarLineScatterCandleBubbleData<IBarDataSet> {
    /**
     * the width of the bars on the x-axis, in values (not pixels)
     */
    private mBarWidth: number = 0.85;
    /**
     * 顶部圆角半径
     */
    private topRadius: number = 0;
    constructor(dataSets?: JArrayList<IBarDataSet>) {
        super(dataSets as JArrayList<IBarDataSet>);
    }
    /**
     * Sets the width each bar should have on the x-axis (in values, not pixels).
     * Default 0.85f
     *
     * @param mBarWidth
     */
    public setBarWidth(mBarWidth: number): void {
        this.mBarWidth = mBarWidth;
    }
    public getBarWidth(): number {
        return this.mBarWidth;
    }
    /**
     * 设置顶部圆角半径
     * @param radius 顶部圆角半径
     */
    public setTopRadius(radius: number): void {
        if (radius < 0) {
            radius = 0;
        }
        this.topRadius = radius;
    }
    public getTopRadius(): number {
        return this.topRadius;
    }
    /**
     * Groups all BarDataSet objects this data object holds together by modifying the x-value of their entries.
     * Previously set x-values of entries will be overwritten. Leaves space between bars and groups as specified
     * by the parameters.
     * Do not forget to call notifyDataSetChanged() on your BarChart object after calling this method.
     *
     * @param fromX      the starting point on the x-axis where the grouping should begin
     * @param groupSpace the space between groups of bars in values (not pixels) e.g. 0.8f for bar width 1f
     * @param barSpace   the space between individual bars in values (not pixels) e.g. 0.1f for bar width 1f
     */
    public groupBars(fromX: number, groupSpace: number, barSpace: number): void {
        let dataSets = this.mDataSets;
        if (dataSets) {
            let setCount: number = dataSets.size();
            if (setCount <= 1) {
                throw new Error("BarData needs to hold at least 2 BarDataSets to allow grouping.");
            }
            let max: IBarDataSet | null = this.getMaxEntryCountSet();
            if (max) {
                let maxEntryCount: number = max.getEntryCount();
                let groupSpaceWidthHalf: number = groupSpace / 2;
                let barSpaceHalf: number = barSpace / 2;
                let barWidthHalf: number = this.mBarWidth / 2;
                let interval: number = this.getGroupWidth(groupSpace, barSpace);
                for (let i = 0; i < maxEntryCount; i++) {
                    let start: number = fromX;
                    fromX += groupSpaceWidthHalf;
                    //for (IBarDataSet set : mDataSets) {
                    for (let j = 0; j < dataSets.size(); j++) {
                        let dataSet: IBarDataSet = dataSets.get(j);
                        fromX += barSpaceHalf;
                        fromX += barWidthHalf;
                        if (i < dataSet.getEntryCount() && dataSet != undefined) {
                            let entry: BarEntry = dataSet.getEntryForIndex(i) as BarEntry;
                            if (entry) {
                                entry.setX(fromX);
                            }
                        }
                        fromX += barWidthHalf;
                        fromX += barSpaceHalf;
                    }
                    fromX += groupSpaceWidthHalf;
                    let end: number = fromX;
                    let innerInterval: number = end - start;
                    let diff: number = interval - innerInterval;
                    // correct rounding errors
                    if (diff > 0 || diff < 0) {
                        fromX += diff;
                    }
                }
                this.notifyDataChanged();
            }
        }
    }
    /**
     * In case of grouped bars, this method returns the space an individual group of bar needs on the x-axis.
     *
     * @param groupSpace
     * @param barSpace
     * @return
     */
    public getGroupWidth(groupSpace: number, barSpace: number): number {
        if (this.mDataSets) {
            return this.mDataSets.listSize * (this.mBarWidth + barSpace) + groupSpace;
        }
        return 0;
    }
}
