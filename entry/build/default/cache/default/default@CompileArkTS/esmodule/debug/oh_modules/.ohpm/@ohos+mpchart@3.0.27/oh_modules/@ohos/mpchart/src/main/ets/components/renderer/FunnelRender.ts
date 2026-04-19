import type FunnelData from "../data/FunnelData";
import Paint from "@package:pkg_modules/.ohpm/@ohos+mpchart@3.0.27/pkg_modules/@ohos/mpchart/src/main/ets/components/data/Paint";
import { DEFAULT_COLOR } from "@package:pkg_modules/.ohpm/@ohos+mpchart@3.0.27/pkg_modules/@ohos/mpchart/src/main/ets/components/interfaces/datasets/IFunnelDataSet";
import type { FunnelColorType, FunnelLabelData, FunnelLabelLineData, FunnelLabelPosition, FunnelOptionOrient, FunnelSeriesData, FunnelTitleData, FunnelDataItem, Point, DataItem, FunnelLegendType, LegendItem, LegendLine, LegendRect, RectInfo, Offset, FunnelAlign } from "@package:pkg_modules/.ohpm/@ohos+mpchart@3.0.27/pkg_modules/@ohos/mpchart/src/main/ets/components/interfaces/datasets/IFunnelDataSet";
import Utils from "@package:pkg_modules/.ohpm/@ohos+mpchart@3.0.27/pkg_modules/@ohos/mpchart/src/main/ets/components/utils/Utils";
import type ViewPortHandler from "../utils/ViewPortHandler";
import { LogUtil } from "@package:pkg_modules/.ohpm/@ohos+mpchart@3.0.27/pkg_modules/@ohos/mpchart/src/main/ets/components/utils/LogUtil";
import { MPChartTraceUtil } from "@package:pkg_modules/.ohpm/@ohos+mpchart@3.0.27/pkg_modules/@ohos/mpchart/src/main/ets/components/utils/MPChartTraceUtil";
import { TraceLogConstants } from "@package:pkg_modules/.ohpm/@ohos+mpchart@3.0.27/pkg_modules/@ohos/mpchart/src/main/ets/components/utils/TraceConfig";
const DEFAULT_OFFSET = 4;
export default class FunnelRender {
    protected mViewPortHandler: ViewPortHandler | null = null;
    private context2d: CanvasRenderingContext2D | null = null;
    private option: FunnelData | null = null;
    protected dataItemArea: DataItem[] = [];
    private cachedPaint: Paint | null = null;
    private cachedTextPaint: Paint | null = null;
    constructor(viewPortHandler: ViewPortHandler, context2d: CanvasRenderingContext2D) {
        this.mViewPortHandler = viewPortHandler;
        this.context2d = context2d;
        this.cachedPaint = new Paint();
        this.cachedTextPaint = new Paint();
    }
    public setOption(option: FunnelData) {
        this.option = option;
    }
    public setViewPortHandler(viewPortHandler: ViewPortHandler) {
        this.mViewPortHandler = viewPortHandler;
    }
    public draw() {
        if (!this.context2d || !this.option || !this.mViewPortHandler) {
            return;
        }
        this.dataItemArea = [];
        this.drawTitle();
        this.drawLegend();
        this.drawData();
    }
    private drawData() {
        const series = this.option?.getSeries();
        if (!this.mViewPortHandler || !series?.length) {
            return;
        }
        const rectWidth = this.mViewPortHandler.getChartWidth();
        const rectHeight = this.mViewPortHandler.getChartHeight();
        for (let i = 0; i < series.length; i++) {
            const seriesOption = series[i];
            this.drawDataSet(seriesOption, rectWidth, rectHeight);
        }
    }
    private calculateDimension(size: string | number | undefined, totalSize: number): number {
        if (!size) {
            return 0;
        }
        return typeof size === 'string' ? Utils.getActualLength(size, totalSize) : size;
    }
    private calcChartItemSize(seriesOption: FunnelSeriesData, rectWidth: number, rectHeight: number): RectInfo {
        const width = this.calculateDimension(seriesOption.width, rectWidth);
        const height = this.calculateDimension(seriesOption.height, rectHeight);
        const offsetX = this.calculateOffsets(seriesOption.left, seriesOption.right, rectWidth, width);
        const offsetY = this.calculateOffsets(seriesOption.top, seriesOption.bottom, rectHeight, height);
        // 最终尺寸确定
        return {
            left: Math.min(offsetX[0], offsetX[1]),
            top: Math.min(offsetY[0], offsetY[1]),
            width: width || Math.abs(offsetX[1] - offsetX[0]),
            height: height || Math.abs(offsetY[1] - offsetY[0])
        };
    }
    private calculateStringOffset(value: string, totalSize: number, size: number, isEnd: boolean): number {
        switch (value) {
            case 'left':
            case 'top':
                return isEnd ? totalSize : 0;
            case 'center':
                return isEnd ? (totalSize + size) * 0.5 : (totalSize - size) * 0.5;
            case 'right':
            case 'bottom':
                return isEnd ? 0 : (totalSize - size);
            default:
                const length = Utils.getActualLength(value, totalSize);
                return isEnd ? (totalSize - length) : length;
        }
    }
    private calculateOffset(value: string | number | undefined, totalSize: number, size: number, isEnd: boolean): number {
        if (typeof value === 'string') {
            return this.calculateStringOffset(value, totalSize, size, isEnd);
        }
        return isEnd ? (totalSize - (value || 0)) : (value || 0);
    }
    private calculateOffsets(start: string | number | undefined, end: string | number | undefined, totalSize: number, size: number): [
        number,
        number
    ] {
        const startOffset = this.calculateOffset(start, totalSize, size, false);
        const endOffset = this.calculateOffset(end, totalSize, size, true);
        return [startOffset, endOffset];
    }
    private getDataSetItemRect(align: FunnelAlign, value: number, itemHeight: number, length: number, rect: RectInfo, gap: number, i: number): RectInfo {
        const itemWidth = (value / length) * rect.width;
        let leftOffset = 0;
        const topOffset = rect.top + itemHeight * i + gap;
        switch (align) {
            case 'left':
                leftOffset = rect.left;
                break;
            case 'right':
                leftOffset = rect.left + rect.width - itemWidth;
                break;
            default:
                leftOffset = rect.left + (rect.width - itemWidth) / 2;
                break;
        }
        return {
            width: itemWidth,
            height: itemHeight,
            left: leftOffset,
            top: topOffset
        };
    }
    private drawDataSet(seriesOption: FunnelSeriesData, rectWidth: number, rectHeight: number) {
        if (!this.option || !seriesOption.data.length) {
            return;
        }
        try {
            LogUtil.log("FunnelRenderer drawDataSet - start");
            MPChartTraceUtil.startInfo(TraceLogConstants.Tag.FunnelChartSetData);
            const rect = this.calcChartItemSize(seriesOption, rectWidth, rectHeight);
            const seriesData = this.option.sortSeriesData(seriesOption.data, seriesOption.sort);
            const dataLength = this.option.getSeriesDataLength(seriesData);
            const itemHeight = (rect.height - seriesOption.gap * (seriesData.length - 1)) / seriesData.length;
            const isAscending = seriesOption.sort === 'ascending';
            const gapMultiplier = seriesOption.gap;
            const align = seriesOption.funnelAlign;
            for (let i = 0; i < seriesData.length; i++) {
                const item = seriesData[i];
                const curIndex = isAscending ? i + 1 : i;
                const itemRect = this.getDataSetItemRect(align, item.value, itemHeight, dataLength, rect, gapMultiplier * i, curIndex);
                const nextIndex = isAscending ? i - 1 : i + 1;
                const nextItem = seriesData[nextIndex];
                const isNoneItem = (!isAscending && i === seriesData.length - 1) || (isAscending && i === 0);
                const nextItemValue = isNoneItem ? 0 : nextItem.value;
                const realNextIndex = isAscending ? nextIndex + 1 : nextIndex;
                const nextItemRect = this.getDataSetItemRect(align, nextItemValue, itemHeight, dataLength, rect, gapMultiplier * i, realNextIndex);
                const color = item.color || DEFAULT_COLOR[i % DEFAULT_COLOR.length];
                this.drawValue(this.getPoints(itemRect, nextItemRect), color, true);
                this.drawLabel(seriesOption.label, itemRect, nextItemRect, item.name);
                this.setDataItemArea('series', seriesOption.name, item, itemRect, nextItemRect);
                LogUtil.info('FunnelRenderer drawDataSet succeed ' + `data:${JSON.stringify(seriesOption.data)}`);
                LogUtil.log("FunnelRenderer drawDataSet - end");
            }
        }
        catch (e) {
            LogUtil.error("FunnelRenderer drawDataSet - err", e);
            MPChartTraceUtil.startError(TraceLogConstants.Tag.FunnelChartSetData);
        }
        finally {
            MPChartTraceUtil.finish(TraceLogConstants.Tag.FunnelChartSetData);
        }
    }
    private drawValue(points: [
        Point,
        Point,
        Point,
        Point
    ], backgroundColor: FunnelColorType, isFill: boolean) {
        if (!this.context2d) {
            return;
        }
        this.context2d.lineWidth = 3;
        this.context2d.beginPath();
        this.context2d.moveTo(points[0].x, points[0].y);
        this.context2d.lineTo(points[1].x, points[1].y);
        this.context2d.lineTo(points[2].x, points[2].y);
        this.context2d.lineTo(points[3].x, points[3].y);
        this.context2d.closePath();
        if (isFill) {
            this.context2d.fillStyle = backgroundColor;
            this.context2d.fill();
        }
        else {
            this.context2d.strokeStyle = backgroundColor;
            this.context2d.stroke();
        }
    }
    private drawLabel(label: FunnelLabelData, itemRect: RectInfo, nextItemRect: RectInfo, text: string) {
        if (!label.show) {
            return;
        }
        const labelPosition = this.calcLabelOffset(label.position, itemRect, nextItemRect);
        let unit = 1;
        let offsetUnit: number = 0;
        switch (label.position) {
            case 'outside':
            case 'outsideRight':
                unit = 1;
                offsetUnit = 0;
                break;
            case 'outsideLeft':
                unit = -1;
                offsetUnit = 1;
                break;
            case 'inside':
                unit = 0;
                offsetUnit = 0.5;
                break;
            case 'insideLeft':
                unit = 0;
                offsetUnit = 0;
                break;
            case 'insideRight':
                unit = 0;
                offsetUnit = -1;
                break;
        }
        this.drawLabelLine(labelPosition[0], labelPosition[1], unit, label.line);
        this.drawLabelText(labelPosition[0] + unit * label.line.length, labelPosition[1], offsetUnit, text, label.textFont, label.textColor);
    }
    private drawLabelLine(left: number, top: number, unit: number, labelLine: FunnelLabelLineData) {
        if (!labelLine.show || !this.context2d || !unit) {
            return;
        }
        this.context2d.lineWidth = labelLine.width;
        this.context2d.beginPath();
        this.context2d.moveTo(left, top);
        this.context2d.lineTo(left + labelLine.length * unit, top);
        this.context2d.stroke();
    }
    private drawLabelText(left: number, top: number, offsetUnit: number, text: string, fontSize: number, fontColor: FunnelColorType) {
        if (!this.context2d) {
            return;
        }
        if (offsetUnit) {
            const paint = new Paint();
            paint.setTextSize(fontSize, 'vp');
            const textWidth = Utils.calcTextWidth(paint, text);
            left -= offsetUnit * textWidth;
        }
        this.drawText(text, fontSize, fontColor, left, top, 'normal', 'middle');
    }
    private calcLabelOffset(position: FunnelLabelPosition, itemRect: RectInfo, nextItemRect: RectInfo): [
        number,
        number
    ] {
        const itemRight = itemRect.left + itemRect.width;
        const nextItemRectRight = nextItemRect.left + nextItemRect.width;
        const height = Math.abs(itemRect.top - nextItemRect.top);
        const minTop = Math.min(itemRect.top, nextItemRect.top);
        const minLeft = Math.min(itemRect.left, nextItemRect.left);
        const minRight = Math.min(itemRight, nextItemRectRight);
        let left = 0;
        let top = 0;
        switch (position) {
            case 'outside':
            case 'outsideRight':
            case 'insideRight':
                left = Math.abs(itemRight - nextItemRectRight) / 2 + minRight;
                break;
            case 'insideLeft':
            case 'outsideLeft':
                left = Math.abs(itemRect.left - nextItemRect.left) / 2 + minLeft;
                break;
            case 'inside':
                left = itemRect.left + itemRect.width / 2;
                break;
        }
        top = height / 2 + minTop;
        return [left, top];
    }
    private getPoints(itemRect: RectInfo, nextItemRect: RectInfo): [
        Point,
        Point,
        Point,
        Point
    ] {
        const startLeft: Point = { x: itemRect.left, y: itemRect.top };
        const startRight: Point = { x: itemRect.left + itemRect.width, y: itemRect.top };
        const endRight: Point = { x: nextItemRect.left + nextItemRect.width, y: nextItemRect.top };
        const endLeft: Point = { x: nextItemRect.left, y: nextItemRect.top };
        return [startLeft, startRight, endRight, endLeft];
    }
    private setDataItemArea(type: string, title: string, item: FunnelDataItem, itemRect: RectInfo, nextItemRect: RectInfo) {
        this.dataItemArea.push({
            type,
            title,
            data: item,
            Points: this.getPoints(itemRect, nextItemRect)
        });
    }
    public getDataItemArea() {
        return this.dataItemArea;
    }
    private getPointsBySize(left: number, top: number, width: number, height: number): [
        Point,
        Point,
        Point,
        Point
    ] {
        const startLeft: Point = { x: left, y: top };
        const startRight: Point = { x: left + width, y: top };
        const endRight: Point = { x: left + width, y: top + height };
        const endLeft: Point = { x: left, y: top + height };
        return [startLeft, startRight, endRight, endLeft];
    }
    public drawTitle() {
        const titleOption: FunnelTitleData | undefined = this.option?.getTitle();
        if (!titleOption || !titleOption.show || !this.mViewPortHandler || (!titleOption.text && !titleOption.subtext)) {
            return;
        }
        try {
            LogUtil.log("FunnelRenderer drawTitle - start");
            const rectWidth = this.mViewPortHandler.getChartWidth();
            const rectHeight = this.mViewPortHandler.getChartHeight();
            const paint = this.cachedPaint || new Paint();
            let titleRect: RectInfo = {
                left: 0,
                top: 0,
                width: 0,
                height: 0
            };
            let textOffset: Offset = { left: 0, top: 0 };
            let subtextOffset: Offset = { left: 0, top: 0 };
            if (titleOption.text) {
                paint.setTextSize(titleOption.textFont, 'vp');
                paint.setFontWeight('bold');
                const textWidth = Utils.calcTextWidth(paint, titleOption.text);
                const textHeight = Utils.calcTextHeight(paint, titleOption.text);
                titleRect.width = textWidth;
                titleRect.height = textHeight + titleOption.itemGap;
                textOffset.left = this.getPosition(titleOption.left, textWidth, rectWidth);
                textOffset.top = this.getPosition(titleOption.top, textHeight, rectHeight);
                titleRect.left = textOffset.left;
                titleRect.top = textOffset.top;
                this.dataItemArea.push({
                    type: 'title',
                    title: titleOption.text,
                    Points: this.getPointsBySize(textOffset.left, textOffset.top, textWidth, titleRect.height)
                });
            }
            if (titleOption.subtext) {
                paint.setTextSize(titleOption.subtextFont, 'vp');
                paint.setFontWeight('normal');
                const subtextWidth = Utils.calcTextWidth(paint, titleOption.subtext);
                const subtextHeight = Utils.calcTextHeight(paint, titleOption.subtext);
                subtextOffset.left = this.getPosition(titleOption.left, subtextWidth, rectWidth);
                subtextOffset.top = textOffset.top + titleRect.height;
                titleRect.top = Math.min(titleRect.top, subtextOffset.top);
                titleRect.width = Math.max(titleRect.width, subtextWidth);
                titleRect.left = Math.min(titleRect.left, subtextOffset.left);
                titleRect.height += subtextHeight;
                this.dataItemArea.push({
                    type: 'title',
                    title: titleOption.text,
                    Points: this.getPointsBySize(subtextOffset.left, subtextOffset.top, subtextWidth, subtextHeight)
                });
            }
            this.drawRect(titleRect.left, titleRect.top, titleRect.width, titleRect.height, titleOption.backgroundColor);
            if (titleOption.text) {
                this.drawText(titleOption.text, titleOption.textFont, titleOption.textColor, textOffset.left, textOffset.top, 'bold');
            }
            if (titleOption.subtext) {
                this.drawText(titleOption.subtext, titleOption.subtextFont, titleOption.subtextColor, subtextOffset.left, subtextOffset.top);
            }
            LogUtil.info('FunnelRenderer drawTitle succeed ' + `title:${JSON.stringify(titleOption.text)}`);
            LogUtil.log("FunnelRenderer drawTitle - end");
        }
        catch (e) {
            LogUtil.error('FunnelRenderer drawTitle error', e);
        }
    }
    private drawShape(type: 'rect' | 'roundRect' | 'circle' | 'line', left: number, top: number, width: number, height: number, backgroundColor: string | number | CanvasGradient | CanvasPattern = 'rgba(0,0,0,0)', radius: number = 0, lineWidth: number = 1, strokeStyle: string | number | CanvasGradient | CanvasPattern = '#000000') {
        if (!this.context2d) {
            return;
        }
        this.context2d.save();
        this.context2d.fillStyle = backgroundColor;
        if (type === 'rect') {
            this.context2d.fillRect(left, top, width, height);
        }
        else if (type === 'roundRect') {
            this.context2d.lineWidth = lineWidth;
            this.context2d.strokeStyle = strokeStyle;
            this.context2d.beginPath();
            this.context2d.moveTo(left + radius, top);
            this.context2d.lineTo(left + width - radius, top);
            this.context2d.arcTo(left + width, top, left + width, top + radius, radius);
            this.context2d.lineTo(left + width, top + height - radius);
            this.context2d.arcTo(left + width, top + height, left + width - radius, top + height, radius);
            this.context2d.lineTo(left + radius, top + height);
            this.context2d.arcTo(left, top + height, left, top + height - radius, radius);
            this.context2d.lineTo(left, top + radius);
            this.context2d.arcTo(left, top, left + radius, top, radius);
            this.context2d.closePath();
            this.context2d.stroke();
            this.context2d.fill();
        }
        else if (type === 'circle') {
            this.context2d.beginPath();
            this.context2d.arc(left + radius, top + radius, radius, 0, Math.PI * 2);
            this.context2d.fill();
        }
        else if (type === 'line') {
            this.context2d.beginPath();
            this.context2d.strokeStyle = backgroundColor;
            this.context2d.moveTo(left, top + height / 2);
            this.context2d.lineTo(left + width, top + height / 2);
            this.context2d.stroke();
        }
        this.context2d.restore();
    }
    private drawRect(left: number, top: number, width: number, height: number, backgroundColor: string | number | CanvasGradient | CanvasPattern = 'rgba(0,0,0,0)') {
        this.drawShape('rect', left, top, width, height, backgroundColor);
    }
    private drawRoundRect(left: number, top: number, width: number, height: number, backgroundColor: string | number | CanvasGradient | CanvasPattern = 'rgba(0,0,0,0)', radius: number = 0, lineWidth: number = 1, strokeStyle: string | number | CanvasGradient | CanvasPattern = '#000000') {
        this.drawShape('roundRect', left, top, width, height, backgroundColor, radius, lineWidth, strokeStyle);
    }
    private drawCircle(left: number, top: number, radius: number, backgroundColor: string | number | CanvasGradient | CanvasPattern = 'rgba(0,0,0,0)') {
        this.drawShape('circle', left, top, radius * 2, radius * 2, backgroundColor, radius);
    }
    private drawLine(left: number, top: number, width: number, height: number, backgroundColor: string | number | CanvasGradient | CanvasPattern = 'rgba(0,0,0,0)') {
        this.drawShape('line', left, top, width, height, backgroundColor);
    }
    private drawText(text: string, fontSize: number, fontColor: string | number | CanvasGradient | CanvasPattern, left: number, top: number, fontWeight: string | number = 'normal', textBaseline: CanvasTextBaseline = 'top') {
        if (!this.context2d) {
            return;
        }
        this.context2d.save();
        this.context2d.fillStyle = fontColor;
        this.context2d.textAlign = 'left';
        this.context2d.textBaseline = textBaseline;
        this.context2d.font = `${fontWeight} ${fontSize}vp sans-serif`;
        this.context2d.fillText(text, left, top);
        this.context2d.restore();
    }
    private getSize(size: string | number, rectLength: number) {
        if (typeof size === 'string') {
            return Utils.getActualLength(size, rectLength);
        }
        else {
            return size || 0;
        }
    }
    private getPosition(position: string | number, textLength: number, rectLength: number): number {
        let offset = 0;
        if (typeof position === 'string') {
            if (position === 'top' || position === 'center' || position === 'bottom' || position === 'left' ||
                position === 'right') {
                switch (position) {
                    case 'left':
                    case 'top':
                        offset = 0;
                        break;
                    case 'center':
                        offset = (rectLength - textLength) / 2;
                        break;
                    case 'right':
                    case 'bottom':
                        offset = rectLength - textLength;
                        break;
                }
            }
            else {
                offset = Utils.getActualLength(position, rectLength);
            }
        }
        else if (position) {
            offset = position;
        }
        return offset;
    }
    public drawLegend() {
        const legendOption = this.option?.getLegend();
        if (!legendOption || !legendOption.show || !this.mViewPortHandler || !legendOption.data?.length) {
            return;
        }
        try {
            LogUtil.log("FunnelRenderer drawLegend - start");
            MPChartTraceUtil.startInfo(TraceLogConstants.Tag.renderLegend);
            const rectWidth = this.mViewPortHandler.getChartWidth();
            const rectHeight = this.mViewPortHandler.getChartHeight();
            const layout = this.calculateLegendLayout(legendOption.data, legendOption.textFont, legendOption.orient, legendOption.itemWidth, legendOption.itemHeight, legendOption.gap, legendOption.itemGap, rectWidth, rectHeight);
            const leftOffset = this.getPosition(legendOption.left, layout.width, rectWidth);
            const topOffset = this.getPosition(legendOption.top, layout.height, rectHeight);
            this.drawRect(leftOffset, topOffset, layout.width, layout.height, legendOption.backgroundColor);
            this.drawLegendItems(layout.lines, legendOption.orient === 'horizontal', leftOffset, topOffset, legendOption.textFont, legendOption.textColor, legendOption.itemType);
            LogUtil.info('FunnelRenderer drawLegend succeed ' + `legend:${JSON.stringify(legendOption.data)}`);
            LogUtil.log("FunnelRenderer drawLegend - end");
        }
        catch (e) {
            LogUtil.error('FunnelRenderer drawLegend error', e);
            MPChartTraceUtil.startError(TraceLogConstants.Tag.renderLegend);
        }
        finally {
            MPChartTraceUtil.finish(TraceLogConstants.Tag.renderLegend);
        }
    }
    private drawLegendItems(lines: LegendLine[], isHorizontal: boolean, leftOffset: number, topOffset: number, textFont: number, textColor: string | number | CanvasGradient | CanvasPattern, itemType: FunnelLegendType) {
        for (let i = 0; i < lines.length; i++) {
            const line = lines[i];
            const perLength = lines[i - 1]?.maxCrossSize || 0;
            const baseX = leftOffset + (isHorizontal ? 0 : perLength);
            const baseY = topOffset + (isHorizontal ? perLength : 0);
            this.drawLegendLineItems(line.items, baseX, baseY, textFont, textColor, isHorizontal, itemType);
        }
    }
    private drawLegendLineItems(items: LegendItem[], baseX: number, baseY: number, textFont: number, textColor: string | number | CanvasGradient | CanvasPattern, isHorizontal: boolean, itemType: FunnelLegendType) {
        let itemOffset = 0;
        for (const item of items) {
            const x = baseX + (isHorizontal ? itemOffset : 0);
            const y = baseY + (isHorizontal ? 0 : itemOffset);
            this.drawLegendIcon(x, y, item.itemWidth, item.itemHeight, itemType, this.option?.getLegendColor(item.text));
            this.drawText(item.text, textFont, textColor, x + item.itemWidth + item.itemGap, y);
            itemOffset += item.length;
            this.dataItemArea.push({
                type: 'legend',
                title: item.text,
                Points: this.getPointsBySize(x + item.itemWidth + item.itemGap, y, item.textWidth, item.textHeight)
            });
        }
    }
    private drawLegendIcon(left: number, top: number, width: number, height: number, itemType: FunnelLegendType, backgroundColor: string | number | CanvasGradient | CanvasPattern = 'rgba(0,0,0,0)') {
        switch (itemType) {
            case 'SQUARE':
            case 'DEFAULT':
                this.drawRect(left, top, width, height, backgroundColor);
                break;
            case 'CIRCLE':
                const radius = Math.min(width, height) / 2;
                const realLeft = left + width - radius * 2;
                this.drawCircle(realLeft, top, radius, backgroundColor);
                break;
            case 'LINE':
                this.drawLine(left, top, width, height, backgroundColor);
                break;
            case 'EMPTY':
                break;
        }
    }
    private calculateLegendLayout(legendOptionData: string[], textFont: number, orient: FunnelOptionOrient, itemWidth: number, itemHeight: number, gap: number, itemGap: number, rectWidth: number, rectHeight: number): LegendRect {
        const paint = new Paint();
        paint.setTextSize(textFont, 'vp');
        const legendLines: LegendLine[] = [];
        let currentLine: LegendLine = { items: [], length: 0, maxCrossSize: 0 };
        let mainAxisSize = 0;
        let crossAxisSize = 0;
        const isHorizontal = orient === 'horizontal';
        gap = gap ?? 0;
        for (let i = 0; i < legendOptionData.length; i++) {
            const text = legendOptionData[i];
            const textWidth = Utils.calcTextWidth(paint, text);
            const textHeight = Utils.calcTextHeight(paint, text);
            const itemMainSize = (isHorizontal ? textWidth + itemGap : textHeight) + gap;
            const itemCrossSize = isHorizontal ? (itemHeight + textHeight) : (itemWidth + textWidth + itemGap);
            const length = isHorizontal ? itemWidth + itemMainSize : Math.max(itemMainSize, itemHeight);
            const rectLength = orient === 'horizontal' ? rectWidth : rectHeight;
            if (currentLine.length + length > rectLength) {
                legendLines.push(currentLine);
                mainAxisSize = Math.max(mainAxisSize, currentLine.length);
                crossAxisSize += currentLine.maxCrossSize;
                currentLine = { items: [], length: 0, maxCrossSize: 0 };
            }
            currentLine.items.push({
                text,
                length,
                itemWidth,
                itemHeight,
                textWidth,
                textHeight,
                itemGap
            });
            currentLine.length += length;
            currentLine.maxCrossSize = Math.max(currentLine.maxCrossSize, itemCrossSize);
        }
        if (currentLine.items.length > 0) {
            legendLines.push(currentLine);
            mainAxisSize = Math.max(mainAxisSize, currentLine.length);
            crossAxisSize += currentLine.maxCrossSize;
        }
        return {
            width: isHorizontal ? mainAxisSize : crossAxisSize,
            height: isHorizontal ? crossAxisSize : mainAxisSize,
            lines: legendLines
        };
    }
    public drawTooltip(dataItem: DataItem, position: Point) {
        if (!this.option || !this.option.isShowTooltip() || !dataItem.data) {
            return;
        }
        const tooltipOption = this.option.getTooltip();
        const textList = this.option.getTooltipTextList(dataItem.title, dataItem.data);
        const maxText = textList.reduce((prev, current) => prev.length > current.length ? prev : current);
        // Use cached paint to avoid repeated object creation
        const paint = this.cachedPaint || new Paint();
        paint.setTextSize(tooltipOption.textFont, 'vp');
        const textWidth = Utils.calcTextWidth(paint, maxText);
        const textHeight = Utils.calcTextHeight(paint, maxText);
        const rectWidth = textWidth + DEFAULT_OFFSET * 2;
        const rectHeight = textHeight * textList.length + DEFAULT_OFFSET * 2;
        this.drawRoundRect(position.x, position.y, rectWidth, rectHeight, tooltipOption.backgroundColor, tooltipOption.borderRadius, tooltipOption.borderWidth, tooltipOption.borderColor);
        const textBaseX = position.x + DEFAULT_OFFSET;
        const textBaseY = position.y + DEFAULT_OFFSET;
        for (let i = 0; i < textList.length; i++) {
            const text = textList[i];
            this.drawText(text, tooltipOption.textFont, tooltipOption.textColor, textBaseX, textBaseY + textHeight * i);
        }
    }
    public drawAccessibleReadingLine(dataItem: DataItem) {
        this.drawValue(dataItem.Points, '#6bc843', false);
    }
    public clearCanvas() {
        if (!this.context2d) {
            return;
        }
        const rectWidth = this.mViewPortHandler?.getChartWidth() || 0;
        const rectHeight = this.mViewPortHandler?.getChartHeight() || 0;
        this.context2d.clearRect(0, 0, rectWidth, rectHeight);
    }
}
