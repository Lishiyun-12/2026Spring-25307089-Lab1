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

import { WordCloudType } from "../dataprovider/WordCloudDataProvider";

export type WordCloudPositionHorizontal = 'left' | 'center' | 'right';

export type WordCloudPositionVertical = 'top' | 'center' | 'bottom';

export type WordCloudColorType = string | number | CanvasGradient | CanvasPattern;

export type WordCloudOptionTooltipTriggerOn = 'mousemove' | 'click';

export type WordCloudAlign = 'left' | 'center' | 'right';

export interface TooltipInfo {
  title: string,
  name: string,
  value: number,
  left: number,
  top: number,
  width: number,
  height: number,
  angle: number
}

export interface SeriesData {
  name: string,
  value: number,
  color?: WordCloudColorType
}

export interface WordCloudOptionTooltip {
  show?: boolean,
  triggerOn?: WordCloudOptionTooltipTriggerOn,
  backgroundColor?: WordCloudColorType,

  // todo:回调函数格式
  formatter?: string,
  borderRadius?: number,
  borderWidth?: number,
  borderColor?: WordCloudColorType,
  textColor?: WordCloudColorType,
  textFont?: number
}

export interface WordCloudOptionSeries {
  name?: string
  width?: number | string,
  height?: number | string,
  left?: number | string,
  top?: number | string,
  bottom?: number | string,
  right?: number | string,
  sizeRange?: [number, number],
  rotationStep?: number,
  rotationRange?: [number, number],
  shape?: WordCloudType,
  showShapeMask?: boolean,
  backgroundColor?: WordCloudColorType,
  data?: SeriesData[]
}

export interface WordCloudOption {
  tooltip?: WordCloudOptionTooltip,
  series: WordCloudOptionSeries[]
}

export type WordCloudTooltipData = Required<WordCloudOptionTooltip>;

const DefaultWordCloudTooltipData: WordCloudTooltipData = {
  show: true,
  triggerOn: 'click',
  backgroundColor: '#FFFFFF',
  formatter: '{a}\n{b}:{c}',
  borderRadius: 4,
  borderWidth: 1,
  borderColor: '#000000',
  textColor: '#000000',
  textFont: 14
}

export const GetDefaultWordCloudTooltipData = (tooltipOption: WordCloudOptionTooltip,
  defaultData: WordCloudTooltipData = DefaultWordCloudTooltipData): WordCloudTooltipData => {
  return {
    show: tooltipOption.show ?? defaultData.show,
    triggerOn: tooltipOption.triggerOn ?? defaultData.triggerOn,
    backgroundColor: tooltipOption.backgroundColor ?? defaultData.backgroundColor,
    formatter: tooltipOption.formatter ?? defaultData.formatter,
    borderRadius: tooltipOption.borderRadius ?? defaultData.borderRadius,
    borderWidth: tooltipOption.borderWidth ?? defaultData.borderWidth,
    borderColor: tooltipOption.borderColor ?? defaultData.borderColor,
    textColor: tooltipOption.textColor ?? defaultData.textColor,
    textFont: tooltipOption.textFont ?? defaultData.textFont
  }
}

export type WordCloudSeriesData = Required<WordCloudOptionSeries>;

const DefaultWordCloudOptionSeries: WordCloudSeriesData = {
  name: '',
  width: 0,
  height: 0,
  left: 10,
  top: 30,
  bottom: 60,
  right: 10,
  sizeRange: [12, 100],
  rotationStep: 45,
  rotationRange: [0, 0],
  shape: WordCloudType.RECT,
  showShapeMask: false,
  backgroundColor: '#fff2f6f6',
  data: []
}

export const GetDefaultWordCloudOptionSeries = (series: WordCloudOptionSeries,
  defaultData: WordCloudSeriesData = DefaultWordCloudOptionSeries): WordCloudSeriesData => {
  return {
    name: series.name ?? defaultData.name,
    width: series.width ?? defaultData.width,
    height: series.height ?? defaultData.height,
    left: series.left ?? defaultData.left,
    top: series.top ?? defaultData.top,
    bottom: series.bottom ?? defaultData.bottom,
    right: series.right ?? defaultData.right,
    sizeRange: series.sizeRange ?? defaultData.sizeRange,
    rotationStep: series.rotationStep ?? defaultData.rotationStep,
    rotationRange: series.rotationRange ?? defaultData.rotationRange,
    shape: series.shape ?? defaultData.shape,
    showShapeMask: series.showShapeMask ?? defaultData.showShapeMask,
    backgroundColor: series.backgroundColor ?? defaultData.backgroundColor,
    data: series.data ?? defaultData.data
  }
}
