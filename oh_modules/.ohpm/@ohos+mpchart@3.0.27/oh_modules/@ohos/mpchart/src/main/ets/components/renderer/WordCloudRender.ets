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

import WordCloudData from "../data/WordCloudData";
import {
  SeriesData,
  WordCloudSeriesData,
  TooltipInfo,
  WordCloudColorType
} from "../interfaces/datasets/WordCloudDataSet";
import ViewPortHandler from "../utils/ViewPortHandler";
import { Rect, Container, Word, Point, GetConvertShape } from '../interfaces/dataprovider/WordCloudDataProvider'
import { GlobalContext } from "../utils/GlobalContext";
import Constants from "../utils/Constants";
import Paint from "../data/Paint";
import Utils from "../utils/Utils";
import { LogUtil } from '../utils/LogUtil';
import { MPChartTraceUtil } from '../utils/MPChartTraceUtil';
import { TraceLogConstants } from '../utils/TraceConfig';

const SCALE: number = 4;
const DEFAULT_OFFSET = 4;

interface CalculationCache {
  vpToPx: number;
  chartWidth: number;
  chartHeight: number;
  offscreenCanvasSize: Container;
}

interface WordPosition {
  word: Word,
  point: Point
}

interface ShapeInfo extends Rect {
  color?: WordCloudColorType
}

export default class  WordCloudRender {
  protected mViewPortHandler: ViewPortHandler | null = null;
  private context2d: CanvasRenderingContext2D | null = null;
  private option: WordCloudData | null = null;
  private offscreenContext2d: OffscreenCanvasRenderingContext2D | null = null;
  private occupiedArea: boolean[][] = [];
  private placedWords: TooltipInfo[] = [];
  private maskShapeFunction: (container: Rect, ctx: CanvasRenderingContext2D | OffscreenCanvasRenderingContext2D,
    backgroundColor: WordCloudColorType) => void = () => {
  };
  private calculationCache: CalculationCache | null = null;
  private isCacheValid: boolean = false;
  protected offsetWordList: WordPosition[] = [];
  protected shapeInfoList: ShapeInfo[] = [];

  constructor(viewPortHandler: ViewPortHandler, context2d: CanvasRenderingContext2D) {
    this.mViewPortHandler = viewPortHandler;
    this.context2d = context2d;
  }

  setViewPortHandler(viewPortHandler: ViewPortHandler) {
    this.mViewPortHandler = viewPortHandler;
  }

  private invalidateCache() {
    this.isCacheValid = false;
    this.calculationCache = null;
  }

  private updateCalculationCache() {
    if (this.isCacheValid && this.calculationCache) {
      return;
    }

    this.placedWords = [];
    this.offsetWordList = [];
    this.shapeInfoList = [];
    const vpToPx = this.getVp2px();
    const chartWidth = this.mViewPortHandler?.getChartWidth() || 0;
    const chartHeight = this.mViewPortHandler?.getChartHeight() || 0;
    const offscreenCanvasSize = this.getOffscreenCanvasSize();

    this.calculationCache = {
      vpToPx,
      chartWidth,
      chartHeight,
      offscreenCanvasSize
    };
    this.isCacheValid = true;
  }

  public setOption(option: WordCloudData) {
    this.option = option;
    this.invalidateCache();
  }

  public draw() {
    if (!this.context2d || !this.option || !this.mViewPortHandler) {
      return;
    }
    this.updateCalculationCache();
    this.drawData();
  }

  private drawData() {
    const series = this.option?.getSeries();
    if (!this.calculationCache || !series?.length) {
      return;
    }
    const rectWidth = this.calculationCache.chartWidth;
    const rectHeight = this.calculationCache.chartHeight;

    try {
      LogUtil.log("WordCloudRenderer drawDataSet - start");
      MPChartTraceUtil.startInfo(TraceLogConstants.Tag.WordCloudChartSetData);
      for (let i = 0; i < series.length; i++) {
        const seriesOption = series[i];
        this.drawDataSet(seriesOption, rectWidth, rectHeight);
        LogUtil.info('WordCloudRenderer drawDataSet succeed ' + `data:${JSON.stringify(seriesOption.data)}`);
      }
      LogUtil.log("WordCloudRenderer drawDataSet - end");
    } catch (e) {
      LogUtil.error('WordCloudRenderer drawDataSet error', e);
      MPChartTraceUtil.startError(TraceLogConstants.Tag.WordCloudChartSetData);
    } finally {
      MPChartTraceUtil.finish(TraceLogConstants.Tag.WordCloudChartSetData);
    }
  }

  private getOffscreenCanvasSize(): Container {
    if (this.calculationCache) {
      return this.calculationCache.offscreenCanvasSize;
    }
    const rectWidth = this.mViewPortHandler?.getChartWidth() || 0;
    const rectHeight = this.mViewPortHandler?.getChartHeight() || 0;
    return this.createContainer(rectWidth / (2 * SCALE), rectHeight / (2 * SCALE), rectWidth / SCALE,
      rectHeight / SCALE);
  }

  private createContainer(x: number, y: number, width: number, height: number) {
    return new Container(x, y, width, height);
  }

  private getVp2px(): number {
    if (this.calculationCache) {
      return this.calculationCache.vpToPx;
    }

    const uiContext = GlobalContext.getContext().getObject(Constants.UI_CONTEXT) as UIContext;
    return uiContext.vp2px(1);
  }

  private initOccupiedArea(width: number, height: number) {
    const vpToPx = this.getVp2px();
    const x = Math.ceil(width * vpToPx);
    const y = Math.ceil(height * vpToPx);
    this.occupiedArea = new Array(x + 1);
    for (let i = 0; i <= x; i++) {
      this.occupiedArea[i] = new Array(y + 1).fill(false);
    }
  }

  private setShapeMask(x: number, y: number, width: number, height: number,
    ctx: CanvasRenderingContext2D | OffscreenCanvasRenderingContext2D, backgroundColor: WordCloudColorType) {
    const rect: Rect = {
      x: x + width / 2,
      y: y + height / 2,
      width,
      height,
      left: x,
      top: y
    }
    this.maskShapeFunction(rect, ctx, backgroundColor);
  }

  setSeriesShape(showShapeMask: boolean, rect: Rect, color: WordCloudColorType) {
    if (showShapeMask) {
      this.shapeInfoList.push({
        x: rect.x + rect.width / 2,
        y: rect.y + rect.height / 2,
        width: rect.width,
        height: rect.height,
        left: rect.x,
        top: rect.y,
        color
      });
      this.setShapeMask(rect.x, rect.y, rect.width, rect.height, this.context2d!, color);
    }
  }

  private setMaskImageData(x: number, y: number, width: number, height: number) {
    if (this.offscreenContext2d) {
      this.setShapeMask(x, y, width, height, this.offscreenContext2d, '#000000');
      const imageData = this.offscreenContext2d!.getImageData(x, y, width, height);

      this.processImageData(imageData);
      this.offscreenContext2d.reset();
    }
  }

  private processImageData(imageData: ImageData): void {
    const data = imageData.data;
    const width = imageData.width;
    const dataLength = data.length;

    for (let i = 3; i < dataLength; i += 4) {
      if (data[i]) {
        const pixelIndex = i >> 2;
        const x = pixelIndex % width;
        const y = pixelIndex / width | 0;

        if (this.occupiedArea[x] && this.occupiedArea[x][y] !== undefined) {
          this.occupiedArea[x][y] = true;
        }
      }
    }
  }

  private setOffscreenContext2d(width: number, height: number) {
    this.offscreenContext2d = new OffscreenCanvasRenderingContext2D(width, height, new RenderingContextSettings(true));
  }

  private drawDataSet(seriesOption: WordCloudSeriesData, rectWidth: number, rectHeight: number) {
    if (!this.option || !seriesOption.data.length) {
      return;
    }
    const rect = this.calcChartItemSize(seriesOption, rectWidth, rectHeight);
    const seriesData = this.option.sortSeriesData(seriesOption.data);
    this.maskShapeFunction = GetConvertShape(seriesOption.shape);
    LogUtil.info(`WordCloudRenderer drawDataSet shape：${JSON.stringify(seriesOption.shape)}`);

    const offsetCanvasWidth = rect.width / SCALE;
    const offsetCanvasHeight = rect.height / SCALE;
    this.initOccupiedArea(offsetCanvasWidth, offsetCanvasHeight);
    this.setOffscreenContext2d(offsetCanvasWidth, offsetCanvasHeight);
    this.setMaskImageData(0, 0, offsetCanvasWidth, offsetCanvasHeight);

    this.setSeriesShape(seriesOption.showShapeMask, rect, seriesOption.backgroundColor);

    const offsetContainer =
      new Container(offsetCanvasWidth / 2, offsetCanvasHeight / 2, offsetCanvasWidth, offsetCanvasHeight);
    const textWeightRange = this.option.getTextWeightRange(seriesData);
    this.processWords(seriesData, seriesOption, offsetContainer, rect, textWeightRange);
  }

  private calculateDimension(size: string | number | undefined, totalSize: number): number {
    if (!size) {
      return 0;
    }
    return typeof size === 'string' ? this.getActualLength(size, totalSize) : size;
  }

  private calcChartItemSize(seriesOption: WordCloudSeriesData, rectWidth: number, rectHeight: number): Rect {

    const width = this.calculateDimension(seriesOption.width, rectWidth);
    const height = this.calculateDimension(seriesOption.height, rectHeight);

    const offsetX = this.calculateOffsets(seriesOption.left, seriesOption.right, rectWidth, width);
    const offsetY = this.calculateOffsets(seriesOption.top, seriesOption.bottom, rectHeight, height);

    return {
      x: Math.min(offsetX[0], offsetX[1]),
      y: Math.min(offsetY[0], offsetY[1]),
      width: width || Math.abs(offsetX[1] - offsetX[0]),
      height: height || Math.abs(offsetY[1] - offsetY[0])
    };
  }

  private calculateOffset(value: string | number | undefined, totalSize: number,
    size: number, isEnd: boolean): number {
    if (typeof value === 'string') {
      return this.calculateStringOffset(value, totalSize, size, isEnd);
    }
    return isEnd ? (totalSize - (value || 0)) : (value || 0);
  }

  private calculateStringOffset(value: string, totalSize: number, size: number, isEnd: boolean): number {
    switch (value) {
      case 'left':
      case 'top':
        return isEnd ? totalSize : 0;
      case 'center':
        return totalSize * 0.5;
      case 'right':
      case 'bottom':
        return isEnd ? 0 : (totalSize - size);
      default:
        const length = this.getActualLength(value, totalSize);
        return isEnd ? (totalSize - length) : length;
    }
  }

  private calculateOffsets(start: string | number | undefined, end: string | number | undefined,
    totalSize: number, size: number): [number, number] {
    const startOffset = this.calculateOffset(start, totalSize, size, false);
    const endOffset = this.calculateOffset(end, totalSize, size, true);
    return [startOffset, endOffset];
  }

  private getActualLength(value: string | number | undefined, length: number): number {
    if (!value) {
      return 0;
    }
    if (typeof value === 'number') {
      return value;
    }
    if (typeof value === 'string') {
      return length * (parseFloat(value) / 100);
    }
    return 0;
  }

  private getWordSize(textWeightRange: [number, number], sizeRange: [number, number], value: number) {
    const minSize = Math.max(sizeRange[0], 6);
    const maxSize = sizeRange[1];
    let valueExtent = 1;
    const length = (textWeightRange[0] - textWeightRange[1]);
    if (length === 0) {
      valueExtent = 0.5;
    } else {
      valueExtent = ((value - textWeightRange[1]) / length);
    }

    return minSize + ((maxSize - minSize) * valueExtent);
  }

  private getRandomInRange(rotationRange: [number, number], rotationStep: number): number {
    const rotationLength = Math.abs(rotationRange[1] - rotationRange[0]);
    const randomSteps = Math.round(Math.random() * rotationLength / rotationStep);
    return rotationRange[0] + randomSteps * rotationStep;
  }

  private processWords(seriesData: SeriesData[], seriesOption: WordCloudSeriesData, container: Container,
    rect: Rect, textWeightRange: [number, number]): void {
    const sizeRange = seriesOption.sizeRange;
    const rotationRange = seriesOption.rotationRange;
    const rotationStep = seriesOption.rotationStep;

    for (let i = 0; i < seriesData.length; i++) {
      const word = seriesData[i];
      const fontSize = this.getWordSize(textWeightRange, sizeRange, word.value);
      LogUtil.info(`WordCloudRenderer drawText text：${word.name}，fontSize：${JSON.stringify(fontSize)}vp`);

      const angle = this.getRandomInRange(rotationRange, rotationStep);
      const offscreenWord = this.getOffscreenWord(word.name, word.value, fontSize, word.color || Color.Black, angle);
      if (offscreenWord) {
        const vpToPx = this.getVp2px();
        const position = this.calcWordPosition(container, offscreenWord, vpToPx);
        this.dealPointToDrawText(offscreenWord, position, vpToPx, seriesOption.name, rect);
      }
    }
  }

  private getOffscreenWord(name: string, value: number, fontSize: number, color: WordCloudColorType, angle: number) {
    if (!this.offscreenContext2d) {
      return null;
    }
    const offscreenWord = new Word(name, value, fontSize, color);
    offscreenWord.setAngle(angle);

    this.offscreenContext2d.reset();
    this.offscreenContext2d.textBaseline = 'middle';
    this.offscreenContext2d.font = `${offscreenWord.weight / SCALE}vp sans-serif`;

    const textInfo = this.offscreenContext2d.measureText(offscreenWord.text);
    const radius = Math.hypot(textInfo.height, textInfo.width) / 2;
    const theta = angle * Math.PI / 180;

    this.offscreenContext2d.translate(radius, radius);
    this.offscreenContext2d.rotate(theta);
    this.offscreenContext2d.fillText(offscreenWord.text, -textInfo.width / 2, 0);

    const imageData = this.offscreenContext2d.getImageData(0, 0, radius * 2, radius * 2);
    const textImageDataPoint = this.getImageDataPoint(imageData);

    this.offscreenContext2d.reset();

    offscreenWord.setSize(textInfo.width, textInfo.height);
    offscreenWord.setTextImageDataPoint(textImageDataPoint);
    offscreenWord.setTextRadius(radius);

    return offscreenWord;
  }

  private dealPointToDrawText(offscreenWord: Word, position: Point | null, vpToPx: number, title: string, rect: Rect) {
    if (!position) {
      return;
    }
    this.setOccupiedArea(offscreenWord, position, vpToPx);

    const textRect = offscreenWord.getTextRect();
    const realPoint: Point = { x: position.x + rect.x / SCALE, y: position.y + rect.y / SCALE };

    this.setPlaceWord(title, offscreenWord, offscreenWord.getAngle(), realPoint, textRect);

    this.offsetWordList.push({ word: offscreenWord, point: realPoint });
    this.drawRotatedText(offscreenWord, realPoint);
  }

  private getImageDataPoint(imageData: ImageData): Point[] {
    const points: Point[] = [];
    const data = imageData.data;
    const width = imageData.width;
    const dataLength = data.length;

    for (let i = 3; i < dataLength; i += 4) {
      if (data[i]) {
        const pixelIndex = i >> 2;
        points.push({
          x: pixelIndex % width,
          y: pixelIndex / width | 0
        });
      }
    }
    return points;
  }

  private calcWordPosition(container: Container, word: Word, vpToPx: number): Point | null {
    const textRect = word.getTextRect();
    const textRadius = word.getTextRadius();
    const textImageDataPoint = word.getTextImageDataPoint();
    const centerX = container.x;
    const centerY = container.y;
    const centerRadius = Math.floor(Math.max(container.width, container.height) / 2);
    const maxRadius = Math.floor(Math.sqrt(centerRadius**2 - (textRect.width / 2)**2) - textRect.height / 2);

    for (let radius = 0; radius < maxRadius; radius += 1) {
      for (let angle = 0; angle < Math.PI * 2; angle += 0.2) {
        const cx = centerX + radius * Math.cos(angle) - textRadius;
        const cy = centerY + radius * Math.sin(angle) - textRadius;
        if (this.isPositionValid(cx, cy, textRect, maxRadius)) {
          const pixelX = Math.floor(cx * vpToPx);
          const pixelY = Math.floor(cy * vpToPx);

          if (this.canFitText(pixelX, pixelY, textImageDataPoint)) {
            return { x: cx + textRadius, y: cy + textRadius };
          }
        }
      }
    }
    return null;
  }

  private isPositionValid(x: number, y: number, textRect: Rect, maxRadius: number): boolean {
    return x >= 0 && y >= 0 &&
      x + textRect.width <= maxRadius * 2 &&
      y + textRect.height <= maxRadius * 2;
  }

  private canFitText(x: number, y: number, textImageDataPoint: Point[]) {
    for (let i = 0, len = textImageDataPoint.length - 1; i < len; i++) {
      const point = textImageDataPoint[i];
      const col = this.occupiedArea[point.x + x];
      if (!col || !col[point.y + y]) {
        return false;
      }
    }
    return true;
  }

  private setOccupiedArea(offscreenWord: Word, position: Point, vpToPx: number) {
    const textRadius = offscreenWord.getTextRadius();
    const baseX = Math.floor((position.x - textRadius) * vpToPx);
    const baseY = Math.floor((position.y - textRadius) * vpToPx);
    offscreenWord.getTextImageDataPoint().forEach((p: Point) => {
      this.occupiedArea[p.x + baseX][p.y + baseY] = false;
    });
  }

  private drawRotatedText(offscreenWord: Word, position: Point): void {
    if (!this.context2d) {
      return;
    }

    this.context2d.save();

    const textInfo = offscreenWord.getTextInfo();
    const radius = Math.hypot(textInfo.height, textInfo.width) / 2;
    const theta = offscreenWord.getAngle() * Math.PI / 180;

    this.context2d.translate(
      (position.x - radius) * SCALE,
      (position.y - radius) * SCALE
    );
    this.context2d.rotate(theta);

    const point = this.rotatePoint(radius, -radius, theta);
    const translateY = (-radius - point.y) * SCALE;
    const translateX = (point.x - radius) * SCALE;
    this.context2d.translate(translateX, translateY);

    // Draw text
    this.context2d.textBaseline = 'middle';
    this.context2d.fillStyle = offscreenWord.color;
    this.context2d.font = `${textInfo.weight}vp sans-serif`;
    this.context2d.fillText(
      offscreenWord.text,
      (radius - textInfo.width / 2) * SCALE,
      radius * SCALE
    );

    this.context2d.setTransform(1, 0, 0, 1, 0, 0);
    this.context2d.restore();
  }

  private rotatePoint(x: number, y: number, theta: number): Point {
    const cos = Math.cos(theta);
    const sin = Math.sin(theta);

    return {
      x: x * cos - y * sin,
      y: x * sin + y * cos
    };
  }

  private setPlaceWord(title: string, word: Word, angle: number, position: Point, textRect: Rect) {
    const left = (position.x - textRect.width / 2) * SCALE;
    const top = (position.y - textRect.height / 2) * SCALE;
    this.placedWords.push({
      title,
      name: word.text,
      value: word.value,
      angle,
      left,
      top,
      width: textRect.width * SCALE,
      height: textRect.height * SCALE
    })
  }

  public getPlaceWord() {
    return this.placedWords;
  }

  private drawRoundRect(left: number, top: number, width: number, height: number,
    backgroundColor: string | number | CanvasGradient | CanvasPattern = 'rgba(0,0,0,0)', radius: number = 0,
    lineWidth: number = 1, strokeStyle: string | number | CanvasGradient | CanvasPattern = '#000000') {
    if (!this.context2d) {
      return;
    }
    this.context2d.save();

    this.context2d.fillStyle = backgroundColor;
    this.context2d.lineWidth = lineWidth;
    this.context2d.strokeStyle = strokeStyle;

    this.context2d.beginPath();

    this.context2d.moveTo(left + radius, top);
    this.context2d.lineTo(left + width - radius, top);
    this.context2d.arcTo(left + width, top, left + width, top + radius, radius);
    this.context2d.lineTo(left + width, top + height - radius);
    this.context2d.arcTo(left + width, top + height, left + width - radius, top + height, radius);
    this.context2d.lineTo(left + radius, top + height);
    this.context2d.arcTo(left, top + height, left, top + height - radius, radius);
    this.context2d.lineTo(left, top + radius);
    this.context2d.arcTo(left, top, left + radius, top, radius);

    this.context2d.closePath();

    this.context2d.stroke();
    this.context2d.fill();
  }

  private drawText(text: string, fontSize: number, fontColor: string | number | CanvasGradient | CanvasPattern,
    left: number,
    top: number, fontWeight: string | number = 'normal', textBaseline: CanvasTextBaseline = 'top') {
    if (!this.context2d) {
      return;
    }
    this.context2d.save();
    this.context2d.fillStyle = fontColor;
    this.context2d.textAlign = 'left';
    this.context2d.textBaseline = textBaseline;
    this.context2d.font = `${fontWeight} ${fontSize}vp  sans-serif`;
    this.context2d.fillText(text, left, top);
  }

  public reDrawText() {
    for (let i = 0; i < this.offsetWordList.length; i++) {
      const item = this.offsetWordList[i];
      this.drawRotatedText(item.word, item.point);
    }
  }

  public reDrawShape() {
    if (this.context2d) {
      for (let i = 0; i < this.shapeInfoList.length; i++) {
        const item = this.shapeInfoList[i];
        this.maskShapeFunction(item as Rect, this.context2d, item.color!);
      }
    }

  }

  public drawTooltip(tooltipInfo: TooltipInfo, point: Point) {
    try {
      if (!this.option || !this.option.isShowTooltip()) {
        return;
      }
      LogUtil.log("WordCloudRenderer drawTooltip - start");
      this.reDrawShape();
      this.reDrawText();
      const tooltipOption = this.option.getTooltip();
      LogUtil.info('WordCloudRenderer drawTooltip succeed ' + `title:${JSON.stringify(tooltipInfo.title)}` +
        `name:${JSON.stringify(tooltipInfo.name)}` + `value:${JSON.stringify(tooltipInfo.value)}`);
      const textList = this.option.getTooltipTextList(tooltipInfo.title, tooltipInfo.name, tooltipInfo.value);
      const maxText = textList.reduce((prev, current) => prev.length > current.length ? prev : current);
      const paint = new Paint();
      paint.setTextSize(tooltipOption.textFont);
      const textWidth = Utils.calcTextWidth(paint, maxText);
      const textHeight = Utils.calcTextHeight(paint, maxText);

      const rectWidth = textWidth + DEFAULT_OFFSET * 2;
      const rectHeight = textHeight * textList.length + DEFAULT_OFFSET * 2;

      this.drawRoundRect(point.x, point.y, rectWidth, rectHeight, tooltipOption.backgroundColor,
        tooltipOption.borderRadius, tooltipOption.borderWidth, tooltipOption.borderColor);

      const textBaseX = point.x + DEFAULT_OFFSET;
      const textBaseY = point.y + DEFAULT_OFFSET;

      for (let i = 0; i < textList.length; i++) {
        const text = textList[i];
        this.drawText(text, tooltipOption.textFont, tooltipOption.textColor, textBaseX, textBaseY + textHeight * i);
      }
      LogUtil.log("WordCloudRenderer drawTooltip - end");
    } catch (e) {
      LogUtil.error('WordCloudRenderer drawTooltip error', e);

    }
  }

  public drawAccessibleReadingLine(tooltipInfo: TooltipInfo) {
    if (!this.context2d) {
      return;
    }

    this.context2d.save();

    const halfHeight = tooltipInfo.height / 2;
    const halfWidth = tooltipInfo.width / 2;

    const centerX = tooltipInfo.left + halfWidth;
    const centerY = tooltipInfo.top + halfHeight;

    const radius = Math.hypot(tooltipInfo.height, tooltipInfo.width) / 2;
    const theta = tooltipInfo.angle * Math.PI / 180;

    this.context2d.translate(
      (centerX - radius),
      (centerY - radius)
    );
    this.context2d.rotate(theta);

    const point = this.rotatePoint(radius, -radius, theta);
    const translateY = (-radius - point.y);
    const translateX = (point.x - radius);
    this.context2d.translate(translateX, translateY);

    // 自定义框颜色
    this.context2d.strokeStyle = '#6bc843';
    this.context2d.lineWidth = 3;
    this.context2d.strokeRect(radius - halfWidth, radius - halfHeight, tooltipInfo.width, tooltipInfo.height);

    this.context2d.setTransform(1, 0, 0, 1, 0, 0);
    this.context2d.restore();
  }

  public clearCanvas() {
    if (!this.context2d) {
      return;
    }
    const rectWidth = this.mViewPortHandler?.getChartWidth() || 0;
    const rectHeight = this.mViewPortHandler?.getChartHeight() || 0;
    this.context2d.clearRect(0, 0, rectWidth, rectHeight);
    this.context2d.reset();
  }
}
