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

// UIContext 就绪监听器接口
export interface UIContextReadyListener {
  onUIContextReady(): void;
}

export class UIContextManager {
  private static instance: UIContextManager;
  private uiContext: UIContext | null = null;
  private listeners: UIContextReadyListener[] = [];
  private isReady: boolean = false;

  private constructor() {
  }

  public static getInstance(): UIContextManager {
    if (!UIContextManager.instance) {
      UIContextManager.instance = new UIContextManager();
    }
    return UIContextManager.instance;
  }

  // 设置 UIContext
  public setUIContext(context: UIContext): void {
    this.uiContext = context;
    this.isReady = true;
    
    // 通知所有监听器
    this.notifyListeners();
  }

  // 获取 UIContext
  public getUIContext(): UIContext | null {
    return this.uiContext;
  }

  // 检查是否就绪
  public isUIContextReady(): boolean {
    return this.isReady;
  }

  // 添加监听器
  public addListener(listener: UIContextReadyListener): void {
    if (!this.listeners.includes(listener)) {
      this.listeners.push(listener);
      
      // 如果已经就绪，立即通知新添加的监听器
      if (this.isReady) {
        listener.onUIContextReady();
      }
    }
  }

  // 移除监听器
  public removeListener(listener: UIContextReadyListener): void {
    const index = this.listeners.indexOf(listener);
    if (index > -1) {
      this.listeners.splice(index, 1);
    }
  }

  // 通知所有监听器
  private notifyListeners(): void {
    this.listeners.forEach(listener => {
      try {
        listener.onUIContextReady();
      } catch (error) {
        console.error('Error notifying UIContextReady listener:', error);
      }
    });
  }

  /**
   * 清理资源
   */
  public dispose(): void {
    this.listeners = [];
    this.uiContext = null;
    this.isReady = false;
  }
}
