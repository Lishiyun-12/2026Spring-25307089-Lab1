if (!("finalizeConstruction" in ViewPU.prototype)) {
    Reflect.set(ViewPU.prototype, "finalizeConstruction", () => { });
}
interface PieChart_Params {
    model?: PieChartModel | null;
    antiAliasing?: boolean;
}
import type PieChartModel from '../charts/PieChartModel';
import PieRadarBaseChart from "@package:pkg_modules/.ohpm/@ohos+mpchart@3.0.27/pkg_modules/@ohos/mpchart/src/main/ets/components/chartcomponents/PieRadarBaseChart";
export default class PieChart extends ViewPU {
    constructor(parent, params, __localStorage, elmtId = -1, paramsLambda = undefined, extraInfo) {
        super(parent, __localStorage, elmtId, extraInfo);
        if (typeof paramsLambda === "function") {
            this.paramsGenerator_ = paramsLambda;
        }
        this.model = null;
        this.antiAliasing = true;
        this.setInitiallyProvidedValue(params);
        this.finalizeConstruction();
    }
    setInitiallyProvidedValue(params: PieChart_Params) {
        if (params.model !== undefined) {
            this.model = params.model;
        }
        if (params.antiAliasing !== undefined) {
            this.antiAliasing = params.antiAliasing;
        }
    }
    updateStateVars(params: PieChart_Params) {
    }
    purgeVariableDependenciesOnElmtId(rmElmtId) {
    }
    aboutToBeDeleted() {
        SubscriberManager.Get().delete(this.id__());
        this.aboutToBeDeletedInternal();
    }
    private model: PieChartModel | null;
    private antiAliasing: boolean;
    initialRender() {
        {
            this.observeComponentCreation2((elmtId, isInitialRender) => {
                if (isInitialRender) {
                    let componentCall = new PieRadarBaseChart(this, { model: this.model, antiAliasing: this.antiAliasing }, undefined, elmtId, () => { }, { page: "oh_modules/.ohpm/@ohos+mpchart@3.0.27/oh_modules/@ohos/mpchart/src/main/ets/components/chartcomponents/PieChart.ets", line: 25, col: 5 });
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
            }, { name: "PieRadarBaseChart" });
        }
    }
    rerender() {
        this.updateDirtyElements();
    }
}
