import type { LabelInfo } from '../components/AxisBase';
import type { ScatterData } from '../data/ScatterData';
import type { ScatterDataProvider } from '../interfaces/dataprovider/ScatterDataProvider';
import ScatterChartRenderer from "@package:pkg_modules/.ohpm/@ohos+mpchart@3.0.27/pkg_modules/@ohos/mpchart/src/main/ets/components/renderer/ScatterChartRenderer";
import BarLineChartBaseModel from "@package:pkg_modules/.ohpm/@ohos+mpchart@3.0.27/pkg_modules/@ohos/mpchart/src/main/ets/components/charts/BarLineChartBaseModel";
/**
 * The ScatterChart. Draws dots, triangles, squares and custom shapes into the
 * Chart-View. CIRCLE and SCQUARE offer the best performance, TRIANGLE has the
 * worst performance.
 *
 */
export default class ScatterChartModel extends BarLineChartBaseModel<ScatterData> implements ScatterDataProvider {
    public mAxisLabelInfo: LabelInfo[] = [];
    // ScatterData() {
    //   throw new Error('Method not implemented.');
    // }
    constructor() {
        super();
        this.init();
    }
    public onChartSizeChanged(newWidth: number, newHeight: number, oldWidth: number, oldHeight: number) {
        super.onSizeChanged(newWidth, newHeight, oldWidth, oldHeight);
    }
    // constructor( context:Context,attrs?:AttributeSet,defStyle?:number) {
    //     super(context,attrs,defStyle);
    // }
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
    public onDraw(c: CanvasRenderingContext2D): void {
        super.onDraw(c);
    }
    // @Override
    protected init(): void {
        super.init();
        if (this.mAnimator) {
            this.mRenderer = new ScatterChartRenderer(this, this.mAnimator, this.mViewPortHandler);
        }
        this.getXAxis()?.setSpaceMin(0.5);
        this.getXAxis()?.setSpaceMax(0.5);
    }
    // @Override
    public getScatterData(): ScatterData | null {
        if (this.mData) {
            return this.mData;
        }
        else {
            return null;
        }
    }
}
/**
 * Predefined ScatterShapes that allow the specification of a shape a ScatterDataSet should be drawn with.
 * If a ScatterShape is specified for a ScatterDataSet, the required renderer is set.
 */
export enum ChartShape {
    SQUARE = 0,
    CIRCLE = 1,
    TRIANGLE = 2,
    CROSS = 3,
    X = 4,
    CHEVRON_UP = 5,
    CHEVRON_DOWN = 6
}
export class ScatterShape {
    // public static SQUARE: string = "SQUARE"
    // public static CIRCLE: string = "CIRCLE"
    // public static TRIANGLE: string = "TRIANGLE"
    // public static CROSS: string = "CROSS"
    // public static X: string = "X"
    // public static CHEVRON_UP: string = "CHEVRON_UP"
    // public static CHEVRON_DOWN: string = "CHEVRON_DOWN";
    //
    private shapeIdentifier: string;
    constructor(shapeIdentifier: string) {
        this.shapeIdentifier = shapeIdentifier;
    }
    // @Override
    public toString(): String {
        return this.shapeIdentifier;
    }
    public static getAllDefaultShapes(): ChartShape[] {
        return [ChartShape.SQUARE, ChartShape.CIRCLE, ChartShape.TRIANGLE, ChartShape.CROSS, ChartShape.X, ChartShape.CHEVRON_UP, ChartShape.CHEVRON_DOWN];
    }
}
