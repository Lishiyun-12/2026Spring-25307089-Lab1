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

import { WordCloudColorType } from "../datasets/WordCloudDataSet";

export enum WordCloudType {
  CIRCLE,
  RECT,
  HEART,
  START,
  TRIANGLE,
}

export interface Point {
  x: number;
  y: number;
}

export interface Rect extends Point {
  width: number;
  height: number;
  angle?: number;
  left?: number,
  top?: number
}

export interface TextInfo extends Rect {
  text: string;
  weight: number;
  color: WordCloudColorType;
}

export class Container implements Rect {
  x: number = 0;
  y: number = 0;
  width: number = 0;
  height: number = 0;
  angle: number = 0;

  constructor(x: number, y: number, width: number, height: number) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
  }
}

export class Word {
  text: string = '';
  weight: number = 0;
  color: WordCloudColorType = Color.Black;
  value: number = 0;
  private x: number = 0;
  private y: number = 0;
  private width: number = 0;
  private height: number = 0;
  private angle: number = 0;
  private textImageDataPoint: Point[] = [];
  private textRadius: number = 0;

  constructor(text: string, value: number, weight: number, color: WordCloudColorType = Color.Black) {
    this.text = text;
    this.weight = weight;
    this.color = color;
    this.value = value;
  }

  setPosition(x: number = 0, y: number = 0) {
    this.x = x;
    this.y = y;
  }

  setSize(width: number, height: number) {
    this.width = width;
    this.height = height;
  }

  getTextRect(): Rect {
    return {
      x: this.x,
      y: this.y,
      width: this.width,
      height: this.height
    }
  }

  getTextInfo(): TextInfo {
    return {
      x: this.x,
      y: this.y,
      width: this.width,
      height: this.height,
      angle: this.angle,
      weight: this.weight,
      color: this.color,
      text: this.text
    }
  }

  setTextImageDataPoint(textImageDataPoint: Point[]) {
    this.textImageDataPoint = textImageDataPoint;
  }

  getTextImageDataPoint() {
    return this.textImageDataPoint;
  }

  getTextCenterPoint(): Point {
    return {
      x: this.x + this.width / 2,
      y: this.y - this.height / 2
    }
  }

  setAngle(angle: number = 0) {
    this.angle = angle;
  }

  getAngle() {
    return this.angle || 0;
  }

  getWeight() {
    return this.weight;
  }

  setTextRadius(radius: number) {
    this.textRadius = radius;
  }

  getTextRadius() {
    return this.textRadius;
  }
}


const drawCircleMask = (container: Rect, ctx: OffscreenCanvasRenderingContext2D | CanvasRenderingContext2D,
  backgroundColor: WordCloudColorType) => {
  const x = container.x;
  const y = container.y;
  const radius = Math.min(container.width, container.height) / 2;
  ctx.arc(x, y, radius, 0, Math.PI * 2);
  ctx.fillStyle = backgroundColor;
  ctx.fill();
  ctx.save();
}

const drawRectMask = (container: Rect, ctx: OffscreenCanvasRenderingContext2D | CanvasRenderingContext2D,
  backgroundColor: WordCloudColorType) => {
  ctx.fillStyle = backgroundColor;
  ctx.fillRect(container.left || 0, container.top || 0, container.width, container.height);
  ctx.save();
}

const drawHeartMask = (container: Rect, ctx: OffscreenCanvasRenderingContext2D | CanvasRenderingContext2D,
  backgroundColor: WordCloudColorType) => {
  const radius = Math.min(container.width, container.height) / 2;
  const scale = radius / 15;
  ctx.beginPath();
  let region = new Path2D()
  for (let theta = 0; theta <= 2 * Math.PI; theta += 0.01) {
    const x = 16 * Math.pow(Math.sin(theta), 3);
    const y = 13 * Math.cos(theta) - 5 * Math.cos(2 * theta) - 2 * Math.cos(3 * theta) - Math.cos(4 * theta);
    if (theta === 0) {
      region.moveTo(container.x + x * scale, container.y - y * scale);
    } else {
      region.lineTo(container.x + x * scale, container.y - y * scale);
    }
  }
  ctx.fillStyle = backgroundColor;
  ctx.fill(region, 'evenodd');
  ctx.save();
}

const drawStartMask = (container: Rect, ctx: OffscreenCanvasRenderingContext2D | CanvasRenderingContext2D,
  backgroundColor: WordCloudColorType) => {
  const centerX = container.x;
  const centerY = container.y;
  const outerRadius = Math.min(container.width, container.height) / 2;
  const innerRadius = outerRadius / 2;
  ctx.beginPath();
  for (let i = 0; i < 10; i++) {
    const angle = Math.PI / 2 + i * Math.PI / 5;
    const radius = i % 2 === 0 ? outerRadius : innerRadius;
    const x = centerX + radius * Math.cos(angle);
    const y = centerY - radius * Math.sin(angle);
    if (i === 0) {
      ctx.moveTo(x, y);
    } else {
      ctx.lineTo(x, y);
    }
  }
  ctx.closePath();
  ctx.fillStyle = backgroundColor;
  ctx.fill();
  ctx.save();
}

const drawTriangleMask = (container: Rect, ctx: OffscreenCanvasRenderingContext2D | CanvasRenderingContext2D,
  backgroundColor: WordCloudColorType) => {
  const r = Math.min(container.width, container.height) / 2;
  const triangleVertex: Point = { x: container.x + r, y: container.y };
  const triangleLeftCorner: Point = { x: container.x - r * 0.5, y: container.y - r * Math.sqrt(3) / 2 };
  const triangleRightCorner: Point = { x: container.x - r * 0.5, y: container.y + r * Math.sqrt(3) / 2 };
  ctx.strokeStyle = '#0000ff';
  ctx.beginPath();
  let region = new Path2D()
  region.moveTo(triangleVertex.x, triangleVertex.y);
  region.lineTo(triangleLeftCorner.x, triangleLeftCorner.y);
  region.lineTo(triangleRightCorner.x, triangleRightCorner.y);
  region.lineTo(triangleVertex.x, triangleVertex.y);
  ctx.fillStyle = backgroundColor;
  ctx.fill(region, 'evenodd');
  ctx.save();
}

const convertShapeMapList: Map<WordCloudType, (container: Rect,
  ctx: OffscreenCanvasRenderingContext2D | CanvasRenderingContext2D,
  backgroundColor: WordCloudColorType) => void> = new Map();
convertShapeMapList.set(WordCloudType.CIRCLE, drawCircleMask);
convertShapeMapList.set(WordCloudType.RECT, drawRectMask);
convertShapeMapList.set(WordCloudType.HEART, drawHeartMask);
convertShapeMapList.set(WordCloudType.START, drawStartMask);
convertShapeMapList.set(WordCloudType.TRIANGLE, drawTriangleMask);

export const GetConvertShape = (type: WordCloudType) => {
  return convertShapeMapList.get(type) || drawRectMask;
}