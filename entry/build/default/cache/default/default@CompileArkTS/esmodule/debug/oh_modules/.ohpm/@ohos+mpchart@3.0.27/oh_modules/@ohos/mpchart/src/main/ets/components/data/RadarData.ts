import type Highlight from '../highlight/Highlight';
import type IRadarDataSet from '../interfaces/datasets/IRadarDataSet';
import { JArrayList } from "@package:pkg_modules/.ohpm/@ohos+mpchart@3.0.27/pkg_modules/@ohos/mpchart/src/main/ets/components/utils/JArrayList";
import ChartData from "@package:pkg_modules/.ohpm/@ohos+mpchart@3.0.27/pkg_modules/@ohos/mpchart/src/main/ets/components/data/ChartData";
import type EntryOhos from './EntryOhos';
export default class RadarData extends ChartData<IRadarDataSet> {
    private mLabels: string[] | undefined;
    constructor(dataSets?: IRadarDataSet[] | JArrayList<IRadarDataSet>) {
        if (dataSets) {
            if (dataSets instanceof JArrayList) {
                super(dataSets);
            }
            else {
                super(dataSets);
            }
        }
        else {
            super();
        }
    }
    /**
     * Sets the labels that should be drawn around the RadarChart at the end of each web line.
     *
     * @param labels
     */
    setLabels(labels: string[]): void;
    /**
     * Sets the labels that should be drawn around the RadarChart at the end of each web line.
     *
     * @param labels
     */
    setLabels(labels: string[] | string): void {
        this.mLabels = Array.isArray(labels) ? labels : [labels];
    }
    getLabels(): string[] | undefined {
        return this.mLabels;
    }
    getEntryForHighlight(highlight: Highlight): EntryOhos | null {
        const dataSet = this.getDataSetByIndex(highlight.getDataSetIndex());
        return dataSet ? dataSet.getEntryForIndex(Math.floor(highlight.getX())) : null;
    }
}
