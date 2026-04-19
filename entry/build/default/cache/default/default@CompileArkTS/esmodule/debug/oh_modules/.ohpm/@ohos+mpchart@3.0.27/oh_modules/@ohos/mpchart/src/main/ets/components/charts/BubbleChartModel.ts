import type { LabelInfo } from '../components/AxisBase';
import type BubbleData from '../data/BubbleData';
import type BubbleDataProvider from '../interfaces/dataprovider/BubbleDataProvider';
import BubbleChartRenderer from "@package:pkg_modules/.ohpm/@ohos+mpchart@3.0.27/pkg_modules/@ohos/mpchart/src/main/ets/components/renderer/BubbleChartRenderer";
import BarLineChartBaseModel from "@package:pkg_modules/.ohpm/@ohos+mpchart@3.0.27/pkg_modules/@ohos/mpchart/src/main/ets/components/charts/BarLineChartBaseModel";
export default class BubbleChartModel extends BarLineChartBaseModel<BubbleData> implements BubbleDataProvider {
    public mAxisLabelInfo: LabelInfo[] = [];
    constructor() {
        super();
        this.init();
    }
    public context2d: CanvasRenderingContext2D | null = null;
    public invalidate() {
        if (this.context2d) {
            this.onDraw(this.context2d);
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
        if (this.mAnimator) {
            this.mRenderer = new BubbleChartRenderer(this, this.mAnimator, this.mViewPortHandler);
        }
    }
    public getBubbleData(): BubbleData | null {
        if (this.mData) {
            return this.mData;
        }
        else {
            return null;
        }
    }
}
