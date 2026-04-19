import type { JArrayList } from './JArrayList';
import { ObjectPool } from "@package:pkg_modules/.ohpm/@ohos+mpchart@3.0.27/pkg_modules/@ohos/mpchart/src/main/ets/components/utils/ObjectPool";
import { Poolable } from "@package:pkg_modules/.ohpm/@ohos+mpchart@3.0.27/pkg_modules/@ohos/mpchart/src/main/ets/components/utils/Poolable";
export default class MPPointF extends Poolable {
    private static pool: ObjectPool<MPPointF> = ObjectPool.create(32, new MPPointF(0, 0))
        .setReplenishPercentage(0.5) as ObjectPool<MPPointF>;
    public x: number = 0;
    public y: number = 0;
    /*static {
          pool = ObjectPool.create(32, new MPPointF(0,0));
          pool.setReplenishPercentage(0.5f);
      }*/
    /*   public MPPointF() {
      }*/
    public constructor(x?: number, y?: number) {
        super();
        this.x = x ? x : 0;
        this.y = y ? y : 0;
    }
    public static getInstance(x?: number, y?: number, copy?: MPPointF): MPPointF {
        if (copy != null) {
            let result: MPPointF = MPPointF.pool.get();
            result.x = copy.x;
            result.y = copy.y;
            return result;
        }
        if (x != null && y != null) {
            let result: MPPointF = MPPointF.pool.get();
            result.x = x;
            result.y = y;
            return result;
        }
        return MPPointF.pool.get();
    }
    /* public static MPPointF getInstance() {
          return pool.get();
      }
  
      public static MPPointF getInstance(MPPointF copy) {
          MPPointF result = pool.get();
          result.x = copy.x;
          result.y = copy.y;
          return result;
      }*/
    public static recycleInstance(instance: MPPointF) {
        MPPointF.pool.recycle(instance);
    }
    public static recycleInstances(instances: JArrayList<MPPointF>) {
        MPPointF.pool.recycleArray(instances);
    }
    /*public static final Parcelable.Creator<MPPointF> CREATOR = new Parcelable.Creator<MPPointF>() {
         */
    /**
     * Return a new point from the data in the specified parcel.
     */
    /*
          public MPPointF createFromParcel(Parcel in) {
              MPPointF r = new MPPointF(0,0);
              r.my_readFromParcel(in);
              return r;
          }
  
         */
    /**
     * Return an array of rectangles of the specified size.
     */
    /*
          public MPPointF[] newArray(int size) {
              return new MPPointF[size];
          }
      };*/
    /**
     * Set the point's coordinates from the data stored in the specified
     * parcel. To write a point to a parcel, call writeToParcel().
     *
     * @param in The parcel to read the point's coordinates from
     */
    /* public void my_readFromParcel(Parcel in) {
          x = in.readFloat();
          y = in.readFloat();
      }*/
    public getX(): number {
        return this.x;
    }
    public getY(): number {
        return this.y;
    }
    instantiate(): Poolable {
        return new MPPointF(0, 0);
    }
}
