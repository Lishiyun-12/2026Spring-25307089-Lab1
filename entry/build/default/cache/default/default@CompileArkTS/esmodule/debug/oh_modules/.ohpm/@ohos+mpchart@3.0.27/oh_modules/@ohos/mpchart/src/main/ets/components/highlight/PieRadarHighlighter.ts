import type PieRadarChartBase from '../charts/PieRadarChartBaseModel';
import type ChartData from '../data/ChartData';
import type EntryOhos from '../data/EntryOhos';
import type IDataSet from '../interfaces/datasets/IDataSet';
import type Highlight from './Highlight';
import type IHighlighter from './IHighlighter';
export default abstract class PieRadarHighlighter<T extends PieRadarChartBase<ChartData<IDataSet<EntryOhos>>>> implements IHighlighter {
    protected mChart: T;
    /**
     * buffer for storing previously highlighted values
     */
    protected mHighlightBuffer: Array<Highlight> = new Array<Highlight>();
    constructor(chart: T) {
        this.mChart = chart;
    }
    public getHighlight(x: number, y: number): Highlight | null {
        if (this.mChart == null || this.mChart.getData() == null || this.mChart.getData()!.getMaxEntryCountSet() == null) {
            return null;
        }
        let touchDistanceToCenter: number = this.mChart.distanceToCenter(x, y);
        // check if a slice was touched
        if (touchDistanceToCenter > this.mChart.getRadius()) {
            // if no slice was touched, highlight nothing
            return null;
        }
        else {
            let angle: number = this.mChart.getAngleForPoint(x, y);
            // if (this.mChart instanceof PieChartModel) {
            //   let animator = this.mChart.getAnimator();
            //   if(animator){
            //     angle /= animator.getPhaseY();
            //   }
            // }
            let index = this.mChart.getIndexForAngle(angle);
            // check if the index could be found
            if (index < 0 || index >= this.mChart!.getData()!.getMaxEntryCountSet()!.getEntryCount()) {
                return null;
            }
            else {
                return this.getClosestHighlight(index, x, y);
            }
        }
    }
    /**
     * Returns the closest Highlight object of the given objects based on the touch position inside the chart.
     *
     * @param index
     * @param x
     * @param y
     * @return
     */
    protected abstract getClosestHighlight(index: number, x: number, y: number): Highlight | null;
}
