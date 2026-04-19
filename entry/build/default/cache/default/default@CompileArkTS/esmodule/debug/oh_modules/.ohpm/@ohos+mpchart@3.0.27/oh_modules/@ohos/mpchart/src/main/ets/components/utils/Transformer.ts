import MPPointD from "@package:pkg_modules/.ohpm/@ohos+mpchart@3.0.27/pkg_modules/@ohos/mpchart/src/main/ets/components/utils/MPPointD";
import type ViewPortHandler from './ViewPortHandler';
import Matrix from "@package:pkg_modules/.ohpm/@ohos+mpchart@3.0.27/pkg_modules/@ohos/mpchart/src/main/ets/components/utils/Matrix";
import type IScatterDataSet from '../interfaces/datasets/IScatterDataSet';
import type Entry from '../data/EntryOhos';
import type EntryOhos from '../data/EntryOhos';
import type IBubbleDataSet from '../interfaces/datasets/IBubbleDataSet';
import type ILineDataSet from '../interfaces/datasets/ILineDataSet';
import type ICandleDataSet from '../interfaces/datasets/ICandleDataSet';
import type CandleEntry from '../data/CandleEntry';
import type MyRect from '../data/Rect';
import { DataSamplingUtils } from "@package:pkg_modules/.ohpm/@ohos+mpchart@3.0.27/pkg_modules/@ohos/mpchart/src/main/ets/components/utils/DataSamplingUtils";
import { JArrayList } from "@package:pkg_modules/.ohpm/@ohos+mpchart@3.0.27/pkg_modules/@ohos/mpchart/src/main/ets/components/utils/JArrayList";
import { LogUtil } from "@package:pkg_modules/.ohpm/@ohos+mpchart@3.0.27/pkg_modules/@ohos/mpchart/src/main/ets/components/utils/LogUtil";
/**
 * Transformer class that contains all matrices and is responsible for
 * transforming values into pixels on the screen and backwards.
 *
 *
 */
export default class Transformer {
    /**
     * matrix to map the values to the screen pixels
     */
    protected mMatrixValueToPx: Matrix = new Matrix();
    /**
     * matrix for handling the different offsets of the chart
     */
    protected mMatrixOffset: Matrix = new Matrix();
    protected mViewPortHandler: ViewPortHandler;
    protected matrix2D: Matrix2D = new Matrix2D();
    protected resultPath: Path2D = new Path2D();
    constructor(viewPortHandler: ViewPortHandler) {
        this.mViewPortHandler = viewPortHandler;
    }
    /**
     * Prepares the matrix that transforms values to pixels. Calculates the
     * scale factors from the charts size and offsets.
     *
     * @param xChartMin
     * @param deltaX
     * @param deltaY
     * @param yChartMin
     */
    public prepareMatrixValuePx(xChartMin: number, deltaX: number, deltaY: number, yChartMin: number) {
        let scaleX: number = this.mViewPortHandler.contentWidth() / deltaX;
        let scaleY: number = this.mViewPortHandler.contentHeight() / deltaY;
        if (scaleX === Number.MAX_VALUE) {
            scaleX = 0;
        }
        if (scaleY === Number.MAX_VALUE) {
            scaleY = 0;
        }
        // setup all matrices
        this.mMatrixValueToPx.reset();
        this.mMatrixValueToPx.postTranslate(-xChartMin, -yChartMin);
        this.mMatrixValueToPx.postScale(scaleX, -scaleY);
    }
    /**
     * Prepares the matrix that contains all offsets.
     *
     * @param inverted
     */
    public prepareMatrixOffset(inverted: boolean) {
        this.mMatrixOffset.reset();
        // offset.postTranslate(mOffsetLeft, getHeight() - mOffsetBottom);
        if (!inverted)
            this.mMatrixOffset.postTranslate(this.mViewPortHandler.offsetLeft(), this.mViewPortHandler.getChartHeight() - this.mViewPortHandler.offsetBottom());
        else {
            this.mMatrixOffset
                .setTranslate(this.mViewPortHandler.offsetLeft(), -this.mViewPortHandler.offsetTop());
            this.mMatrixOffset.postScale(1.0, -1.0);
        }
    }
    protected valuePointsForGenerateTransformedValuesScatter: number[] = new Array<number>(1);
    /**
     * Transforms an List of Entry into a float array containing the x and
     * y values transformed with all matrices for the SCATTERCHART.
     *
     * @param data
     * @return
     */
    public generateTransformedValuesScatter(data: IScatterDataSet, phaseX: number, phaseY: number, from: number, to: number): number[] {
        let count: number = Math.floor(((to - from) * phaseX + 1) * 2);
        // 限制数组最大长度，防止 RangeError
        if (count > Transformer.MAX_ARRAY_LENGTH) {
            const maxRange = Math.floor((Transformer.MAX_ARRAY_LENGTH / 2 - 1) / phaseX);
            to = Math.min(to, from + maxRange);
            count = Math.floor(((to - from) * phaseX + 1) * 2);
            if (count > Transformer.MAX_ARRAY_LENGTH) {
                count = Transformer.MAX_ARRAY_LENGTH;
            }
        }
        if (this.valuePointsForGenerateTransformedValuesScatter.length != count) {
            this.valuePointsForGenerateTransformedValuesScatter = new Array<number>(count);
        }
        let valuePoints: number[] = this.valuePointsForGenerateTransformedValuesScatter;
        for (let j = 0; j < count; j += 2) {
            let e: Entry | null = data.getEntryForIndex(j / 2 + from);
            if (e != null) {
                valuePoints[j] = e.getX();
                valuePoints[j + 1] = e.getY() * phaseY;
            }
            else {
                valuePoints[j] = 0;
                valuePoints[j + 1] = 0;
            }
        }
        this.getValueToPixelMatrix().mapPoints(valuePoints);
        return valuePoints;
    }
    protected valuePointsForGenerateTransformedValuesBubble: number[] = new Array<number>(1);
    /**
     * Transforms an List of Entry into a float array containing the x and
     * y values transformed with all matrices for the BUBBLECHART.
     *
     * @param data
     * @return
     */
    public generateTransformedValuesBubble(data: IBubbleDataSet, phaseY: number, from: number, to: number): number[] {
        let count = (to - from + 1) * 2; // (int) Math.ceil((to - from) * phaseX) * 2;
        // 限制数组最大长度，防止 RangeError
        if (count > Transformer.MAX_ARRAY_LENGTH) {
            const maxRange = Math.floor(Transformer.MAX_ARRAY_LENGTH / 2 - 1);
            to = Math.min(to, from + maxRange);
            count = (to - from + 1) * 2;
            if (count > Transformer.MAX_ARRAY_LENGTH) {
                count = Transformer.MAX_ARRAY_LENGTH;
            }
        }
        if (this.valuePointsForGenerateTransformedValuesBubble.length != count) {
            this.valuePointsForGenerateTransformedValuesBubble = new Array<number>(count);
        }
        let valuePoints: number[] = this.valuePointsForGenerateTransformedValuesBubble;
        for (let j = 0; j < count; j += 2) {
            let e: Entry | null = data.getEntryForIndex(j / 2 + from);
            if (e != null) {
                valuePoints[j] = e.getX();
                valuePoints[j + 1] = e.getY() * phaseY;
            }
            else {
                valuePoints[j] = 0;
                valuePoints[j + 1] = 0;
            }
        }
        this.getValueToPixelMatrix().mapPoints(valuePoints);
        return valuePoints;
    }
    protected valuePointsForGenerateTransformedValuesLine: number[] = new Array<number>(1);
    /**
     * 数组最大长度限制，防止 RangeError: Invalid array length
     * JavaScript/ArkTS 数组最大长度通常是 2^32-1，但为了性能和稳定性，限制为更小的值
     * 考虑到实际渲染性能和移动设备内存限制，设置为10万更安全
     * 每个点需要2个数字（x, y），所以10万长度可以表示5万个点
     */
    private static readonly MAX_ARRAY_LENGTH: number = 100000; // 最大数组长度：10万（可表示5万个点）
    /**
     * Transforms an List of Entry into a float array containing the x and
     * y values transformed with all matrices for the LINECHART.
     *
     * @param data
     * @return
     */
    public generateTransformedValuesLine(data: ILineDataSet, phaseX: number, phaseY: number, min: number, max: number): number[] {
        // 情况1：确保输入参数有效
        if (!isFinite(min) || !isFinite(max) || !isFinite(phaseX) || !isFinite(phaseY)) {
            return [];
        }
        // 情况2：限制 phaseX 的范围，防止过大导致计算溢出
        phaseX = Math.max(0, Math.min(phaseX, 10)); // 限制 phaseX 在 0-10 之间
        // 情况3：确保 min <= max
        if (min > max) {
            const temp = min;
            min = max;
            max = temp;
        }
        // 保存原始可见范围（不截断，避免数据断层）
        const originalMin = min;
        const originalMax = max;
        const originalRange = originalMax - originalMin;
        // 计算所需的数组长度
        let count: number = Math.floor((((max - min) * phaseX) + 1) * 2);
        // 情况4：检查 count 是否为有效数字
        if (!isFinite(count) || count < 0) {
            count = 0;
        }
        // 情况5：如果数组长度超过限制，使用采样而不是截断
        let needsSampling = false;
        let samplingStep = 1;
        if (count > Transformer.MAX_ARRAY_LENGTH) {
            needsSampling = true;
            // 计算采样步长：将数据采样到安全范围内
            const targetPointCount = Math.floor(Transformer.MAX_ARRAY_LENGTH / 2); // 目标点数
            samplingStep = Math.max(1, Math.floor(originalRange / targetPointCount));
            count = Math.min(Transformer.MAX_ARRAY_LENGTH, count);
        }
        // 情况7：最后一次检查，确保 count 是有效的正数
        if (!isFinite(count) || count < 0 || count > Transformer.MAX_ARRAY_LENGTH) {
            count = Math.min(Transformer.MAX_ARRAY_LENGTH, 1000); // 默认最多1000
        }
        // 情况8：确保 count 是整数
        count = Math.floor(count);
        if (count < 0) {
            count = 0;
        }
        try {
            if (this.valuePointsForGenerateTransformedValuesLine.length != count) {
                // 情况9：最后一次验证 count 的有效性
                if (count > Transformer.MAX_ARRAY_LENGTH || count < 0 || !isFinite(count)) {
                    count = Math.min(Transformer.MAX_ARRAY_LENGTH, 1000);
                }
                this.valuePointsForGenerateTransformedValuesLine = new Array<number>(count);
            }
        }
        catch (e) {
            // 情况10：如果创建数组失败，使用较小的默认值
            console.error(`[Transformer] Failed to create array with length ${count}, using default size. Error: ${e}`);
            count = Math.min(1000, Transformer.MAX_ARRAY_LENGTH);
            try {
                if (count < 0) {
                    LogUtil.log(`Transformer generateTransformedValuesLine count = ${count}`);
                    return [];
                }
                this.valuePointsForGenerateTransformedValuesLine = new Array<number>(count);
            }
            catch (e2) {
                // 如果还是失败，使用最小安全值
                this.valuePointsForGenerateTransformedValuesLine = new Array<number>(0);
                return [];
            }
        }
        let valuePoints: number[] = this.valuePointsForGenerateTransformedValuesLine;
        // 情况11：确保数组长度与 count 匹配
        if (valuePoints.length < count) {
            // 如果数组长度不够，重新创建
            try {
                valuePoints = new Array<number>(count);
                this.valuePointsForGenerateTransformedValuesLine = valuePoints;
            }
            catch (e) {
                console.error(`[Transformer] Failed to resize array to ${count}, using existing size ${valuePoints.length}`);
                count = Math.min(count, valuePoints.length);
            }
        }
        // 情况12：根据是否需要采样，采用不同的填充策略
        const safeCount = Math.min(count, valuePoints.length);
        if (needsSampling && samplingStep > 1) {
            // 采样模式：使用 Min-Max 采样算法，保留峰值和谷值，避免断层
            const targetPointCount = Math.floor(Transformer.MAX_ARRAY_LENGTH / 2);
            const actualRange = originalMax - originalMin;
            // 性能保护：如果可见范围太大，先使用粗采样减少数据量
            const maxCollectRange = targetPointCount * 10; // 最多收集 10 倍目标数量的数据
            let arrayIndex = 0;
            const maxArrayIndex = safeCount - 2;
            if (actualRange > maxCollectRange) {
                // 范围太大，先粗采样再精细采样
                const coarseStep = Math.max(1, Math.floor(actualRange / maxCollectRange));
                const visibleEntries = new JArrayList<EntryOhos>();
                try {
                    // 粗采样收集
                    for (let i = originalMin; i <= originalMax; i += coarseStep) {
                        const e = data.getEntryForIndex(i);
                        if (e != null) {
                            visibleEntries.add(e as EntryOhos);
                        }
                    }
                    // 确保最后一个点被包含
                    if (originalMax % coarseStep !== 0) {
                        const e = data.getEntryForIndex(originalMax);
                        if (e != null) {
                            visibleEntries.add(e as EntryOhos);
                        }
                    }
                }
                catch (err) {
                    // 收集失败，降级到简单采样
                }
                // 如果收集到的数据仍超过限制，使用 Min-Max 采样
                let sampledEntries: JArrayList<EntryOhos>;
                if (visibleEntries.size() > targetPointCount) {
                    sampledEntries = DataSamplingUtils.minMaxSampling(visibleEntries, targetPointCount);
                }
                else {
                    sampledEntries = visibleEntries;
                }
                // 转换为数组格式
                for (let i = 0; i < sampledEntries.size() && arrayIndex < maxArrayIndex; i++) {
                    if (arrayIndex + 1 >= valuePoints.length) {
                        break;
                    }
                    const e = sampledEntries.get(i);
                    if (e != null) {
                        valuePoints[arrayIndex] = e.getX();
                        valuePoints[arrayIndex + 1] = e.getY() * phaseY;
                        arrayIndex += 2;
                    }
                }
            }
            else {
                // 范围适中，直接收集所有可见点并使用 Min-Max 采样
                const visibleEntries = new JArrayList<EntryOhos>();
                try {
                    for (let i = originalMin; i <= originalMax; i++) {
                        const e = data.getEntryForIndex(i);
                        if (e != null) {
                            visibleEntries.add(e as EntryOhos);
                        }
                    }
                }
                catch (err) {
                    // 收集失败，降级到简单采样
                }
                // 如果收集到的数据超过限制，使用 Min-Max 采样
                let sampledEntries: JArrayList<EntryOhos>;
                if (visibleEntries.size() > targetPointCount) {
                    sampledEntries = DataSamplingUtils.minMaxSampling(visibleEntries, targetPointCount);
                }
                else {
                    sampledEntries = visibleEntries;
                }
                // 转换为数组格式
                for (let i = 0; i < sampledEntries.size() && arrayIndex < maxArrayIndex; i++) {
                    if (arrayIndex + 1 >= valuePoints.length) {
                        break;
                    }
                    const e = sampledEntries.get(i);
                    if (e != null) {
                        valuePoints[arrayIndex] = e.getX();
                        valuePoints[arrayIndex + 1] = e.getY() * phaseY;
                        arrayIndex += 2;
                    }
                }
            }
            // 更新实际使用的数组长度
            count = arrayIndex;
        }
        else {
            // 正常模式：顺序填充所有可见点
            for (let j = 0; j < safeCount; j += 2) {
                // 情况13：确保索引有效
                if (j + 1 >= valuePoints.length) {
                    break;
                }
                const entryIndex = Math.floor(j / 2) + originalMin;
                let e: Entry | null = null;
                try {
                    e = data.getEntryForIndex(entryIndex);
                }
                catch (err) {
                    // 如果获取 Entry 失败，跳过
                    valuePoints[j] = 0;
                    valuePoints[j + 1] = 0;
                    continue;
                }
                if (e != null) {
                    valuePoints[j] = e.getX();
                    valuePoints[j + 1] = e.getY() * phaseY;
                }
                else {
                    valuePoints[j] = 0;
                    valuePoints[j + 1] = 0;
                }
            }
        }
        this.getValueToPixelMatrix().mapPoints(valuePoints);
        return valuePoints;
    }
    protected valuePointsForGenerateTransformedValuesCandle: number[] = new Array<number>(1);
    /**
     * Transforms an List of Entry into a float array containing the x and
     * y values transformed with all matrices for the CANDLESTICKCHART.
     *
     * @param data
     * @return
     */
    public generateTransformedValuesCandle(data: ICandleDataSet, phaseX: number, phaseY: number, fromValue: number, toValue: number): number[] {
        let count: number = Math.floor(((toValue - fromValue) * phaseX + 1) * 2);
        // 限制数组最大长度，防止 RangeError
        if (count > Transformer.MAX_ARRAY_LENGTH) {
            const maxRange = Math.floor((Transformer.MAX_ARRAY_LENGTH / 2 - 1) / phaseX);
            toValue = Math.min(toValue, fromValue + maxRange);
            count = Math.floor(((toValue - fromValue) * phaseX + 1) * 2);
            if (count > Transformer.MAX_ARRAY_LENGTH) {
                count = Transformer.MAX_ARRAY_LENGTH;
            }
        }
        if (this.valuePointsForGenerateTransformedValuesCandle.length != count) {
            this.valuePointsForGenerateTransformedValuesCandle = new Array<number>(count);
        }
        let valuePoints: number[] = this.valuePointsForGenerateTransformedValuesCandle;
        for (let j = 0; j < count; j += 2) {
            let e: CandleEntry | null = data.getEntryForIndex(j / 2 + fromValue);
            if (e != null) {
                valuePoints[j] = e.getX();
                valuePoints[j + 1] = e.getHigh() * phaseY;
            }
            else {
                valuePoints[j] = 0;
                valuePoints[j + 1] = 0;
            }
        }
        this.getValueToPixelMatrix().mapPoints(valuePoints);
        return valuePoints;
    }
    /**
     * transform a path with all the given matrices VERY IMPORTANT: keep order
     * to value-touch-offset
     *
     * @param path
     */
    public pathValueToPixel(path: Path2D): Path2D {
        path = this.pathTransform(path, this.mMatrixValueToPx);
        path = this.pathTransform(path, this.mViewPortHandler.getMatrixTouch());
        path = this.pathTransform(path, this.mMatrixOffset);
        return path;
    }
    public pathTransform(path: Path2D, matrix: Matrix): Path2D {
        let values = matrix.getValues();
        this.matrix2D.scaleX = values[Matrix.MSCALE_X];
        this.matrix2D.scaleY = values[Matrix.MSCALE_Y];
        this.matrix2D.translateX = values[Matrix.MTRANS_X];
        this.matrix2D.translateY = values[Matrix.MTRANS_Y];
        this.matrix2D.rotateX = values[Matrix.MSKEW_X];
        this.matrix2D.rotateY = values[Matrix.MSKEW_Y];
        this.resultPath = new Path2D();
        this.resultPath.addPath(path, this.matrix2D);
        return this.resultPath;
    }
    /**
     * Transform an array of points with all matrices. VERY IMPORTANT: Keep
     * matrix order "value-touch-offset" when transforming.
     *
     * @param pts
     */
    public pointValuesToPixel(pts: number[]) {
        this.mMatrixValueToPx.mapPoints(pts);
        this.mViewPortHandler.getMatrixTouch().mapPoints(pts);
        this.mMatrixOffset.mapPoints(pts);
    }
    /**
     * Transform a rectangle with all matrices.
     *
     * @param r
     */
    public rectValueToPixel(r: MyRect) {
        this.mMatrixValueToPx.mapRect(r);
        this.mViewPortHandler.getMatrixTouch().mapRect(r);
        this.mMatrixOffset.mapRect(r);
    }
    /**
     * Transform a rectangle with all matrices with potential animation phases.
     *
     * @param r
     * @param phaseY
     */
    public rectToPixelPhase(r: MyRect, phaseY: number) {
        // multiply the height of the rect with the phase
        r.top *= phaseY;
        r.bottom *= phaseY;
        this.mMatrixValueToPx.mapRect(r);
        this.mViewPortHandler.getMatrixTouch().mapRect(r);
        this.mMatrixOffset.mapRect(r);
    }
    public rectToPixelPhaseHorizontal(r: MyRect, phaseY: number) {
        // multiply the height of the rect with the phase
        r.left *= phaseY;
        r.right *= phaseY;
        this.mMatrixValueToPx.mapRect(r);
        this.mViewPortHandler.getMatrixTouch().mapRect(r);
        this.mMatrixOffset.mapRect(r);
    }
    /**
     * Transform a rectangle with all matrices with potential animation phases.
     *
     * @param r
     */
    public rectValueToPixelHorizontal(r: MyRect, phaseY?: number) {
        if (phaseY != null && phaseY != undefined) {
            r.left *= phaseY;
            r.right *= phaseY;
        }
        this.mMatrixValueToPx.mapRect(r);
        this.mViewPortHandler.getMatrixTouch().mapRect(r);
        this.mMatrixOffset.mapRect(r);
    }
    /**
     * transforms multiple rects with all matrices
     *
     * @param rects
     */
    public rectValuesToPixel(rects: MyRect[]) {
        let m: Matrix = this.getValueToPixelMatrix();
        for (let i = 0; i < rects.length; i++) {
            m.mapRect(rects[i]);
        }
    }
    protected mPixelToValueMatrixBuffer: Matrix = new Matrix();
    /**
     * Transforms the given array of touch positions (pixels) (x, y, x, y, ...)
     * into values on the chart.
     *
     * @param pixels
     */
    public pixelsToValue(pixels: number[]) {
        let tmp: Matrix = this.mPixelToValueMatrixBuffer;
        tmp.reset();
        // invert all matrixes to convert back to the original value
        this.mMatrixOffset.invert(tmp);
        tmp.mapPoints(pixels);
        this.mViewPortHandler.getMatrixTouch().invert(tmp);
        tmp.mapPoints(pixels);
        this.mMatrixValueToPx.invert(tmp);
        tmp.mapPoints(pixels);
    }
    /**
     * buffer for performance
     */
    ptsBuffer: number[] = new Array<number>(2);
    /**
     * Returns a recyclable MPPointD instance.
     * returns the x and y values in the chart at the given touch point
     * (encapsulated in a MPPointD). This method transforms pixel coordinates to
     * coordinates / values in the chart. This is the opposite method to
     * getPixelForValues(...).
     *
     * @param x
     * @param y
     * @return
     */
    public getValuesByTouchPoint(x: number, y: number, outputPoint?: MPPointD): MPPointD {
        let result: MPPointD = (outputPoint != null && outputPoint != undefined) ? outputPoint : MPPointD.getInstance(0, 0);
        this.ptsBuffer[0] = x;
        this.ptsBuffer[1] = y;
        this.pixelsToValue(this.ptsBuffer);
        result.x = this.ptsBuffer[0];
        result.y = this.ptsBuffer[1];
        return result;
    }
    /**
     * Returns a recyclable MPPointD instance.
     * Returns the x and y coordinates (pixels) for a given x and y value in the chart.
     *
     * @param x
     * @param y
     * @return
     */
    public getPixelForValues(x: number, y: number): MPPointD {
        this.ptsBuffer[0] = x;
        this.ptsBuffer[1] = y;
        this.pointValuesToPixel(this.ptsBuffer);
        let xPx: number = this.ptsBuffer[0];
        let yPx: number = this.ptsBuffer[1];
        return MPPointD.getInstance(xPx, yPx);
    }
    public getValueMatrix(): Matrix {
        return this.mMatrixValueToPx;
    }
    public getOffsetMatrix(): Matrix {
        return this.mMatrixOffset;
    }
    private mMBuffer1: Matrix = new Matrix();
    public getValueToPixelMatrix(): Matrix {
        this.mMBuffer1.set(this.mMatrixValueToPx);
        this.mMBuffer1.postConcat(this.mViewPortHandler.mMatrixTouch);
        this.mMBuffer1.postConcat(this.mMatrixOffset);
        return this.mMBuffer1;
    }
    private mMBuffer2: Matrix = new Matrix();
    public getPixelToValueMatrix(): Matrix {
        this.getValueToPixelMatrix().invert(this.mMBuffer2);
        return this.mMBuffer2;
    }
}
