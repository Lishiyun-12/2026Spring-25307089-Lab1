import { GetDefaultWordCloudOptionSeries, GetDefaultWordCloudTooltipData } from "@package:pkg_modules/.ohpm/@ohos+mpchart@3.0.27/pkg_modules/@ohos/mpchart/src/main/ets/components/interfaces/datasets/WordCloudDataSet";
import type { SeriesData, WordCloudOption, WordCloudOptionSeries, WordCloudOptionTooltip, WordCloudTooltipData, WordCloudSeriesData } from "@package:pkg_modules/.ohpm/@ohos+mpchart@3.0.27/pkg_modules/@ohos/mpchart/src/main/ets/components/interfaces/datasets/WordCloudDataSet";
export default class WordCloudData implements WordCloudOption {
    tooltip: WordCloudTooltipData = GetDefaultWordCloudTooltipData({});
    series: WordCloudSeriesData[] = [];
    public merge(wordCloudOption: WordCloudOption) {
        this.mergeTooltip(wordCloudOption.tooltip);
        this.mergeSeries(wordCloudOption.series);
    }
    private mergeTooltip(tooltip: WordCloudOptionTooltip | undefined) {
        if (!tooltip) {
            return;
        }
        this.tooltip = GetDefaultWordCloudTooltipData(tooltip, this.tooltip);
    }
    private mergeSeries(series: WordCloudOptionSeries[] | undefined) {
        if (!series) {
            return;
        }
        this.series = series.map((item: WordCloudOptionSeries, i: number) => {
            return GetDefaultWordCloudOptionSeries(item, this.series[i]);
            ;
        });
    }
    public getSeries(): WordCloudSeriesData[] {
        return this.series;
    }
    public sortSeriesData(data: SeriesData[]) {
        return data.sort((a: SeriesData, b: SeriesData) => {
            return b.value - a.value;
        });
    }
    public getTextWeightRange(seriesData: SeriesData[]): [
        number,
        number
    ] {
        if (seriesData.length) {
            return [seriesData[0].value, seriesData[seriesData.length - 1].value];
        }
        return [0, 0];
    }
    public isShowTooltip() {
        return this.tooltip.show;
    }
    public getTooltipTriggerOn() {
        return this.tooltip.triggerOn;
    }
    public getTooltipTextList(title: string, name: string, value: number) {
        const replacements: Record<string, string> = {
            '{a}': title,
            '{b}': name,
            '{c}': value.toString()
        };
        return this.tooltip.formatter.replace(/{a}|{b}|{c}/g, match => replacements[match]).split('\n');
    }
    public getTooltip(): WordCloudTooltipData {
        return this.tooltip;
    }
}
