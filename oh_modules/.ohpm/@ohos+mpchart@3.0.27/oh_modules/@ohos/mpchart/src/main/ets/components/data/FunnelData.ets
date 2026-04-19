/*
 * Copyright (c) 2025 Huawei Device Co., Ltd.
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
  FunnelOptionSeries,
  FunnelOption,
  FunnelOptionTitle,
  FunnelOptionLegend,
  FunnelOptionTooltip,
  FunnelDataItem,
  GetDefaultFunnelOptionTitle,
  FunnelLegendData,
  FunnelTitleData,
  GetDefaultFunnelOptionLegend,
  GetDefaultFunnelOptionSeries,
  FunnelSeriesData,
  FunnelSort,
  DEFAULT_COLOR,
  FunnelTooltipData,
  GetDefaultFunnelTooltipData
} from '../interfaces/datasets/IFunnelDataSet';


export default class FunnelData implements FunnelOption {
  title: FunnelTitleData = GetDefaultFunnelOptionTitle({});
  tooltip: FunnelTooltipData = GetDefaultFunnelTooltipData({});
  legend: FunnelLegendData = GetDefaultFunnelOptionLegend({});
  series: FunnelSeriesData[] = [];
  private seriesDataList: FunnelDataItem[] = [];

  public merge(funnelOption: FunnelOption) {
    this.mergeTitle(funnelOption.title);
    this.mergeTooltip(funnelOption.tooltip);
    this.mergeSeries(funnelOption.series);
    this.mergeLegend(funnelOption.legend, this.series);
  }

  private mergeTitle(title: FunnelOptionTitle | undefined) {
    if (!title) {
      return;
    }
    this.title = GetDefaultFunnelOptionTitle(title, this.title);
  }

  private mergeTooltip(tooltip: FunnelOptionTooltip | undefined) {
    if (!tooltip) {
      return;
    }
    this.tooltip = GetDefaultFunnelTooltipData(tooltip, this.tooltip);
  }

  private mergeLegend(legend: FunnelOptionLegend | undefined, series: FunnelSeriesData[]) {
    if (legend) {
      this.legend = GetDefaultFunnelOptionLegend(legend, this.legend);
    }
    let legendData: string[] = []
    series.forEach(item => {
      if (item?.data?.length) {
        item.data.forEach(data => {
          if (!legendData.includes(data.name)) {
            legendData.push(data.name);
          }
        })
      }
    })

    this.legend.data = this.legend.data.concat(legendData)
      .filter((item, index, self) => self.indexOf(item) === index && legendData.includes(item));
  }

  private mergeSeries(series: FunnelOptionSeries[] | undefined) {
    if (!series) {
      return;
    }
    this.series = series.map((item: FunnelOptionSeries, i: number) => {
      return GetDefaultFunnelOptionSeries(item, this.series[i]);
    })
    this.setSeriesDataColor();
  }

  private setSeriesDataColor() {
    this.seriesDataList = [];
    this.series.forEach(seriesOption => {
      seriesOption.data.forEach((item: FunnelDataItem, i: number) => {
        if (!item.color) {
          if (!this.isExitDataColor(item.name)) {
            item.color = this.getLegendColor(item.name);
          } else {
            item.color = this.getColor(i);
          }
        }
        this.seriesDataList.push(item);
      })
    })
  }

  getColor(i: number) {
    return DEFAULT_COLOR[i%DEFAULT_COLOR.length];
  }

  public getTitle(): FunnelTitleData | undefined {
    return this.title;
  }

  public getTooltip(): FunnelTooltipData {
    return this.tooltip;
  }

  public getLegend(): FunnelLegendData | undefined {
    return this.legend;
  }

  public getSeries(): FunnelSeriesData[] {
    return this.series;
  }

  public sortSeriesData(data: FunnelDataItem[], sort: FunnelSort): FunnelDataItem[] {
    if (sort !== 'none') {
      return data.sort((a: FunnelDataItem, b: FunnelDataItem) => {
        if (sort === 'descending') {
          return b.value - a.value;
        }
        return a.value - b.value;
      });
    }
    return data;
  }

  public getSeriesDataLength(data: FunnelDataItem[]): number {
    if (!data.length) {
      return 0;
    }
    let max = 0;
    data.forEach(item => {
      max = Math.max(max, item.value);
    })
    return max;
  }

  public getLegendColor(name: string) {
    for (let i = 0; i < this.seriesDataList.length; i++) {
      const item = this.seriesDataList[i];
      if (item.name === name) {
        return item.color;
      }
    }
    return DEFAULT_COLOR[0];
  }

  private isExitDataColor(name: string): boolean {
    return this.seriesDataList.filter(item => item.name === name).length <= 0
  }

  public isShowTooltip() {
    return this.tooltip.show;
  }

  public getTooltipTriggerOn() {
    return this.tooltip.triggerOn;
  }

  public getTooltipTextList(title: string, seriesData: FunnelDataItem) {
    const replacements: Record<string, string> = {
      '{a}': title,
      '{b}': seriesData.name,
      '{c}': seriesData.value.toString(),
    };

    return this.tooltip.formatter.replace(/{a}|{b}|{c}/g, match => replacements[match]).split('\n');
  }
}