import FunnelData from "@package:pkg_modules/.ohpm/@ohos+mpchart@3.0.27/pkg_modules/@ohos/mpchart/src/main/ets/components/data/FunnelData";
import type { FunnelOption, Point } from '../interfaces/datasets/IFunnelDataSet';
import ViewPortHandler from "@package:pkg_modules/.ohpm/@ohos+mpchart@3.0.27/pkg_modules/@ohos/mpchart/src/main/ets/components/utils/ViewPortHandler";
import FunnelRender from "@package:pkg_modules/.ohpm/@ohos+mpchart@3.0.27/pkg_modules/@ohos/mpchart/src/main/ets/components/renderer/FunnelRender";
const DEFAULT_OFFSET = 10;
export default class FunnelChartModel {
    private context2d: CanvasRenderingContext2D | null = null;
    private option: FunnelData = new FunnelData();
    protected mViewPortHandler: ViewPortHandler = new ViewPortHandler();
    protected render: FunnelRender | null = null;
    protected tooltipIsShow: boolean = false;
    protected drawTimer: number | null = null;
    protected readChartText: string = '';
    protected readOtherText: string = '';
    public setContext2D(context2d: CanvasRenderingContext2D) {
        this.context2d = context2d;
    }
    public getContext2D() {
        return this.context2d;
    }
    public setOption(funnelOption: FunnelOption) {
        this.option.merge(funnelOption);
    }
    public getOption() {
        return this.option;
    }
    public setReadChartText(readChartText: string) {
        this.readChartText = readChartText;
    }
    public getReadChartText(): string {
        return this.readChartText;
    }
    public setReadOtherText(readOtherText: string) {
        this.readOtherText = readOtherText;
    }
    public getReadOtherText(): string {
        return this.readOtherText;
    }
    public invalidate() {
        this.onDraw();
    }
    public onDraw() {
        if (!this.context2d) {
            return;
        }
        if (!this.render) {
            this.render = new FunnelRender(this.mViewPortHandler, this.context2d);
        }
        this.render.clearCanvas();
        this.render.setOption(this.option);
        this.render?.draw();
    }
    public onChartSizeChanged(newWidth: number, newHeight: number) {
        if (newWidth > 0 && newHeight > 0 && newWidth < 10000 && newHeight < 10000) {
            this.mViewPortHandler.setChartDimens(newWidth, newHeight);
            this.render?.setViewPortHandler(this.mViewPortHandler);
            this.onDraw();
        }
    }
    public notifyDataSetChanged(width: number, height: number): void {
        this.onChartSizeChanged(width, height);
    }
    public accessibleReading(point: Point) {
        if (!this.render) {
            return;
        }
        let selectItem = this.getSelectItem(point, false);
        if (selectItem) {
            this.render.clearCanvas();
            this.render.draw();
            this.render.drawAccessibleReadingLine(selectItem);
        }
        return selectItem;
    }
    public onTouchEvent(event: TouchEvent) {
        if (this.drawTimer) {
            clearTimeout(this.drawTimer);
        }
        this.drawTimer = setTimeout(() => {
            if (!this.render || !this.option.isShowTooltip()) {
                return;
            }
            const isClick = this.option.getTooltipTriggerOn() === 'click';
            if ((event.type === TouchType.Move && !isClick) || (event.type === TouchType.Up && isClick)) {
                const eventPoint = event.touches[0];
                const point: Point = { x: eventPoint.x, y: eventPoint.y };
                let selectItem = this.getSelectItem(point, true);
                if (selectItem) {
                    this.render.clearCanvas();
                    this.render.draw();
                    this.render.drawTooltip(selectItem, point);
                    this.tooltipIsShow = true;
                }
                else {
                    this.render.clearCanvas();
                    this.render.draw();
                    this.tooltipIsShow = false;
                }
            }
            if (event.type === TouchType.Up && !isClick && this.tooltipIsShow) {
                this.render.clearCanvas();
                this.render.draw();
                this.tooltipIsShow = false;
            }
            this.drawTimer = null;
        }, 16);
    }
    private getSelectItem(p: Point, isSeries: boolean) {
        if (!this.render) {
            return null;
        }
        const dataItemArea = this.render.getDataItemArea();
        for (let i = 0; i < dataItemArea.length; i++) {
            const item = dataItemArea[i];
            if (this.isPointInPolygon(p, item.Points) && (!isSeries || item.type === 'series')) {
                return item;
            }
        }
        return null;
    }
    private isPointInPolygon(point: Point, polygon: Point[]) {
        let inside = false;
        for (let i = 0, j = polygon.length - 1; i < polygon.length; j = i++) {
            const xi = polygon[i].x;
            const yi = polygon[i].y;
            const xj = polygon[j].x;
            const yj = polygon[j].y;
            const intersect = ((yi > point.y) !== (yj > point.y)) &&
                (point.x < (xj - xi) * (point.y - yi) / (yj - yi) + xi);
            if (intersect) {
                inside = !inside;
            }
        }
        return inside;
    }
}
