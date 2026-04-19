if (!("finalizeConstruction" in ViewPU.prototype)) {
    Reflect.set(ViewPU.prototype, "finalizeConstruction", () => { });
}
interface BarLineBaseChart_Params {
    model?: BubbleChartModel | CandleStickChartModel | CombinedChartModel | ScatterChartModel | HorizontalBarChartModel | null;
    antiAliasing?: boolean;
    setting?: RenderingContextSettings | null;
    context2D?: CanvasRenderingContext2D | null;
    content?: string;
    isAccessBool?: boolean;
    isAccessShow?: boolean;
    accessWidth?: number;
    accessHeight?: number;
    accessX?: number;
    accessY?: number;
}
import type BubbleChartModel from '../charts/BubbleChartModel';
import type CandleStickChartModel from '../charts/CandleStickChartModel';
import type CombinedChartModel from '../charts/CombinedChartModel';
import type HorizontalBarChartModel from '../charts/HorizontalBarChartModel';
import type ScatterChartModel from '../charts/ScatterChartModel';
import MoveViewJob from "@package:pkg_modules/.ohpm/@ohos+mpchart@3.0.27/pkg_modules/@ohos/mpchart/src/main/ets/components/jobs/MoveViewJob";
import Constants from "@package:pkg_modules/.ohpm/@ohos+mpchart@3.0.27/pkg_modules/@ohos/mpchart/src/main/ets/components/utils/Constants";
import type { AccessClick } from "@package:pkg_modules/.ohpm/@ohos+mpchart@3.0.27/pkg_modules/@ohos/mpchart/src/main/ets/components/utils/Constants";
import { GlobalContext } from "@package:pkg_modules/.ohpm/@ohos+mpchart@3.0.27/pkg_modules/@ohos/mpchart/src/main/ets/components/utils/GlobalContext";
import { LogUtil } from "@package:pkg_modules/.ohpm/@ohos+mpchart@3.0.27/pkg_modules/@ohos/mpchart/src/main/ets/components/utils/LogUtil";
import Utils from "@package:pkg_modules/.ohpm/@ohos+mpchart@3.0.27/pkg_modules/@ohos/mpchart/src/main/ets/components/utils/Utils";
import BubbleEntry from "@package:pkg_modules/.ohpm/@ohos+mpchart@3.0.27/pkg_modules/@ohos/mpchart/src/main/ets/components/data/BubbleEntry";
import CandleEntry from "@package:pkg_modules/.ohpm/@ohos+mpchart@3.0.27/pkg_modules/@ohos/mpchart/src/main/ets/components/data/CandleEntry";
import WaterfallEntry from "@package:pkg_modules/.ohpm/@ohos+mpchart@3.0.27/pkg_modules/@ohos/mpchart/src/main/ets/components/data/WaterfallEntry";
export class BarLineBaseChart extends ViewPU {
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
        this.__isAccessBool = new ObservedPropertySimplePU(true, this, "isAccessBool");
        this.__isAccessShow = new ObservedPropertySimplePU(false, this, "isAccessShow");
        this.__accessWidth = new ObservedPropertySimplePU(0, this, "accessWidth");
        this.__accessHeight = new ObservedPropertySimplePU(200, this, "accessHeight");
        this.__accessX = new ObservedPropertySimplePU(0, this, "accessX");
        this.__accessY = new ObservedPropertySimplePU(0, this, "accessY");
        this.setInitiallyProvidedValue(params);
        this.finalizeConstruction();
    }
    setInitiallyProvidedValue(params: BarLineBaseChart_Params) {
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
        if (params.isAccessBool !== undefined) {
            this.isAccessBool = params.isAccessBool;
        }
        if (params.isAccessShow !== undefined) {
            this.isAccessShow = params.isAccessShow;
        }
        if (params.accessWidth !== undefined) {
            this.accessWidth = params.accessWidth;
        }
        if (params.accessHeight !== undefined) {
            this.accessHeight = params.accessHeight;
        }
        if (params.accessX !== undefined) {
            this.accessX = params.accessX;
        }
        if (params.accessY !== undefined) {
            this.accessY = params.accessY;
        }
    }
    updateStateVars(params: BarLineBaseChart_Params) {
    }
    purgeVariableDependenciesOnElmtId(rmElmtId) {
        this.__content.purgeDependencyOnElmtId(rmElmtId);
        this.__isAccessBool.purgeDependencyOnElmtId(rmElmtId);
        this.__isAccessShow.purgeDependencyOnElmtId(rmElmtId);
        this.__accessWidth.purgeDependencyOnElmtId(rmElmtId);
        this.__accessHeight.purgeDependencyOnElmtId(rmElmtId);
        this.__accessX.purgeDependencyOnElmtId(rmElmtId);
        this.__accessY.purgeDependencyOnElmtId(rmElmtId);
    }
    aboutToBeDeleted() {
        this.__content.aboutToBeDeleted();
        this.__isAccessBool.aboutToBeDeleted();
        this.__isAccessShow.aboutToBeDeleted();
        this.__accessWidth.aboutToBeDeleted();
        this.__accessHeight.aboutToBeDeleted();
        this.__accessX.aboutToBeDeleted();
        this.__accessY.aboutToBeDeleted();
        SubscriberManager.Get().delete(this.id__());
        this.aboutToBeDeletedInternal();
    }
    private model: BubbleChartModel | CandleStickChartModel | CombinedChartModel | ScatterChartModel | HorizontalBarChartModel | null;
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
    private __isAccessBool: ObservedPropertySimplePU<boolean>;
    get isAccessBool() {
        return this.__isAccessBool.get();
    }
    set isAccessBool(newValue: boolean) {
        this.__isAccessBool.set(newValue);
    }
    private __isAccessShow: ObservedPropertySimplePU<boolean>;
    get isAccessShow() {
        return this.__isAccessShow.get();
    }
    set isAccessShow(newValue: boolean) {
        this.__isAccessShow.set(newValue);
    }
    private __accessWidth: ObservedPropertySimplePU<number>;
    get accessWidth() {
        return this.__accessWidth.get();
    }
    set accessWidth(newValue: number) {
        this.__accessWidth.set(newValue);
    }
    private __accessHeight: ObservedPropertySimplePU<number>;
    get accessHeight() {
        return this.__accessHeight.get();
    }
    set accessHeight(newValue: number) {
        this.__accessHeight.set(newValue);
    }
    private __accessX: ObservedPropertySimplePU<number>;
    get accessX() {
        return this.__accessX.get();
    }
    set accessX(newValue: number) {
        this.__accessX.set(newValue);
    }
    private __accessY: ObservedPropertySimplePU<number>;
    get accessY() {
        return this.__accessY.get();
    }
    set accessY(newValue: number) {
        this.__accessY.set(newValue);
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
    aboutToDisappear(): void {
        this.model?.clearJobs();
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
                        this.isAccessBool = true;
                        let readChartText = this.model.getReadChartText();
                        let readLegendText = this.model.getReadLegendText();
                        let readAxisText = this.model.getReadAxisText();
                        AppStorage.setOrCreate(Constants.BAR_CHART_ACCESS, true);
                        const highlight = this.model.getHighlightByTouchPoint(event.x, event.y);
                        if (highlight) {
                            const entry = this.model.getData()?.getEntryForHighlight(highlight);
                            AppStorage.setOrCreate(Constants.LEGEND_ACCESS_BOOL, this.isAccessBool);
                            let accessClick: AccessClick = {
                                x: event.x,
                                y: event.y
                            };
                            AppStorage.setOrCreate(Constants.LEGEND_ACCESS, accessClick);
                            if (this.model && this.context2D) {
                                this.model.onDraw(this.context2D);
                            }
                            let legendString = AppStorage.get(Constants.LEGEND_ACCESS_LABEL) as string;
                            let matchText = {
                                '{legend}': legendString != '' ? legendString : '标签无内容',
                            } as Record<string, string>;
                            this.content = readLegendText ? (legendString == 'No section selected' ? 'No section selected' : (Utils.matchingTemplate(readLegendText, matchText))) : legendString != '' ? `图例: ${legendString}` : '标签无内容';
                            this.isAccessBool = AppStorage.get(Constants.LEGEND_ACCESS_BOOL) as boolean;
                            if (this.isAccessBool) {
                                this.model.onAccessUp(event);
                                if (entry) {
                                    if (entry instanceof BubbleEntry) {
                                        let matchText = {
                                            '{x}': entry.getX().toFixed(1),
                                            '{y}': entry.getY().toFixed(1),
                                            '{size}': entry.getSize().toFixed(1),
                                        } as Record<string, string>;
                                        this.content = readChartText != '' ? Utils.matchingTemplate(readChartText, matchText) : `横坐标: ${entry.getX()}, 纵坐标: ${entry.getY().toFixed(1)}, 面积: ${entry.getSize().toFixed(1)}`;
                                    }
                                    else if (entry instanceof CandleEntry) {
                                        let matchText = {
                                            '{x}': entry.getX().toFixed(1),
                                            '{y}': entry.getY().toFixed(1),
                                            '{max}': entry.getHigh().toFixed(1),
                                            '{min}': entry.getLow().toFixed(1),
                                            '{open}': entry.getOpen().toFixed(1),
                                            '{close}': entry.getClose().toFixed(1),
                                        } as Record<string, string>;
                                        this.content = readChartText != '' ? Utils.matchingTemplate(readChartText, matchText) : `横坐标: ${entry.getX()}, 纵坐标: ${entry.getY().toFixed(1)}, 最高值: ${entry.getHigh().toFixed(1)}, 最低值: ${entry.getLow().toFixed(1)}, 开值: ${entry.getOpen().toFixed(1)}, 关值: ${entry.getClose().toFixed(1)}, `;
                                    }
                                    else if (entry instanceof WaterfallEntry) {
                                        let matchText = {
                                            '{x}': entry.getX().toFixed(1),
                                            '{y}': entry.getY().toFixed(1),
                                            '{min}': entry.getMinY().toFixed(1),
                                            '{max}': entry.getMaxY().toFixed(1),
                                        } as Record<string, string>;
                                        this.content = readChartText != '' ? Utils.matchingTemplate(readChartText, matchText) : `横坐标: ${entry.getX()}, 纵坐标: ${entry.getY().toFixed(1)}, 最小值: ${entry.getMinY().toFixed(1)}, 最大值: ${entry.getMaxY().toFixed(1)}`;
                                    }
                                    else {
                                        let matchText = {
                                            '{x}': entry.getX().toFixed(1),
                                            '{y}': entry.getY().toFixed(1),
                                        } as Record<string, string>;
                                        this.content = readChartText != '' ? Utils.matchingTemplate(readChartText, matchText) : `横坐标: ${entry.getX().toFixed(1)}, 纵坐标: ${entry.getY().toFixed(1)}`;
                                    }
                                }
                                else {
                                    this.content = 'No section selected';
                                }
                            }
                        }
                        else {
                            this.content = 'No section selected';
                        }
                        if (Utils.getAccessibilityHoverText(this.model.mAxisLabelInfo, event.x, event.y).value !== '') {
                            this.isAccessShow = true;
                            let labelInfo = Utils.getAccessibilityHoverText(this.model.mAxisLabelInfo, event.x, event.y);
                            if (labelInfo.value) {
                                let axisStr = labelInfo.value.split(':');
                                let matchText = {
                                    '{axis}': axisStr[0],
                                    '{value}': axisStr[1],
                                } as Record<string, string>;
                                this.content = readAxisText ? Utils.matchingTemplate(readAxisText, matchText) : labelInfo.value;
                            }
                            else {
                                this.content = 'No section selected';
                            }
                            this.accessWidth = labelInfo.width!;
                            this.accessHeight = labelInfo.height!;
                            this.accessX = labelInfo.x!;
                            this.accessY = labelInfo.y!;
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
            Canvas.onReady(() => {
                if (this.model && this.context2D) {
                    this.model.setContext2D(this.context2D);
                }
            });
            Canvas.onAreaChange((oldArea: Area, newArea: Area) => {
                if (this.model && ((newArea.width !== oldArea.width) || (newArea.height !== oldArea.height))) {
                    this.model.onChartSizeChanged(Number(newArea.width), Number(newArea.height), Number(oldArea.width), Number(oldArea.height));
                }
            });
            Canvas.onTouch((event) => {
                this.model?.onTouchEvent(event);
            });
            Canvas.hitTestBehavior(this.model?.getTouchEnabled() ? this.model?.getHitTestMode() : HitTestMode.None);
            Gesture.create(GesturePriority.High);
            GestureGroup.create(GestureMode.Exclusive);
            SwipeGesture.create();
            SwipeGesture.onAction((event: GestureEvent) => {
                if (this.model?.isDragDecelerationEnabled()) {
                    this.model.computeScroll(event);
                }
            });
            SwipeGesture.pop();
            GestureGroup.create(GestureMode.Parallel);
            TapGesture.create({ count: 2 });
            TapGesture.onAction((event?: GestureEvent) => {
                if (event && this.model) {
                    this.model.onDoubleTap(false, event);
                }
            });
            TapGesture.pop();
            TapGesture.create({ count: 1 });
            TapGesture.onAction((event?: GestureEvent) => {
                if (event && this.model) {
                    AppStorage.setOrCreate(Constants.BAR_CHART_ACCESS, false);
                    this.model.onSingleTapUp(false, event);
                }
            });
            TapGesture.pop();
            GestureGroup.pop();
            LongPressGesture.create({ duration: this.model?.getLongPressDuration() });
            LongPressGesture.onAction((event?: GestureEvent) => {
                if (this.model && event) {
                    this.model.onLongPress(false, 'Down', event);
                }
            });
            LongPressGesture.onActionEnd((event?: GestureEvent) => {
                if (this.model && event) {
                    this.model.onLongPress(false, 'Up', event);
                }
            });
            LongPressGesture.onActionCancel((event?: GestureEvent) => {
                if (this.model && event) {
                    this.model.onLongPress(false, 'Cancel', event);
                }
            });
            LongPressGesture.pop();
            PinchGesture.create({ fingers: 2 });
            PinchGesture.onActionStart((event?: GestureEvent) => {
                if (this.model && event) {
                    this.model.onPinch(false, 'Start', event);
                }
            });
            PinchGesture.onActionUpdate((event?: GestureEvent) => {
                if (this.model && event) {
                    this.model.onPinch(false, 'Update', event);
                }
            });
            PinchGesture.onActionEnd((event?: GestureEvent) => {
                if (this.model && event) {
                    this.model.onPinch(false, 'End', event);
                }
            });
            PinchGesture.onActionCancel((event?: GestureEvent) => {
                if (this.model && event) {
                    this.model.onPinch(false, 'Cancel', event);
                }
            });
            PinchGesture.pop();
            GestureGroup.pop();
            Gesture.pop();
            Canvas.scale({
                x: this.model?.getHorizontalFlip() ? -1 : 1
            });
        }, Canvas);
        Canvas.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            If.create();
            if (this.isAccessShow) {
                this.ifElseBranchUpdateFunction(0, () => {
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Row.create();
                        Row.width(this.accessWidth);
                        Row.height(this.accessHeight);
                        Row.borderWidth(3);
                        Row.borderColor('#6bc843');
                        Row.position({
                            x: this.accessX,
                            y: this.accessY
                        });
                    }, Row);
                    Row.pop();
                });
            }
            else {
                this.ifElseBranchUpdateFunction(1, () => {
                });
            }
        }, If);
        If.pop();
        Stack.pop();
        Column.pop();
    }
    rerender() {
        this.updateDirtyElements();
    }
}
