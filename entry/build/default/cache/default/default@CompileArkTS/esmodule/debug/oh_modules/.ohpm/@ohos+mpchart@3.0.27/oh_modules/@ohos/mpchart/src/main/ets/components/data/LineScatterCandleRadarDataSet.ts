import { DashPathEffect } from "@package:pkg_modules/.ohpm/@ohos+mpchart@3.0.27/pkg_modules/@ohos/mpchart/src/main/ets/components/data/Paint";
import type EntryOhos from './EntryOhos';
import BarLineScatterCandleBubbleDataSet from "@package:pkg_modules/.ohpm/@ohos+mpchart@3.0.27/pkg_modules/@ohos/mpchart/src/main/ets/components/data/BarLineScatterCandleBubbleDataSet";
import type ILineScatterCandleRadarDataSet from '../interfaces/datasets/ILineScatterCandleRadarDataSet';
import Utils from "@package:pkg_modules/.ohpm/@ohos+mpchart@3.0.27/pkg_modules/@ohos/mpchart/src/main/ets/components/utils/Utils";
import type { JArrayList } from '../utils/JArrayList';
export default abstract class LineScatterCandleRadarDataSet<T extends EntryOhos> extends BarLineScatterCandleBubbleDataSet<T> implements ILineScatterCandleRadarDataSet<T> {
    protected mDrawVerticalHighlightIndicator: boolean = true;
    protected mDrawHorizontalHighlightIndicator: boolean = true;
    /** the width of the highlight indicator lines */
    protected mHighlightLineWidth: number = 0.5;
    /** the path effect for dashed highlight-lines */
    protected mHighlightDashPathEffect: DashPathEffect | null = null;
    constructor(yVals: JArrayList<T> | null, label: string) {
        super(yVals, label);
        this.mHighlightLineWidth = Utils.handleDataValues(0.5);
    }
    /**
     * Enables / disables the horizontal highlight-indicator. If disabled, the indicator is not drawn.
     * @param enabled
     */
    public setDrawHorizontalHighlightIndicator(enabled: boolean): void {
        this.mDrawHorizontalHighlightIndicator = enabled;
    }
    /**
     * Enables / disables the vertical highlight-indicator. If disabled, the indicator is not drawn.
     * @param enabled
     */
    public setDrawVerticalHighlightIndicator(enabled: boolean): void {
        this.mDrawVerticalHighlightIndicator = enabled;
    }
    /**
     * Enables / disables both vertical and horizontal highlight-indicators.
     * @param enabled
     */
    public setDrawHighlightIndicators(enabled: boolean): void {
        this.setDrawVerticalHighlightIndicator(enabled);
        this.setDrawHorizontalHighlightIndicator(enabled);
    }
    public isVerticalHighlightIndicatorEnabled(): boolean {
        return this.mDrawVerticalHighlightIndicator;
    }
    public isHorizontalHighlightIndicatorEnabled(): boolean {
        return this.mDrawHorizontalHighlightIndicator;
    }
    /**
     * Sets the width of the highlight line in vp.
     * @param width
     */
    public setHighlightLineWidth(width: number): void {
        this.mHighlightLineWidth = Utils.handleDataValues(width);
    }
    public getHighlightLineWidth(): number {
        return this.mHighlightLineWidth;
    }
    /**
     * Enables the highlight-line to be drawn in dashed mode, e.g. like this "- - - - - -"
     *
     * @param lineLength the length of the line pieces
     * @param spaceLength the length of space in between the line-pieces
     * @param phase offset, in degrees (normally, use 0)
     */
    public enableDashedHighlightLine(lineLength: number, spaceLength: number, phase: number): void {
        let arr = [lineLength, spaceLength];
        this.mHighlightDashPathEffect = new DashPathEffect(arr, phase);
    }
    /**
     * Disables the highlight-line to be drawn in dashed mode.
     */
    public disableDashedHighlightLine(): void {
        this.mHighlightDashPathEffect = null;
    }
    /**
     * Returns true if the dashed-line effect is enabled for highlight lines, false if not.
     * Default: disabled
     * @return
     */
    public isDashedHighlightLineEnabled(): boolean {
        return !this.mHighlightDashPathEffect ? false : true;
    }
    public getDashPathEffectHighlight(): DashPathEffect /*DashPathEffect*/ | null {
        return this.mHighlightDashPathEffect;
    }
    protected copyTo(lineScatterCandleRadarDataSet: LineScatterCandleRadarDataSet<T>): void {
        super.copyTo(lineScatterCandleRadarDataSet);
        lineScatterCandleRadarDataSet.mDrawHorizontalHighlightIndicator = this.mDrawHorizontalHighlightIndicator;
        lineScatterCandleRadarDataSet.mDrawVerticalHighlightIndicator = this.mDrawVerticalHighlightIndicator;
        lineScatterCandleRadarDataSet.mHighlightLineWidth = this.mHighlightLineWidth;
        lineScatterCandleRadarDataSet.mHighlightDashPathEffect = this.mHighlightDashPathEffect;
    }
}
