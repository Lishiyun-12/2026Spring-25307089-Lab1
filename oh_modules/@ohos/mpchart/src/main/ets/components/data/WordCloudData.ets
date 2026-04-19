/*
 * Copyright (C) 2025 Huawei Device Co., Ltd.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import {
  GetDefaultWordCloudOptionSeries,
  GetDefaultWordCloudTooltipData,
  SeriesData,
  WordCloudOption,
  WordCloudOptionSeries,
  WordCloudOptionTooltip,
  WordCloudTooltipData,
  WordCloudSeriesData
} from "../interfaces/datasets/WordCloudDataSet";

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
      return GetDefaultWordCloudOptionSeries(item, this.series[i]);;
    })
  }

  public getSeries(): WordCloudSeriesData[] {
    return this.series;
  }

  public sortSeriesData(data: SeriesData[]) {
    return data.sort((a: SeriesData, b: SeriesData) => {
      return b.value - a.value;
    });
  }

  public getTextWeightRange(seriesData: SeriesData[]): [number, number] {
    if (seriesData.length) {
      return [seriesData[0].value, seriesData[seriesData.length-1].value];
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
