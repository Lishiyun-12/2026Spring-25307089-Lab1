import type { Poolable } from '../utils/Poolable';
import { ObjectPool } from "@package:pkg_modules/.ohpm/@ohos+mpchart@3.0.27/pkg_modules/@ohos/mpchart/src/main/ets/components/utils/ObjectPool";
import type Transformer from '../utils/Transformer';
import type ViewPortHandler from '../utils/ViewPortHandler';
import type Chart from '../charts/ChartModel';
import ViewPortJob from "@package:pkg_modules/.ohpm/@ohos+mpchart@3.0.27/pkg_modules/@ohos/mpchart/src/main/ets/components/jobs/ViewPortJob";
import type ChartData from '../data/ChartData';
import type IDataSet from '../interfaces/datasets/IDataSet';
import type EntryOhos from '../data/EntryOhos';
export default class MoveViewJob extends ViewPortJob {
    private static pool: ObjectPool<MoveViewJob> = ObjectPool.create(2, new MoveViewJob(null, 0, 0, null, null))
        .setReplenishPercentage(0.5) as ObjectPool<MoveViewJob>;
    public static getInstance(viewPortHandler: ViewPortHandler, xValue: number, yValue: number, trans: Transformer, v: Chart<ChartData<IDataSet<EntryOhos>>>): MoveViewJob {
        let result: MoveViewJob = MoveViewJob.pool.get();
        result.mViewPortHandler = viewPortHandler;
        result.xValue = xValue;
        result.yValue = yValue;
        result.mTrans = trans;
        result.view = v;
        return result;
    }
    /**
     * 清理对象池和释放资源
     * 在不再需要 MoveViewJob 时调用此方法
     */
    public static cleanup(): void {
        // 重置对象池为初始状态
        MoveViewJob.pool = ObjectPool.create(2, new MoveViewJob(null, 0, 0, null, null))
            .setReplenishPercentage(0.5) as ObjectPool<MoveViewJob>;
    }
    public static recycleInstance(instance: MoveViewJob): void {
        instance.mViewPortHandler = null;
        instance.view = null;
        instance.mTrans = null;
        MoveViewJob.pool.recycle(instance);
    }
    constructor(viewPortHandler: ViewPortHandler | null, xValue: number, yValue: number, trans: Transformer | null, v: Chart<ChartData<IDataSet<EntryOhos>>> | null) {
        super(viewPortHandler, xValue, yValue, trans, v);
    }
    public run(): void {
        this.pts[0] = this.xValue;
        this.pts[1] = this.yValue;
        if (this.mTrans) {
            this.mTrans.pointValuesToPixel(this.pts);
        }
        if (this.mViewPortHandler && this.view) {
            this.mViewPortHandler.centerViewPort(this.pts, this.view);
        }
        MoveViewJob.recycleInstance(this);
    }
    public instantiate(): Poolable {
        return new MoveViewJob(this.mViewPortHandler, this.xValue, this.yValue, this.mTrans, this.view);
    }
}
