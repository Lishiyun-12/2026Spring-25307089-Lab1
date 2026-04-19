import hilog from "@ohos:hilog";
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
            }
            else {
                // 没有错误对象时，按原样输出
                hilog.error(LogUtil.DOMAIN, LogUtil.TAG, message, args);
            }
        }
    }
}
