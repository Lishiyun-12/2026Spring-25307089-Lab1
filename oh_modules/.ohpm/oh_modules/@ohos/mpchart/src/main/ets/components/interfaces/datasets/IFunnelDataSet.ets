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

export type FunnelPositionHorizontal = 'left' | 'center' | 'right';

export type FunnelPositionVertical = 'top' | 'center' | 'bottom';

export type FunnelOptionTooltipTriggerOn = 'mousemove' | 'click';

export type FunnelOptionOrient = 'horizontal' | 'vertical';

export type FunnelSort = 'ascending' | 'descending' | 'none';

export type FunnelAlign = 'left' | 'center' | 'right';

export type FunnelLabelPosition = 'inside' | 'outside' | 'insideLeft' | 'insideRight' | 'outsideLeft' | 'outsideRight';

export type FunnelColorType = string | number | CanvasGradient | CanvasPattern;

export const DEFAULT_COLOR =
  ['#5470c6', '#91cc75', '#fac858', '#ee6666', '#73c0de', '#3ba272', '#fc8452', '#9a60b4', '#ea7ccc'];

export type FunnelLegendType = 'SQUARE' | 'CIRCLE' | 'LINE' | 'DEFAULT' | 'EMPTY';


export interface Point {
  x: number,
  y: number
}

export interface DataItem {
  type: string,
  title: string,
  data?: FunnelDataItem,
  Points: [Point, Point, Point, Point]
}

export interface LegendItem {
  text: string,
  length: number,
  itemWidth: number,
  textWidth: number,
  itemHeight: number,
  textHeight: number,
  itemGap: number
}

export interface LegendLine {
  items: LegendItem[],
  length: number,
  maxCrossSize: number;
}

export interface LegendRect {
  width: number,
  height: number,
  lines: LegendLine[]
}

export interface Offset {
  left: number,
  top: number,
}

export interface RectInfo extends Offset {
  width: number,
  height: number,
}

export interface FunnelOptionTitle {
  text?: string,
  show?: boolean,
  subtext?: string,
  left?: FunnelPositionHorizontal | number,
  top?: FunnelPositionVertical | number,
  backgroundColor?: string,
  itemGap?: number,
  textColor?: FunnelColorType,
  textFont?: number,
  subtextColor?: FunnelColorType,
  subtextFont?: number
}

export interface FunnelOptionTooltip {
  show?: boolean,
  triggerOn?: FunnelOptionTooltipTriggerOn,
  backgroundColor?: FunnelColorType,
  formatter?: string,
  borderRadius?: number,
  borderWidth?: number,
  borderColor?: FunnelColorType,
  textColor?: FunnelColorType,
  textFont?: number
}

export interface FunnelOptionLegend {
  show?: boolean,
  left?: FunnelPositionHorizontal | number,
  top?: FunnelPositionVertical | number,
  orient?: FunnelOptionOrient,
  backgroundColor?: FunnelColorType,
  gap?: number,
  itemType?: FunnelLegendType,
  itemGap?: number,
  itemWidth?: number,
  itemHeight?: number,
  textColor?: FunnelColorType,
  textFont?: number,
  data?: string[]
}

export interface FunnelOptionLabelLine {
  show?: boolean,
  length?: number,
  width?: number,
  color?: FunnelColorType
}

export interface FunnelOptionLabel {
  show?: boolean
  position?: FunnelLabelPosition,
  textColor?: FunnelColorType,
  textFont?: number,
  line?: FunnelOptionLabelLine,
}

export interface FunnelDataItem {
  name: string,
  value: number,
  color?: FunnelColorType
}

export interface FunnelOptionSeries {
  name?: string
  width?: number | string,
  height?: number | string,
  left?: number | string,
  top?: number | string,
  bottom?: number | string,
  right?: number | string,
  funnelAlign?: FunnelAlign,
  sort?: FunnelSort,
  gap?: number,
  label?: FunnelOptionLabel,
  data?: FunnelDataItem[]
}

export interface FunnelOption {
  title?: FunnelOptionTitle,
  tooltip?: FunnelOptionTooltip,
  legend?: FunnelOptionLegend,
  series?: FunnelOptionSeries[]
}

export type FunnelTitleData = Required<FunnelOptionTitle>;

const DefaultFunnelOptionTitle: FunnelTitleData = {
  show: true,
  text: '',
  subtext: '',
  left: 'center',
  top: 'top',
  backgroundColor: 'rgba(0,0,0,0)',
  itemGap: 10,
  textColor: Color.Black,
  textFont: 16,
  subtextColor: Color.Gray,
  subtextFont: 14
}

export const GetDefaultFunnelOptionTitle =
  (titleOption: FunnelOptionTitle, defaultData: FunnelTitleData = DefaultFunnelOptionTitle): FunnelTitleData => {
    return {
      show: titleOption.show ?? defaultData.show,
      text: titleOption.text ?? defaultData.text,
      subtext: titleOption.subtext ?? defaultData.subtext,
      left: titleOption.left ?? defaultData.left,
      top: titleOption.top ?? defaultData.top,
      backgroundColor: titleOption.backgroundColor ?? defaultData.backgroundColor,
      itemGap: titleOption.itemGap ?? defaultData.itemGap,
      textColor: titleOption.textColor ?? defaultData.textColor,
      textFont: titleOption.textFont ?? defaultData.textFont,
      subtextColor: titleOption.subtextColor ?? defaultData.subtextColor,
      subtextFont: titleOption.subtextFont ?? defaultData.subtextFont
    }
  }

export type FunnelLegendData = Required<FunnelOptionLegend>;

const DefaultFunnelOptionLegend: FunnelLegendData = {
  show: true,
  data: [],
  textFont: 12,
  orient: 'horizontal',
  gap: 8,
  itemType: 'DEFAULT',
  itemWidth: 25,
  itemHeight: 14,
  itemGap: 8,
  left: 'center',
  top: 'bottom',
  backgroundColor: 'rgba(0,0,0,0)',
  textColor: Color.Black
}

export const GetDefaultFunnelOptionLegend =
  (legendOption: FunnelOptionLegend, defaultData: FunnelLegendData = DefaultFunnelOptionLegend): FunnelLegendData => {
    return {
      show: legendOption.show ?? defaultData.show,
      data: legendOption.data ?? defaultData.data,
      textFont: legendOption.textFont ?? defaultData.textFont,
      orient: legendOption.orient ?? defaultData.orient,
      gap: legendOption.gap ?? defaultData.gap,
      itemType: legendOption.itemType ?? defaultData.itemType,
      itemWidth: legendOption.itemWidth ?? defaultData.itemWidth,
      itemHeight: legendOption.itemHeight ?? defaultData.itemHeight,
      itemGap: legendOption.itemGap ?? defaultData.itemGap,
      left: legendOption.left ?? defaultData.left,
      top: legendOption.top ?? defaultData.top,
      backgroundColor: legendOption.backgroundColor ?? defaultData.backgroundColor,
      textColor: legendOption.textColor ?? defaultData.textColor
    };
  }

export type FunnelLabelLineData = Required<FunnelOptionLabelLine>;

const DefaultFunnelOptionLabelLine: FunnelLabelLineData = {
  show: true,
  length: 10,
  width: 1,
  color: Color.Black
}

export const GetDefaultFunnelOptionLabelLine = (labelLine: FunnelOptionLabelLine,
  defaultData: FunnelLabelLineData = DefaultFunnelOptionLabelLine): FunnelLabelLineData => {
  return {
    show: labelLine.show ?? defaultData.show,
    length: labelLine.length ?? defaultData.length,
    width: labelLine.width ?? defaultData.width,
    color: labelLine.color ?? defaultData.color
  }
}

interface FunnelOptionLabelData extends FunnelOptionLabel {
  line?: FunnelLabelLineData,
}

export type FunnelLabelData = Required<FunnelOptionLabelData>;

const DefaultFunnelOptionLabelEmphasis: FunnelLabelData = {
  show: true,
  position: 'outside',
  textColor: Color.Black,
  textFont: 16,
  line: DefaultFunnelOptionLabelLine,
}

export const GetDefaultFunnelOptionLabelEmphasis = (labelEmphasis: FunnelOptionLabel,
  defaultData: FunnelLabelData = DefaultFunnelOptionLabelEmphasis): FunnelLabelData => {
  return {
    show: labelEmphasis.show ?? defaultData.show,
    position: labelEmphasis.position ?? defaultData.position,
    textColor: labelEmphasis.textColor ?? defaultData.textColor,
    textFont: labelEmphasis.textFont ?? defaultData.textFont,
    line: GetDefaultFunnelOptionLabelLine(labelEmphasis.line || defaultData.line),
  }
}

const DefaultFunnelOptionLabel: FunnelLabelData = {
  show: true,
  position: 'inside',
  textColor: Color.Black,
  textFont: 16,
  line: DefaultFunnelOptionLabelLine,
}

export const GetDefaultFunnelOptionLabel =
  (label: FunnelOptionLabel, defaultData: FunnelLabelData = DefaultFunnelOptionLabel): FunnelLabelData => {
    return {
      show: label.show ?? defaultData.show,
      position: label.position ?? defaultData.position,
      textColor: label.textColor ?? defaultData.textColor,
      textFont: label.textFont ?? defaultData.textFont,
      line: GetDefaultFunnelOptionLabelLine(label.line || defaultData.line),
    }
  }

interface FunnelOptionSeriesT extends FunnelOptionSeries {
  label?: FunnelLabelData
}

export type FunnelSeriesData = Required<FunnelOptionSeriesT>;

const DefaultFunnelOptionSeries: FunnelSeriesData = {
  name: '',
  width: 0,
  height: 0,
  left: 10,
  top: 30,
  bottom: 60,
  right: 10,
  funnelAlign: 'center',
  sort: 'descending',
  gap: 2,
  label: GetDefaultFunnelOptionLabel({}),
  data: []
}

export const GetDefaultFunnelOptionSeries =
  (series: FunnelOptionSeries, defaultData: FunnelSeriesData = DefaultFunnelOptionSeries): FunnelSeriesData => {
    return {
      name: series.name ?? defaultData.name,
      width: series.width ?? defaultData.width,
      height: series.height ?? defaultData.height,
      left: series.left ?? defaultData.left,
      top: series.top ?? defaultData.top,
      bottom: series.bottom ?? defaultData.bottom,
      right: series.right ?? defaultData.right,
      funnelAlign: series.funnelAlign ?? defaultData.funnelAlign,
      sort: series.sort ?? defaultData.sort,
      gap: series.gap ?? defaultData.gap,
      label: GetDefaultFunnelOptionLabel(series.label || defaultData.label),
      data: series.data ?? defaultData.data
    }
  }

export type FunnelTooltipData = Required<FunnelOptionTooltip>;

const DefaultFunnelTooltipData: FunnelTooltipData = {
  show: false,
  triggerOn: 'click',
  backgroundColor: '#FFFFFF',
  formatter: '{a}\n{b}:{c}',
  borderRadius: 4,
  borderWidth: 1,
  borderColor: '#000000',
  textColor: '#000000',
  textFont: 14
}

export const GetDefaultFunnelTooltipData = (tooltipOption: FunnelOptionTooltip,
  defaultData: FunnelTooltipData = DefaultFunnelTooltipData): FunnelTooltipData => {
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
