import type ChartAnimator from '../animation/ChartAnimator';
import type ChartPixelMap from '../data/ChartPixelMap';
import type { ChartColorStop } from '../data/LineDataSet';
import type { JArrayList } from '../utils/JArrayList';
import Utils from "@package:pkg_modules/.ohpm/@ohos+mpchart@3.0.27/pkg_modules/@ohos/mpchart/src/main/ets/components/utils/Utils";
import type ViewPortHandler from '../utils/ViewPortHandler';
import LineScatterCandleRadarRenderer from "@package:pkg_modules/.ohpm/@ohos+mpchart@3.0.27/pkg_modules/@ohos/mpchart/src/main/ets/components/renderer/LineScatterCandleRadarRenderer";
export abstract class LineRadarRenderer extends LineScatterCandleRadarRenderer {
    constructor(animator: ChartAnimator, viewPortHandler: ViewPortHandler) {
        super(animator, viewPortHandler);
    }
    /**
     * Draws the provided path in filled mode with the provided color and alpha.
     * Special thanks to Angelo Suzuki (https://github.com/tinsukE) for this.
     *
     * @param c
     * @param filledPath
     * @param fillColor
     * @param fillAlpha
     */
    protected drawFilledPathWithAlpha(c: CanvasRenderingContext2D, filledPath: Path2D, fillColor: number | string, fillAlpha: number) {
        let color: number = 0;
        // 如果传入的颜色是字符串形式
        if (typeof (fillColor) == "string" && fillColor.startsWith("#")) {
            // 将字符串颜色值转换为数字格式
            color = Number.parseInt(fillColor.substr(1), 16);
        }
        else {
            color = Number(fillColor);
        }
        if (fillAlpha > 255) {
            fillAlpha = 255;
        }
        if (fillAlpha < 0) {
            fillAlpha = 0;
        }
        // 使用修改后的颜色值进行绘制
        c.fillStyle = `rgba(${(color >> 16) & 0xff}, ${(color >> 8) & 0xff}, ${color & 0xff}, ${fillAlpha / 255})`;
        c.fill(filledPath);
    }
    /**
     * Draws the provided path in filled mode with the provided drawable.
     *
     * @param c
     * @param filledPath
     * @param drawable
     */
    protected drawFilledPath(c: CanvasRenderingContext2D, filledPath: Path2D, drawable: ChartPixelMap) {
        if (this.clipPathSupported()) {
            c.save();
            c.clip(filledPath);
            // drawable.setBounds(
            //   Math.floor(this.mViewPortHandler.contentLeft()),
            //   Math.floor(this.mViewPortHandler.contentTop()),
            //   Math.floor(this.mViewPortHandler.contentRight()),
            //   Math.floor(this.mViewPortHandler.contentBottom())
            // );
            // drawable.draw(c);
            //
            // c.restoreToCount(save);
            if (this.mViewPortHandler) {
                c.rect(this.mViewPortHandler.contentLeft(), this.mViewPortHandler.contentTop(), this.mViewPortHandler.contentRight() - this.mViewPortHandler.contentLeft(), this.mViewPortHandler.contentBottom() - this.mViewPortHandler.contentTop());
            }
            c.restore();
        }
        else {
            throw new Error("Fill-drawables not (yet) supported below API level 18, " +
                "this code was run on API level " + Utils.getSDKInt() + ".");
        }
    }
    /**
     * Clip path with hardware acceleration only working properly on API level 18 and above.
     *
     * @return
     */
    private clipPathSupported(): boolean {
        return Utils.getSDKInt() >= 8;
    }
    protected drawGradientFill(c: CanvasRenderingContext2D, filledPath: Path2D, gradientColor: JArrayList<ChartColorStop>, topValue: number, bottomValue: number) {
        let gradient = c.createLinearGradient(0, topValue, 0, bottomValue);
        for (let i = 0; i < gradientColor.size(); i++) {
            let colorStop: ChartColorStop = gradientColor.get(i);
            if (colorStop) {
                gradient.addColorStop(colorStop[1], colorStop[0]);
            }
        }
        c.fillStyle = gradient;
        c.fill(filledPath);
    }
}
