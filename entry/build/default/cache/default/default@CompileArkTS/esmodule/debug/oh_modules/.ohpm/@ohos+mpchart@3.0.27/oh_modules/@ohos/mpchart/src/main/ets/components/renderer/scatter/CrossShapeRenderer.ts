import { Style } from "@package:pkg_modules/.ohpm/@ohos+mpchart@3.0.27/pkg_modules/@ohos/mpchart/src/main/ets/components/data/Paint";
import type Paint from "@package:pkg_modules/.ohpm/@ohos+mpchart@3.0.27/pkg_modules/@ohos/mpchart/src/main/ets/components/data/Paint";
import type IScatterDataSet from '../../interfaces/datasets/IScatterDataSet';
import Utils from "@package:pkg_modules/.ohpm/@ohos+mpchart@3.0.27/pkg_modules/@ohos/mpchart/src/main/ets/components/utils/Utils";
import type ViewPortHandler from '../../utils/ViewPortHandler';
import type IShapeRenderer from './IShapeRenderer';
/**
 * Created by wajdic on 15/06/2016.
 * Created at Time 09:08
 */
export default class CrossShapeRenderer implements IShapeRenderer {
    public renderShape(c: CanvasRenderingContext2D, dataSet: IScatterDataSet, viewPortHandler: ViewPortHandler, posX: number, posY: number, renderPaint: Paint): void {
        const shapeHalf: number = dataSet.getScatterShapeSize() / 2;
        renderPaint.setStyle(Style.STROKE);
        renderPaint.setStrokeWidth(Utils.handleDataValues(1));
        //画线
        Utils.resetContext2DWithoutFont(c, renderPaint);
        c.beginPath();
        c.moveTo(posX - shapeHalf, posY);
        c.lineTo(posX + shapeHalf, posY);
        c.moveTo(posX, posY - shapeHalf);
        c.lineTo(posX, posY + shapeHalf);
        c.stroke();
        c.closePath();
    }
}
