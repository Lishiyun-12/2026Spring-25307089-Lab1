if (!("finalizeConstruction" in ViewPU.prototype)) {
    Reflect.set(ViewPU.prototype, "finalizeConstruction", () => { });
}
interface PieRadarBaseChart_Params {
    model?: PieChartModel | RadarChartModel | null;
    antiAliasing?: boolean;
    setting?: RenderingContextSettings | null;
    context2D?: CanvasRenderingContext2D | null;
    content?: string;
}
import PieChartModel from "@package:pkg_modules/.ohpm/@ohos+mpchart@3.0.27/pkg_modules/@ohos/mpchart/src/main/ets/components/charts/PieChartModel";
import RadarChartModel from "@package:pkg_modules/.ohpm/@ohos+mpchart@3.0.27/pkg_modules/@ohos/mpchart/src/main/ets/components/charts/RadarChartModel";
import PieEntry from "@package:pkg_modules/.ohpm/@ohos+mpchart@3.0.27/pkg_modules/@ohos/mpchart/src/main/ets/components/data/PieEntry";
import MoveViewJob from "@package:pkg_modules/.ohpm/@ohos+mpchart@3.0.27/pkg_modules/@ohos/mpchart/src/main/ets/components/jobs/MoveViewJob";
import Constants from "@package:pkg_modules/.ohpm/@ohos+mpchart@3.0.27/pkg_modules/@ohos/mpchart/src/main/ets/components/utils/Constants";
import type { AccessClick } from "@package:pkg_modules/.ohpm/@ohos+mpchart@3.0.27/pkg_modules/@ohos/mpchart/src/main/ets/components/utils/Constants";
import { GlobalContext } from "@package:pkg_modules/.ohpm/@ohos+mpchart@3.0.27/pkg_modules/@ohos/mpchart/src/main/ets/components/utils/GlobalContext";
import { LogUtil } from "@package:pkg_modules/.ohpm/@ohos+mpchart@3.0.27/pkg_modules/@ohos/mpchart/src/main/ets/components/utils/LogUtil";
import Utils from "@package:pkg_modules/.ohpm/@ohos+mpchart@3.0.27/pkg_modules/@ohos/mpchart/src/main/ets/components/utils/Utils";
export default class PieRadarBaseChart extends ViewPU {
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
    setInitiallyProvidedValue(params: PieRadarBaseChart_Params) {
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
    updateStateVars(params: PieRadarBaseChart_Params) {
    }
    purgeVariableDependenciesOnElmtId(rmElmtId) {
        this.__content.purgeDependencyOnElmtId(rmElmtId);
    }
    aboutToBeDeleted() {
        this.__content.aboutToBeDeleted();
        SubscriberManager.Get().delete(this.id__());
        this.aboutToBeDeletedInternal();
    }
    private model: PieChartModel | RadarChartModel | null;
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
                        let readChartText = this.model.getReadChartText();
                        let readLegendText = this.model.getReadLegendText();
                        AppStorage.setOrCreate(Constants.PIE_CHART_ACCESS, true);
                        const highlight = this.model.getHighlightByTouchPoint(event.x, event.y);
                        if (highlight) {
                            const entry = this.model.getData()?.getEntryForHighlight(highlight);
                            AppStorage.setOrCreate(Constants.LEGEND_ACCESS_BOOL, false);
                            this.model.onAccessUp(event);
                            if (entry) {
                                if (this.model instanceof PieChartModel) {
                                    let pieEntryArr: Array<PieEntry> = this.model.getData()?.getDataSetForEntry(entry)?.getEntriesForXValue(0).dataSource as Array<PieEntry>;
                                    let ySum = pieEntryArr.reduce((acc, item) => acc + item.getY(), 0);
                                    let label = '';
                                    let value = '';
                                    if (entry instanceof PieEntry) {
                                        label = entry.getLabel();
                                        value = (entry.getY() / ySum * 100).toFixed(1);
                                    }
                                    let matchText = {
                                        '{label}': label,
                                        '{value}': value,
                                    } as Record<string, string>;
                                    this.content = readChartText != '' ? Utils.matchingTemplate(readChartText, matchText) : `选中的块: ${label}, 值为: ${value}`;
                                }
                                else if (this.model instanceof RadarChartModel) {
                                    let matchText = {
                                        '{value}': entry.getY().toFixed(0),
                                    } as Record<string, string>;
                                    this.content = readChartText != '' ? Utils.matchingTemplate(readChartText, matchText) : `值为: ${entry.getY().toFixed(0)}%`;
                                }
                            }
                            else {
                                this.content = 'No section selected';
                            }
                        }
                        else {
                            AppStorage.setOrCreate(Constants.LEGEND_ACCESS_BOOL, true);
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
                        }
                    }
                }
                catch (err) {
                    LogUtil.error(err);
                }
            });
        }, Column);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Canvas.create(this.context2D);
            Canvas.onReady(() => {
                if (this.model && this.context2D) {
                    this.model.setContext2D(this.context2D);
                }
            });
            Canvas.onAreaChange((oldArea: Area, newArea: Area) => {
                if (this.model && this.context2D && ((newArea.width !== oldArea.width) || (newArea.height !== oldArea.height))) {
                    this.model.onChartSizeChanged(Number(newArea.width), Number(newArea.height), Number(oldArea.width), Number(oldArea.height));
                    this.model.onDraw(this.context2D);
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
                if (event && this.model && this.model.isDragDecelerationEnabled()) {
                    this.model?.computeScroll(event);
                }
            });
            SwipeGesture.pop();
            TapGesture.create({ count: 1 });
            TapGesture.onAction((event?: GestureEvent) => {
                if (event && this.model) {
                    LogUtil.log("------------------------onSingleTapUp");
                    AppStorage.setOrCreate(Constants.PIE_CHART_ACCESS, false);
                    this.model.onSingleTapUp(false, event);
                }
            });
            TapGesture.pop();
            GestureGroup.pop();
            Gesture.pop();
        }, Canvas);
        Canvas.pop();
        Column.pop();
    }
    rerender() {
        this.updateDirtyElements();
    }
}
