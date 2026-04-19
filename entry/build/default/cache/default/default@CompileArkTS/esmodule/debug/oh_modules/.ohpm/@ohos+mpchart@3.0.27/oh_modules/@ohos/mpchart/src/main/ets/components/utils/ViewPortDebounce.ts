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
export class ViewPortDebounce {
    private lastRefreshTime: number = 0;
    private refreshTimer: number | null = null;
    private pendingCallback: (() => void) | null = null;
    /**
     * 防抖刷新执行
     * @param callback 刷新回调函数
     * @param debounceMs 防抖时间，默认16ms
     */
    public debounceRefresh(callback: () => void, debounceMs: number = 16): void {
        const now = Date.now();
        const timeSinceLastRefresh = now - this.lastRefreshTime;
        // 清除之前的定时器
        if (this.refreshTimer !== null) {
            clearTimeout(this.refreshTimer);
        }
        // 保存最新的回调
        this.pendingCallback = callback;
        if (timeSinceLastRefresh >= debounceMs) {
            // 立即执行
            this.executePendingRefresh();
        }
        else {
            // 延迟执行
            const delay = debounceMs - timeSinceLastRefresh;
            this.refreshTimer = setTimeout(() => {
                this.executePendingRefresh();
            }, delay);
        }
    }
    private executePendingRefresh(): void {
        if (this.pendingCallback) {
            this.pendingCallback();
            this.lastRefreshTime = Date.now();
            this.pendingCallback = null;
        }
        this.refreshTimer = null;
    }
    /**
     * 强制立即执行（用于缩放结束等场景）
     */
    public forceExecute(): void {
        if (this.refreshTimer !== null) {
            clearTimeout(this.refreshTimer);
            this.refreshTimer = null;
        }
        this.executePendingRefresh();
    }
    /**
     * 清除待执行的操作
     */
    public clear(): void {
        if (this.refreshTimer !== null) {
            clearTimeout(this.refreshTimer);
            this.refreshTimer = null;
        }
        this.pendingCallback = null;
    }
}
