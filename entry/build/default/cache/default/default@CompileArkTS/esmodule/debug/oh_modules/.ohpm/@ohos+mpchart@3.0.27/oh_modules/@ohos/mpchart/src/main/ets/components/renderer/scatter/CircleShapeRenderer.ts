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
export default class CircleShapeRenderer implements IShapeRenderer {
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
            let path: Path2D = new Path2D();
            path.arc(posX, posY, shapeHoleSizeHalf + shapeStrokeSizeHalf, 0, 2 * Math.PI);
            c.stroke(path);
            c.closePath();
            if (shapeHoleColor != ColorTemplate.COLOR_NONE) {
                renderPaint.setStyle(Style.FILL);
                renderPaint.setColor(shapeHoleColor);
                Utils.resetContext2DWithoutFont(c, renderPaint);
                c.beginPath();
                let path: Path2D = new Path2D();
                path.arc(posX, posY, shapeHoleSizeHalf, 0, 2 * Math.PI);
                c.fill(path);
                c.closePath();
            }
        }
        else {
            renderPaint.setStyle(Style.FILL);
            Utils.resetContext2DWithoutFont(c, renderPaint);
            c.beginPath();
            c.arc(posX, posY, shapeHalf, 0, 2 * Math.PI);
            c.stroke();
            c.closePath();
        }
    }
}
