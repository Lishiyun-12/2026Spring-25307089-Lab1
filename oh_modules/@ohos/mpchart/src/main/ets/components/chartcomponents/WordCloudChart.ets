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

import WordCloudChartModel from '../charts/WordCloudChartModel';
import Constants from '../utils/Constants';
import { GlobalContext } from '../utils/GlobalContext';
import { LogUtil } from '../utils/LogUtil';
import Utils from '../utils/Utils';

@Component
export default struct WordCloudChart {
  model: WordCloudChartModel | null = null;
  antiAliasing: boolean = true;
  private setting: RenderingContextSettings | null = null;
  private context2D: CanvasRenderingContext2D | null = null;
  @State content: string = '';

  aboutToAppear(): void {
    this.setting = new RenderingContextSettings(this.antiAliasing);
    this.context2D = new CanvasRenderingContext2D(this.setting);
    GlobalContext.getContext().setObject(Constants.UI_CONTEXT, this.getUIContext());
  }

  aboutToDisappear(): void {
  }

  build() {
    Column() {
      Stack() {
        Canvas(this.context2D)
          .width('100%')
          .height('100%')
          .onReady(() => {
            if (this.model && this.context2D) {
              this.model.setContext2D(this.context2D);
              this.model.invalidate();
            }
          })
          .onSizeChange((oldArea: SizeOptions, newArea: SizeOptions) => {
            if (this.model && this.context2D &&
              ((newArea.width !== oldArea.width) || (newArea.height !== oldArea.height))) {
              this.model.onChartSizeChanged(Number(newArea.width), Number(newArea.height));
              this.model.invalidate();
            }
          })
          .onTouch((event) => {
            this.model?.onTouchEvent(event);
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
          let readChartText = this.model.getReadChartText();
          let tooltipInfo = this.model.accessibleReading({ x: event.x, y: event.y });
          if (tooltipInfo) {
            let matchText = {
              '{title}': tooltipInfo.title,
              '{name}': tooltipInfo.name,
              '{value}': tooltipInfo.value.toFixed(1)
            } as Record<string, string>;
            this.content = readChartText ? Utils.matchingTemplate(readChartText, matchText) : `标题: ${tooltipInfo.title}, 名称: ${tooltipInfo.name}, 值为: ${tooltipInfo.value}`;
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