import hiTraceMeter from "@ohos:hiTraceMeter";
export class MPChartTraceUtil {
    // 全局日志开关
    private static enabled: boolean = true;
    private static readonly taskMap: Map<string, number> = new Map();
    // 自增taskId
    private static taskIdSeed: number = 1000;
    /**
     * 获取当前trace启用状态
     */
    public static isEnabled(): boolean {
        return MPChartTraceUtil.enabled;
    }
    /**
     * 设置trace启用状态
     */
    public static setEnabled(enabled: boolean): void {
        MPChartTraceUtil.enabled = enabled;
    }
    /**
     * 生成唯一的taskId
     */
    private static nextTaskId(): number {
        return ++MPChartTraceUtil.taskIdSeed;
    }
    /**
     * 开始trace
     * @param tag string，trace标签
     */
    public static start(tag: string): void {
        if (!MPChartTraceUtil.enabled) {
            return;
        }
        const taskId = MPChartTraceUtil.nextTaskId();
        MPChartTraceUtil.taskMap.set(tag, taskId);
        try {
            if (typeof hiTraceMeter.startTrace === 'function') {
                hiTraceMeter.startTrace(tag, taskId);
            }
        }
        catch (e) {
            console.error(`MPChartTraceUtil start trace failed for tag: ${tag}, error: ${e}`);
        }
    }
    public static startInfo(tag: string): void {
        MPChartTraceUtil.start(tag);
    }
    public static startError(tag: string): void {
        MPChartTraceUtil.start(tag + 'Error');
    }
    /**
     * 结束trace
     * @param tag string，trace标签
     */
    public static finish(tag: string): void {
        if (!MPChartTraceUtil.enabled) {
            return;
        }
        const taskId = MPChartTraceUtil.taskMap.get(tag);
        if (taskId === null || taskId === undefined) {
            console.warn(`MPChartTraceUtil finish trace failed: no task found for tag: ${tag}`);
            return;
        }
        try {
            if (typeof hiTraceMeter.finishTrace === 'function') {
                hiTraceMeter.finishTrace(tag, taskId);
            }
        }
        catch (e) {
            console.error(`MPChartTraceUtil finish trace failed for tag: ${tag}, taskId: ${taskId}, error: ${e}`);
        }
        finally {
            MPChartTraceUtil.taskMap.delete(tag);
        }
    }
}
