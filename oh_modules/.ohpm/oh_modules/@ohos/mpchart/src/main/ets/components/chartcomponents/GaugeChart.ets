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

import { GaugeChartModel } from "../charts/GaugeChartModel";
import MoveViewJob from "../jobs/MoveViewJob";
import { GlobalContext } from "../utils/GlobalContext";
import { LogUtil } from "../utils/LogUtil";
import Utils from "../utils/Utils";

@Component
export struct GaugeChart {
  model: GaugeChartModel | null = null;
  antiAliasing: boolean = true;
  private setting: RenderingContextSettings | null = null;
  private context2D: CanvasRenderingContext2D | null = null;
  @State content: string = '';

  aboutToAppear(): void {
    LogUtil.log('GaugeChart aboutToAppear: enter');
    this.setting = new RenderingContextSettings(this.antiAliasing);
    this.context2D = new CanvasRenderingContext2D(this.setting);
    GlobalContext.getContext().setObject("uiContext", this.getUIContext());
  }

  aboutToDisappear(): void {
    MoveViewJob.cleanup();
    GlobalContext.getContext().dispose();
  }

  build() {
    Column() {
      Canvas(this.context2D)
        .onReady(() => {
          if (this.context2D && this.model) {
            this.model.setContext2D(this.context2D);
          }
        })
        .onAreaChange((oldArea, newArea) => {
          if (this.context2D && this.model) {
            this.model.onChartSizeChanged(
              Number(newArea.width),
              Number(newArea.height)
            );
            this.model.onDraw(this.context2D);
          }
        })
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
          let readChartText = this.model.getReadChartText();
          let accessibilityItem = this.model?.checkAccessibilityItem(event.x,event.y);
          if (accessibilityItem) {
            let matchText = {
              '{type}': accessibilityItem.type,
              '{value}': accessibilityItem?.value
            } as Record<string, string>;
            this.content = readChartText ? Utils.matchingTemplate(readChartText, matchText) : `类型 : ${accessibilityItem.type}, 值为 : ${accessibilityItem.value}`;
          } else {
            this.content = 'No section selected';
          }
        }
      } catch (err) {
        LogUtil.error(err);
      }
    })
    .width('100%')
    .height('100%')
  }
}