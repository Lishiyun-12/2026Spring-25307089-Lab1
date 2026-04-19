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

import animator, { AnimatorOptions, AnimatorResult } from '@ohos.animator';
import AnimatorUpdateListener from '../listener/AnimatorUpdateListener';
import Constants from '../utils/Constants';
import { GlobalContext } from '../utils/GlobalContext';
import { LogUtil } from '../utils/LogUtil';
import { UIContextManager, UIContextReadyListener } from '../utils/UIContextManager';

// 定义待处理动画的接口
interface PendingAnimation {
  type: 'x' | 'y' | 'xy';
  durationX: number;
  durationY?: number;
  easing?: string;
}

export default class ChartAnimator implements UIContextReadyListener {
  /**
   * object that is updated upon animation update
   */
  private mListener: AnimatorUpdateListener;
  /**
   * The phase of drawn values on the y-axis.
   */
  protected mPhaseY: number = 1;
  /** The phase of drawn values on the x-axis. 0 - 1 */
  protected mPhaseX: number = 1;
  private isShowXCallback: boolean = false;
  private isShowYCallback: boolean = false;
  private uiContextReady: boolean = false;
  private pendingAnimations: PendingAnimation[] = [];

  constructor(listener: AnimatorUpdateListener) {
    this.mListener = listener;
    // 注册 UIContext 就绪监听器
    UIContextManager.getInstance().addListener(this);
  }

  // 实现 UIContextReadyListener 接口
  onUIContextReady(): void {
    this.uiContextReady = true;
    // 处理待处理的动画
    this.processPendingAnimations();
  }

  private processPendingAnimations(): void {
    while (this.pendingAnimations.length > 0) {
      const animation = this.pendingAnimations.shift();
      if (animation) {
        try {
          // 确保 easing 有默认值
          const easing = animation.easing || 'linear';
          
          switch (animation.type) {
            case 'x':
              this.animateX(animation.durationX, easing);
              break;
            case 'y':
              this.animateY(animation.durationX, easing);
              break;
            case 'xy':
              if (animation.durationY !== undefined) {
                this.animateXY(animation.durationX, animation.durationY, easing);
              }
              break;
          }
        } catch (error) {
          LogUtil.error('Failed to process pending animation:', error);
        }
      }
    }
  }

  private getUIContext(): UIContext {
    return GlobalContext.getContext().getObject(Constants.UI_CONTEXT) as UIContext;
  }

  private xAnimator(duration: number, easing: string): AnimatorResult {
    let options: AnimatorOptions = {
      duration: duration,
      easing: easing,
      delay: 0,
      fill: "forwards",
      direction: "normal",
      iterations: 1,
      begin: 0,
      end: 1
    };
    
    const uiContext = this.getUIContext();
    if (!uiContext) {
      throw new Error('UIContext is not available');
    }
    
    let animatorResult = uiContext.createAnimator(options);
    animatorResult.onFrame = (value) => {
      this.mPhaseX = value;
      if (this.isShowXCallback && this.mListener) {
        this.mListener.onAnimationUpdate(animatorResult);
      }
    }

    return animatorResult;
  }

  private yAnimator(duration: number, easing: string): AnimatorResult {
    let options: AnimatorOptions = {
      duration: duration,
      easing: easing,
      delay: 0,
      fill: "forwards",
      direction: "normal",
      iterations: 1,
      begin: 0,
      end: 1
    };
    
    const uiContext = this.getUIContext();
    if (!uiContext) {
      throw new Error('UIContext is not available');
    }
    
    let animatorResult = uiContext.createAnimator(options);
    animatorResult.onFrame = (value) => {
      this.mPhaseY = value;
      if (this.isShowYCallback && this.mListener) {
        this.mListener.onAnimationUpdate(animatorResult);
      }
    }

    return animatorResult;
  }

  //
  // /**
  //    * Animates values along the X axis, in a linear fashion.
  //    *
  //    * @param durationMillis animation duration
  //    */
  // public animateX(durationMillis:number) {
  //   animateX(durationMillis, Easing.Linear);
  // }
  //
  /**
   * Animates values along the X axis.
   *
   * @param durationMillis animation duration
   * @param easing EasingFunction
   */
  public animateX(durationMillis: number): void;

  public animateX(durationMillis: number, easing: string): void;

  public animateX(durationMillis: number, easing?: string): void {
    if (!easing) {
      easing = 'linear'
    }
    
    // 如果 uiContext 还没有准备好，将动画添加到待处理队列
    if (!this.uiContextReady) {
      const pendingAnimation: PendingAnimation = { 
        type: 'x', 
        durationX: durationMillis, 
        easing 
      };
      this.pendingAnimations.push(pendingAnimation);
      return;
    }
    
    try {
      let animatorXResult = this.xAnimator(durationMillis, easing);
      
      // 检查动画器是否成功创建
      if (animatorXResult) {
        this.isShowXCallback = true;
        this.isShowYCallback = false;
        animatorXResult.play();
      }
    } catch (error) {
      LogUtil.error('Failed to create X animator:', error);
    }
  }

  //
  // /**
  //    * Animates values along both the X and Y axes, in a linear fashion.
  //    *
  //    * @param durationMillisX animation duration along the X axis
  //    * @param durationMillisY animation duration along the Y axis
  //    */
  //
  // public animateXY(durationMillisX:number,durationMillisY:number) {
  //   animateXY(durationMillisX, durationMillisY, Easing.Linear, Easing.Linear);
  // }
  //
  /**
   * Animates values along both the X and Y axes.
   *
   * @param durationMillisX animation duration along the X axis
   * @param durationMillisY animation duration along the Y axis
   * @param easing EasingFunction for both axes
   */

  public animateXY(durationMillisX: number, durationMillisY: number): void;

  public animateXY(durationMillisX: number, durationMillisY: number, easing: string): void;

  public animateXY(durationMillisX: number, durationMillisY: number, xEasing: string, yEasing: string): void;

  public animateXY(durationMillisX: number, durationMillisY: number, xEasing?: string, yEasing?: string): void {
    if (!xEasing) {
      xEasing = 'linear'
    }
    if (!yEasing) {
      yEasing = 'linear'
    }
    
    // 如果 uiContext 还没有准备好，将动画添加到待处理队列
    if (!this.uiContextReady) {
      const pendingAnimation: PendingAnimation = { 
        type: 'xy', 
        durationX: durationMillisX, 
        durationY: durationMillisY, 
        easing: xEasing 
      };
      this.pendingAnimations.push(pendingAnimation);
      return;
    }
    
    try {
      let xAnimatorResult = this.xAnimator(durationMillisX, xEasing);
      let yAnimatorResult = this.yAnimator(durationMillisY, yEasing);

      // 检查动画器是否成功创建
      if (xAnimatorResult && yAnimatorResult) {
        if (durationMillisX > durationMillisY) {
          this.isShowXCallback = true;
          this.isShowYCallback = false;
        } else {
          this.isShowXCallback = false;
          this.isShowYCallback = true;
        }

        xAnimatorResult.play();
        yAnimatorResult.play();
      }
    } catch (error) {
      LogUtil.error('Failed to create XY animator:', error);
    }
  }

  //
  // /**
  //    * Animates values along both the X and Y axes.
  //    *
  //    * @param durationMillisX animation duration along the X axis
  //    * @param durationMillisY animation duration along the Y axis
  //    * @param easingX EasingFunction for the X axis
  //    * @param easingY EasingFunction for the Y axis
  //    */
  //
  // public animateXY(durationMillisX:number, durationMillisY:number, easingX:EasingFunction,
  //                  easingY:EasingFunction) {
  //
  //   let xAnimator = xAnimator(durationMillisX, easingX);
  //   let yAnimator = yAnimator(durationMillisY, easingY);
  //
  //   if (durationMillisX > durationMillisY) {
  //     xAnimator.addUpdateListener(mListener);
  //   } else {
  //     yAnimator.addUpdateListener(mListener);
  //   }
  //
  //   xAnimator.start();
  //   yAnimator.start();
  // }
  //
  // /**
  //    * Animates values along the Y axis, in a linear fashion.
  //    *
  //    * @param durationMillis animation duration
  //    */
  //
  // public animateY(durationMillis:number) {
  //   this.animateY(durationMillis, Easing.Linear);
  // }
  //
  /**
   * Animates values along the Y axis.
   *
   * @param durationMillis animation duration
   * @param easing EasingFunction
   */

  public animateY(durationMillis: number): void;

  public animateY(durationMillis: number, easing: string): void;

  public animateY(durationMillis: number, easing?: string): void {
    if (!easing) {
      easing = 'linear'
    }
    
    // 如果 uiContext 还没有准备好，将动画添加到待处理队列
    if (!this.uiContextReady) {
      const pendingAnimation: PendingAnimation = { 
        type: 'y', 
        durationX: durationMillis, 
        easing 
      };
      this.pendingAnimations.push(pendingAnimation);
      return;
    }
    
    try {
      let animatorY: AnimatorResult = this.yAnimator(durationMillis, easing);
      
      // 检查动画器是否成功创建
      if (animatorY) {
        this.isShowXCallback = false;
        this.isShowYCallback = true;
        animatorY.play();
      }
    } catch (error) {
      LogUtil.error('Failed to create Y animator:', error);
    }
  }

  /**
   * Gets the Y axis phase of the animation.
   *
   * @return float value of {@link #mPhaseY}
   */
  public getPhaseY(): number {
    return this.mPhaseY;
  }

  /**
   * Sets the Y axis phase of the animation.
   *
   * @param phase float value between 0 - 1
   */
  public setPhaseY(phase: number) {
    if (phase > 1) {
      phase = 1;
    } else if (phase < 0) {
      phase = 0;
    }
    this.mPhaseY = phase;
  }

  /**
   * Gets the X axis phase of the animation.
   *
   * @return float value of {@link #mPhaseX}
   */
  public getPhaseX(): number {
    return this.mPhaseX;
  }

  /**
   * Sets the X axis phase of the animation.
   *
   * @param phase float value between 0 - 1
   */
  public setPhaseX(phase: number) {
    if (phase > 1) {
      phase = 1;
    } else if (phase < 0) {
      phase = 0;
    }
    this.mPhaseX = phase;
  }
}
