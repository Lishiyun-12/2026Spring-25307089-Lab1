import { Poolable } from "@package:pkg_modules/.ohpm/@ohos+mpchart@3.0.27/pkg_modules/@ohos/mpchart/src/main/ets/components/utils/Poolable";
import { ObjectPool } from "@package:pkg_modules/.ohpm/@ohos+mpchart@3.0.27/pkg_modules/@ohos/mpchart/src/main/ets/components/utils/ObjectPool";
import type { JArrayList } from './JArrayList';
/**
 * Point encapsulating two double values.
 *
 *
 */
export default class MPPointD extends Poolable {
    private static pool: ObjectPool<MPPointD> = ObjectPool.create(64, new MPPointD(0, 0))
        .setReplenishPercentage(0.5) as ObjectPool<MPPointD>;
    public static getInstance(x: number, y: number): MPPointD {
        let result: MPPointD = MPPointD.pool.get();
        result.x = x;
        result.y = y;
        return result;
    }
    public static recycleInstance(instance: MPPointD) {
        MPPointD.pool.recycle(instance);
    }
    public static recycleInstances(instances: JArrayList<MPPointD>) {
        MPPointD.pool.recycleArray(instances);
    }
    public instantiate(): Poolable {
        return new MPPointD(0, 0);
    }
    public x: number = 0;
    public y: number = 0;
    private constructor(x: number, y: number) {
        super();
        this.x = x;
        this.y = y;
    }
    /**
     * returns a string representation of the object
     */
    public toString(): string {
        return "MPPointD, x: " + this.x + ", y: " + this.y;
    }
}
