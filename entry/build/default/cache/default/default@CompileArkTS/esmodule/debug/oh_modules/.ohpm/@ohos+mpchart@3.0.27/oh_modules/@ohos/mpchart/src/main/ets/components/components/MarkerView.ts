import type ChartModel from '../charts/ChartModel';
import type ChartData from '../data/ChartData';
import type EntryOhos from '../data/EntryOhos';
import type Highlight from '../highlight/Highlight';
import type IDataSet from '../interfaces/datasets/IDataSet';
import MPPointF from "@package:pkg_modules/.ohpm/@ohos+mpchart@3.0.27/pkg_modules/@ohos/mpchart/src/main/ets/components/utils/MPPointF";
import type IMarker from './IMarker';
export default class MarkerView implements IMarker {
    private mOffset: MPPointF = new MPPointF();
    private mOffset2: MPPointF = new MPPointF();
    private mWeakChart: ChartModel<ChartData<IDataSet<EntryOhos>>> | null = null;
    constructor() {
    }
    public setOffsetByMPPointF(offset: MPPointF) {
        this.mOffset = offset;
        if (this.mOffset == null) {
            this.mOffset = new MPPointF();
        }
    }
    public setOffset(offsetX: number, offsetY: number): void {
        this.mOffset.x = offsetX;
        this.mOffset.y = offsetY;
    }
    getOffset(): MPPointF {
        return this.mOffset;
    }
    public setChartView(chart: ChartModel<ChartData<IDataSet<EntryOhos>>>): void {
        this.mWeakChart = chart;
    }
    public getChartView(): ChartModel<ChartData<IDataSet<EntryOhos>>> | null {
        return this.mWeakChart;
    }
    getOffsetForDrawingAtPoint(posX: number, posY: number): MPPointF {
        let offset: MPPointF = this.getOffset();
        this.mOffset2.x = offset.x;
        this.mOffset2.y = offset.y;
        return this.mOffset2;
    }
    draw(c: CanvasRenderingContext2D, posX: number, posY: number, e: EntryOhos, highlight: Highlight) {
        let offset: MPPointF = this.getOffsetForDrawingAtPoint(posX, posY);
        c.save();
        let roundX = Number(e.getX().toFixed(1));
        let roundY = Number(e.getY().toFixed(1));
        let text: string = 'x:' + Math.round(roundX) + 'y:' + Math.round(roundY);
        let textMetrics: TextMetrics = c.measureText(text);
        let measureWidth: number = textMetrics.width;
        let measureHeight: number = textMetrics.height;
        let padding: number = 5;
        c.beginPath();
        c.fillStyle = '#bcbcbc';
        let left: number = posX + offset.x;
        let top: number = posY + offset.y;
        c.fillRect(left - measureWidth / 2 - padding, top - measureHeight - 4 * padding, measureWidth + 2 * padding, measureHeight + 3 * padding);
        if (measureWidth < 32) {
            measureWidth = 32;
        }
        if (measureHeight < 12) {
            measureHeight = 12;
        }
        c.beginPath();
        c.moveTo(left - 2 * padding, top - 2 * padding);
        c.lineTo(left, top + padding / 2);
        c.lineTo(left + 2 * padding, top - 2 * padding);
        c.fill();
        c.closePath();
        c.fillStyle = Color.Black;
        c.textAlign = 'center';
        c.font = "normal normal 14vp";
        c.fillText(text, left, top - 3 * padding);
        c.closePath();
        c.restore();
    }
}
