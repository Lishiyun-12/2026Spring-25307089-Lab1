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
export default class TriangleShapeRenderer implements IShapeRenderer {
    //不确定改为Path2D还是Path
    protected mTrianglePathBuffer: Path2D = new Path2D();
    public renderShape(c: CanvasRenderingContext2D, dataSet: IScatterDataSet, viewPortHandler: ViewPortHandler, posX: number, posY: number, renderPaint: Paint): void {
        const shapeSize: number = dataSet.getScatterShapeSize();
        const shapeHalf: number = shapeSize / 2;
        const shapeHoleSizeHalf: number = Utils.handleDataValues(dataSet.getScatterShapeHoleRadius());
        const shapeHoleSize: number = shapeHoleSizeHalf * 2;
        const shapeStrokeSize: number = (shapeSize - shapeHoleSize) / 2;
        const shapeHoleColor: number = dataSet.getScatterShapeHoleColor();
        renderPaint.setStyle(Style.FILL);
        // create a triangle path
        // Path tri = mTrianglePathBuffer;
        let tri: Path2D = this.mTrianglePathBuffer;
        // tri.reset();
        tri = new Path2D();
        tri.moveTo(posX, posY - shapeHalf);
        tri.lineTo(posX + shapeHalf, posY + shapeHalf);
        tri.lineTo(posX - shapeHalf, posY + shapeHalf);
        if (shapeSize > 0.0) {
            tri.lineTo(posX, posY - shapeHalf);
            tri.moveTo(posX - shapeHalf + shapeStrokeSize, posY + shapeHalf - shapeStrokeSize);
            tri.lineTo(posX + shapeHalf - shapeStrokeSize, posY + shapeHalf - shapeStrokeSize);
            tri.lineTo(posX, posY - shapeHalf + shapeStrokeSize);
            tri.lineTo(posX - shapeHalf + shapeStrokeSize, posY + shapeHalf - shapeStrokeSize);
        }
        tri.closePath();
        Utils.resetContext2DWithoutFont(c, renderPaint);
        c.beginPath();
        c.stroke(tri);
        c.closePath();
        // tri.reset();
        // tri = new Path2D();
        if (shapeSize > 0.0 && shapeHoleColor != ColorTemplate.COLOR_NONE) {
            renderPaint.setColor(shapeHoleColor);
            tri.moveTo(posX, posY - shapeHalf + shapeStrokeSize);
            tri.lineTo(posX + shapeHalf - shapeStrokeSize, posY + shapeHalf - shapeStrokeSize);
            tri.lineTo(posX - shapeHalf + shapeStrokeSize, posY + shapeHalf - shapeStrokeSize);
            tri.closePath();
            // c.drawPath(tri, renderPaint);
            Utils.resetContext2DWithoutFont(c, renderPaint);
            c.beginPath();
            c.stroke(tri);
            c.closePath();
            // tri.reset();
            // tri = new Path2D();
        }
    }
}
