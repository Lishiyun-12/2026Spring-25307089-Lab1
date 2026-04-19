if (!("finalizeConstruction" in ViewPU.prototype)) {
    Reflect.set(ViewPU.prototype, "finalizeConstruction", () => { });
}
interface AreaChart_Params {
    model?: LineChartModel | null;
    antiAliasing?: boolean;
}
import type LineChartModel from '../charts/LineChartModel';
import LineChart from "@package:pkg_modules/.ohpm/@ohos+mpchart@3.0.27/pkg_modules/@ohos/mpchart/src/main/ets/components/chartcomponents/LineChart";
export default class AreaChart extends ViewPU {
    constructor(parent, params, __localStorage, elmtId = -1, paramsLambda = undefined, extraInfo) {
        super(parent, __localStorage, elmtId, extraInfo);
        if (typeof paramsLambda === "function") {
            this.paramsGenerator_ = paramsLambda;
        }
        this.__model = new ObservedPropertyObjectPU(null, this, "model");
        this.antiAliasing = true;
        this.setInitiallyProvidedValue(params);
        this.finalizeConstruction();
    }
    setInitiallyProvidedValue(params: AreaChart_Params) {
        if (params.model !== undefined) {
            this.model = params.model;
        }
        if (params.antiAliasing !== undefined) {
            this.antiAliasing = params.antiAliasing;
        }
    }
    updateStateVars(params: AreaChart_Params) {
    }
    purgeVariableDependenciesOnElmtId(rmElmtId) {
        this.__model.purgeDependencyOnElmtId(rmElmtId);
    }
    aboutToBeDeleted() {
        this.__model.aboutToBeDeleted();
        SubscriberManager.Get().delete(this.id__());
        this.aboutToBeDeletedInternal();
    }
    private __model: ObservedPropertyObjectPU<LineChartModel | null>;
    get model() {
        return this.__model.get();
    }
    set model(newValue: LineChartModel | null) {
        this.__model.set(newValue);
    }
    private antiAliasing: boolean;
    initialRender() {
        {
            this.observeComponentCreation2((elmtId, isInitialRender) => {
                if (isInitialRender) {
                    let componentCall = new LineChart(this, { model: this.model, antiAliasing: this.antiAliasing }, undefined, elmtId, () => { }, { page: "oh_modules/.ohpm/@ohos+mpchart@3.0.27/oh_modules/@ohos/mpchart/src/main/ets/components/chartcomponents/AreaChart.ets", line: 25, col: 5 });
                    ViewPU.create(componentCall);
                    let paramsLambda = () => {
                        return {
                            model: this.model,
                            antiAliasing: this.antiAliasing
                        };
                    };
                    componentCall.paramsGenerator_ = paramsLambda;
                }
                else {
                    this.updateStateVarsOfChildByElmtId(elmtId, {});
                }
            }, { name: "LineChart" });
        }
    }
    rerender() {
        this.updateDirtyElements();
    }
}
