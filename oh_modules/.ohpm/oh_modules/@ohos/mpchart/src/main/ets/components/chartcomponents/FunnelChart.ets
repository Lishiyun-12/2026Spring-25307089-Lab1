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
import FunnelChartModel from "../charts/FunnelChartModel";
import Constants from "../utils/Constants";
import { GlobalContext } from "../utils/GlobalContext";
import { LogUtil } from "../utils/LogUtil";
import Utils from "../utils/Utils";


@Component
export struct FunnelChart {
  antiAliasing: boolean = true;
  private setting: RenderingContextSettings = new RenderingContextSettings(this.antiAliasing);
  private context: CanvasRenderingContext2D = new CanvasRenderingContext2D(this.setting);
  model: FunnelChartModel | null = null;
  @State content: string = '';

  aboutToAppear(): void {
    this.setting = new RenderingContextSettings(this.antiAliasing);
    this.context = new CanvasRenderingContext2D(this.setting);
    GlobalContext.getContext().setObject(Constants.UI_CONTEXT, this.getUIContext());
  }

  aboutToDisappear(): void {
  }

  // 构建函数
  build() {
    Column() {
      Canvas(this.context)
        .width('100%')
        .height('100%')
        .onReady(() => {
          if (this.model && this.context) {
            this.model.setContext2D(this.context);
            this.model.invalidate();
          }
        })
        .onSizeChange((oldArea: SizeOptions, newArea: SizeOptions) => {
          if (this.model && this.context &&
            ((newArea.width !== oldArea.width) || (newArea.height !== oldArea.height))) {
            this.model.onChartSizeChanged(Number(newArea.width), Number(newArea.height));
            this.model.invalidate();
          }
        })
        .onTouch((event) => {
          this.model?.onTouchEvent(event);
        })
    }
    .padding(16)
    .backgroundColor('#F5F7FA')
    .borderRadius(12)
    .accessibilityLevel("yes")
    .accessibilityGroup(true)
    .accessibilityText(this.content)
    .onAccessibilityHover((isHover: boolean, event: AccessibilityHoverEvent) => {
      if (!isHover) {
        return
      }
      try {
        if (this.model) {
          let readChartText = this.model.getReadChartText();
          let readOtherText = this.model.getReadOtherText();
          let dataItem = this.model.accessibleReading({ x: event.x, y: event.y });
          if (dataItem) {
            if (dataItem.type === 'series') {
              let matchText = {
                '{type}': dataItem.type,
                '{title}': dataItem.title,
                '{name}': dataItem.data?.name
              } as Record<string, string>;
              this.content = readChartText ? Utils.matchingTemplate(readChartText, matchText) : `类型: ${dataItem.type}, 标题 : ${dataItem.title}, 名称 : ${dataItem.data?.name}`;
            } else {
              let matchText = {
                '{type}': dataItem.type,
                '{title}': dataItem.title
              } as Record<string, string>;
              this.content = readOtherText ? Utils.matchingTemplate(readOtherText, matchText) : `类型: ${dataItem.type}, 标题 : ${dataItem.title}`;
            }
          } else {
            this.content = 'No section selected';
          }
        }
      } catch (err) {
        LogUtil.error(err);
      }
    })
  }
}