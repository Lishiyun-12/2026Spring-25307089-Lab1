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

import WaterfallChartModel from '../charts/WaterfallChartModel';
import MoveViewJob from '../jobs/MoveViewJob';
import Constants, { AccessClick } from '../utils/Constants';
import { GlobalContext } from '../utils/GlobalContext';
import { LogUtil } from '../utils/LogUtil';
import Utils from '../utils/Utils';
import WaterfallEntry from '../data/WaterfallEntry';

@Component
export default struct WaterfallChart {
  model: WaterfallChartModel | null = null;
  antiAliasing: boolean = true;
  private setting: RenderingContextSettings | null = null;
  private context2D: CanvasRenderingContext2D | null = null;
  @State content: string = '';
  @State isAccessBool: boolean = true;
  @State isAccessShow: boolean = false;
  @State accessWidth: number = 0;
  @State accessHeight: number = 200;
  @State accessX: number = 0;
  @State accessY: number = 0;

  aboutToAppear() {
    this.setting = new RenderingContextSettings(this.antiAliasing);
    this.context2D = new CanvasRenderingContext2D(this.setting);
    GlobalContext.getContext().setObject(Constants.UI_CONTEXT, this.getUIContext());
  }

  aboutToDisappear(): void {
    this.model?.clearJobs();
    MoveViewJob.cleanup();
    GlobalContext.getContext().dispose();
  }

  invalidate() {
    this.model?.invalidate();
  }

  build() {
    Column() {
      Canvas(this.context2D)
        .onReady(() => {
          if (this.model && this.context2D) {
            this.model.setContext2D(this.context2D);
            this.model.onDraw(this.context2D);
          }
        })
        .onAreaChange((oldArea: Area, newArea: Area) => {
          if (this.model && ((newArea.width !== oldArea.width) || (newArea.height !== oldArea.height))) {
            this.model.onChartSizeChanged(Number(newArea.width), Number(newArea.height), Number(oldArea.width),
              Number(oldArea.height));
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
                  AppStorage.setOrCreate(Constants.WATER_CHART_ACCESS, false);
                  this.model.onSingleTapUp(false, event);
                }
              })
          )
        )
        .scale({
          x: this.model?.getHorizontalFlip() ? -1 : 1
        })
      if (this.isAccessShow) {
        Row()
          .width(this.accessWidth)
          .height(this.accessHeight)
          .borderWidth(3)
          .borderColor('#6bc843')
          .position({
            x: this.accessX,
            y: this.accessY
          })
      }
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
          this.isAccessBool = true;
          let readChartText = this.model.getReadChartText();
          let readLegendText = this.model.getReadLegendText();
          let readAxisText = this.model.getReadAxisText();
          AppStorage.setOrCreate(Constants.WATER_CHART_ACCESS, true);
          const highlight = this.model.getHighlightByTouchPoint(event.x, event.y);
          if (highlight) {
            const entry = this.model.getData()?.getEntryForHighlight(highlight);

            AppStorage.setOrCreate(Constants.LEGEND_ACCESS_BOOL, this.isAccessBool);
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

            this.isAccessBool = AppStorage.get(Constants.LEGEND_ACCESS_BOOL) as boolean;
            if (this.isAccessBool) {
              this.model.onAccessUp(event);
              if (entry && entry instanceof WaterfallEntry) {
                this.isAccessShow = false;
                let matchText = {
                  '{x}': entry.getX().toFixed(1),
                  '{y}': entry.getY().toFixed(1),
                  '{min}': entry.getMinY().toFixed(1),
                  '{max}': entry.getMaxY().toFixed(1),
                } as Record<string, string>;
                this.content = readChartText != '' ? Utils.matchingTemplate(readChartText, matchText) : `横坐标: ${entry.getX()}, 纵坐标: ${entry.getY().toFixed(1)}, 最小值: ${entry.getMinY().toFixed(1)}, 最大值: ${entry.getMaxY().toFixed(1)}`;
              } else {
                this.content = 'No section selected';
              }
            }
          } else {
            this.content = 'No section selected';
          }

          if (Utils.getAccessibilityHoverText(this.model.mAxisLabelInfo, event.x, event.y).value !== '') {
            this.isAccessShow = true;
            let labelInfo = Utils.getAccessibilityHoverText(this.model.mAxisLabelInfo, event.x, event.y);
            if (labelInfo.value) {
              let axisStr = labelInfo.value.split(':');
              let matchText = {
                '{axis}': axisStr[0],
                '{value}': axisStr[1],
              } as Record<string, string>;
              this.content = readAxisText ? Utils.matchingTemplate(readAxisText, matchText) : labelInfo.value;
            } else {
              this.content = 'No section selected';
            }
            this.accessWidth = labelInfo.width!;
            this.accessHeight = labelInfo.height!;
            this.accessX = labelInfo.x!;
            this.accessY = labelInfo.y!;
          }
        }
      } catch (err) {
        LogUtil.error(err);
      }
    })
  }
}

