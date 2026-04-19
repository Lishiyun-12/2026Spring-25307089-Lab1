import type { LabelInfo } from '../components/AxisBase';
import type { XAxis } from '../components/XAxis';
import type CandleData from '../data/CandleData';
import type CandleDataProvider from '../interfaces/dataprovider/CandleDataProvider';
import CandleStickChartRenderer from "@package:pkg_modules/.ohpm/@ohos+mpchart@3.0.27/pkg_modules/@ohos/mpchart/src/main/ets/components/renderer/CandleStickChartRenderer";
import BarLineChartBaseModel from "@package:pkg_modules/.ohpm/@ohos+mpchart@3.0.27/pkg_modules/@ohos/mpchart/src/main/ets/components/charts/BarLineChartBaseModel";
export default class CandleStickChartModel extends BarLineChartBaseModel<CandleData> implements CandleDataProvider {
    public mAxisLabelInfo: LabelInfo[] = [];
    public constructor() {
        super();
        this.init();
    }
    public context2d: CanvasRenderingContext2D | null = null;
    public invalidate(): void {
        if (this.context2d) {
            super.onDraw(this.context2d);
            const axisXLabel = this.getXAxis()?.getLabelXInfos() || [];
            const axisYLabel = this.getAxisLeft()?.getLabelYInfos() || [];
            this.mAxisLabelInfo = axisXLabel.concat(axisYLabel);
        }
    }
    public invalidateHighlight() {
        this.invalidate();
    }
    public setContext2D(context2d: CanvasRenderingContext2D) {
        this.context2d = context2d;
    }
    public onChartSizeChanged(newWidth: number, newHeight: number, oldWidth: number, oldHeight: number) {
        super.onSizeChanged(newWidth, newHeight, oldWidth, oldHeight);
    }
    public onDraw(c: CanvasRenderingContext2D): void {
        super.onDraw(c);
    }
    // @Override
    protected init(): void {
        super.init();
        this.mRenderer = new CandleStickChartRenderer(this, this.mAnimator!, this.mViewPortHandler);
        let xAxis: XAxis | null = this.getXAxis();
        if (xAxis) {
            xAxis.setSpaceMin(0.5);
            xAxis.setSpaceMax(0.5);
        }
    }
    // @Override
    public getCandleData(): CandleData | null {
        return this.mData;
    }
}
