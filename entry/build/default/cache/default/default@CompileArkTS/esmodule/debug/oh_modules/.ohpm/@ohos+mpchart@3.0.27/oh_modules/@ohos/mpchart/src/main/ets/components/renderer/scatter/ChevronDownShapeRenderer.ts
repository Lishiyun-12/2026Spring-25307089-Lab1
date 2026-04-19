import { Style } from "@package:pkg_modules/.ohpm/@ohos+mpchart@3.0.27/pkg_modules/@ohos/mpchart/src/main/ets/components/data/Paint";
import type Paint from "@package:pkg_modules/.ohpm/@ohos+mpchart@3.0.27/pkg_modules/@ohos/mpchart/src/main/ets/components/data/Paint";
import type IScatterDataSet from '../../interfaces/datasets/IScatterDataSet';
import Utils from "@package:pkg_modules/.ohpm/@ohos+mpchart@3.0.27/pkg_modules/@ohos/mpchart/src/main/ets/components/utils/Utils";
import type ViewPortHandler from '../../utils/ViewPortHandler';
import type IShapeRenderer from './IShapeRenderer';
export default class ChevronDownShapeRenderer implements IShapeRenderer {
    public renderShape(c: CanvasRenderingContext2D, dataSet: IScatterDataSet, viewPortHandler: ViewPortHandler, posX: number, posY: number, renderPaint: Paint): void {
        const shapeHalf: number = dataSet.getScatterShapeSize() / 2;
        renderPaint.setStyle(Style.STROKE);
        renderPaint.setStrokeWidth(Utils.handleDataValues(1));
        // c.drawLine(
        // posX,
        // posY + (2 * shapeHalf),
        // posX + (2 * shapeHalf),
        // posY,
        // renderPaint);
        // c.drawLine(
        //   posX,
        //   posY + (2 * shapeHalf),
        //   posX - (2 * shapeHalf),
        //   posY,
        //   renderPaint);
        Utils.resetContext2DWithoutFont(c, renderPaint);
        c.beginPath();
        c.moveTo(posX, posY + (2 * shapeHalf));
        c.lineTo(posX + (2 * shapeHalf), posY);
        c.moveTo(posX, posY + (2 * shapeHalf));
        c.lineTo(posX - (2 * shapeHalf), posY);
        c.stroke();
        c.closePath();
    }
}
