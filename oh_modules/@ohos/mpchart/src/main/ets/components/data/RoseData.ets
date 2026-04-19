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

export interface TitleStyle {
  fontSize?: number | string;
  fontFamily?: string;
  fontWeight?: string;
  fontStyles?: string;
}

export interface SectorData {
  value: number;
  label: string;
  selected?: boolean;
  color?: ResourceColor;
  countingUnit?: string;
  accessibleSelected?: boolean;
}

interface TitleOptions {
  value: string,
  titleStyle: TitleStyle
}

export interface LabelInfo {
  x: number,
  y: number,
  isTouch: boolean,
  width: number,
  height: number,
  label: string
}

export interface SectorInfo {
  startAngle: number,
  endAngle: number,
  color: number | string,
  label: string,
  value: number,
  outerRadius: number,
  innerRadius: number,
  selected?: boolean,
  countingUnit?: string,
  accessibleSelected?: boolean;
}

export interface RoseOption {
  title?: TitleOptions;
  dataView: boolean;
  showValue: boolean;
  radius: [number, number];
  center?: [number | string, number | string];
  roseType: 'area' | 'radius';
  roseData: SectorData[];
  description?: 'left' | 'right' | 'top' | 'bottom' | 'noShow'
}

export class RoseData implements RoseOption {
  title?: TitleOptions;
  dataView: boolean;
  showValue: boolean;
  radius: [number, number];
  center?: [number | string, number | string];
  roseType: 'area' | 'radius';
  roseData: SectorData[];
  description?: 'left' | 'right' | 'top' | 'bottom' | 'noShow'

  constructor(roseOption: RoseOption) {
    this.title = roseOption.title;
    this.dataView = roseOption.dataView;
    this.showValue = roseOption.showValue;
    this.radius = roseOption.radius;
    this.center = roseOption.center
    this.roseType = roseOption.roseType;
    this.roseData = roseOption.roseData;
    this.description = roseOption.description
  }
}