import type LineData from '../data/LineData';
import type LineDataProvider from '../interfaces/dataprovider/LineDataProvider';
import type ILineDataSet from '../interfaces/datasets/ILineDataSet';
import type IFillFormatter from './IFillFormatter';
/**
 * Default formatter that calculates the position of the filled line.
 *
 *
 */
export default class DefaultFillFormatter implements IFillFormatter {
    public getFillLinePosition(dataSet: ILineDataSet, dataProvider: LineDataProvider): number {
        let fillMin: number = 0;
        let chartMaxY: number = dataProvider.getYChartMax();
        let chartMinY: number = dataProvider.getYChartMin();
        let data: LineData | null = dataProvider.getLineData();
        if (dataSet.getYMax() > 0 && dataSet.getYMin() < 0) {
            fillMin = 0;
        }
        else {
            let max: number;
            let min: number;
            if (data && data.getYMax() > 0) {
                max = 0;
            }
            else {
                max = chartMaxY;
            }
            if (data && data.getYMin() < 0) {
                min = 0;
            }
            else {
                min = chartMinY;
            }
            fillMin = dataSet.getYMin() >= 0 ? min : max;
        }
        return fillMin;
    }
}
