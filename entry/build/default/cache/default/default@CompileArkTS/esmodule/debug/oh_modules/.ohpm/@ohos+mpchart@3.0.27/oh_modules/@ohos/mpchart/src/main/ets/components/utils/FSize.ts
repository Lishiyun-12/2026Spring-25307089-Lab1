import type { JArrayList } from './JArrayList';
import { ObjectPool } from "@package:pkg_modules/.ohpm/@ohos+mpchart@3.0.27/pkg_modules/@ohos/mpchart/src/main/ets/components/utils/ObjectPool";
import { Poolable } from "@package:pkg_modules/.ohpm/@ohos+mpchart@3.0.27/pkg_modules/@ohos/mpchart/src/main/ets/components/utils/Poolable";
/**
 * Class for describing width and height dimensions in some arbitrary
 */
export default class FSize extends Poolable {
    public width: number = 0;
    public height: number = 0;
    public static pool: ObjectPool<FSize> = ObjectPool.create(256, new FSize(0, 0))
        .setReplenishPercentage(0.5) as ObjectPool<FSize>;
    instantiate(): Poolable {
        return new FSize(0, 0);
    }
    public static getInstance(width: number, height: number): FSize {
        let result: FSize = FSize.pool.get();
        result.width = width;
        result.height = height;
        return result;
    }
    public static recycleInstance(instance: FSize) {
        FSize.pool.recycle(instance);
    }
    public static recycleInstances(instances: JArrayList<FSize>) {
        FSize.pool.recycleArray(instances);
    }
    constructor();
    constructor(width: number, height: number);
    public constructor(width?: number, height?: number) {
        super();
        if (width !== undefined && width !== null && height !== undefined && height !== null) {
            this.width = width;
            this.height = height;
        }
    }
    public equals(obj: Object): boolean {
        if (obj == null) {
            return false;
        }
        if (this == obj) {
            return true;
        }
        if (obj instanceof FSize) {
            let other: FSize = obj as FSize;
            return this.width == other.width && this.height == other.height;
        }
        return false;
    }
    public toString(): string {
        return this.width + "x" + this.height;
    }
}
