/*
 * Copyright (C) 2024 Huawei Device Co., Ltd.
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

import PieChartModel from '../charts/PieChartModel'
import RadarChartModel from '../charts/RadarChartModel';
import PieEntry from '../data/PieEntry';
import MoveViewJob from '../jobs/MoveViewJob';
import Constants, { AccessClick } from '../utils/Constants';
import { GlobalContext } from '../utils/GlobalContext';
import { LogUtil } from '../utils/LogUtil';
import Utils from '../utils/Utils';

@Component
export default struct PieRadarBaseChart {
  model: PieChartModel | RadarChartModel | null = null;
  antiAliasing: boolean = true;
  private setting: RenderingContextSettings | null = null;
  private context2D: CanvasRenderingContext2D | null = null;
  @State content: string = '';

  invalidate() {
    this.model?.invalidate();
  }

  aboutToAppear() {
    LogUtil.log('-----------aboutToAppear: enter');
    this.setting = new RenderingContextSettings(this.antiAliasing);
    this.context2D = new CanvasRenderingContext2D(this.setting);
    GlobalContext.getContext().setObject(Constants.UI_CONTEXT, this.getUIContext());
  }

  aboutToDisappear(): void {
    this.model?.clearJobs();
    MoveViewJob.cleanup();
    GlobalContext.getContext().dispose();
  }

  build() {
    Column() {
      Canvas(this.context2D)
        .onReady(() => {
          if (this.model && this.context2D) {
            this.model.setContext2D(this.context2D);
          }
        })
        .onAreaChange((oldArea: Area, newArea: Area) => {
          if (this.model && this.context2D && ((newArea.width !== oldArea.width) || (newArea.height !== oldArea.height))) {
            this.model.onChartSizeChanged(Number(newArea.width), Number(newArea.height), Number(oldArea.width),
              Number(oldArea.height));
            this.model.onDraw(this.context2D);
          }
        })
        .onTouch((event) => {
          this.model?.onTouchEvent(event);
        })
        .hitTestBehavior(this.model?.getTouchEnabled()? this.model?.getHitTestMode(): HitTestMode.None)
        .priorityGesture(
          GestureGroup(GestureMode.Exclusive,
            SwipeGesture()
              .onAction((event: GestureEvent) => {
                if (event && this.model && this.model.isDragDecelerationEnabled()) {
                  this.model?.computeScroll(event)
                }
              }),
            TapGesture({ count: 1 })
              .onAction((event?: GestureEvent) => {
                if (event && this.model) {
                  LogUtil.log("------------------------onSingleTapUp")
                  AppStorage.setOrCreate(Constants.PIE_CHART_ACCESS, false);
                  this.model.onSingleTapUp(false, event);
                }
              })
          )
        )
    }
    .accessibilityLevel("yes")
    .accessibilityGroup(true)
    .accessibilityText(this.content)
    .onAccessibilityHover((isHover: boolean, event: AccessibilityHoverEvent) => {
      if (!isHover) {
        return;
      }
      try {
        if (this.model) {
          let readChartText = this.model.getReadChartText();
          let readLegendText = this.model.getReadLegendText();
          AppStorage.setOrCreate(Constants.PIE_CHART_ACCESS, true);
          const highlight = this.model.getHighlightByTouchPoint(event.x, event.y);
          if (highlight) {
            const entry = this.model.getData()?.getEntryForHighlight(highlight);
            AppStorage.setOrCreate(Constants.LEGEND_ACCESS_BOOL, false);
            this.model.onAccessUp(event);
            if (entry) {
              if (this.model instanceof PieChartModel) {
                let pieEntryArr: Array<PieEntry> = this.model.getData()?.getDataSetForEntry(entry)?.getEntriesForXValue(0).dataSource as Array<PieEntry>;
                let ySum = pieEntryArr.reduce((acc, item) => acc + item.getY(), 0);
                let label = '';
                let value = '';
                if (entry instanceof PieEntry) {
                  label = entry.getLabel();
                  value = (entry.getY() / ySum * 100).toFixed(1);
                }
                let matchText = {
                  '{label}': label,
                  '{value}': value,
                } as Record<string, string>;
                this.content = readChartText != '' ? Utils.matchingTemplate(readChartText, matchText) : `选中的块: ${label}, 值为: ${value}`;
              } else if (this.model instanceof RadarChartModel) {
                let matchText = {
                  '{value}': entry.getY().toFixed(0),
                } as Record<string, string>;
                this.content = readChartText != '' ? Utils.matchingTemplate(readChartText, matchText) : `值为: ${entry.getY().toFixed(0)}%`;
              }
              
            } else {
              this.content = 'No section selected';
            }
          } else {
            AppStorage.setOrCreate(Constants.LEGEND_ACCESS_BOOL, true);
            let accessClick: AccessClick = {
              x: event.x,
              y: event.y
            };
            AppStorage.setOrCreate(Constants.LEGEND_ACCESS, accessClick);
            if (this.model && this.context2D) {
              this.model.onDraw(this.context2D);
            }
            let legendString = AppStorage.get(Constants.LEGEND_ACCESS_LABEL) as string;
            let matchText = {
              '{legend}': legendString != '' ? legendString : '标签无内容',
            } as Record<string, string>;
            this.content = readLegendText ? (legendString == 'No section selected' ? 'No section selected' : (Utils.matchingTemplate(readLegendText, matchText))) : legendString != '' ? `图例: ${legendString}` : '标签无内容';
          }
        }
      } catch (err) {
        LogUtil.error(err);
      }
    })
  }
}

