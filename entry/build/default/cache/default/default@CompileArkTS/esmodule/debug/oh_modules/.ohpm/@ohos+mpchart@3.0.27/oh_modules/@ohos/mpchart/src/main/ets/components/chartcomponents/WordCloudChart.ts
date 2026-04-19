if (!("finalizeConstruction" in ViewPU.prototype)) {
    Reflect.set(ViewPU.prototype, "finalizeConstruction", () => { });
}
interface WordCloudChart_Params {
    model?: WordCloudChartModel | null;
    antiAliasing?: boolean;
    setting?: RenderingContextSettings | null;
    context2D?: CanvasRenderingContext2D | null;
    content?: string;
}
import type WordCloudChartModel from '../charts/WordCloudChartModel';
import Constants from "@package:pkg_modules/.ohpm/@ohos+mpchart@3.0.27/pkg_modules/@ohos/mpchart/src/main/ets/components/utils/Constants";
import { GlobalContext } from "@package:pkg_modules/.ohpm/@ohos+mpchart@3.0.27/pkg_modules/@ohos/mpchart/src/main/ets/components/utils/GlobalContext";
import { LogUtil } from "@package:pkg_modules/.ohpm/@ohos+mpchart@3.0.27/pkg_modules/@ohos/mpchart/src/main/ets/components/utils/LogUtil";
import Utils from "@package:pkg_modules/.ohpm/@ohos+mpchart@3.0.27/pkg_modules/@ohos/mpchart/src/main/ets/components/utils/Utils";
export default class WordCloudChart extends ViewPU {
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
    setInitiallyProvidedValue(params: WordCloudChart_Params) {
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
    updateStateVars(params: WordCloudChart_Params) {
    }
    purgeVariableDependenciesOnElmtId(rmElmtId) {
        this.__content.purgeDependencyOnElmtId(rmElmtId);
    }
    aboutToBeDeleted() {
        this.__content.aboutToBeDeleted();
        SubscriberManager.Get().delete(this.id__());
        this.aboutToBeDeletedInternal();
    }
    private model: WordCloudChartModel | null;
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
        this.setting = new RenderingContextSettings(this.antiAliasing);
        this.context2D = new CanvasRenderingContext2D(this.setting);
        GlobalContext.getContext().setObject(Constants.UI_CONTEXT, this.getUIContext());
    }
    aboutToDisappear(): void {
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
                        let tooltipInfo = this.model.accessibleReading({ x: event.x, y: event.y });
                        if (tooltipInfo) {
                            let matchText = {
                                '{title}': tooltipInfo.title,
                                '{name}': tooltipInfo.name,
                                '{value}': tooltipInfo.value.toFixed(1)
                            } as Record<string, string>;
                            this.content = readChartText ? Utils.matchingTemplate(readChartText, matchText) : `标题: ${tooltipInfo.title}, 名称: ${tooltipInfo.name}, 值为: ${tooltipInfo.value}`;
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
            Stack.create();
        }, Stack);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Canvas.create(this.context2D);
            Canvas.width('100%');
            Canvas.height('100%');
            Canvas.onReady(() => {
                if (this.model && this.context2D) {
                    this.model.setContext2D(this.context2D);
                    this.model.invalidate();
                }
            });
            Canvas.onSizeChange((oldArea: SizeOptions, newArea: SizeOptions) => {
                if (this.model && this.context2D &&
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
        Stack.pop();
        Column.pop();
    }
    rerender() {
        this.updateDirtyElements();
    }
}
