import type IWaterfallDataSet from '../interfaces/datasets/IWaterfallDataSet';
import BarDataSet from "@package:pkg_modules/.ohpm/@ohos+mpchart@3.0.27/pkg_modules/@ohos/mpchart/src/main/ets/components/data/BarDataSet";
import type BarEntry from './BarEntry';
import type WaterfallEntry from './WaterfallEntry';
import type { WaterfallHighlight } from './WaterfallEntry';
export default class WaterfallDataSet extends BarDataSet implements IWaterfallDataSet {
    /**
     * Indicates whether the highest or lowest point can be highlighted.
     */
    private enableMaxOrMinHighlightColor: boolean = false;
    /**
     * Highest point highlight color
     */
    private maxyHighlightColor: number | string = Color.Red;
    /**
     * Lowest Highlight Color
     */
    private minyHighlightColor: number | string = Color.Red;
    private yAxisSegmentationColors: WaterfallHighlight[] = [];
    private maxTopHighlightEXIST: boolean = false;
    private opacity: number = 100;
    private minBottomHighlightEXIST: boolean = false;
    public setEnableMaxOrMinHighlightColor(value: boolean) {
        this.enableMaxOrMinHighlightColor = value;
    }
    public getEnableMaxOrMinHighlightColor(): boolean {
        return this.enableMaxOrMinHighlightColor;
    }
    public setMaxyHighlightColor(value: number | string) {
        this.maxyHighlightColor = value;
    }
    public getMaxyHighlightColor(): number | string {
        return this.maxyHighlightColor;
    }
    public setMinyHighlightColor(value: number | string) {
        this.minyHighlightColor = value;
    }
    public getMinyHighlightColor(): number | string {
        return this.minyHighlightColor;
    }
    public setYAxisSegmentationColors(value: WaterfallHighlight[]) {
        this.yAxisSegmentationColors = value;
    }
    public getYAxisSegmentationColors(): WaterfallHighlight[] {
        return this.yAxisSegmentationColors;
    }
    /**
     * 设置所有高亮点的颜色。
     * @param color - 要设置的颜色，可以是数字或字符串。
     */
    public setDotsColors(color: number | string): void {
        this.mEntries?.dataSource.forEach((value: BarEntry) => {
            (value as WaterfallEntry).getHighlights().forEach((highlight: WaterfallHighlight) => {
                highlight.setColor(color);
            });
        });
    }
    /**
     * 获取所有高亮点的颜色。
     * @returns 包含所有高亮点颜色的数组，元素可以是字符串或数字。
     */
    public getDotsColors(): Array<string | number> {
        const colors: Array<number | string> = [];
        this.mEntries?.dataSource.forEach((value: BarEntry) => {
            const entry = value as WaterfallEntry;
            entry.getHighlights().forEach((highlight: WaterfallHighlight) => {
                colors.push(highlight.getColor());
            });
        });
        return colors;
    }
    public setMaxTopHighlightEXIST(value: boolean) {
        this.maxTopHighlightEXIST = value;
    }
    public getMaxTopHighlightEXIST(): boolean {
        return this.maxTopHighlightEXIST;
    }
    public setMinBottomHighlightEXIST(value: boolean) {
        this.minBottomHighlightEXIST = value;
    }
    public getMinBottomHighlightEXIST(): boolean {
        return this.minBottomHighlightEXIST;
    }
    public setOpacity(value: number) {
        if (value < 0) {
            value = 0;
        }
        else if (value > 100) {
            value = 100;
        }
        this.opacity = value;
    }
    public getOpacity(): number {
        return this.opacity;
    }
    public setMaxTopHighLightEXIST(value: boolean) {
        this.maxTopHighlightEXIST = value;
    }
    public myCalcMinMax(e: WaterfallEntry): void {
        if (e != null && !Number.isNaN(e.getY())) {
            if (e.getMinY() < this.mYMin)
                this.mYMin = e.getMinY();
            if (e.getMaxY() > this.mYMax)
                this.mYMax = e.getMaxY();
            this.calcMinMaxX(e);
        }
    }
}
