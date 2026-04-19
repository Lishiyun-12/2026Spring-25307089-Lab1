import type { AnimatorResult } from "@ohos:animator";
import { GlobalContext } from "@package:pkg_modules/.ohpm/@ohos+mpchart@3.0.27/pkg_modules/@ohos/mpchart/src/main/ets/components/utils/GlobalContext";
import type { GaugeConfig, AccessibilityItem } from "../interfaces/GaugeConfig/Index";
import type { GaugeDataItemConfig } from "../interfaces/GaugeConfig/Index";
import { MPChartTraceUtil } from "@package:pkg_modules/.ohpm/@ohos+mpchart@3.0.27/pkg_modules/@ohos/mpchart/src/main/ets/components/utils/MPChartTraceUtil";
import { TraceLogConstants } from "@package:pkg_modules/.ohpm/@ohos+mpchart@3.0.27/pkg_modules/@ohos/mpchart/src/main/ets/components/utils/TraceConfig";
import { LogUtil } from "@package:pkg_modules/.ohpm/@ohos+mpchart@3.0.27/pkg_modules/@ohos/mpchart/src/main/ets/components/utils/LogUtil";
export class GaugeChartModel {
    // 基础数据配置
    private maxValue: number = 100;
    private minValue: number = 0;
    private currentValue: number = 0;
    // 布局配置
    private centerX: number = 0;
    private centerY: number = 0;
    private radius: number = 0;
    private width: number = 300;
    private height: number = 300;
    // 角度配置
    private startAngle: number = 135;
    private endAngle: number = 45;
    // 轴线配置
    private axisLineWidth: number = 12;
    private axisLineColor: ResourceColor = '#dddddd';
    private axisLineRoundCap: boolean = true;
    // 进度条配置
    private progressShow: boolean = true;
    private progressWidth: number = 12;
    private progressColor: ResourceColor = '#5070dd';
    private progressRoundCap: boolean = true;
    // 刻度配置
    private axisTickShow: boolean = true;
    private axisTickLength: number = 5;
    private axisTickWidth: number = 2;
    private axisTickColor: ResourceColor = "#999999";
    // 分割线配置
    private splitLineShow: boolean = true;
    private splitLineLength: number = 10;
    private splitLineWidth: number = 3;
    private splitLineColor: ResourceColor = "#666666";
    // 刻度标签配置
    private axisLabelShow: boolean = true;
    private axisLabelDistance: number = 12;
    private axisLabelColor: ResourceColor = "#666666";
    private axisLabelFontSize: number = 14;
    private axisLabelFontWeight: FontWeight = FontWeight.Normal;
    private axisLabelFormatter: string = "{value}";
    // 指针配置
    private pointerShow: boolean = true;
    private pointerLength: string | number = '60%';
    private pointerWidth: number = 6;
    private pointerColor: ResourceColor = '';
    private pointerImage?: string;
    private pointerImageWidth?: number;
    private pointerImageHeight?: number;
    private pointerImageOffsetX: number = 0;
    private pointerImageOffsetY: number = 0;
    // 锚点配置
    private anchorShow: boolean = true;
    private anchorSize: number = 25;
    private anchorBorderWidth: number = 10;
    private anchorBorderColor: ResourceColor = "#ffffff";
    private anchorColor: ResourceColor = "#ff42ab68";
    // 标题配置
    private titleShow: boolean = false;
    private titleText: string = "";
    private titleOffsetCenter: Array<number | string> = [0, '10%'];
    private titleFontSize: number = 16;
    private titleColor: ResourceColor = "#333333";
    // 详情配置
    private detailShow: boolean = true;
    private detailValueAnimation: boolean = true;
    private detailFontSize: number = 40;
    private detailFontWeight: FontWeight = FontWeight.Normal;
    private detailColor: ResourceColor = "#000000";
    private detailOffsetCenter: Array<number | string> = [0, '20%'];
    private detailFormatter: string = "{value}";
    private currentData: Array<GaugeDataItemConfig> = [];
    // 动画相关
    private isAnimate: boolean = false;
    private animatedValue: number = 0;
    private animator: AnimatorResult | undefined = undefined;
    private isAnimating: boolean = false;
    // 刻度配置
    private tickCount: number = 11;
    // 上下文和配置
    private context2d: CanvasRenderingContext2D | null = null;
    private currentConfig: GaugeConfig | null = null;
    // 添加防抖相关变量
    private invalidateTimer: number | null = null;
    private readonly INVALIDATE_DELAY: number = 16;
    private accessibilityItemList: AccessibilityItem[] = [];
    // 添加语音朗读模版
    private readChartText: string = '';
    constructor(config?: GaugeConfig) {
        if (config) {
            this.currentData = config.data || [];
            this.setOption(config);
        }
    }
    /**
     * 应用配置
     */
    private applyConfig(config: GaugeConfig): void {
        // 基础数据
        this.setMinValue(config.min ?? this.minValue);
        this.setMaxValue(config.max ?? this.maxValue);
        let validCurrentValue = this.minValue;
        let titleText = '';
        if (config.data !== undefined && config.data.length > 0) {
            const dataValue = config.data[0].value ?? 0;
            validCurrentValue = Math.max(config.min ?? this.minValue, Math.min(dataValue, config.max ?? this.maxValue));
            titleText = config.data[0].name ?? '';
            this.setCurrentValue(validCurrentValue);
        }
        else {
            validCurrentValue = 0;
            titleText = '';
        }
        // 角度
        this.setStartAngle(config.startAngle ?? this.startAngle);
        this.setEndAngle(config.endAngle ?? this.endAngle);
        // 轴线
        if (config.axisLine?.lineStyle?.width !== undefined) {
            this.setAxisLineWidth(config.axisLine.lineStyle.width);
        }
        if (config.axisLine?.lineStyle?.color !== undefined) {
            this.setAxisLineColor(config.axisLine.lineStyle.color);
        }
        if (config.axisLine?.roundCap !== undefined) {
            this.setAxisLineRoundCap(config.axisLine.roundCap);
        }
        // 进度条
        if (config.progress?.show !== undefined) {
            this.setProgressShow(config.progress.show);
        }
        if (config.progress?.lineStyle?.width !== undefined) {
            this.setProgressWidth(config.progress.lineStyle.width);
        }
        if (config.progress?.lineStyle?.color !== undefined) {
            this.setProgressColor(config.progress.lineStyle.color);
        }
        if (config.progress?.roundCap !== undefined) {
            this.setProgressRoundCap(config.progress.roundCap);
        }
        // 刻度
        if (config.axisTick?.show !== undefined) {
            this.setAxisTickShow(config.axisTick.show);
        }
        if (config.axisTick?.length !== undefined) {
            this.setAxisTickLength(config.axisTick.length);
        }
        if (config.axisTick?.lineStyle?.width !== undefined) {
            this.setAxisTickWidth(config.axisTick.lineStyle.width);
        }
        if (config.axisTick?.lineStyle?.color !== undefined) {
            this.setAxisTickColor(config.axisTick.lineStyle.color);
        }
        // 分割线
        if (config.splitLine?.show !== undefined) {
            this.setSplitLineShow(config.splitLine.show);
        }
        if (config.splitLine?.length !== undefined) {
            this.setSplitLineLength(config.splitLine.length);
        }
        if (config.splitLine?.lineStyle?.width !== undefined) {
            this.setSplitLineWidth(config.splitLine.lineStyle.width);
        }
        if (config.splitLine?.lineStyle?.color !== undefined) {
            this.setSplitLineColor(config.splitLine.lineStyle.color);
        }
        // 标签
        if (config.axisLabel?.show !== undefined) {
            this.setAxisLabelShow(config.axisLabel.show);
        }
        if (config.axisLabel?.distance !== undefined) {
            this.setAxisLabelDistance(config.axisLabel.distance);
        }
        if (config.axisLabel?.color !== undefined) {
            this.setAxisLabelColor(config.axisLabel.color);
        }
        if (config.axisLabel?.fontSize !== undefined) {
            this.setAxisLabelFontSize(config.axisLabel.fontSize);
        }
        if (config.axisLabel?.fontWeight !== undefined) {
            this.setAxisLabelFontWeight(config.axisLabel.fontWeight);
        }
        if (config.axisLabel?.formatter !== undefined) {
            this.setAxisLabelFormatter(config.axisLabel.formatter);
        }
        // 指针 - 如果没有数据，不显示指针
        const shouldShowPointer = config.data !== undefined && config.data.length > 0 ?
            (config.pointer?.show ?? this.pointerShow) : false;
        this.setPointerShow(shouldShowPointer);
        if (config.pointer?.length !== undefined) {
            this.setPointerLength(config.pointer.length);
        }
        if (config.pointer?.lineStyle?.width !== undefined) {
            this.setPointerWidth(config.pointer.lineStyle.width);
        }
        if (config.pointer?.lineStyle?.color !== undefined) {
            this.setPointerColor(config.pointer.lineStyle.color);
        }
        // 图片指针配置
        if (config.pointer?.image !== undefined) {
            this.setPointerImage(config.pointer.image, config.pointer.imageWidth, config.pointer.imageHeight, config.pointer.imageOffsetX, config.pointer.imageOffsetY);
        }
        else {
            this.clearPointerImage();
        }
        // 锚点 - 如果没有数据，不显示锚点
        const shouldShowAnchor = config.data !== undefined && config.data.length > 0 ?
            (config.anchor?.show ?? this.anchorShow) : false;
        this.setAnchorShow(shouldShowAnchor);
        if (config.anchor?.size !== undefined) {
            this.setAnchorSize(config.anchor.size);
        }
        if (config.anchor?.itemStyle?.borderWidth !== undefined || config.anchor?.itemStyle?.borderColor !== undefined) {
            this.setAnchorBorder(config.anchor.itemStyle.borderWidth ?? this.anchorBorderWidth, config.anchor.itemStyle.borderColor ?? this.anchorBorderColor);
        }
        if (config.anchor?.itemStyle?.color !== undefined) {
            this.setAnchorColor(config.anchor.itemStyle.color);
        }
        // 标题 - 如果没有数据，不显示标题
        const shouldShowTitle = config.data !== undefined && config.data.length > 0 ?
            (config.title?.show ?? this.titleShow) : false;
        this.setTitleShow(shouldShowTitle);
        this.setTitleText(titleText);
        if (config.title?.offsetCenter !== undefined) {
            this.setTitleOffsetCenter(config.title.offsetCenter);
        }
        if (config.title?.fontSize !== undefined || config.title?.color !== undefined) {
            this.setTitleStyle(config.title?.fontSize ?? this.titleFontSize, config.title?.color ?? this.titleColor);
        }
        // 详情 - 如果没有数据，不显示详情
        const shouldShowDetail = config.data !== undefined && config.data.length > 0 ?
            (config.detail?.show ?? this.detailShow) : false;
        this.setDetailShow(shouldShowDetail);
        if (config.detail?.valueAnimation !== undefined) {
            this.setDetailValueAnimation(config.detail.valueAnimation);
        }
        if (config.detail?.fontSize !== undefined || config.detail?.color !== undefined ||
            config.detail?.fontWeight !== undefined) {
            this.setDetailStyle(config.detail?.fontSize ?? this.detailFontSize, config.detail?.color ?? this.detailColor, config.detail?.fontWeight ?? this.detailFontWeight);
        }
        if (config.detail?.offsetCenter !== undefined) {
            this.setDetailOffsetCenter(config.detail.offsetCenter);
        }
        if (config.detail?.formatter !== undefined) {
            this.setDetailFormatter(config.detail.formatter);
        }
        // 动画
        this.setIsAnimate(config.detail?.valueAnimation ?? this.detailValueAnimation);
    }
    public setOption(config: GaugeConfig): void {
        this.currentConfig = config;
        if (!this.currentConfig.data) {
            this.currentConfig.data = this.currentData;
        }
        else {
            this.currentData = this.currentConfig.data;
        }
        this.applyConfig(config);
    }
    public updateData(value: number, name?: string): void {
        if (!this.currentConfig) {
            this.currentConfig = {
                type: 'gauge',
                data: [{ value: value, name: name !== undefined ? name : '' }]
            };
        }
        else {
            if (!this.currentConfig.data) {
                this.currentConfig.data = [{ value: value, name: name || '' }];
            }
            else if (this.currentConfig.data.length > 0) {
                this.currentConfig.data[0].value = value;
                if (name) {
                    this.currentConfig.data[0].name = name;
                    this.setTitleText(name);
                }
            }
            else {
                this.currentConfig.data.push({ value: value, name: name || '' });
            }
        }
        // 更新显示状态
        const hasData = this.currentConfig.data !== undefined && this.currentConfig.data.length > 0;
        this.setPointerShow(!!hasData && (this.currentConfig.pointer?.show ?? this.pointerShow));
        this.setAnchorShow(!!hasData && (this.currentConfig.anchor?.show ?? this.anchorShow));
        this.setTitleShow(!!hasData && (this.currentConfig.title?.show ?? this.titleShow));
        this.setDetailShow(!!hasData && (this.currentConfig.detail?.show ?? this.detailShow));
        this.setCurrentValue(value);
        if (name) {
            this.setTitleText(name);
        }
    }
    public getCurrentConfig(): GaugeConfig | null {
        return this.currentConfig;
    }
    // ============ Getter方法 ============
    public getMinValue(): number {
        return this.minValue;
    }
    public getMaxValue(): number {
        return this.maxValue;
    }
    public getCurrentValue(): number {
        return this.currentValue;
    }
    public getStartAngle(): number {
        return this.startAngle;
    }
    public getEndAngle(): number {
        return this.endAngle;
    }
    public getReadChartText(): string {
        return this.readChartText;
    }
    // ============ Setter方法 ============
    public setReadChartText(readChartText: string): void {
        this.readChartText = readChartText;
    }
    public setMinValue(value: number): void {
        if (Number(value) >= 0) {
            this.minValue = value;
            this.invalidate();
        }
    }
    public setMaxValue(value: number): void {
        if (Number(value) <= Number.MAX_VALUE) {
            this.maxValue = value;
            this.invalidate();
        }
    }
    public setCurrentValue(value: number): void {
        if (value >= this.minValue && value <= this.maxValue) {
            this.currentValue = value;
            this.invalidate();
        }
    }
    public setContext2D(context2d: CanvasRenderingContext2D): void {
        this.context2d = context2d;
    }
    public setStartAngle(angle: number): void {
        this.startAngle = angle;
        this.invalidate();
    }
    public setEndAngle(angle: number): void {
        this.endAngle = angle;
        this.invalidate();
    }
    public setAxisLineWidth(width: number): void {
        this.axisLineWidth = width;
        this.invalidate();
    }
    public setAxisLineColor(color: ResourceColor): void {
        this.axisLineColor = color;
        this.invalidate();
    }
    public setAxisLineRoundCap(roundCap: boolean): void {
        this.axisLineRoundCap = roundCap;
        this.invalidate();
    }
    public setProgressShow(show: boolean): void {
        this.progressShow = show;
        this.invalidate();
    }
    public setProgressWidth(width: number): void {
        this.progressWidth = width;
        this.invalidate();
    }
    public setProgressColor(color: ResourceColor): void {
        this.progressColor = color;
        this.invalidate();
    }
    public setProgressRoundCap(roundCap: boolean): void {
        this.progressRoundCap = roundCap;
        this.invalidate();
    }
    public setAxisTickShow(show: boolean): void {
        this.axisTickShow = show;
        this.invalidate();
    }
    public setAxisTickLength(length: number): void {
        this.axisTickLength = length;
        this.invalidate();
    }
    public setAxisTickWidth(width: number): void {
        this.axisTickWidth = width;
        this.invalidate();
    }
    public setAxisTickColor(color: ResourceColor): void {
        this.axisTickColor = color;
        this.invalidate();
    }
    public setSplitLineShow(show: boolean): void {
        this.splitLineShow = show;
        this.invalidate();
    }
    public setSplitLineLength(length: number): void {
        this.splitLineLength = length;
        this.invalidate();
    }
    public setSplitLineWidth(width: number): void {
        this.splitLineWidth = width;
        this.invalidate();
    }
    public setSplitLineColor(color: ResourceColor): void {
        this.splitLineColor = color;
        this.invalidate();
    }
    public setAxisLabelShow(show: boolean): void {
        this.axisLabelShow = show;
        this.invalidate();
    }
    public setAxisLabelDistance(distance: number): void {
        this.axisLabelDistance = distance;
        this.invalidate();
    }
    public setAxisLabelColor(color: ResourceColor): void {
        this.axisLabelColor = color;
        this.invalidate();
    }
    public setAxisLabelFontSize(fontSize: number): void {
        this.axisLabelFontSize = Math.max(6, Math.min(48, fontSize));
        this.invalidate();
    }
    public setAxisLabelFontWeight(fontWeight: FontWeight): void {
        this.axisLabelFontWeight = fontWeight;
        this.invalidate();
    }
    public setAxisLabelFormatter(formatter: string): void {
        this.axisLabelFormatter = formatter;
        this.invalidate();
    }
    public setPointerShow(show: boolean): void {
        this.pointerShow = show;
        this.invalidate();
    }
    public setPointerLength(length: string | number): void {
        this.pointerLength = length;
        this.invalidate();
    }
    public setPointerWidth(width: number): void {
        this.pointerWidth = width;
        this.invalidate();
    }
    public setPointerImage(image: string, width?: number, height?: number, offsetX?: number, offsetY?: number): void {
        this.pointerImage = image;
        this.pointerImageWidth = width;
        this.pointerImageHeight = height;
        this.pointerImageOffsetX = offsetX ?? 0;
        this.pointerImageOffsetY = offsetY ?? 0;
        this.invalidate();
    }
    // 添加设置图片偏移的单独方法
    public setPointerImageOffset(offsetX: number, offsetY: number): void {
        this.pointerImageOffsetX = offsetX;
        this.pointerImageOffsetY = offsetY;
        this.invalidate();
    }
    // 清除图片指针设置（恢复到默认线条指针）
    public clearPointerImage(): void {
        this.pointerImage = undefined;
        this.pointerImageWidth = undefined;
        this.pointerImageHeight = undefined;
        this.pointerImageOffsetX = 0;
        this.pointerImageOffsetY = 0;
        this.invalidate();
    }
    public setPointerColor(color: ResourceColor): void {
        this.pointerColor = color;
        this.invalidate();
    }
    public setAnchorShow(show: boolean): void {
        this.anchorShow = show;
        this.invalidate();
    }
    public setAnchorSize(size: number): void {
        this.anchorSize = size;
        this.invalidate();
    }
    public setAnchorBorder(width: number, color: ResourceColor): void {
        this.anchorBorderWidth = width;
        this.anchorBorderColor = color;
        this.invalidate();
    }
    public setAnchorColor(color: ResourceColor): void {
        this.anchorColor = color;
        this.invalidate();
    }
    public setTitleShow(show: boolean): void {
        this.titleShow = show;
        this.invalidate();
    }
    public setTitleText(text: string): void {
        this.titleText = text;
        this.invalidate();
    }
    public setTitleOffsetCenter(offset: Array<number | string>): void {
        this.titleOffsetCenter = offset;
        this.invalidate();
    }
    public setTitleStyle(fontSize: number, color: ResourceColor): void {
        this.titleFontSize = Math.max(6, Math.min(48, fontSize));
        this.titleColor = color;
        this.invalidate();
    }
    public setDetailShow(show: boolean): void {
        this.detailShow = show;
        this.invalidate();
    }
    public setDetailValueAnimation(animate: boolean): void {
        this.detailValueAnimation = animate;
        this.invalidate();
    }
    public setDetailStyle(fontSize: number, color: ResourceColor, fontWeight: FontWeight): void {
        this.detailFontSize = Math.max(6, Math.min(48, fontSize));
        this.detailColor = color;
        this.detailFontWeight = fontWeight;
        this.invalidate();
    }
    public setDetailOffsetCenter(offset: Array<number | string>): void {
        this.detailOffsetCenter = offset;
        this.invalidate();
    }
    public setDetailFormatter(formatter: string): void {
        this.detailFormatter = formatter;
        this.invalidate();
    }
    public setIsAnimate(isAnimate: boolean): void {
        this.isAnimate = isAnimate;
        this.invalidate();
    }
    public checkAccessibilityItem(x: number, y: number): AccessibilityItem | null {
        const selectItem = this.accessibilityItemList.filter((item: AccessibilityItem) => this.isPointInRotatedRect(x, y, item));
        if (selectItem.length) {
            this.drawGauge(this.context2d!);
            this.drawAccessibilityRect(selectItem[0]);
            return selectItem[0];
        }
        else {
            this.drawGauge(this.context2d!);
            return null;
        }
    }
    private isPointInRotatedRect(x: number, y: number, item: AccessibilityItem): boolean {
        const centerX = item.left + item.width / 2;
        const centerY = item.top + item.height / 2;
        const translatedX = x - centerX;
        const translatedY = y - centerY;
        return Math.abs(translatedX) <= item.width / 2 && Math.abs(translatedY) <= item.height / 2;
    }
    public onDraw(context2D: CanvasRenderingContext2D): void {
        if (this.isAnimate && this.detailValueAnimation) {
            let ctx = GlobalContext.getContext().getObject("uiContext") as UIContext;
            this.startAnimation(context2D, ctx);
        }
        else {
            this.animatedValue = this.currentValue;
            this.drawGauge(context2D);
        }
    }
    public onChartSizeChanged(newWidth: number, newHeight: number): void {
        this.onSizeChanged(newWidth, newHeight);
    }
    public onSizeChanged(w: number, h: number): void {
        this.width = w;
        this.height = h;
        this.centerX = w / 2;
        this.centerY = h / 2;
        this.radius = this.calculateRadius();
    }
    public invalidate(): void {
        if (this.invalidateTimer !== null) {
            clearTimeout(this.invalidateTimer);
        }
        this.invalidateTimer = setTimeout(() => {
            this.invalidateTimer = null;
            if (this.context2d) {
                this.onDraw(this.context2d);
            }
        }, this.INVALIDATE_DELAY);
    }
    private startAnimation(context2D: CanvasRenderingContext2D, context: UIContext): void {
        if (this.isAnimating) {
            return;
        }
        this.isAnimating = true;
        if (this.animator) {
            this.animator.cancel();
            this.animator = undefined;
        }
        const startValue = this.animatedValue || this.minValue;
        const targetValue = this.currentValue;
        this.animatedValue = this.animatedValue || this.minValue;
        if (!context) {
            this.isAnimating = false;
            this.drawGauge(context2D);
            return;
        }
        this.animator = context.createAnimator({
            duration: 1000,
            easing: "ease",
            delay: 0,
            fill: "forwards",
            direction: "normal",
            iterations: 1,
            begin: 0,
            end: 1
        });
        this.animator.onFrame = (value: number) => {
            this.animatedValue = startValue + value * (targetValue - startValue);
            if (context2D) {
                this.drawGauge(context2D);
            }
        };
        const finishAnimation = () => {
            this.animatedValue = targetValue;
            this.isAnimating = false;
            if (context2D) {
                this.drawGauge(context2D);
            }
        };
        this.animator.onFinish = finishAnimation;
        this.animator.onCancel = finishAnimation;
        this.animator.play();
    }
    private drawGauge(ctx: CanvasRenderingContext2D): void {
        try {
            LogUtil.log("GaugeChartModel drawGauge - start");
            MPChartTraceUtil.startInfo(TraceLogConstants.Tag.GaugeChartDrawGauge);
            this.accessibilityItemList = [];
            ctx.clearRect(0, 0, this.width, this.height);
            // 计算角度
            const startRad = this.degreesToRadians(this.startAngle);
            let endRad = this.degreesToRadians(this.endAngle);
            if (endRad <= startRad) {
                endRad += 2 * Math.PI;
            }
            const totalAngle = endRad - startRad;
            // 绘制轴线（轨道）
            this.drawAxisLine(ctx, startRad, endRad);
            // 绘制进度条
            if (this.progressShow) {
                this.drawProgress(ctx, startRad, totalAngle);
            }
            // 绘制刻度
            if (this.axisTickShow) {
                this.drawAxisTicks(ctx, startRad, totalAngle);
            }
            // 绘制分割线和标签
            if (this.splitLineShow) {
                this.drawSplitLines(ctx, startRad, totalAngle);
            }
            // 检查是否有数据来决定是否绘制指针相关元素
            const hasData = this.currentConfig !== null && this.currentConfig.data !== undefined && this.currentConfig.data.length > 0;
            // 绘制指针（只有有数据时才绘制）
            if (this.pointerShow && hasData) {
                this.drawPointer(ctx, startRad, totalAngle);
            }
            // 绘制锚点（只有有数据时才绘制）
            if (this.anchorShow && hasData) {
                this.drawAnchor(ctx);
            }
            // 绘制标题（只有有数据时才绘制）
            if (this.titleShow && this.titleText && hasData) {
                this.drawTitle(ctx);
            }
            // 绘制详情（只有有数据时才绘制）
            if (this.detailShow && hasData) {
                this.drawDetail(ctx);
            }
            LogUtil.info("GaugeChartModel drawGauge succeed  " + `currentConfig:${JSON.stringify(this.currentConfig)}`);
        }
        catch (e) {
            MPChartTraceUtil.startError(TraceLogConstants.Tag.BarChartSetData);
            LogUtil.error("GaugeChartModel drawGauge error", e);
        }
        finally {
            MPChartTraceUtil.finish(TraceLogConstants.Tag.BarChartSetData);
            LogUtil.log("GaugeChartModel drawGauge - end");
        }
    }
    private drawAxisLine(ctx: CanvasRenderingContext2D, startRad: number, endRad: number): void {
        ctx.beginPath();
        ctx.arc(this.centerX, this.centerY, this.radius, startRad, endRad, false);
        ctx.strokeStyle = this.axisLineColor.toString();
        ctx.lineWidth = this.axisLineWidth;
        ctx.lineCap = this.axisLineRoundCap ? 'round' : 'butt';
        ctx.stroke();
    }
    private drawProgress(ctx: CanvasRenderingContext2D, startRad: number, totalAngle: number): void {
        if (!this.progressShow) {
            return;
        }
        if (this.maxValue === this.minValue) {
            if (this.animatedValue !== this.minValue) {
                return;
            }
        }
        const progressRatio = Math.min(Math.max((this.animatedValue - this.minValue) / (this.maxValue - this.minValue || 1), 0), 1);
        if (progressRatio > 0) {
            const currentRad = startRad + progressRatio * totalAngle;
            // 计算进度条的半径偏移量，让进度条绘制在轴线内部
            const radiusOffset = (this.axisLineWidth - this.progressWidth) / 2;
            const progressRadius = this.radius + radiusOffset;
            ctx.beginPath();
            ctx.arc(this.centerX, this.centerY, progressRadius, startRad, currentRad, false);
            ctx.strokeStyle = this.progressColor.toString();
            ctx.lineWidth = this.progressWidth;
            ctx.lineCap = this.progressRoundCap ? 'round' : 'butt';
            ctx.stroke();
        }
    }
    private drawAxisTicks(ctx: CanvasRenderingContext2D, startRad: number, totalAngle: number): void {
        if (!this.axisTickShow) {
            return;
        }
        const minorTickCount = (this.tickCount - 1) * 5;
        const minorAngleStep = totalAngle / minorTickCount;
        const tickStartRadius = this.radius - this.axisLineWidth;
        const tickEndRadius = tickStartRadius - this.axisTickLength;
        ctx.strokeStyle = this.axisTickColor.toString();
        ctx.lineWidth = this.axisTickWidth;
        for (let i = 0; i <= minorTickCount; i++) {
            const angle = startRad + i * minorAngleStep;
            const xStart = this.centerX + tickStartRadius * Math.cos(angle);
            const yStart = this.centerY + tickStartRadius * Math.sin(angle);
            const xEnd = this.centerX + tickEndRadius * Math.cos(angle);
            const yEnd = this.centerY + tickEndRadius * Math.sin(angle);
            ctx.beginPath();
            ctx.moveTo(xStart, yStart);
            ctx.lineTo(xEnd, yEnd);
            ctx.stroke();
        }
    }
    private drawSplitLines(ctx: CanvasRenderingContext2D, startRad: number, totalAngle: number): void {
        if (!this.splitLineShow) {
            return;
        }
        // 大刻度数量
        const majorAngleStep = totalAngle / (this.tickCount - 1);
        const tickStartRadius = this.radius - this.axisLineWidth;
        const tickEndRadius = tickStartRadius - this.splitLineLength;
        ctx.strokeStyle = this.splitLineColor.toString();
        ctx.lineWidth = this.splitLineWidth;
        // 从第一个大刻度开始绘制到最后一个大刻度
        for (let i = 0; i < this.tickCount; i++) {
            const angle = startRad + i * majorAngleStep;
            const xStart = this.centerX + tickStartRadius * Math.cos(angle);
            const yStart = this.centerY + tickStartRadius * Math.sin(angle);
            const xEnd = this.centerX + tickEndRadius * Math.cos(angle);
            const yEnd = this.centerY + tickEndRadius * Math.sin(angle);
            ctx.beginPath();
            ctx.moveTo(xStart, yStart);
            ctx.lineTo(xEnd, yEnd);
            ctx.stroke();
        }
        // 绘制标签（与大刻度对应）
        if (this.axisLabelShow) {
            this.drawAxisLabels(ctx, startRad, majorAngleStep);
        }
    }
    private drawAxisLabels(ctx: CanvasRenderingContext2D, startRad: number, majorAngleStep: number): void {
        ctx.fillStyle = this.axisLabelColor.toString();
        ctx.font = `${this.axisLabelFontWeight} ${this.axisLabelFontSize}vp sans-serif`;
        ctx.textBaseline = 'middle';
        const labelOffset = Math.max(this.splitLineLength, this.axisTickLength) + this.axisLabelFontSize / 2 + this.axisLabelDistance;
        for (let i = 0; i < this.tickCount; i++) {
            const angle = startRad + i * majorAngleStep;
            const labelRadius = this.radius - this.axisLineWidth / 2 - labelOffset;
            const xLabel = this.centerX + labelRadius * Math.cos(angle);
            const yLabel = this.centerY + labelRadius * Math.sin(angle);
            const value = this.minValue + ((this.maxValue - this.minValue) / (this.tickCount - 1)) * i;
            const text = this.axisLabelFormatter.replace('{value}', Math.round(value).toString());
            const textMetrics = ctx.measureText(text);
            const textWidth = textMetrics.width;
            let xAdjusted = xLabel;
            let left = xLabel;
            if (angle > Math.PI / 2 && angle < 3 * Math.PI / 2) {
                ctx.textAlign = 'right';
                xAdjusted = xLabel + textWidth / 2;
                left = xAdjusted - textWidth;
            }
            else {
                ctx.textAlign = 'left';
                xAdjusted = xLabel - textWidth / 2;
                left = xAdjusted;
            }
            this.accessibilityItemList.push({
                type: 'AxisLabel',
                value: text,
                left,
                top: yLabel - textMetrics.height / 2,
                width: textWidth,
                height: textMetrics.height
            });
            ctx.fillText(text, xAdjusted, yLabel);
        }
    }
    private drawPointer(ctx: CanvasRenderingContext2D, startRad: number, totalAngle: number): void {
        const progressRatio = Math.min(Math.max((this.animatedValue - this.minValue) / (this.maxValue - this.minValue), 0), 1);
        const currentRad = startRad + progressRatio * totalAngle;
        if (this.pointerImage) {
            // 绘制图片指针
            const pointerWidth = this.pointerImageWidth ?? (this.radius / 2);
            const pointerHeight = this.pointerImageHeight ?? 10;
            ctx.save();
            ctx.translate(this.centerX, this.centerY);
            ctx.rotate(currentRad + Math.PI);
            try {
                const imageBitmap = new ImageBitmap(this.pointerImage);
                // 右侧为圆心
                const drawX = -pointerWidth + (this.pointerImageOffsetX || 0);
                const drawY = -pointerHeight / 2 + (this.pointerImageOffsetY || 0);
                ctx.drawImage(imageBitmap, drawX, drawY, pointerWidth, pointerHeight);
                ctx.restore();
            }
            catch (error) {
                ctx.restore();
                this.drawDefaultPointer(ctx, currentRad, progressRatio);
            }
        }
        else {
            this.drawDefaultPointer(ctx, currentRad, progressRatio);
        }
    }
    private drawDefaultPointer(ctx: CanvasRenderingContext2D, currentRad: number, progressRatio: number): void {
        const pointerLength = this.calculatePointerLength(progressRatio);
        const xEnd = this.centerX + pointerLength * Math.cos(currentRad);
        const yEnd = this.centerY + pointerLength * Math.sin(currentRad);
        ctx.beginPath();
        ctx.moveTo(this.centerX, this.centerY);
        ctx.lineTo(xEnd, yEnd);
        ctx.strokeStyle = this.pointerColor.toString() ?? this.progressColor.toString();
        ctx.lineWidth = this.pointerWidth;
        ctx.lineCap = 'round';
        ctx.stroke();
    }
    private drawAnchor(ctx: CanvasRenderingContext2D): void {
        ctx.beginPath();
        ctx.arc(this.centerX, this.centerY, this.anchorSize / 2, 0, 2 * Math.PI);
        if (this.anchorBorderWidth > 0) {
            ctx.strokeStyle = this.anchorBorderColor.toString();
            ctx.lineWidth = this.anchorBorderWidth;
            ctx.stroke();
        }
        ctx.fillStyle = this.anchorColor.toString();
        ctx.fill();
    }
    private drawTitle(ctx: CanvasRenderingContext2D): void {
        const offset = this.calculatePixelOffset(this.titleOffsetCenter);
        ctx.fillStyle = this.titleColor.toString();
        ctx.font = `${this.titleFontSize}vp sans-serif`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        const textMetrics = ctx.measureText(this.titleText);
        this.accessibilityItemList.push({
            type: 'title',
            value: this.titleText,
            left: this.centerX + offset[0] - textMetrics.width / 2,
            top: this.centerY + offset[1] - textMetrics.height / 2,
            width: textMetrics.width,
            height: textMetrics.height
        });
        ctx.fillText(this.titleText, this.centerX + offset[0], this.centerY + offset[1]);
    }
    private drawDetail(ctx: CanvasRenderingContext2D): void {
        const offset = this.calculatePixelOffset(this.detailOffsetCenter);
        const text = this.detailFormatter.replace('{value}', Math.round(this.animatedValue).toString());
        ctx.fillStyle = this.detailColor.toString();
        ctx.font = `${this.detailFontWeight} ${this.detailFontSize}vp sans-serif`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        const textMetrics = ctx.measureText(this.titleText);
        this.accessibilityItemList.push({
            type: 'detail',
            value: text,
            left: this.centerX + offset[0] - textMetrics.width / 2,
            top: this.centerY + offset[1] - textMetrics.height / 2,
            width: textMetrics.width,
            height: textMetrics.height
        });
        ctx.fillText(text, this.centerX + offset[0], this.centerY + offset[1]);
    }
    private calculateRadius(): number {
        return Math.min(this.centerX, this.centerY) - this.axisLineWidth;
    }
    private calculatePointerLength(progressRatio: number): number {
        if (typeof this.pointerLength === 'string' && this.pointerLength.endsWith('%')) {
            const percentage = parseFloat(this.pointerLength) / 100;
            return this.radius * percentage;
        }
        const minPointerLength = this.radius / 3;
        const maxPointerLength = this.radius - this.axisLineWidth - 10;
        return minPointerLength + progressRatio * (maxPointerLength - minPointerLength);
    }
    private calculatePixelOffset(offset: Array<number | string>): [
        number,
        number
    ] {
        let x = 0;
        let y = 0;
        if (offset[0]) {
            x = typeof offset[0] === 'string' ?
                this.parsePercentage(offset[0], this.width) :
                Number(offset[0]);
        }
        if (offset[1]) {
            y = typeof offset[1] === 'string' ?
                this.parsePercentage(offset[1], this.height) :
                Number(offset[1]);
        }
        return [x, y];
    }
    private parsePercentage(value: string, base: number): number {
        if (value.endsWith('%')) {
            return (parseFloat(value) / 100) * base;
        }
        return parseFloat(value);
    }
    private degreesToRadians(degrees: number): number {
        return degrees * Math.PI / 180;
    }
    private drawAccessibilityRect(item: AccessibilityItem) {
        if (this.context2d) {
            this.context2d.strokeStyle = '#6bc843';
            this.context2d.lineWidth = 3;
            this.context2d.strokeRect(item.left, item.top, item.width, item.height);
        }
    }
}
