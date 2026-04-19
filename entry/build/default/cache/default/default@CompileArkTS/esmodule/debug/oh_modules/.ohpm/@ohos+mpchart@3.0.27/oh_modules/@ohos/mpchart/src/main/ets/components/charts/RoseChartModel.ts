import RoseChartRender from "@package:pkg_modules/.ohpm/@ohos+mpchart@3.0.27/pkg_modules/@ohos/mpchart/src/main/ets/components/renderer/RoseChartRender";
import type { LabelInfo, RoseData, SectorData, TitleStyle } from '../data/RoseData';
export default class RoseChartModel {
    private context: CanvasRenderingContext2D | null = null;
    private mCenterX: number = 0;
    private mCenterY: number = 0;
    private mInnerRadius: number = 30;
    private mMaxLength: number = 0;
    private mRenderer: RoseChartRender | null = null;
    private mRoseData: SectorData[] = [];
    private mTitle: string = '';
    private mTitleStyles: TitleStyle = {};
    private mShowDataView: boolean = false;
    private mShowValue: boolean = false;
    private mViewMode: 'radius' | 'area' = 'radius';
    private mCenterOptionX: number | string | undefined = 0;
    private mCenterOptionY: number | string | undefined = 0;
    private mDescription?: 'left' | 'right' | 'top' | 'bottom' | 'noShow';
    protected readChartText: string = '';
    protected readLegendText: string = '';
    constructor() {
        this.init();
    }
    public setData(roseData: RoseData) {
        this.mViewMode = roseData.roseType;
        this.mDescription = roseData.description || 'right';
        this.mInnerRadius = roseData.radius[0] || 0;
        this.mMaxLength = roseData.radius[1] || 100;
        this.mShowDataView = roseData.dataView;
        this.mShowValue = roseData.showValue;
        this.mTitle = roseData.title?.value || '';
        this.mCenterOptionX = roseData.center?.shift();
        this.mCenterOptionY = roseData.center?.pop();
        if (roseData.title?.titleStyle !== undefined) {
            this.mTitleStyles.fontSize = roseData.title.titleStyle.fontSize || '30px';
            this.mTitleStyles.fontFamily = roseData.title.titleStyle.fontFamily || 'sans-serif';
            this.mTitleStyles.fontWeight = roseData.title.titleStyle.fontWeight || 'bold';
            this.mTitleStyles.fontStyles = roseData.title.titleStyle.fontStyles || 'normal';
        }
        this.mRoseData = roseData.roseData;
        this.resetCanvas();
    }
    getCenterValue(input: string | undefined | number, ctxSize: number): number {
        if (input === undefined) {
            return ctxSize * 0.5;
        }
        const str = String(input);
        const numberRegex = /^-?\d+(\.\d+)?$/;
        const percentageRegex = /^-?\d+(\.\d+)?%$/;
        const trimmedInput: string = str.trim();
        if (percentageRegex.test(trimmedInput)) {
            const centerSize = ctxSize * Number(str.replace(/%/g, '')) / 100;
            return centerSize;
        }
        if (numberRegex.test(trimmedInput)) {
            return Number(trimmedInput);
        }
        throw Error('Incorrect parameter type');
    }
    public setContext2D(ctx: CanvasRenderingContext2D) {
        this.context = ctx;
        this.mCenterX = this.getCenterValue(this.mCenterOptionX, ctx.width);
        this.mCenterY = this.getCenterValue(this.mCenterOptionY, ctx.height);
        this.FirstLoad(ctx);
    }
    public getViewMode(): 'radius' | 'area' {
        return this.mViewMode;
    }
    public getCenterX(): number {
        return this.mCenterX;
    }
    public getCenterY(): number {
        return this.mCenterY;
    }
    public getRoseData(): SectorData[] {
        return this.mRoseData;
    }
    public getCopies(): number {
        return this.mRoseData.length;
    }
    public getMaxLength(): number {
        return this.mMaxLength;
    }
    public getInnerRadius(): number {
        return this.mInnerRadius;
    }
    public getMaxRadius(): number {
        return this.mMaxLength;
    }
    public getShowDataView(): boolean {
        return this.mShowDataView;
    }
    public getShowValue(): boolean {
        return this.mShowValue;
    }
    public getDescription() {
        return this.mDescription;
    }
    public setReadChartText(readChartText: string) {
        this.readChartText = readChartText;
    }
    public getReadChartText(): string {
        return this.readChartText;
    }
    public setReadLegendText(readLegendText: string) {
        this.readLegendText = readLegendText;
    }
    public getReadLegendText(): string {
        return this.readLegendText;
    }
    protected init(): void {
        this.mRenderer = new RoseChartRender(this);
    }
    public FirstLoad(ctx: CanvasRenderingContext2D) {
        this.mRenderer?.invalidateData();
        this.mRenderer?.startAnimation(ctx);
    }
    public invalidate() {
        if (this.context) {
            this.mRenderer?.invalidateCanvas(this.context);
        }
    }
    public getTitle() {
        return this.mTitle;
    }
    public getTitleStyles(): TitleStyle {
        return this.mTitleStyles;
    }
    public resetCanvas() {
        this.mRenderer?.clearCanvas(this.context);
        this.invalidate();
    }
    private getClickedSector(x: number, y: number): number {
        // 转换为相对于canvas中心的坐标
        const dx = x - this.getCenterX();
        const dy = y - this.getCenterY();
        const distance = Math.sqrt(dx * dx + dy * dy);
        // 计算点击角度
        let angle = Math.atan2(dy, dx);
        if (angle < 0) {
            if (dx < 0) {
                angle += Math.PI * 2;
            }
        }
        if (distance < this.getInnerRadius()) {
            return -1;
        }
        // 查找对应的扇形
        const sectors = this.mRenderer?.getSectors()!;
        if (sectors === undefined) {
            return -1;
        }
        for (let i = 0; i < sectors.length; i++) {
            if (angle >= sectors[i].startAngle && angle <= sectors[i].endAngle) {
                if (distance > sectors[i].outerRadius) {
                    return -1;
                }
                return i;
            }
        }
        return -1;
    }
    public onTouchEvent(event: TouchEvent) {
        if (event.touches && event.touches.length > 0) {
            const globalX = event.touches[0].x;
            const globalY = event.touches[0].y;
            if (event.type === TouchType.Down) {
                let i = this.getClickedSector(globalX, globalY);
                this.sectorSelected(i);
            }
        }
    }
    public getLabelByTouchPoint(x: number, y: number): LabelInfo | undefined {
        const labels = this.mRenderer?.getLabels();
        if (labels !== undefined) {
            for (let i = 0; i < labels.length; i++) {
                if (x >= labels[i].x && labels[i].x <= labels[i].x + labels[i].width && y >= labels[i].y &&
                    y <= labels[i].y + labels[i].height) {
                    this.accessibleSelected(this.mRoseData.length);
                    return labels[i];
                }
            }
        }
        return undefined;
    }
    public getSectorByTouchPoint(x: number, y: number): SectorData | undefined {
        let i = this.getClickedSector(x, y);
        if (i === -1) {
            return undefined;
        }
        else {
            const sectors = this.mRenderer?.getSectors();
            if (sectors !== undefined && sectors.length > 0) {
                this.accessibleSelected(i);
                return sectors[i];
            }
            else {
                return undefined;
            }
        }
    }
    public accessibleSelected(index: number) {
        for (let i = 0; i < this.mRoseData.length; i++) {
            if (i === index) {
                this.mRoseData[i].accessibleSelected = true;
            }
            else {
                this.mRoseData[i].accessibleSelected = false;
            }
        }
        this.resetCanvas();
    }
    public sectorSelected(index: number) {
        for (let i = 0; i < this.mRoseData.length; i++) {
            if (i === index) {
                this.mRoseData[i].selected = !this.mRoseData[i].selected;
            }
            else {
                this.mRoseData[i].selected = false;
            }
        }
        this.resetCanvas();
    }
}
;
