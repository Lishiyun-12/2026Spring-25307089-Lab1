import type IBubbleDataSet from '../interfaces/datasets/IBubbleDataSet';
import { JArrayList } from "@package:pkg_modules/.ohpm/@ohos+mpchart@3.0.27/pkg_modules/@ohos/mpchart/src/main/ets/components/utils/JArrayList";
import Utils from "@package:pkg_modules/.ohpm/@ohos+mpchart@3.0.27/pkg_modules/@ohos/mpchart/src/main/ets/components/utils/Utils";
import BarLineScatterCandleBubbleDataSet from "@package:pkg_modules/.ohpm/@ohos+mpchart@3.0.27/pkg_modules/@ohos/mpchart/src/main/ets/components/data/BarLineScatterCandleBubbleDataSet";
import type BubbleEntry from './BubbleEntry';
import type { DataSet } from './DataSet';
export default class BubbleDataSet extends BarLineScatterCandleBubbleDataSet<BubbleEntry> implements IBubbleDataSet {
    static mMaxSize: number = 0;
    protected mNormalizeSize: boolean = true;
    private mHighlightCircleWidth: number = 2.5;
    constructor(yVals: JArrayList<BubbleEntry>, label: string) {
        super(yVals, label);
    }
    // @Override
    public setHighlightCircleWidth(width: number): void {
        this.mHighlightCircleWidth = Utils.handleDataValues(width);
    }
    // @Override
    public getHighlightCircleWidth(): number {
        return this.mHighlightCircleWidth;
    }
    public myCalcMinMax(e?: BubbleEntry): void {
        super.myCalcMinMax(e);
        if (e) {
            let size: number = e.getSize();
            if (size > BubbleDataSet.mMaxSize) {
                BubbleDataSet.mMaxSize = size;
            }
        }
    }
    // @Override
    public copy(): DataSet<BubbleEntry> {
        let entries: JArrayList<BubbleEntry> = new JArrayList<BubbleEntry>();
        if (this.mEntries != null) {
            for (let i: number = 0; i < this.mEntries.size(); i++) {
                entries.add(this.mEntries.get(i).copy());
            }
        }
        let copied = new BubbleDataSet(entries, this.getLabel());
        this.copyDataSet(copied);
        return copied;
    }
    protected copyDataSet(bubbleDataSet: BubbleDataSet): void {
        bubbleDataSet.mHighlightCircleWidth = this.mHighlightCircleWidth;
        bubbleDataSet.mNormalizeSize = this.mNormalizeSize;
    }
    // @Override
    public getMaxSize(): number {
        return BubbleDataSet.mMaxSize;
    }
    // @Override
    public isNormalizeSizeEnabled(): boolean {
        return this.mNormalizeSize;
    }
    public setNormalizeSizeEnabled(normalizeSize: boolean): void {
        this.mNormalizeSize = normalizeSize;
    }
}
