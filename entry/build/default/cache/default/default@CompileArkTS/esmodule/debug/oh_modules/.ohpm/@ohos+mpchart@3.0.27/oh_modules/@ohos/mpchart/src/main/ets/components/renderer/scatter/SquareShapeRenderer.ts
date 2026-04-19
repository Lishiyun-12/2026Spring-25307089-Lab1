import { Style } from "@package:pkg_modules/.ohpm/@ohos+mpchart@3.0.27/pkg_modules/@ohos/mpchart/src/main/ets/components/data/Paint";
import type Paint from "@package:pkg_modules/.ohpm/@ohos+mpchart@3.0.27/pkg_modules/@ohos/mpchart/src/main/ets/components/data/Paint";
import type IScatterDataSet from '../../interfaces/datasets/IScatterDataSet';
import ColorTemplate from "@package:pkg_modules/.ohpm/@ohos+mpchart@3.0.27/pkg_modules/@ohos/mpchart/src/main/ets/components/utils/ColorTemplate";
import Utils from "@package:pkg_modules/.ohpm/@ohos+mpchart@3.0.27/pkg_modules/@ohos/mpchart/src/main/ets/components/utils/Utils";
import type ViewPortHandler from '../../utils/ViewPortHandler';
import type IShapeRenderer from './IShapeRenderer';
/**
 * Created by wajdic on 15/06/2016.
 * Created at Time 09:08
 */
export default class SquareShapeRenderer implements IShapeRenderer {
    public renderShape(c: CanvasRenderingContext2D, dataSet: IScatterDataSet, viewPortHandler: ViewPortHandler, posX: number, posY: number, renderPaint: Paint): void {
        const shapeSize: number = dataSet.getScatterShapeSize();
        const shapeHalf: number = shapeSize / 2;
        const shapeHoleSizeHalf: number = Utils.handleDataValues(dataSet.getScatterShapeHoleRadius());
        const shapeHoleSize: number = shapeHoleSizeHalf * 2;
        const shapeStrokeSize: number = (shapeSize - shapeHoleSize) / 2;
        const shapeStrokeSizeHalf: number = shapeStrokeSize / 2;
        const shapeHoleColor: number = dataSet.getScatterShapeHoleColor();
        if (shapeSize > 0.0) {
            renderPaint.setStyle(Style.STROKE);
            renderPaint.setStrokeWidth(shapeStrokeSize);
            Utils.resetContext2DWithoutFont(c, renderPaint);
            c.beginPath();
            let left = posX - shapeHoleSizeHalf - shapeStrokeSizeHalf;
            let top = posY - shapeHoleSizeHalf - shapeStrokeSizeHalf;
            let right = posX + shapeHoleSizeHalf + shapeStrokeSizeHalf;
            let bottom = posY + shapeHoleSizeHalf + shapeStrokeSizeHalf;
            c.strokeRect(left, top, right - left, bottom - top);
            c.closePath();
            if (shapeHoleColor != ColorTemplate.COLOR_NONE) {
                renderPaint.setStyle(Style.FILL);
                renderPaint.setColor(shapeHoleColor);
                Utils.resetContext2DWithoutFont(c, renderPaint);
                c.beginPath();
                let left = posX - shapeHoleSizeHalf;
                let top = posY - shapeHoleSizeHalf;
                let right = posX + shapeHoleSizeHalf;
                let bottom = posY + shapeHoleSizeHalf;
                c.fillRect(left, top, right - left, bottom - top);
                c.closePath();
            }
        }
        else {
            renderPaint.setStyle(Style.FILL);
            Utils.resetContext2DWithoutFont(c, renderPaint);
            c.beginPath();
            let left = posX - shapeHalf;
            let top = posY - shapeHalf;
            let right = posX + shapeHalf;
            let bottom = posY + shapeHalf;
            c.fillRect(left, top, right - left, bottom - top);
            c.closePath();
        }
    }
}
