import BarData from "@package:pkg_modules/.ohpm/@ohos+mpchart@3.0.27/pkg_modules/@ohos/mpchart/src/main/ets/components/data/BarData";
import type BarLineScatterCandleBubbleData from '../data/BarLineScatterCandleBubbleData';
import { Rounding } from "@package:pkg_modules/.ohpm/@ohos+mpchart@3.0.27/pkg_modules/@ohos/mpchart/src/main/ets/components/data/DataSet";
import type EntryOhos from '../data/EntryOhos';
import WaterfallData from "@package:pkg_modules/.ohpm/@ohos+mpchart@3.0.27/pkg_modules/@ohos/mpchart/src/main/ets/components/data/WaterfallData";
import type BarDataProvider from '../interfaces/dataprovider/BarDataProvider';
import type CombinedDataProvider from '../interfaces/dataprovider/CombinedDataProvider';
import type WaterfallDataProvider from '../interfaces/dataprovider/WaterfallDataProvider';
import type IBarLineScatterCandleBubbleDataSet from '../interfaces/datasets/IBarLineScatterCandleBubbleDataSet';
import type IDataSet from '../interfaces/datasets/IDataSet';
import type { JArrayList } from '../utils/JArrayList';
import BarHighlighter from "@package:pkg_modules/.ohpm/@ohos+mpchart@3.0.27/pkg_modules/@ohos/mpchart/src/main/ets/components/highlight/BarHighlighter";
import ChartHighlighter from "@package:pkg_modules/.ohpm/@ohos+mpchart@3.0.27/pkg_modules/@ohos/mpchart/src/main/ets/components/highlight/ChartHighlighter";
import type Highlight from './Highlight';
import type IHighlighter from './IHighlighter';
import WaterfallHighlighter from "@package:pkg_modules/.ohpm/@ohos+mpchart@3.0.27/pkg_modules/@ohos/mpchart/src/main/ets/components/highlight/WaterfallHighlighter";
export default class CombinedHighlighter extends ChartHighlighter<CombinedDataProvider> implements IHighlighter {
    /**
     * bar highlighter for supporting stacked highlighting
     */
    protected barHighlighter: BarHighlighter | null = null;
    protected waterfallHighlighter: WaterfallHighlighter | null = null;
    constructor(chart: CombinedDataProvider, barChart: BarDataProvider, waterfallChart: WaterfallDataProvider) {
        super(chart);
        // if there is BarData, create a BarHighlighter
        this.barHighlighter = barChart.getBarData() == null ? null : new BarHighlighter(barChart);
        this.waterfallHighlighter = waterfallChart.getWaterfallData() == null ? null : new WaterfallHighlighter(waterfallChart);
    }
    protected getHighlightsAtXValue(xVal: number, x: number, y: number): JArrayList<Highlight> | null {
        this.mHighlightBuffer.clear();
        let combinedData = this.mChart.getCombinedData();
        if (!combinedData) {
            return null;
        }
        let dataObjects: JArrayList<BarLineScatterCandleBubbleData<IBarLineScatterCandleBubbleDataSet<EntryOhos>>> = combinedData.getAllData();
        for (let i = 0; i < dataObjects.size(); i++) {
            let dataObject: BarLineScatterCandleBubbleData<IBarLineScatterCandleBubbleDataSet<EntryOhos>> = dataObjects.get(i);
            if (this.waterfallHighlighter != null && dataObject instanceof WaterfallData) {
                let high: Highlight | null = this.waterfallHighlighter.getHighlight(x, y);
                if (high != null) {
                    high.setDataIndex(i);
                    this.mHighlightBuffer.add(high);
                }
            }
            else if (this.barHighlighter != null && dataObject instanceof BarData) {
                let high: Highlight | null = this.barHighlighter.getHighlight(x, y);
                if (high != null) {
                    high.setDataIndex(i);
                    this.mHighlightBuffer.add(high);
                }
            }
            else {
                for (let j = 0, dataSetCount = dataObject.getDataSetCount(); j < dataSetCount; j++) {
                    let dataSet: IBarLineScatterCandleBubbleDataSet<EntryOhos> | null = dataObjects.get(i).getDataSetByIndex(j);
                    // don't include datasets that cannot be highlighted
                    if (!dataSet || !dataSet.isHighlightEnabled())
                        continue;
                    let highs: JArrayList<Highlight> = this.buildHighlights(dataSet as IDataSet<EntryOhos>, j, xVal, Rounding.CLOSEST);
                    for (let j = 0; j < highs.size(); j++) {
                        let high = highs.get(j);
                        high.setDataIndex(i);
                        this.mHighlightBuffer.add(high);
                    }
                }
            }
        }
        return this.mHighlightBuffer;
    }
}
