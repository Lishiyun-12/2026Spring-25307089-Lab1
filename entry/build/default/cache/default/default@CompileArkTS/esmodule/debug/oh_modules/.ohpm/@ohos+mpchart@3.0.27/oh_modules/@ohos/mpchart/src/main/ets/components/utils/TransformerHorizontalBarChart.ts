import Transformer from "@package:pkg_modules/.ohpm/@ohos+mpchart@3.0.27/pkg_modules/@ohos/mpchart/src/main/ets/components/utils/Transformer";
import type ViewPortHandler from './ViewPortHandler';
export default class TransformerHorizontalBarChart extends Transformer {
    constructor(viewPortHandler: ViewPortHandler) {
        super(viewPortHandler);
    }
    /**
     * Prepares the matrix that contains all offsets.
     *
     * @param inverted
     */
    public prepareMatrixOffset(inverted: boolean): void {
        this.mMatrixOffset.reset();
        // offset.postTranslate(mOffsetLeft, getHeight() - mOffsetBottom);
        if (!inverted)
            this.mMatrixOffset.postTranslate(this.mViewPortHandler.offsetLeft(), this.mViewPortHandler.getChartHeight() - this.mViewPortHandler.offsetBottom());
        else {
            this.mMatrixOffset
                .setTranslate(-(this.mViewPortHandler.getChartWidth() - this.mViewPortHandler.offsetRight()), this.mViewPortHandler.getChartHeight() - this.mViewPortHandler.offsetBottom());
            this.mMatrixOffset.postScale(-1.0, 1.0);
        }
        // mMatrixOffset.set(offset);
        // mMatrixOffset.reset();
        //
        // mMatrixOffset.postTranslate(mOffsetLeft, getHeight() -
        // mOffsetBottom);
    }
}
