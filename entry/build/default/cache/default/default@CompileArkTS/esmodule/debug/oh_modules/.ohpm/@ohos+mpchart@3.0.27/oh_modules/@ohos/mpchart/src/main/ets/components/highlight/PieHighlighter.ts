import PieRadarHighlighter from "@package:pkg_modules/.ohpm/@ohos+mpchart@3.0.27/pkg_modules/@ohos/mpchart/src/main/ets/components/highlight/PieRadarHighlighter";
import type PieChart from '../charts/PieChartModel';
import Highlight from "@package:pkg_modules/.ohpm/@ohos+mpchart@3.0.27/pkg_modules/@ohos/mpchart/src/main/ets/components/highlight/Highlight";
import type IPieDataSet from '../interfaces/datasets/IPieDataSet';
import type EntryOhos from '../data/EntryOhos';
export default class PieHighlighter extends PieRadarHighlighter<PieChart> {
    constructor(chart: PieChart) {
        super(chart);
    }
    public getClosestHighlight(index: number, x: number, y: number): Highlight {
        let chartData = this.mChart.getData();
        if (chartData) {
            let set: IPieDataSet = chartData.getDataSet();
            let entry: EntryOhos = set.getEntryForIndex(index);
            return new Highlight(index, entry.getY(), 0, -1, 0, x, y, set.getAxisDependency());
        }
        return new Highlight(0, 0, 0, 0, 0, 0, 0, null);
    }
}
