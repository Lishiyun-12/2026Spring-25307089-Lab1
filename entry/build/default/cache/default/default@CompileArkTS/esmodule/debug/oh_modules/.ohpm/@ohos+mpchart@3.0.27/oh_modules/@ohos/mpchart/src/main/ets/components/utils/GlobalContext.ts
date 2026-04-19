import Constants from "@package:pkg_modules/.ohpm/@ohos+mpchart@3.0.27/pkg_modules/@ohos/mpchart/src/main/ets/components/utils/Constants";
import { UIContextManager } from "@package:pkg_modules/.ohpm/@ohos+mpchart@3.0.27/pkg_modules/@ohos/mpchart/src/main/ets/components/utils/UIContextManager";
export class GlobalContext {
    private static instance: GlobalContext;
    private _objects = new Map<string, Object>();
    private constructor() {
    }
    public static getContext(): GlobalContext {
        if (!GlobalContext.instance) {
            GlobalContext.instance = new GlobalContext();
        }
        return GlobalContext.instance;
    }
    getObject(value: string): Object | undefined {
        return this._objects.get(value);
    }
    setObject(key: string, objectClass: Object): void {
        this._objects.set(key, objectClass as Object);
        // 如果设置的是 UI_CONTEXT，通知 UIContextManager
        if (key === Constants.UI_CONTEXT) {
            UIContextManager.getInstance().setUIContext(objectClass as UIContext);
        }
    }
    /**
     * 清理资源
     */
    public dispose(): void {
        this._objects.clear();
        UIContextManager.getInstance().dispose();
    }
}
