import image from "@ohos:multimedia.image";
import Constants from "@package:pkg_modules/.ohpm/@ohos+mpchart@3.0.27/pkg_modules/@ohos/mpchart/src/main/ets/components/utils/Constants";
import { GlobalContext } from "@package:pkg_modules/.ohpm/@ohos+mpchart@3.0.27/pkg_modules/@ohos/mpchart/src/main/ets/components/utils/GlobalContext";
export default class ChartPixelMap {
    private icon: PixelMap | number | null = null;
    private height: number = 0;
    private width: number = 0;
    //设置图标 PixelMap 或者 Resource.id
    public setIcon(newIcon: PixelMap | number) {
        this.icon = newIcon;
    }
    public async getIcon(): Promise<image.PixelMap | null> {
        if (typeof this.icon === 'number') {
            let id = this.icon as number;
            let uiContext = GlobalContext.getContext().getObject(Constants.UI_CONTEXT) as UIContext;
            let hostContext = uiContext.getHostContext();
            if (hostContext) {
                let fileData = hostContext.resourceManager.getMediaContentSync(id);
                const buffer: ArrayBuffer = fileData.buffer.slice(0, fileData.buffer.byteLength);
                const imageSource: image.ImageSource = image.createImageSource(buffer);
                let pixelMap = await imageSource.createPixelMap();
                imageSource.release();
                return pixelMap;
            }
            else {
                return null;
            }
        }
        if (this.icon != null) {
            let pixelMap = this.icon as PixelMap;
            return pixelMap;
        }
        return null;
    }
    public setWidth(width: number) {
        this.width = width;
    }
    public getWidth(): number {
        return this.width;
    }
    public setHeight(height: number) {
        this.height = height;
    }
    public getHeight(): number {
        return this.height;
    }
}
