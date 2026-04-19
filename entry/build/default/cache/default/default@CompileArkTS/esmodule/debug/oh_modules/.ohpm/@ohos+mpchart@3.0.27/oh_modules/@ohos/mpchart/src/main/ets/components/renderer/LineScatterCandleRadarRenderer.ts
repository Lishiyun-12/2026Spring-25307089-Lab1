import type ChartAnimator from '../animation/ChartAnimator';
import type EntryOhos from '../data/EntryOhos';
import type ILineScatterCandleRadarDataSet from '../interfaces/datasets/ILineScatterCandleRadarDataSet';
import Utils from "@package:pkg_modules/.ohpm/@ohos+mpchart@3.0.27/pkg_modules/@ohos/mpchart/src/main/ets/components/utils/Utils";
import type ViewPortHandler from '../utils/ViewPortHandler';
import BarLineScatterCandleBubbleRenderer from "@package:pkg_modules/.ohpm/@ohos+mpchart@3.0.27/pkg_modules/@ohos/mpchart/src/main/ets/components/renderer/BarLineScatterCandleBubbleRenderer";
export default abstract class LineScatterCandleRadarRenderer extends BarLineScatterCandleBubbleRenderer {
    constructor(animator: ChartAnimator, viewPortHandler: ViewPortHandler) {
        super(animator, viewPortHandler);
    }
    protected drawHighlightLines(c: CanvasRenderingContext2D, x: number, y: number, set: ILineScatterCandleRadarDataSet<EntryOhos>): void {
        let highLightColor = set.getHighLightColor();
        if (typeof highLightColor == 'number') {
            let stringColor = String(highLightColor.toString(16));
            this.mHighlightPaint.setColor('#' + stringColor);
        }
        else {
            this.mHighlightPaint.setColor(highLightColor);
        }
        this.mHighlightPaint.setStrokeWidth(set.getHighlightLineWidth());
        this.mHighlightPaint.setDashPathEffect(set.getDashPathEffectHighlight());
        Utils.resetContext2DWithoutFont(c, this.mHighlightPaint);
        if (set.isVerticalHighlightIndicatorEnabled()) {
            c.beginPath();
            // create vertical path
            // this.mHighlightLinePath = new Path2D();
            c.moveTo(x, (this.mViewPortHandler ? this.mViewPortHandler.contentTop() : 0));
            c.lineTo(x, (this.mViewPortHandler ? this.mViewPortHandler.contentBottom() : 0));
            c.stroke();
            c.closePath();
        }
        // draw horizontal highlight lines
        if (set.isHorizontalHighlightIndicatorEnabled()) {
            c.beginPath();
            // create horizontal path
            // this.mHighlightLinePath = new Path2D();
            c.moveTo((this.mViewPortHandler ? this.mViewPortHandler.contentLeft() : 0), y);
            c.lineTo((this.mViewPortHandler ? this.mViewPortHandler.contentRight() : 0), y);
            c.stroke();
            c.closePath();
        }
    }
}
