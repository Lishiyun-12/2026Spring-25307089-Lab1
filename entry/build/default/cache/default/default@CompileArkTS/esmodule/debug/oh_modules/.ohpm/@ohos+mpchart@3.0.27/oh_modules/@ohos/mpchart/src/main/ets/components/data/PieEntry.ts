import EntryOhos from "@package:pkg_modules/.ohpm/@ohos+mpchart@3.0.27/pkg_modules/@ohos/mpchart/src/main/ets/components/data/EntryOhos";
import type ChartPixelMap from './ChartPixelMap';
// @SuppressLint("ParcelCreator")
export default class PieEntry extends EntryOhos {
    public label: string = '';
    constructor(yValue: number, label?: string, icon?: ChartPixelMap /*Drawable*/, data?: Object) {
        super(0, yValue, icon, data);
        this.label = label ? label : '';
    }
    /**
     * This is the same as getY(). Returns the value of the PieEntry.
     *
     * @return
     */
    public getValue(): number {
        return super.getY();
    }
    public getLabel(): string {
        return this.label;
    }
    public setLabel(label: string): void {
        this.label = label;
    }
    // @Deprecated
    // @Override
    public setX(x: number): void {
        super.setX(x);
        // Log.i("DEPRECATED", "Pie entries do not have x values");
    }
    // @Deprecated
    // @Override
    public getX(): number {
        // Log.i("DEPRECATED", "Pie entries do not have x values");
        return super.getX();
    }
    public copy(): PieEntry {
        let data = this.getData();
        let e: PieEntry = new PieEntry(this.getY(), this.label, undefined, data ? data : undefined);
        return e;
    }
}
