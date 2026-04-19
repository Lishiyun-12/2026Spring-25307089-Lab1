if (!("finalizeConstruction" in ViewPU.prototype)) {
    Reflect.set(ViewPU.prototype, "finalizeConstruction", () => { });
}
interface FunnelChart_Params {
    antiAliasing?: boolean;
    setting?: RenderingContextSettings;
    context?: CanvasRenderingContext2D;
    model?: FunnelChartModel | null;
    content?: string;
}
import type FunnelChartModel from "../charts/FunnelChartModel";
import Constants from "@package:pkg_modules/.ohpm/@ohos+mpchart@3.0.27/pkg_modules/@ohos/mpchart/src/main/ets/components/utils/Constants";
import { GlobalContext } from "@package:pkg_modules/.ohpm/@ohos+mpchart@3.0.27/pkg_modules/@ohos/mpchart/src/main/ets/components/utils/GlobalContext";
import { LogUtil } from "@package:pkg_modules/.ohpm/@ohos+mpchart@3.0.27/pkg_modules/@ohos/mpchart/src/main/ets/components/utils/LogUtil";
import Utils from "@package:pkg_modules/.ohpm/@ohos+mpchart@3.0.27/pkg_modules/@ohos/mpchart/src/main/ets/components/utils/Utils";
export class FunnelChart extends ViewPU {
    constructor(parent, params, __localStorage, elmtId = -1, paramsLambda = undefined, extraInfo) {
        super(parent, __localStorage, elmtId, extraInfo);
        if (typeof paramsLambda === "function") {
            this.paramsGenerator_ = paramsLambda;
        }
        this.antiAliasing = true;
        this.setting = new RenderingContextSettings(this.antiAliasing);
        this.context = new CanvasRenderingContext2D(this.setting);
        this.model = null;
        this.__content = new ObservedPropertySimplePU('', this, "content");
        this.setInitiallyProvidedValue(params);
        this.finalizeConstruction();
    }
    setInitiallyProvidedValue(params: FunnelChart_Params) {
        if (params.antiAliasing !== undefined) {
            this.antiAliasing = params.antiAliasing;
        }
        if (params.setting !== undefined) {
            this.setting = params.setting;
        }
        if (params.context !== undefined) {
            this.context = params.context;
        }
        if (params.model !== undefined) {
            this.model = params.model;
        }
        if (params.content !== undefined) {
            this.content = params.content;
        }
    }
    updateStateVars(params: FunnelChart_Params) {
    }
    purgeVariableDependenciesOnElmtId(rmElmtId) {
        this.__content.purgeDependencyOnElmtId(rmElmtId);
    }
    aboutToBeDeleted() {
        this.__content.aboutToBeDeleted();
        SubscriberManager.Get().delete(this.id__());
        this.aboutToBeDeletedInternal();
    }
    private antiAliasing: boolean;
    private setting: RenderingContextSettings;
    private context: CanvasRenderingContext2D;
    private model: FunnelChartModel | null;
    private __content: ObservedPropertySimplePU<string>;
    get content() {
        return this.__content.get();
    }
    set content(newValue: string) {
        this.__content.set(newValue);
    }
    aboutToAppear(): void {
        this.setting = new RenderingContextSettings(this.antiAliasing);
        this.context = new CanvasRenderingContext2D(this.setting);
        GlobalContext.getContext().setObject(Constants.UI_CONTEXT, this.getUIContext());
    }
    aboutToDisappear(): void {
    }
    // 构建函数
    initialRender() {
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Column.create();
            Column.padding(16);
            Column.backgroundColor('#F5F7FA');
            Column.borderRadius(12);
            Column.accessibilityLevel("yes");
            Column.accessibilityGroup(true);
            Column.accessibilityText(this.content);
            Column.onAccessibilityHover((isHover: boolean, event: AccessibilityHoverEvent) => {
                if (!isHover) {
                    return;
                }
                try {
                    if (this.model) {
                        let readChartText = this.model.getReadChartText();
                        let readOtherText = this.model.getReadOtherText();
                        let dataItem = this.model.accessibleReading({ x: event.x, y: event.y });
                        if (dataItem) {
                            if (dataItem.type === 'series') {
                                let matchText = {
                                    '{type}': dataItem.type,
                                    '{title}': dataItem.title,
                                    '{name}': dataItem.data?.name
                                } as Record<string, string>;
                                this.content = readChartText ? Utils.matchingTemplate(readChartText, matchText) : `类型: ${dataItem.type}, 标题 : ${dataItem.title}, 名称 : ${dataItem.data?.name}`;
                            }
                            else {
                                let matchText = {
                                    '{type}': dataItem.type,
                                    '{title}': dataItem.title
                                } as Record<string, string>;
                                this.content = readOtherText ? Utils.matchingTemplate(readOtherText, matchText) : `类型: ${dataItem.type}, 标题 : ${dataItem.title}`;
                            }
                        }
                        else {
                            this.content = 'No section selected';
                        }
                    }
                }
                catch (err) {
                    LogUtil.error(err);
                }
            });
        }, Column);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Canvas.create(this.context);
            Canvas.width('100%');
            Canvas.height('100%');
            Canvas.onReady(() => {
                if (this.model && this.context) {
                    this.model.setContext2D(this.context);
                    this.model.invalidate();
                }
            });
            Canvas.onSizeChange((oldArea: SizeOptions, newArea: SizeOptions) => {
                if (this.model && this.context &&
                    ((newArea.width !== oldArea.width) || (newArea.height !== oldArea.height))) {
                    this.model.onChartSizeChanged(Number(newArea.width), Number(newArea.height));
                    this.model.invalidate();
                }
            });
            Canvas.onTouch((event) => {
                this.model?.onTouchEvent(event);
            });
        }, Canvas);
        Canvas.pop();
        Column.pop();
    }
    rerender() {
        this.updateDirtyElements();
    }
}
