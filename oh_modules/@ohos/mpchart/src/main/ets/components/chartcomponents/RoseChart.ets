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

import RoseChartModel from '../charts/RoseChartModel'
import Constants from '../utils/Constants';
import { GlobalContext } from '../utils/GlobalContext';
import { LogUtil } from '../utils/LogUtil';
import Utils from '../utils/Utils';

@Component
export default struct RoseChart {
  model: RoseChartModel | null = null
  antiAliasing: boolean = true;
  private setting: RenderingContextSettings | null = null;
  context2D: CanvasRenderingContext2D | null = null;
  @State content: string = '';
  @State showAccessRect: boolean = false;
  @State accessRectWidth: number = 0;
  @State accessRectHeight: number = 0;
  @State accessRectX: number = 0;
  @State accessRectY: number = 0

  invalidate() {
    this.model?.invalidate();
  }

  aboutToAppear() {
    LogUtil.log('-----------aboutToAppear: enter');
    this.setting = new RenderingContextSettings(this.antiAliasing);
    this.context2D = new CanvasRenderingContext2D(this.setting);
    GlobalContext.getContext().setObject(Constants.UI_CONTEXT, this.getUIContext());
  }

  build() {
    Stack() {
      Canvas(this.context2D)
        .onReady(() => {
          this.model?.setContext2D(this.context2D!)
        })
        .onTouch((event) => {
          this.model?.onTouchEvent(event);
        })
      Row()
        .width(this.accessRectWidth)
        .height(this.accessRectHeight)
        .position({ x: this.accessRectX, y: this.accessRectY })
        .visibility(this.showAccessRect ? Visibility.Visible : Visibility.None)
        .border({width: 3, color: '#6bc843'})
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
          let readLegendText = this.model.getReadLegendText();
          let highlight = this.model.getSectorByTouchPoint(event.x, event.y);
          if (highlight) {
            this.showAccessRect = false
            let matchText = {
              '{label}': highlight.label,
              '{value}': highlight.value.toFixed(1),
            } as Record<string, string>;
            this.content = readChartText ? Utils.matchingTemplate(readChartText, matchText) : `选中的块: ${highlight.label}, 值为: ${highlight.value}`;
          } else {
            let label = this.model.getLabelByTouchPoint(event.x, event.y);
            if (label !== undefined) {
              this.accessRectWidth = label.width;
              this.accessRectHeight = label.height + 5;
              this.accessRectX = label.x;
              this.accessRectY = label.y;
              let matchText = {
                '{legend}': label.label,
              } as Record<string, string>;
              this.content = readLegendText ? Utils.matchingTemplate(readLegendText, matchText) : `图例 : ${ label.label}`;
              this.showAccessRect = true;
            } else {
              this.showAccessRect = false;
              this.content = 'No section selected';
            }
          }
        }
      } catch (err) {
        LogUtil.error(err);
      }
    })
  }
}