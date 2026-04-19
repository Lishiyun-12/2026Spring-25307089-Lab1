import type Transformer from '../utils/Transformer';
import type ViewPortHandler from '../utils/ViewPortHandler';
import type Chart from '../charts/ChartModel';
import type IDataSet from '../interfaces/datasets/IDataSet';
import type EntryOhos from '../data/EntryOhos';
import type ChartData from '../data/ChartData';
import { Poolable } from "@package:pkg_modules/.ohpm/@ohos+mpchart@3.0.27/pkg_modules/@ohos/mpchart/src/main/ets/components/utils/Poolable";
/**
 * Runnable that is used for viewport modifications since they cannot be
 * executed at any time. This can be used to delay the execution of viewport
 * modifications until the onSizeChanged(...) method of the chart-view is called.
 * This is especially important if viewport modifying methods are called on the chart
 * directly after initialization.
 *
 *
 */
export default abstract class ViewPortJob extends Poolable {
    protected pts: number[] = new Array<number>(2);
    protected mViewPortHandler: ViewPortHandler | null = null;
    protected xValue: number = 0;
    protected yValue: number = 0;
    protected mTrans: Transformer | null = null;
    protected view: Chart<ChartData<IDataSet<EntryOhos>>> | null = null;
    constructor(viewPortHandler: ViewPortHandler | null, xValue: number, yValue: number, trans: Transformer | null, v: Chart<ChartData<IDataSet<EntryOhos>>> | null) {
        super();
        this.mViewPortHandler = viewPortHandler;
        this.xValue = xValue;
        this.yValue = yValue;
        this.mTrans = trans;
        this.view = v;
    }
    public getXValue(): number {
        return this.xValue;
    }
    public getYValue(): number {
        return this.yValue;
    }
}
