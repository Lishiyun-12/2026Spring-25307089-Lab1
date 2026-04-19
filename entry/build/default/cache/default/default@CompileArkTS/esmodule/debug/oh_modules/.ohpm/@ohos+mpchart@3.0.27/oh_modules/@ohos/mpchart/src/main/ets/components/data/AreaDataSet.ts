import { LineDataSet } from "@package:pkg_modules/.ohpm/@ohos+mpchart@3.0.27/pkg_modules/@ohos/mpchart/src/main/ets/components/data/LineDataSet";
import { JArrayList } from "@package:pkg_modules/.ohpm/@ohos+mpchart@3.0.27/pkg_modules/@ohos/mpchart/src/main/ets/components/utils/JArrayList";
import AreaEntry from "@package:pkg_modules/.ohpm/@ohos+mpchart@3.0.27/pkg_modules/@ohos/mpchart/src/main/ets/components/data/AreaEntry";
export default class AreaDataSet extends LineDataSet {
    private readonly cachedDataSets: AreaDataSet[] = [];
    private readonly yValues: JArrayList<AreaEntry>;
    private readonly dataSetLabels: string | string[];
    constructor(yValues: JArrayList<AreaEntry>, label: string | string[]) {
        super(yValues, AreaDataSet.normalizeLabel(label));
        this.yValues = yValues;
        this.dataSetLabels = label;
    }
    /**
     * Normalizes label to string format
     * @param label Label(s) to normalize
     * @returns Single label string
     */
    private static normalizeLabel(label: string | string[]): string {
        return typeof label === 'string' ? label : label[0] || 'Default';
    }
    /**
     * Gets label for specific dataset index
     * @param index Dataset index
     * @returns Corresponding label
     */
    private getLabelForDataSet(index: number): string {
        if (typeof this.dataSetLabels === 'string') {
            return this.dataSetLabels;
        }
        return this.dataSetLabels[index];
    }
    /**
     * Gets all area datasets
     * @returns Readonly array of area datasets
     */
    public getAreaDataSets(): Array<AreaDataSet> {
        if (this.cachedDataSets.length > 0) {
            return this.cachedDataSets;
        }
        const entries = this.yValues.dataSource;
        if (!entries || entries.length === 0) {
            return [new AreaDataSet(new JArrayList<AreaEntry>(), this.getLabelForDataSet(0))];
        }
        const firstEntry = entries[0];
        if (!firstEntry.isStacked) {
            return [new AreaDataSet(this.yValues, this.getLabelForDataSet(0))];
        }
        const stackData = firstEntry.getStackedEntries();
        if (!stackData || stackData.length === 0) {
            return [new AreaDataSet(this.yValues, this.getLabelForDataSet(0))];
        }
        for (let i = 0; i < stackData.length; i++) {
            const stackedValues = new JArrayList<AreaEntry>();
            for (const entry of entries) {
                const currentStack = entry.getStackedEntries()[i];
                if (!currentStack) {
                    continue;
                }
                stackedValues.add(new AreaEntry(currentStack.getX(), currentStack.getY()));
            }
            this.cachedDataSets.push(new AreaDataSet(stackedValues, this.getLabelForDataSet(i)));
        }
        return this.cachedDataSets;
    }
}
