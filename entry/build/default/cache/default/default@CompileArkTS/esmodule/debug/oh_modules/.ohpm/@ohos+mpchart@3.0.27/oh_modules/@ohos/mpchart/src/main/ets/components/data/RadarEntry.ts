import type ChartPixelMap from './ChartPixelMap';
import EntryOhos from "@package:pkg_modules/.ohpm/@ohos+mpchart@3.0.27/pkg_modules/@ohos/mpchart/src/main/ets/components/data/EntryOhos";
export default class RadarEntry extends EntryOhos {
    constructor(value: number, icon?: ChartPixelMap, data?: Object) {
        super(0, value, icon, data);
    }
    public getValue(): number {
        return this.getY();
    }
    public copy(): RadarEntry {
        if (!this.getData()) {
            return new RadarEntry(this.getY(), undefined);
        }
        let e: RadarEntry = new RadarEntry(this.getY(), this.getIcon()!, this.getData()!);
        return e;
    }
    public setX(x: number) {
        super.setX(x);
    }
    public getX(): number {
        return super.getX();
    }
}
