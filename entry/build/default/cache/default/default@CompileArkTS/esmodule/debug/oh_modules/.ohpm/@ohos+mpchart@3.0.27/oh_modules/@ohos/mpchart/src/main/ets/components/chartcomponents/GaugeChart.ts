if (!("finalizeConstruction" in ViewPU.prototype)) {
    Reflect.set(ViewPU.prototype, "finalizeConstruction", () => { });
}
interface GaugeChart_Params {
    model?: GaugeChartModel | null;
    antiAliasing?: boolean;
    setting?: RenderingContextSettings | null;
    context2D?: CanvasRenderingContext2D | null;
    content?: string;
}
import type { GaugeChartModel } from "../charts/GaugeChartModel";
import MoveViewJob from "@package:pkg_modules/.ohpm/@ohos+mpchart@3.0.27/pkg_modules/@ohos/mpchart/src/main/ets/components/jobs/MoveViewJob";
import { GlobalContext } from "@package:pkg_modules/.ohpm/@ohos+mpchart@3.0.27/pkg_modules/@ohos/mpchart/src/main/ets/components/utils/GlobalContext";
import { LogUtil } from "@package:pkg_modules/.ohpm/@ohos+mpchart@3.0.27/pkg_modules/@ohos/mpchart/src/main/ets/components/utils/LogUtil";
import Utils from "@package:pkg_modules/.ohpm/@ohos+mpchart@3.0.27/pkg_modules/@ohos/mpchart/src/main/ets/components/utils/Utils";
export class GaugeChart extends ViewPU {
    constructor(parent, params, __localStorage, elmtId = -1, paramsLambda = undefined, extraInfo) {
        super(parent, __localStorage, elmtId, extraInfo);
        if (typeof paramsLambda === "function") {
            this.paramsGenerator_ = paramsLambda;
        }
        this.model = null;
        this.antiAliasing = true;
        this.setting = null;
        this.context2D = null;
        this.__content = new ObservedPropertySimplePU('', this, "content");
        this.setInitiallyProvidedValue(params);
        this.finalizeConstruction();
    }
    setInitiallyProvidedValue(params: GaugeChart_Params) {
        if (params.model !== undefined) {
            this.model = params.model;
        }
        if (params.antiAliasing !== undefined) {
            this.antiAliasing = params.antiAliasing;
        }
        if (params.setting !== undefined) {
            this.setting = params.setting;
        }
        if (params.context2D !== undefined) {
            this.context2D = params.context2D;
        }
        if (params.content !== undefined) {
            this.content = params.content;
        }
    }
    updateStateVars(params: GaugeChart_Params) {
    }
    purgeVariableDependenciesOnElmtId(rmElmtId) {
        this.__content.purgeDependencyOnElmtId(rmElmtId);
    }
    aboutToBeDeleted() {
        this.__content.aboutToBeDeleted();
        SubscriberManager.Get().delete(this.id__());
        this.aboutToBeDeletedInternal();
    }
    private model: GaugeChartModel | null;
    private antiAliasing: boolean;
    private setting: RenderingContextSettings | null;
    private context2D: CanvasRenderingContext2D | null;
    private __content: ObservedPropertySimplePU<string>;
    get content() {
        return this.__content.get();
    }
    set content(newValue: string) {
        this.__content.set(newValue);
    }
    aboutToAppear(): void {
        LogUtil.log('GaugeChart aboutToAppear: enter');
        this.setting = new RenderingContextSettings(this.antiAliasing);
        this.context2D = new CanvasRenderingContext2D(this.setting);
        GlobalContext.getContext().setObject("uiContext", this.getUIContext());
    }
    aboutToDisappear(): void {
        MoveViewJob.cleanup();
        GlobalContext.getContext().dispose();
    }
    initialRender() {
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Column.create();
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
                        let accessibilityItem = this.model?.checkAccessibilityItem(event.x, event.y);
                        if (accessibilityItem) {
                            let matchText = {
                                '{type}': accessibilityItem.type,
                                '{value}': accessibilityItem?.value
                            } as Record<string, string>;
                            this.content = readChartText ? Utils.matchingTemplate(readChartText, matchText) : `类型 : ${accessibilityItem.type}, 值为 : ${accessibilityItem.value}`;
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
            Column.width('100%');
            Column.height('100%');
        }, Column);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Canvas.create(this.context2D);
            Canvas.onReady(() => {
                if (this.context2D && this.model) {
                    this.model.setContext2D(this.context2D);
                }
            });
            Canvas.onAreaChange((oldArea, newArea) => {
                if (this.context2D && this.model) {
                    this.model.onChartSizeChanged(Number(newArea.width), Number(newArea.height));
                    this.model.onDraw(this.context2D);
                }
            });
        }, Canvas);
        Canvas.pop();
        Column.pop();
    }
    rerender() {
        this.updateDirtyElements();
    }
}
