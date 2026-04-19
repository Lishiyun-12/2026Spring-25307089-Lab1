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

import {
  Point,
} from '../interfaces/dataprovider/WordCloudDataProvider'
import WordCloudData from '../data/WordCloudData';
import ViewPortHandler from '../utils/ViewPortHandler';
import WordCloudRender from '../renderer/WordCloudRender';
import { TooltipInfo, WordCloudOption } from '../interfaces/datasets/WordCloudDataSet';

export default class WordCloudChartModel {
  private context2d: CanvasRenderingContext2D | null = null;
  private option: WordCloudData = new WordCloudData();
  protected mViewPortHandler: ViewPortHandler = new ViewPortHandler();
  protected render: WordCloudRender | null = null;
  protected tooltipIsShow: boolean = false;
  protected drawTimer: number | null = null;
  protected readChartText: string = '';

  public setContext2D(context2d: CanvasRenderingContext2D) {
    this.context2d = context2d;
  }

  public setOption(funnelOption: WordCloudOption) {
    this.option.merge(funnelOption);
  }

  public setReadChartText(readChartText: string) {
    this.readChartText = readChartText;
  }

  public getReadChartText(): string {
    return this.readChartText;
  }

  public invalidate() {
    this.onDraw();
  }

  private onDraw() {
    if (!this.context2d) {
      return;
    }

    if (!this.render) {
      this.render = new WordCloudRender(this.mViewPortHandler, this.context2d);
    }
    this.render.clearCanvas();
    this.render.setOption(this.option);
    this.render.draw();
  }

  public onChartSizeChanged(newWidth: number, newHeight: number) {
    if (newWidth > 0 && newHeight > 0 && newWidth < 10000 && newHeight < 10000) {
      this.mViewPortHandler.setChartDimens(newWidth, newHeight);
      this.render?.setViewPortHandler(this.mViewPortHandler);
      this.onDraw();
    }
  }

  public notifyDataSetChanged(width: number, height: number): void {
    this.onChartSizeChanged(width, height);
  }

  public accessibleReading(point: Point) {
    if (!this.render) {
      return;
    }
    let selectItem = this.getSelectItem(point);
    if (selectItem) {
      this.render.clearCanvas();
      this.render.reDrawText();
      this.render.drawAccessibleReadingLine(selectItem);
    }
    return selectItem;
  }

  public onTouchEvent(event: TouchEvent) {
    if (this.drawTimer) {
      clearTimeout(this.drawTimer);
    }
    this.drawTimer = setTimeout(() => {
      if (!this.render || !this.option.isShowTooltip()) {
        return;
      }
      const isClick = this.option.getTooltipTriggerOn() === 'click';

      if ((event.type === TouchType.Move && !isClick) || (event.type === TouchType.Up && isClick)) {
        const eventPoint = event.touches[0];
        const point: Point = { x: eventPoint.x, y: eventPoint.y }
        let selectItem = this.getSelectItem(point);
        if (selectItem) {
          this.render.clearCanvas();
          this.render.reDrawText();
          this.render.drawTooltip(selectItem, point);
          this.tooltipIsShow = true;
        } else {
          this.render.clearCanvas();
          this.render.reDrawShape();
          this.render.reDrawText();
          this.tooltipIsShow = false;
        }
      }

      if (event.type === TouchType.Up && !isClick && this.tooltipIsShow) {
        this.render.clearCanvas();
        this.render.reDrawText();
        this.tooltipIsShow = false;
      }
    })
  }

  private getSelectItem(point: Point) {
    const tooltipInfos: TooltipInfo[] = this.render?.getPlaceWord() || [];
    for (let i = 0; i < tooltipInfos.length; i++) {
      const tooltipInfo = tooltipInfos[i];
      if (this.isPointInRotatedRect(point, tooltipInfo)) {
        return tooltipInfo;
      }
    }
    return null;
  }

  private isPointInRotatedRect(point: Point, tooltipInfo: TooltipInfo): boolean {
    const angleRad = (tooltipInfo.angle) * Math.PI / 180;

    const centerX = tooltipInfo.left + tooltipInfo.width / 2;
    const centerY = tooltipInfo.top + tooltipInfo.height / 2;

    const translatedX = point.x - centerX;
    const translatedY = point.y - centerY;

    const cosAngle = Math.cos(-angleRad);
    const sinAngle = Math.sin(-angleRad);

    const rotatedX = translatedX * cosAngle - translatedY * sinAngle;
    const rotatedY = translatedX * sinAngle + translatedY * cosAngle;


    return Math.abs(rotatedX) <= tooltipInfo.width / 2 && Math.abs(rotatedY) <= tooltipInfo.height / 2;
  }
}