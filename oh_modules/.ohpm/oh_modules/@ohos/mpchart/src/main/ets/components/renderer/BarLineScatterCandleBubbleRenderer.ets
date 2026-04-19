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

import EntryOhos from '../data/EntryOhos';
import { Rounding } from '../data/DataSet';
import ChartAnimator from '../animation/ChartAnimator';
import DataRenderer from './DataRenderer';
import ViewPortHandler from '../utils/ViewPortHandler';
import IBarLineScatterCandleBubbleDataSet from '../interfaces/datasets/IBarLineScatterCandleBubbleDataSet';
import BarLineScatterCandleBubbleDataProvider from '../interfaces/dataprovider/BarLineScatterCandleBubbleDataProvider';
import IDataSet from '../interfaces/datasets/IDataSet';

export class XBounds {
  constructor(animator: ChartAnimator) {
    this.mAnimator = animator;
  }

  /**
   * minimum visible entry index
   */
  public min: number = 0;
  /**
   * maximum visible entry index
   */
  public max: number = 0;
  /**
   * range of visible entry indices
   */
  public range: number = 0;
  public mAnimator: ChartAnimator | null = null;

  /**
   * Calculates the minimum and maximum x values as well as the range between them.
   *
   * @param chart
   * @param dataSet
   */
  public set(chart: BarLineScatterCandleBubbleDataProvider, dataSet: IBarLineScatterCandleBubbleDataSet<EntryOhos>) {
    let phaseX: number = Math.max(0, Math.min(1, (this.mAnimator ? this.mAnimator.getPhaseX() : 1)));

    let low: number = chart.getLowestVisibleX();
    let high: number = chart.getHighestVisibleX();

    let entryFrom: EntryOhos | null = dataSet.getEntryForXValue(low, Number.NaN, Rounding.DOWN);
    let entryTo: EntryOhos | null = dataSet.getEntryForXValue(high, Number.NaN, Rounding.UP);

    // 增强的回退机制:如果基于X值查找失败,使用索引遍历查找
    const entryCount = dataSet.getEntryCount();

    if (!entryFrom && entryCount > 0) {
      // 查找第一个X值大于等于low的entry
      for (let i = 0; i < entryCount; i++) {
        const entry = dataSet.getEntryForIndex(i);
        // 添加undefined检查,防止访问无效entry
        if (!entry || entry === undefined || entry === null) {
          continue;  // 跳过无效entry
        }
        if (entry.getX() >= low) {
          entryFrom = entry;
          break;
        }
      }

      // 修复2: 如果low比所有数据都小,使用第一个点(而不是最后一个)
      if (!entryFrom && entryCount > 0) {
        entryFrom = dataSet.getEntryForIndex(0);
      }
    }

    if (!entryTo && entryCount > 0) {
      // 反向查找第一个X值小于等于high的entry
      for (let i = entryCount - 1; i >= 0; i--) {
        const entry = dataSet.getEntryForIndex(i);
        // 修复1: 添加undefined检查,防止访问无效entry
        if (!entry || entry === undefined || entry === null) {
          continue;  // 跳过无效entry
        }
        if (entry.getX() <= high) {
          entryTo = entry;
          break;
        }
      }

      // 如果还是没找到,说明high比所有数据都小,使用第一个点
      if (!entryTo && entryCount > 0) {
        entryTo = dataSet.getEntryForIndex(entryCount - 1);
      }
    }

    if (entryFrom && entryTo) {
      this.min = dataSet.getEntryIndexByEntry(entryFrom);
      this.max = dataSet.getEntryIndexByEntry(entryTo);

      // 确保min <= max
      if (this.min > this.max) {
        const temp = this.min;
        this.min = this.max;
        this.max = temp;
      }

      this.range = Math.floor((this.max - this.min) * phaseX);

      if (this.range < 1 && this.min < entryCount) {
        this.range = Math.min(1, entryCount - this.min);
      }
    } else {
      // 最后的安全保护:如果仍然找不到任何entry,显示所有数据
      this.min = 0;
      this.max = Math.max(0, entryCount - 1);
      this.range = Math.floor(this.max * phaseX);

      // 确保至少有一个点
      if (this.range < 1 && entryCount > 0) {
        this.range = 1;
      }
    }
  }
}

/**
 * Created by Philipp Jahoda on 09/06/16.
 */
export default abstract class BarLineScatterCandleBubbleRenderer extends DataRenderer {
  /**
   * buffer for storing the current minimum and maximum visible x
   */
  protected mXBounds: XBounds | null = null;

  constructor(animator: ChartAnimator, viewPortHandler: ViewPortHandler) {
    super(animator, viewPortHandler);
    if (this.mAnimator) {
      this.mXBounds = new XBounds(this.mAnimator);
    }
  }

  /**
   * Returns true if the DataSet values should be drawn, false if not.
   *
   * @param set
   * @return
   */
  protected shouldDrawValues(dataSet: IDataSet<EntryOhos>): boolean {
    return dataSet.isVisible() && (dataSet.isDrawValuesEnabled() || dataSet.isDrawIconsEnabled());
  }

  /**
   * Checks if the provided entry object is in bounds for drawing considering the current animation phase.
   *
   * @param e
   * @param set
   * @return
   */
  protected isInBoundsX(e: EntryOhos, dataSet: IBarLineScatterCandleBubbleDataSet<EntryOhos>): boolean {

    if (e == null)
      return false;

    let entryIndex = dataSet.getEntryIndexByEntry(e);

    if (e == null || entryIndex >= dataSet.getEntryCount() * (this.mAnimator ? this.mAnimator.getPhaseX() : 1)) {
      return false;
    } else {
      return true;
    }
  }
}


