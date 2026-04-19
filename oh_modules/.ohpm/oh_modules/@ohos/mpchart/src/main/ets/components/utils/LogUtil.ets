/*
 * Copyright (C) 2024 Huawei Device Co., Ltd.
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

import hilog from '@ohos.hilog';

export class LogUtil {
  public static readonly DOMAIN: number = 0xFFFF;
  public static readonly TAG: string = "MPChart::";
  // 全局日志开关
  private static enabled: boolean = true;

  /**
   * 设置日志开关
   */
  public static setEnabled(enable: boolean): void {
    LogUtil.enabled = enable;
  }

  /**
   * 获取当前日志开关
   */
  public static isEnabled(): boolean {
    return LogUtil.enabled;
  }


  public static debug(message: string, ...args: Object[]) {
    if (LogUtil.enabled) {
      hilog.debug(LogUtil.DOMAIN, LogUtil.TAG, message, args);
    }
  }

  public static info(message: string, ...args: Object[]) {
    if (LogUtil.enabled) {
      hilog.info(LogUtil.DOMAIN, LogUtil.TAG, message, args);
    }
  }

  public static log(message: string, ...args: Object[]) {
    if (LogUtil.enabled) {
      hilog.debug(LogUtil.DOMAIN, LogUtil.TAG, message, args);
    }
  }

  public static warn(message: string, ...args: Object[]) {
    if (LogUtil.enabled) {
      hilog.warn(LogUtil.DOMAIN, LogUtil.TAG, message, args);
    }
  }

  public static error(message: string, e?: Error | string, ...args: Object[]) {
    if (LogUtil.enabled) {
      // 检查是否有错误对象
      if (e) {
        const error = e as Error;
        // 合并为一条日志输出，避免分散
        const errorDetails = `Error details: ${JSON.stringify({
          name: error.name,
          message: error.message,
          stack: error.stack
        })}`;
        hilog.error(LogUtil.DOMAIN, LogUtil.TAG, `${message} - ${errorDetails}`, args);
      } else {
        // 没有错误对象时，按原样输出
        hilog.error(LogUtil.DOMAIN, LogUtil.TAG, message, args);
      }
    }
  }
}