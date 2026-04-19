import BarChartModel from "@package:pkg_modules/.ohpm/@ohos+mpchart@3.0.27/pkg_modules/@ohos/mpchart/src/main/ets/components/charts/BarChartModel";
import type WaterfallData from '../data/WaterfallData';
import type WaterfallDataProvider from '../interfaces/dataprovider/WaterfallDataProvider';
import WaterfallChartRenderer from "@package:pkg_modules/.ohpm/@ohos+mpchart@3.0.27/pkg_modules/@ohos/mpchart/src/main/ets/components/renderer/WaterfallChartRenderer";
export default class WaterfallChartModel extends BarChartModel implements WaterfallDataProvider {
    public getWaterfallData(): WaterfallData | null {
        return this.mData;
    }
    protected init(): void {
        super.init();
        this.mRenderer = new WaterfallChartRenderer(this, this.mAnimator!, this.mViewPortHandler);
    }
}
