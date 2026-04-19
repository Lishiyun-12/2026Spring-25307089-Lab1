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

import LineChartModel from '../charts/LineChartModel'
import { CustomUiInfo } from '../data/customUiData';
import MoveViewJob from '../jobs/MoveViewJob';
import { EventType } from '../listener/EventControl';
import Constants, { AccessClick } from '../utils/Constants';
import { GlobalContext } from '../utils/GlobalContext';
import { LogUtil } from '../utils/LogUtil';
import Utils from '../utils/Utils';

@Component
export default struct LineChart {
  model: LineChartModel | null = null;
  antiAliasing: boolean = true;
  private setting: RenderingContextSettings | null = null;
  private context2D: CanvasRenderingContext2D | null = null;
  private highlightSetting: RenderingContextSettings = new RenderingContextSettings(true);
  private highlightContext2D: CanvasRenderingContext2D = new CanvasRenderingContext2D(this.highlightSetting);
  @Prop customUiInfo: CustomUiInfo | null = null;
  // 默认长按显示自定义ui
  @Prop customUiTriggerEvent: EventType = EventType.LongPress;
  @State content: string = '';
  @State isAccessBool: boolean = true;
  @State isAccessShow: boolean = false;
  @State accessWidth: number = 0;
  @State accessHeight: number = 200;
  @State accessX: number = 0;
  @State accessY: number = 0;

  aboutToAppear(): void {
    this.setting = new RenderingContextSettings(this.antiAliasing);
    this.context2D = new CanvasRenderingContext2D(this.setting);
    GlobalContext.getContext().setObject(Constants.UI_CONTEXT, this.getUIContext());
  }

  aboutToDisappear(): void {
    this.model?.clearJobs();
    MoveViewJob.cleanup();
    GlobalContext.getContext().dispose();
  }

  invalidate(){
    this.model?.invalidate();
  }

  @Builder
  emptyBuilder() {
  };

  @BuilderParam customUiBuilder: () => void = this.emptyBuilder;

  public calcCustomUiInfo(ev: GestureEvent | TouchEvent) {

    if (!this.customUiInfo) {
      return;
    }

    if (!this.model) return;
    const pos = this.model.calcPos(false, ev);
    if (!pos) return;
    const entryData = this.model.getEntryByTouchPoint(pos[0], pos[1]);
    if (entryData) {
      const vph = this.model.getViewPortHandler();
      const isInbounds = vph.isInBounds(pos[0], pos[1]);
      // 距离左侧距离
      const offsetLeft = pos[0] - vph.offsetLeft();
      // 距离右侧
      const offsetRight = vph.getChartWidth() - pos[0] - vph.offsetRight();
      this.customUiInfo.isInbounds = isInbounds;
      this.customUiInfo.x = pos[0];
      this.customUiInfo.y = pos[1];
      this.customUiInfo.offsetLeft = offsetLeft;
      this.customUiInfo.offsetRight = offsetRight;
      this.customUiInfo.data = entryData;

      this.customUiInfo.showUi = true;
    }
  }

  build() {
    Column() {
      Stack({ alignContent: Alignment.TopStart }) {
        Canvas(this.context2D)
          .onReady(() => {
            if (this.model && this.context2D) {
              this.model.setContext2D(this.context2D);
              this.model.onDraw(this.context2D);
            }
          })
          .onAreaChange((oldArea: Area, newArea: Area) => {
            if (this.model && ((newArea.width !== oldArea.width) || (newArea.height !== oldArea.height))) {
              this.model.onChartSizeChanged(Number(newArea.width), Number(newArea.height), Number(oldArea.width), Number(oldArea.height));
            }
          })
          .onTouch((event) => {
              this.model?.onTouchEvent(event);
          })
          .hitTestBehavior(this.model?.getTouchEnabled()? this.model?.getHitTestMode(): HitTestMode.None)
          .priorityGesture(GestureGroup(GestureMode.Exclusive,
            SwipeGesture()
              .onAction((event: GestureEvent) => {
                if (event && this.model) {
                  if (this.customUiTriggerEvent === EventType.SingleTap &&
                  this.model.eventControl.eventIsEnable(EventType.SingleTap) && this.model.getTouchEnabled()
                  ) {
                    this.calcCustomUiInfo(event)
                  }
                  if (this.model.isDragDecelerationEnabled()) {
                    this.model.computeScroll(event);
                  }
                }
              }),
            GestureGroup(GestureMode.Parallel,
              TapGesture({ count: 2 })
                .onAction((event?: GestureEvent) => {
                  if (event && this.model) {
                    this.model.onDoubleTap(false, event);
                    if (this.customUiTriggerEvent === EventType.DoubleTap &&
                    this.model.eventControl.eventIsEnable(EventType.DoubleTap) && this.model.getTouchEnabled()
                    ) {
                      this.calcCustomUiInfo(event)
                    }
                  }
                }),
              TapGesture({ count: 1 })
                .onAction((event?: GestureEvent) => {
                  if (event && this.model) {
                    this.model.onSingleTapUp(false, event);
                    if (this.customUiTriggerEvent === EventType.SingleTap &&
                    this.model.eventControl.eventIsEnable(EventType.SingleTap) && this.model.getTouchEnabled()
                    ) {
                      this.calcCustomUiInfo(event)
                    }
                  }
                }),
            ),
            LongPressGesture({ duration: this.model?.getLongPressDuration() })
              .onAction((event?: GestureEvent) => {
                if (this.model && event) {
                  this.model.onLongPress(false, 'Down', event);
                  if (this.customUiTriggerEvent === EventType.LongPress &&
                  this.model.eventControl.eventIsEnable(EventType.LongPress) && this.model.getTouchEnabled()
                  ) {
                    this.calcCustomUiInfo(event);
                  }
                }
              })
              .onActionEnd((event?: GestureEvent) => {
                if (this.model && event) {
                  this.model.onLongPress(false, 'Up', event);
                }
              })
              .onActionCancel((event?: GestureEvent) => {
                if (this.model && event) {
                  this.model.onLongPress(false, 'Cancel', event);
                }
              }),
            PinchGesture({ fingers: 2 })
              .onActionStart((event?: GestureEvent) => {
                if (this.model && event) {
                  this.model.onPinch(false, 'Start', event);
                }
              })
              .onActionUpdate((event?: GestureEvent) => {
                if (this.model && event) {
                  this.model.onPinch(false, 'Update', event);
                }
              })
              .onActionEnd((event?: GestureEvent) => {
                if (this.model && event) {
                  this.model.onPinch(false, 'End', event);
                }
              })
              .onActionCancel((event?: GestureEvent) => {
                if (this.model && event) {
                  this.model.onPinch(false, 'Cancel', event);
                }
              })
          ))
          .scale({
            x: this.model?.getHorizontalFlip() ? -1 : 1
          })
        if (this.customUiInfo && this.customUiInfo.showUi) {
          this.customUiBuilder()
        }
        if (this.isAccessShow) {
          Row()
            .width(this.accessWidth)
            .height(this.accessHeight)
            .borderWidth(2)
            .borderColor(Color.Green)
            .position({
              x: this.accessX,
              y: this.accessY
            })
        }
        Canvas(this.highlightContext2D)
          .onReady(() => {
            this.model?.setHighlightContext2D(this.highlightContext2D);
          }).hitTestBehavior(HitTestMode.None)
      }
    }
    .accessibilityLevel("yes")
    .accessibilityGroup(true)
    .accessibilityText(this.content) // 无障碍文本的内容，若组件既拥有文本属性又拥有无障碍文本属性，则组件被选中时，仅播报无障碍文本内容。
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
              if (entry) {
                this.isAccessShow = false;
                let matchText = {
                  '{x}': entry.getX().toFixed(1),
                  '{y}': entry.getY().toFixed(1),
                } as Record<string, string>;
                this.content = readChartText != '' ? Utils.matchingTemplate(readChartText, matchText) : `横坐标: ${entry.getX()}, 纵坐标: ${entry.getY().toFixed(1)}`;
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

