import { AxisDependency } from "@package:pkg_modules/.ohpm/@ohos+mpchart@3.0.27/pkg_modules/@ohos/mpchart/src/main/ets/components/components/YAxis";
import type Highlight from '../highlight/Highlight';
import type IBarLineScatterCandleBubbleDataSet from '../interfaces/datasets/IBarLineScatterCandleBubbleDataSet';
import type IDataSet from '../interfaces/datasets/IDataSet';
import { JArrayList } from "@package:pkg_modules/.ohpm/@ohos+mpchart@3.0.27/pkg_modules/@ohos/mpchart/src/main/ets/components/utils/JArrayList";
import type BarData from './BarData';
import BarLineScatterCandleBubbleData from "@package:pkg_modules/.ohpm/@ohos+mpchart@3.0.27/pkg_modules/@ohos/mpchart/src/main/ets/components/data/BarLineScatterCandleBubbleData";
import type BubbleData from './BubbleData';
import type CandleData from './CandleData';
import type ChartData from './ChartData';
import type EntryOhos from './EntryOhos';
import type LineData from './LineData';
import type { ScatterData } from './ScatterData';
import type WaterfallData from './WaterfallData';
export default class CombinedData extends BarLineScatterCandleBubbleData<IBarLineScatterCandleBubbleDataSet<EntryOhos>> {
    private mWaterfallData: WaterfallData | null = null;
    private mLineData: LineData | null = null;
    private mBarData: BarData | null = null;
    private mScatterData: ScatterData | null = null;
    private mCandleData: CandleData | null = null;
    private mBubbleData: BubbleData | null = null;
    constructor() {
        super();
    }
    public setLineData(data: LineData) {
        this.mLineData = data;
        this.notifyDataChanged();
    }
    public setBarData(data: BarData) {
        this.mBarData = data;
        this.notifyDataChanged();
    }
    public setCandleData(data: CandleData) {
        this.mCandleData = data;
        this.notifyDataChanged();
    }
    public setBubbleData(data: BubbleData) {
        this.mBubbleData = data;
        this.notifyDataChanged();
    }
    public setScatterData(data: ScatterData) {
        this.mScatterData = data;
        this.notifyDataChanged();
    }
    public setWaterfallData(data: WaterfallData) {
        this.mWaterfallData = data;
        this.notifyDataChanged();
    }
    //@Override
    public calcMinMax() {
        if (this.mDataSets == null) {
            this.mDataSets = new JArrayList();
        }
        this.mDataSets.clear();
        this.mYMax = -Number.MAX_VALUE;
        this.mYMin = Number.MAX_VALUE;
        this.mXMax = -Number.MAX_VALUE;
        this.mXMin = Number.MAX_VALUE;
        this.mLeftAxisMax = -Number.MAX_VALUE;
        this.mLeftAxisMin = Number.MAX_VALUE;
        this.mRightAxisMax = -Number.MAX_VALUE;
        this.mRightAxisMin = Number.MAX_VALUE;
        let allData: JArrayList<BarLineScatterCandleBubbleData<IBarLineScatterCandleBubbleDataSet<EntryOhos>>> = this.getAllData();
        for (let i = 0; i < allData.size(); i++) {
            let data = allData.get(i);
            data.calcMinMax();
            let sets: JArrayList<IBarLineScatterCandleBubbleDataSet<EntryOhos>> = data.getDataSets();
            this.mDataSets.addAll(sets);
            if (data.getYMax() > this.mYMax)
                this.mYMax = data.getYMax();
            if (data.getYMin() < this.mYMin)
                this.mYMin = data.getYMin();
            if (data.getXMax() > this.mXMax)
                this.mXMax = data.getXMax();
            if (data.getXMin() < this.mXMin)
                this.mXMin = data.getXMin();
            for (let i = 0; i < sets.size(); i++) {
                let dataset = sets.get(i);
                if (dataset.getAxisDependency() == AxisDependency.LEFT) {
                    if (dataset.getYMax() > this.mLeftAxisMax) {
                        this.mLeftAxisMax = dataset.getYMax();
                    }
                    if (dataset.getYMin() < this.mLeftAxisMin) {
                        this.mLeftAxisMin = dataset.getYMin();
                    }
                }
                else {
                    if (dataset.getYMax() > this.mRightAxisMax) {
                        this.mRightAxisMax = dataset.getYMax();
                    }
                    if (dataset.getYMin() < this.mRightAxisMin) {
                        this.mRightAxisMin = dataset.getYMin();
                    }
                }
            }
        }
    }
    public getBubbleData(): BubbleData | null {
        return this.mBubbleData;
    }
    public getLineData(): LineData | null {
        return this.mLineData;
    }
    public getBarData(): BarData | null {
        return this.mBarData;
    }
    public getScatterData(): ScatterData | null {
        return this.mScatterData;
    }
    public getCandleData(): CandleData | null {
        return this.mCandleData;
    }
    public getWaterfallData(): WaterfallData | null {
        return this.mWaterfallData;
    }
    public getAllData(): JArrayList<BarLineScatterCandleBubbleData<IBarLineScatterCandleBubbleDataSet<EntryOhos>>> {
        let data: JArrayList<BarLineScatterCandleBubbleData<IBarLineScatterCandleBubbleDataSet<EntryOhos>>> = new JArrayList<BarLineScatterCandleBubbleData<IBarLineScatterCandleBubbleDataSet<EntryOhos>>>();
        if (this.mWaterfallData != null)
            data.add(this.mWaterfallData);
        if (this.mLineData != null)
            data.add(this.mLineData);
        if (this.mBarData != null)
            data.add(this.mBarData);
        if (this.mScatterData != null)
            data.add(this.mScatterData);
        if (this.mCandleData != null)
            data.add(this.mCandleData);
        if (this.mBubbleData != null)
            data.add(this.mBubbleData);
        return data;
    }
    public getDataByIndex(index: number): BarLineScatterCandleBubbleData<IBarLineScatterCandleBubbleDataSet<EntryOhos>> {
        return this.getAllData().get(index);
    }
    public notifyDataChanged(): void {
        if (this.mWaterfallData != null)
            this.mWaterfallData.notifyDataChanged();
        if (this.mLineData != null)
            this.mLineData.notifyDataChanged();
        if (this.mBarData != null)
            this.mBarData.notifyDataChanged();
        if (this.mCandleData != null)
            this.mCandleData.notifyDataChanged();
        if (this.mScatterData != null)
            this.mScatterData.notifyDataChanged();
        if (this.mBubbleData != null)
            this.mBubbleData.notifyDataChanged();
        this.calcMinMax(); // recalculate everything
    }
    /**
     * Get the Entry for a corresponding highlight object
     *
     * @param highlight
     * @return the entry that is highlighted
     */
    public getEntryForHighlight(highlight: Highlight): EntryOhos | null {
        if (highlight.getDataIndex() >= this.getAllData().size())
            return null;
        let data: ChartData<IDataSet<EntryOhos>> = this.getDataByIndex(highlight.getDataIndex());
        if (!data || highlight.getDataSetIndex() >= data.getDataSetCount()) {
            return null;
        }
        // The value of the highlighted entry could be NaN -
        //   if we are not interested in highlighting a specific value.
        let dataSet = data.getDataSetByIndex(highlight.getDataSetIndex());
        if (!dataSet) {
            return null;
        }
        let entries: JArrayList<EntryOhos> | null = dataSet.getEntriesForXValue(highlight.getX());
        if (!entries) {
            return null;
        }
        for (let i = 0; i < entries.size(); i++) {
            let entry = entries.get(i);
            if (entry.getY() == highlight.getY() ||
                Number.isNaN(highlight.getY()))
                return entry;
        }
        return null;
    }
    /**
     * Get dataset for highlight
     *
     * @param highlight current highlight
     * @return dataset related to highlight
     */
    public getDataSetByHighlight(highlight: Highlight): IBarLineScatterCandleBubbleDataSet<EntryOhos> | null {
        if (highlight.getDataIndex() >= this.getAllData().size())
            return null;
        let data: BarLineScatterCandleBubbleData<IBarLineScatterCandleBubbleDataSet<EntryOhos>> = this.getDataByIndex(highlight.getDataIndex());
        if (!data || highlight.getDataSetIndex() >= data.getDataSetCount())
            return null;
        return data.getDataSets().get(highlight.getDataSetIndex()) as IBarLineScatterCandleBubbleDataSet<EntryOhos>;
    }
    public getDataIndex(data: BarLineScatterCandleBubbleData<IBarLineScatterCandleBubbleDataSet<EntryOhos>>): number {
        return this.getAllData().indexOf(data);
    }
    public removeDataSet(d: IBarLineScatterCandleBubbleDataSet<EntryOhos>): boolean {
        let allData: JArrayList<BarLineScatterCandleBubbleData<IBarLineScatterCandleBubbleDataSet<EntryOhos>>> = this.getAllData();
        let success: boolean = false;
        for (let i = 0; i < allData.size(); i++) {
            let data = allData.get(i);
            success = data.removeDataSet(d);
            if (success) {
                break;
            }
        }
        return success;
    }
}
