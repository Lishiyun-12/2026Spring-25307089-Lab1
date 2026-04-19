import type AreaData from '../data/AreaData';
import type AreaDataProvider from '../interfaces/dataprovider/AreaDataProvider';
import LineChartModel from "@package:pkg_modules/.ohpm/@ohos+mpchart@3.0.27/pkg_modules/@ohos/mpchart/src/main/ets/components/charts/LineChartModel";
import AreaChartRenderer from "@package:pkg_modules/.ohpm/@ohos+mpchart@3.0.27/pkg_modules/@ohos/mpchart/src/main/ets/components/renderer/AreaChartRenderer";
@ObservedV2
export default class AreaChartModel extends LineChartModel implements AreaDataProvider {
    public getAreaData(): AreaData | null {
        return this.mData;
    }
    protected init(): void {
        super.init();
        this.mRenderer = new AreaChartRenderer(this, this.mAnimator!, this.mViewPortHandler);
    }
}
