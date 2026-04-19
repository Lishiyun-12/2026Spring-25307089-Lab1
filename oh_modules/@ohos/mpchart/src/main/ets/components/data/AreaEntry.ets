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

import ChartPixelMap from './ChartPixelMap';
import EntryOhos from './EntryOhos';

export default class AreaEntry extends EntryOhos {
  private readonly stackedYValues: number[] | null = null;
  private readonly stackedEntries: AreaEntry[] = [];
  public readonly isStacked: boolean = false;

  constructor(
    x?: number,
    y?: number | number[],
    icon?: ChartPixelMap,
    data?: object
  ) {
    super(x, Array.isArray(y) ? AreaEntry.calculateSum(y) : y, icon, data);
    if (Array.isArray(y)) {
      this.isStacked = true;
      this.stackedYValues = y.map(item => item ?? 0);
      this.initializeStackedEntries();
    }
  }

  /**
   * Gets all stacked entries
   * @returns Array of stacked entries
   */
  public getStackedEntries(): ReadonlyArray<AreaEntry> {
    return this.stackedEntries;
  }

  /**
   * Initializes stacked entries from Y values
   */
  private initializeStackedEntries(): void {
    if (!this.stackedYValues) {
      return;
    }
    this.stackedYValues.forEach((_, index) => {
      const cumulativeY = this.calculateCumulativeY(index + 1);
      this.stackedEntries.push(this.createStackedEntry(cumulativeY));
    });
  }

  /**
   * Calculates cumulative Y value up to given index
   * @param upToIndex The stack index to calculate to
   * @returns Cumulative Y value
   */
  private calculateCumulativeY(upToIndex: number): number {
    if (!this.stackedYValues) {
      return 0;
    }
    return this.stackedYValues
      .slice(0, upToIndex)
      .reduce((sum, num) => sum + num, 0);
  }

  /**
   * Creates a new stacked entry
   * @param yValue The Y value for new entry
   * @returns New AreaEntry instance
   */
  private createStackedEntry(yValue: number): AreaEntry {
    return new AreaEntry(
      this.getX(),
      yValue,
      undefined,
      this.getData() ?? undefined
    );
  }

  /**
   * Sums all values in array
   * @param values Array of numbers to sum
   * @returns Total sum
   */
  public static calculateSum(values: number[] | null): number {
    return values?.reduce((sum, num) => sum + num, 0) ?? 0;
  }
}