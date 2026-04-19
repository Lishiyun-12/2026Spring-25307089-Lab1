if (!("finalizeConstruction" in ViewPU.prototype)) {
    Reflect.set(ViewPU.prototype, "finalizeConstruction", () => { });
}
interface RoseChart_Params {
    model?: RoseChartModel | null;
    antiAliasing?: boolean;
    setting?: RenderingContextSettings | null;
    context2D?: CanvasRenderingContext2D | null;
    content?: string;
    showAccessRect?: boolean;
    accessRectWidth?: number;
    accessRectHeight?: number;
    accessRectX?: number;
    accessRectY?: number;
}
import type RoseChartModel from '../charts/RoseChartModel';
import Constants from "@package:pkg_modules/.ohpm/@ohos+mpchart@3.0.27/pkg_modules/@ohos/mpchart/src/main/ets/components/utils/Constants";
import { GlobalContext } from "@package:pkg_modules/.ohpm/@ohos+mpchart@3.0.27/pkg_modules/@ohos/mpchart/src/main/ets/components/utils/GlobalContext";
import { LogUtil } from "@package:pkg_modules/.ohpm/@ohos+mpchart@3.0.27/pkg_modules/@ohos/mpchart/src/main/ets/components/utils/LogUtil";
import Utils from "@package:pkg_modules/.ohpm/@ohos+mpchart@3.0.27/pkg_modules/@ohos/mpchart/src/main/ets/components/utils/Utils";
export default class RoseChart extends ViewPU {
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
        this.__showAccessRect = new ObservedPropertySimplePU(false, this, "showAccessRect");
        this.__accessRectWidth = new ObservedPropertySimplePU(0, this, "accessRectWidth");
        this.__accessRectHeight = new ObservedPropertySimplePU(0, this, "accessRectHeight");
        this.__accessRectX = new ObservedPropertySimplePU(0, this, "accessRectX");
        this.__accessRectY = new ObservedPropertySimplePU(0, this, "accessRectY");
        this.setInitiallyProvidedValue(params);
        this.finalizeConstruction();
    }
    setInitiallyProvidedValue(params: RoseChart_Params) {
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
        if (params.showAccessRect !== undefined) {
            this.showAccessRect = params.showAccessRect;
        }
        if (params.accessRectWidth !== undefined) {
            this.accessRectWidth = params.accessRectWidth;
        }
        if (params.accessRectHeight !== undefined) {
            this.accessRectHeight = params.accessRectHeight;
        }
        if (params.accessRectX !== undefined) {
            this.accessRectX = params.accessRectX;
        }
        if (params.accessRectY !== undefined) {
            this.accessRectY = params.accessRectY;
        }
    }
    updateStateVars(params: RoseChart_Params) {
    }
    purgeVariableDependenciesOnElmtId(rmElmtId) {
        this.__content.purgeDependencyOnElmtId(rmElmtId);
        this.__showAccessRect.purgeDependencyOnElmtId(rmElmtId);
        this.__accessRectWidth.purgeDependencyOnElmtId(rmElmtId);
        this.__accessRectHeight.purgeDependencyOnElmtId(rmElmtId);
        this.__accessRectX.purgeDependencyOnElmtId(rmElmtId);
        this.__accessRectY.purgeDependencyOnElmtId(rmElmtId);
    }
    aboutToBeDeleted() {
        this.__content.aboutToBeDeleted();
        this.__showAccessRect.aboutToBeDeleted();
        this.__accessRectWidth.aboutToBeDeleted();
        this.__accessRectHeight.aboutToBeDeleted();
        this.__accessRectX.aboutToBeDeleted();
        this.__accessRectY.aboutToBeDeleted();
        SubscriberManager.Get().delete(this.id__());
        this.aboutToBeDeletedInternal();
    }
    private model: RoseChartModel | null;
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
    private __showAccessRect: ObservedPropertySimplePU<boolean>;
    get showAccessRect() {
        return this.__showAccessRect.get();
    }
    set showAccessRect(newValue: boolean) {
        this.__showAccessRect.set(newValue);
    }
    private __accessRectWidth: ObservedPropertySimplePU<number>;
    get accessRectWidth() {
        return this.__accessRectWidth.get();
    }
    set accessRectWidth(newValue: number) {
        this.__accessRectWidth.set(newValue);
    }
    private __accessRectHeight: ObservedPropertySimplePU<number>;
    get accessRectHeight() {
        return this.__accessRectHeight.get();
    }
    set accessRectHeight(newValue: number) {
        this.__accessRectHeight.set(newValue);
    }
    private __accessRectX: ObservedPropertySimplePU<number>;
    get accessRectX() {
        return this.__accessRectX.get();
    }
    set accessRectX(newValue: number) {
        this.__accessRectX.set(newValue);
    }
    private __accessRectY: ObservedPropertySimplePU<number>;
    get accessRectY() {
        return this.__accessRectY.get();
    }
    set accessRectY(newValue: number) {
        this.__accessRectY.set(newValue);
    }
    invalidate() {
        this.model?.invalidate();
    }
    aboutToAppear() {
        LogUtil.log('-----------aboutToAppear: enter');
        this.setting = new RenderingContextSettings(this.antiAliasing);
        this.context2D = new CanvasRenderingContext2D(this.setting);
        GlobalContext.getContext().setObject(Constants.UI_CONTEXT, this.getUIContext());
    }
    initialRender() {
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Stack.create();
            Stack.accessibilityLevel("yes");
            Stack.accessibilityGroup(true);
            Stack.accessibilityText(this.content);
            Stack.onAccessibilityHover((isHover: boolean, event: AccessibilityHoverEvent) => {
                if (!isHover) {
                    return;
                }
                try {
                    if (this.model) {
                        let readChartText = this.model.getReadChartText();
                        let readLegendText = this.model.getReadLegendText();
                        let highlight = this.model.getSectorByTouchPoint(event.x, event.y);
                        if (highlight) {
                            this.showAccessRect = false;
                            let matchText = {
                                '{label}': highlight.label,
                                '{value}': highlight.value.toFixed(1),
                            } as Record<string, string>;
                            this.content = readChartText ? Utils.matchingTemplate(readChartText, matchText) : `选中的块: ${highlight.label}, 值为: ${highlight.value}`;
                        }
                        else {
                            let label = this.model.getLabelByTouchPoint(event.x, event.y);
                            if (label !== undefined) {
                                this.accessRectWidth = label.width;
                                this.accessRectHeight = label.height + 5;
                                this.accessRectX = label.x;
                                this.accessRectY = label.y;
                                let matchText = {
                                    '{legend}': label.label,
                                } as Record<string, string>;
                                this.content = readLegendText ? Utils.matchingTemplate(readLegendText, matchText) : `图例 : ${label.label}`;
                                this.showAccessRect = true;
                            }
                            else {
                                this.showAccessRect = false;
                                this.content = 'No section selected';
                            }
                        }
                    }
                }
                catch (err) {
                    LogUtil.error(err);
                }
            });
        }, Stack);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Canvas.create(this.context2D);
            Canvas.onReady(() => {
                this.model?.setContext2D(this.context2D!);
            });
            Canvas.onTouch((event) => {
                this.model?.onTouchEvent(event);
            });
        }, Canvas);
        Canvas.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Row.create();
            Row.width(this.accessRectWidth);
            Row.height(this.accessRectHeight);
            Row.position({ x: this.accessRectX, y: this.accessRectY });
            Row.visibility(this.showAccessRect ? Visibility.Visible : Visibility.None);
            Row.border({ width: 3, color: '#6bc843' });
        }, Row);
        Row.pop();
        Stack.pop();
    }
    rerender() {
        this.updateDirtyElements();
    }
}
