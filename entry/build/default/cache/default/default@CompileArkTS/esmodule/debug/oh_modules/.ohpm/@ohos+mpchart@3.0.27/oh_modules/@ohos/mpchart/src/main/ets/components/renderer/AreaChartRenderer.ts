import LineChartRenderer from "@package:pkg_modules/.ohpm/@ohos+mpchart@3.0.27/pkg_modules/@ohos/mpchart/src/main/ets/components/renderer/LineChartRenderer";
import type AreaDataProvider from '../interfaces/dataprovider/AreaDataProvider';
import type ChartAnimator from '../animation/ChartAnimator';
import type ViewPortHandler from '../utils/ViewPortHandler';
import type LineData from '../data/LineData';
import type ILineDataSet from '../interfaces/datasets/ILineDataSet';
import { Mode } from "@package:pkg_modules/.ohpm/@ohos+mpchart@3.0.27/pkg_modules/@ohos/mpchart/src/main/ets/components/data/LineDataSet";
import type EntryOhos from '../data/EntryOhos';
import type Transformer from '../utils/Transformer';
import type { XBounds } from './BarLineScatterCandleBubbleRenderer';
import type { JArrayList } from '../utils/JArrayList';
import type ChartPixelMap from '../data/ChartPixelMap';
import Utils from "@package:pkg_modules/.ohpm/@ohos+mpchart@3.0.27/pkg_modules/@ohos/mpchart/src/main/ets/components/utils/Utils";
import MPPointF from "@package:pkg_modules/.ohpm/@ohos+mpchart@3.0.27/pkg_modules/@ohos/mpchart/src/main/ets/components/utils/MPPointF";
import type IValueFormatter from '../formatter/IValueFormatter';
import { LogUtil } from "@package:pkg_modules/.ohpm/@ohos+mpchart@3.0.27/pkg_modules/@ohos/mpchart/src/main/ets/components/utils/LogUtil";
import { MPChartTraceUtil } from "@package:pkg_modules/.ohpm/@ohos+mpchart@3.0.27/pkg_modules/@ohos/mpchart/src/main/ets/components/utils/MPChartTraceUtil";
import { TraceLogConstants } from "@package:pkg_modules/.ohpm/@ohos+mpchart@3.0.27/pkg_modules/@ohos/mpchart/src/main/ets/components/utils/TraceConfig";
export default class AreaChartRender extends LineChartRenderer {
    constructor(chart: AreaDataProvider, animator: ChartAnimator, viewPortHandler: ViewPortHandler) {
        super(chart, animator, viewPortHandler);
    }
    public drawData(c: CanvasRenderingContext2D) {
        try {
            LogUtil.log('AreaChartRenderer drawData - start');
            MPChartTraceUtil.startInfo(TraceLogConstants.Tag.AreaChartSetData);
            const width: number = Math.floor(this.mViewPortHandler ? this.mViewPortHandler.getChartWidth() : 0);
            const height: number = Math.floor(this.mViewPortHandler ? this.mViewPortHandler.getChartHeight() : 0);
            if (width > 0 && height > 0) {
                this.mBitmapCanvas = c;
            }
            else {
                return;
            }
            if (!this.mChart) {
                return;
            }
            const lineData: LineData | null = this.mChart.getLineData();
            if (!lineData) {
                return;
            }
            let dataSets = lineData.getDataSets();
            for (let i = 0; i < dataSets.size(); i++) {
                let set = dataSets.get(i);
                if (set.isVisible()) {
                    set.setDrawFilled(true);
                    this.drawDataSet(c, set);
                }
            }
        }
        catch (e) {
            LogUtil.error('AreaChartRenderer drawData error', e);
            MPChartTraceUtil.startError(TraceLogConstants.Tag.AreaChartSetData);
        }
        finally {
            LogUtil.log('AreaChartRenderer drawData - end');
            MPChartTraceUtil.finish(TraceLogConstants.Tag.AreaChartSetData);
        }
    }
    public drawDataSet(c: CanvasRenderingContext2D, dataSet: ILineDataSet) {
        if (dataSet.getEntryCount() < 1) {
            return;
        }
        this.mRenderPaint.setStrokeWidth(dataSet.getLineWidth());
        this.mRenderPaint.setDashPathEffect(dataSet.getDashPathEffect());
        switch (dataSet.getMode()) {
            case Mode.LINEAR:
            case Mode.STEPPED:
                this.drawLinear(c, dataSet);
                break;
            case Mode.CUBIC_BEZIER:
            case Mode.HORIZONTAL_BEZIER:
                this.drawHorizontalBezier(c, dataSet);
                break;
            default:
                this.drawLinear(c, dataSet);
        }
        this.mRenderPaint.setDashPathEffect(null);
    }
    private generateStackedFilledPath(dataSet: ILineDataSet, previousDataSet: ILineDataSet | null, startIndex: number, endIndex: number): Path2D {
        if (!this.mChart) {
            return new Path2D();
        }
        const phaseY: number = this.mAnimator ? this.mAnimator.getPhaseY() : 1;
        const isDrawSteppedEnabled: boolean = dataSet.getMode() === Mode.STEPPED;
        let filled: Path2D = new Path2D();
        const startEntry: EntryOhos = dataSet.getEntryForIndex(startIndex);
        if (!startEntry) {
            return filled;
        }
        let startPreviousY = 0;
        if (previousDataSet) {
            const startPreviousEntry = previousDataSet.getEntryForIndex(startIndex);
            if (startPreviousEntry) {
                startPreviousY = startPreviousEntry.getY() * phaseY;
            }
        }
        filled.moveTo(startEntry.getX(), startPreviousY);
        let currentEntry: EntryOhos | null = startEntry;
        let previousEntry: EntryOhos = startEntry;
        for (let x: number = startIndex; x <= endIndex; x++) {
            currentEntry = dataSet.getEntryForIndex(x);
            if (!currentEntry) {
                continue;
            }
            if (isDrawSteppedEnabled && x > startIndex) {
                filled.lineTo(currentEntry.getX(), previousEntry.getY() * phaseY);
            }
            filled.lineTo(currentEntry.getX(), currentEntry.getY() * phaseY);
            previousEntry = currentEntry;
        }
        for (let x: number = endIndex; x >= startIndex; x--) {
            currentEntry = dataSet.getEntryForIndex(x);
            if (!currentEntry) {
                continue;
            }
            let previousY = 0;
            if (previousDataSet) {
                const previousEntry = previousDataSet.getEntryForIndex(x);
                if (previousEntry) {
                    previousY = previousEntry.getY() * phaseY;
                }
            }
            if (isDrawSteppedEnabled && x < endIndex) {
                const nextEntry = dataSet.getEntryForIndex(x + 1);
                if (nextEntry) {
                    filled.lineTo(currentEntry.getX(), previousY);
                }
            }
            filled.lineTo(currentEntry.getX(), previousY);
        }
        filled.closePath();
        return filled;
    }
    private generateSteppedFilledPath(dataSet: ILineDataSet, previousDataSet: ILineDataSet | null, startIndex: number, endIndex: number): Path2D {
        if (!this.mChart) {
            return new Path2D();
        }
        const phaseY: number = this.mAnimator ? this.mAnimator.getPhaseY() : 1;
        const isDrawSteppedEnabled: boolean = dataSet.getMode() === Mode.STEPPED;
        let filled: Path2D = new Path2D();
        const startEntry: EntryOhos = dataSet.getEntryForIndex(startIndex);
        if (!startEntry) {
            return filled;
        }
        let startPreviousY = 0;
        if (previousDataSet) {
            const startPreviousEntry = previousDataSet.getEntryForIndex(startIndex);
            if (startPreviousEntry) {
                startPreviousY = startPreviousEntry.getY() * phaseY;
            }
        }
        filled.moveTo(startEntry.getX(), startPreviousY);
        let previousEntry: EntryOhos = startEntry;
        for (let x: number = startIndex; x <= endIndex; x++) {
            const currentEntry = dataSet.getEntryForIndex(x);
            if (!currentEntry) {
                continue;
            }
            if (isDrawSteppedEnabled && x > startIndex) {
                filled.lineTo(currentEntry.getX(), previousEntry.getY() * phaseY);
            }
            filled.lineTo(currentEntry.getX(), currentEntry.getY() * phaseY);
            previousEntry = currentEntry;
        }
        for (let x: number = endIndex; x >= startIndex; x--) {
            const currentEntry = dataSet.getEntryForIndex(x);
            if (!currentEntry) {
                continue;
            }
            let previousY = 0;
            if (previousDataSet) {
                const previousDataSetEntry = previousDataSet.getEntryForIndex(x);
                if (previousDataSetEntry) {
                    previousY = previousDataSetEntry.getY() * phaseY;
                }
            }
            if (isDrawSteppedEnabled) {
                if (x < endIndex) {
                    const nextEntry = previousDataSet ? previousDataSet.getEntryForIndex(x + 1) : null;
                    if (nextEntry) {
                        filled.lineTo(nextEntry.getX(), previousY);
                    }
                    else {
                        const nextCurrentEntry = dataSet.getEntryForIndex(x + 1);
                        if (nextCurrentEntry) {
                            filled.lineTo(nextCurrentEntry.getX(), previousY);
                        }
                    }
                }
                filled.lineTo(currentEntry.getX(), previousY);
            }
            else {
                filled.lineTo(currentEntry.getX(), previousY);
            }
        }
        filled.closePath();
        return filled;
    }
    /**
     * Draws a filled linear path on the canvas for area charts.
     *
     * @param c
     * @param dataSet
     * @param trans
     * @param bounds
     */
    protected drawLinearFill(c: CanvasRenderingContext2D, dataSet: ILineDataSet, trans: Transformer, bounds: XBounds): void {
        if (!this.mChart) {
            return;
        }
        const lineData: LineData | null = this.mChart.getLineData();
        if (!lineData) {
            return;
        }
        const dataSets: JArrayList<ILineDataSet> = lineData.getDataSets();
        const currentDataSetIndex = dataSets.indexOf(dataSet);
        const previousDataSet = currentDataSetIndex > 0 ? dataSets.get(currentDataSetIndex - 1) : null;
        let filled: Path2D = this.mGenerateFilledPathBuffer;
        const startingIndex: number = bounds.min;
        const endingIndex: number = bounds.range + bounds.min;
        const indexInterval: number = 128;
        let currentStartIndex: number = 0;
        let currentEndIndex: number = indexInterval;
        let iterations: number = 0;
        do {
            currentStartIndex = startingIndex + iterations * indexInterval;
            currentEndIndex = currentStartIndex + indexInterval;
            currentEndIndex = currentEndIndex > endingIndex ? endingIndex : currentEndIndex;
            if (currentStartIndex <= currentEndIndex) {
                // 使用统一的逻辑，根据模式选择不同的路径生成方法
                if (dataSet.getMode() === Mode.STEPPED) {
                    filled = this.generateSteppedFilledPath(dataSet, previousDataSet, currentStartIndex, currentEndIndex);
                }
                else {
                    filled = this.generateStackedFilledPath(dataSet, previousDataSet, currentStartIndex, currentEndIndex);
                }
                filled = trans.pathValueToPixel(filled);
                let isInverted: boolean = this.mChart.isInverted(dataSet.getAxisDependency());
                const drawable: ChartPixelMap | null = dataSet.getFillDrawable();
                const gradientFillColor = dataSet.getGradientFillColor();
                if (drawable !== null) {
                    this.drawFilledPath(c, filled, drawable);
                }
                else if (gradientFillColor) {
                    let topValue = 0;
                    if (isInverted) {
                        topValue = dataSet.getYMin();
                    }
                    else {
                        topValue = dataSet.getYMax();
                    }
                    let fillMin = dataSet.getFillFormatter().getFillLinePosition(dataSet, this.mChart);
                    let topBottomValueNumber = [0, topValue, 0, fillMin];
                    trans.pointValuesToPixel(topBottomValueNumber);
                    this.drawGradientFill(c, filled, gradientFillColor, topBottomValueNumber[1], topBottomValueNumber[3]);
                }
                else {
                    this.drawFilledPathWithAlpha(c, filled, dataSet.getFillColor(), dataSet.getFillAlpha());
                }
            }
            iterations++;
        } while (currentStartIndex <= currentEndIndex);
    }
    protected drawCubicFill(c: CanvasRenderingContext2D, dataSet: ILineDataSet, spline: Path2D, trans: Transformer, bounds: XBounds) {
        if (!this.mChart) {
            return;
        }
        const lineData: LineData | null = this.mChart.getLineData();
        if (!lineData) {
            return;
        }
        const dataSets: JArrayList<ILineDataSet> = lineData.getDataSets();
        const currentDataSetIndex = dataSets.indexOf(dataSet);
        const previousDataSet = currentDataSetIndex > 0 ? dataSets.get(currentDataSetIndex - 1) : null;
        const fillMin: number = dataSet.getFillFormatter().getFillLinePosition(dataSet, this.mChart);
        const phaseY: number = this.mAnimator ? this.mAnimator.getPhaseY() : 1;
        // 统一使用堆叠逻辑，不再区分是否为第一个数据集
        if (dataSet.getEntryCount() === 1) {
            const entryIndex0 = dataSet.getEntryForIndex(0);
            const prevEntry = previousDataSet ? previousDataSet.getEntryForIndex(0) : null;
            const prevY = prevEntry ? prevEntry.getY() * phaseY : fillMin;
            const xRange = this.mChart.getHighestVisibleX() - this.mChart.getLowestVisibleX();
            const interval = xRange / this.mChart.getContentRect().width() * dataSet.getCircleRadius();
            spline.moveTo(entryIndex0.getX() - interval, prevY);
            spline.lineTo(entryIndex0.getX() + interval, prevY);
            spline.lineTo(entryIndex0.getX() + interval, entryIndex0.getY() * phaseY);
            spline.lineTo(entryIndex0.getX() - interval, entryIndex0.getY() * phaseY);
            spline.closePath();
        }
        else {
            for (let j = bounds.min + bounds.range; j >= bounds.min; j--) {
                const entry = dataSet.getEntryForIndex(j);
                const prevEntry = previousDataSet ? previousDataSet.getEntryForIndex(j) : null;
                const prevY = prevEntry ? prevEntry.getY() * phaseY : fillMin;
                if (j === bounds.min + bounds.range) {
                    spline.lineTo(entry.getX(), prevY);
                }
                else {
                    const nextEntry = dataSet.getEntryForIndex(j + 1);
                    const nextPrevEntry = previousDataSet ? previousDataSet.getEntryForIndex(j + 1) : null;
                    const nextPrevY = nextPrevEntry ? nextPrevEntry.getY() * phaseY : fillMin;
                    const cpx: number = (entry.getX() + nextEntry.getX()) / 2.0;
                    spline.bezierCurveTo(cpx, nextPrevY, cpx, prevY, entry.getX(), prevY);
                }
            }
            spline.closePath();
        }
        spline = trans.pathValueToPixel(spline);
        const drawable: ChartPixelMap | null = dataSet.getFillDrawable();
        const gradientFillColor = dataSet.getGradientFillColor();
        if (drawable !== null) {
            this.drawFilledPath(c, spline, drawable);
        }
        else if (gradientFillColor) {
            let isInverted: boolean = this.mChart.isInverted(dataSet.getAxisDependency());
            let topValue = 0;
            if (isInverted) {
                topValue = dataSet.getYMin();
            }
            else {
                topValue = dataSet.getYMax();
            }
            let topBottomValueNumber = [0, topValue, 0, fillMin];
            trans.pointValuesToPixel(topBottomValueNumber);
            this.drawGradientFill(c, spline, gradientFillColor, topBottomValueNumber[1], topBottomValueNumber[3]);
        }
        else {
            this.drawFilledPathWithAlpha(c, spline, dataSet.getFillColor(), dataSet.getFillAlpha());
        }
    }
    public drawValues(c: CanvasRenderingContext2D, isHorizontalFlip: boolean) {
        if (!this.mChart) {
            return;
        }
        if (this.isDrawingValuesAllowed(this.mChart)) {
            let lineData = this.mChart.getLineData();
            if (!lineData) {
                return;
            }
            let dataSets: JArrayList<ILineDataSet> = lineData.getDataSets();
            for (let i: number = 0; i < dataSets.size(); i++) {
                const dataSet: ILineDataSet = dataSets.get(i);
                if (!this.shouldDrawValues(dataSet) || dataSet.getEntryCount() < 1) {
                    continue;
                }
                // apply the text-styling defined by the DataSet
                this.applyValueTextStyle(dataSet);
                let trans: Transformer | null = this.mChart.getTransformer(dataSet.getAxisDependency());
                // make sure the values do not interfere with the circles
                let valOffset: number = dataSet.getCircleRadius() * 1.75;
                if (!dataSet.isDrawCirclesEnabled()) {
                    valOffset /= 2;
                }
                if (!this.mXBounds) {
                    continue;
                }
                this.mXBounds.set(this.mChart, dataSet);
                let positions: number[] = new Array<number>();
                if (trans) {
                    positions = trans.generateTransformedValuesLine(dataSet, this.mAnimator ? this.mAnimator.getPhaseX() : 1, this.mAnimator ? this.mAnimator.getPhaseY() : 1, this.mXBounds.min, this.mXBounds.max);
                }
                const iconsOffset: MPPointF = MPPointF.getInstance(undefined, undefined, dataSet.getIconsOffset());
                iconsOffset.x = Utils.handleDataValues(iconsOffset.x);
                iconsOffset.y = Utils.handleDataValues(iconsOffset.y);
                // 获取前一个数据集（用于计算当前层的实际值）
                const previousDataSet = i > 0 ? dataSets.get(i - 1) : null;
                for (let j: number = 0; j < positions.length; j += 2) {
                    const x: number = positions[j];
                    const y: number = positions[j + 1];
                    if (!this.mViewPortHandler || !this.mViewPortHandler.isInBoundsRight(x)) {
                        break;
                    }
                    if (!this.mViewPortHandler || !this.mViewPortHandler.isInBoundsLeft(x) ||
                        !this.mViewPortHandler.isInBoundsY(y)) {
                        continue;
                    }
                    const entry: EntryOhos = dataSet.getEntryForIndex(j / 2 + this.mXBounds.min);
                    // 计算当前层的实际值（累加值减去上一层的值）
                    let currentLayerValue: number = entry.getY();
                    if (previousDataSet) {
                        const previousEntry: EntryOhos | null = previousDataSet.getEntryForIndex(j / 2 + this.mXBounds.min);
                        if (previousEntry) {
                            currentLayerValue -= previousEntry.getY();
                        }
                    }
                    if (dataSet.isDrawValuesEnabled()) {
                        let valueFormatter: IValueFormatter | null = dataSet.getValueFormatter();
                        if (valueFormatter) {
                            this.drawValue(c, valueFormatter, currentLayerValue, entry, i, x, y - valOffset, dataSet.getValueTextColor(j / 2), isHorizontalFlip);
                        }
                    }
                    if (entry.getIcon() != null && dataSet.isDrawIconsEnabled()) {
                        let icon: ChartPixelMap | null = entry.getIcon();
                        if (!icon) {
                            return;
                        }
                        Utils.drawImage(c, icon, Math.floor(x + iconsOffset.x), Math.floor(y + iconsOffset.y), icon.getWidth(), icon.getHeight());
                    }
                }
                MPPointF.recycleInstance(iconsOffset);
            }
        }
    }
}
