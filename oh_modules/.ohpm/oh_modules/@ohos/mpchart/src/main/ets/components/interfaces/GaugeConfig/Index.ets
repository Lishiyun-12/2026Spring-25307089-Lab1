/*
 * Copyright (C) 2022 Huawei Device Co., Ltd.
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
export interface LineStyleConfig {
  width?: number;
  color?: ResourceColor;
}

export interface GaugeProgressConfig {
  show?: boolean;
  lineStyle?: LineStyleConfig;
  roundCap?: boolean;
}

export interface GaugeAxisLineConfig {
  lineStyle?: LineStyleConfig;
  roundCap?: boolean;
}

export interface GaugeAxisTickConfig {
  show?: boolean;
  length?: number;
  lineStyle?: LineStyleConfig;
}

export interface GaugeSplitLineConfig {
  show?: boolean;
  length?: number;
  lineStyle?: LineStyleConfig;
}

export interface GaugeAxisLabelConfig {
  show?: boolean;
  distance?: number;
  color?: ResourceColor;
  fontSize?: number;
  fontWeight?: FontWeight;
  formatter?: string;
}

export interface GaugePointerConfig {
  show?: boolean;
  length?: number | string;
  lineStyle?: LineStyleConfig;
  image?: string;
  imageWidth?: number;
  imageHeight?: number;
  imageOffsetX?: number;
  imageOffsetY?: number;
}

export interface GaugeAnchorItemStyleConfig {
  borderWidth?: number;
  borderColor?: number | string;
  color?: ResourceColor;
}

export interface GaugeAnchorConfig {
  show?: boolean;
  size?: number;
  itemStyle?: GaugeAnchorItemStyleConfig;
}

export interface GaugeTitleConfig {
  show?: boolean;
  offsetCenter?: Array<number | string>;
  fontSize?: number;
  color?: ResourceColor;
}

export interface GaugeDetailConfig {
  show?: boolean;
  valueAnimation?: boolean;
  fontSize?: number;
  fontWeight?: FontWeight;
  color?: ResourceColor;
  offsetCenter?: Array<number | string>;
  formatter?: string;
}

export interface GaugeDataItemConfig {
  value: number;
  name?: string;
}

export interface GaugeConfig {
  name?: string
  type?: string;
  startAngle?: number;
  endAngle?: number;
  min?: number;
  max?: number;
  progress?: GaugeProgressConfig;
  axisLine?: GaugeAxisLineConfig;
  axisTick?: GaugeAxisTickConfig;
  splitLine?: GaugeSplitLineConfig;
  axisLabel?: GaugeAxisLabelConfig;
  pointer?: GaugePointerConfig;
  anchor?: GaugeAnchorConfig;
  title?: GaugeTitleConfig;
  detail?: GaugeDetailConfig;
  data?: Array<GaugeDataItemConfig>;
}

export interface AccessibilityItem {
  type: string,
  value: number | string,
  left: number,
  top: number,
  width: number,
  height: number
}