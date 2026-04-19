import MPPointF from "@package:pkg_modules/.ohpm/@ohos+mpchart@3.0.27/pkg_modules/@ohos/mpchart/src/main/ets/components/utils/MPPointF";
import Utils from "@package:pkg_modules/.ohpm/@ohos+mpchart@3.0.27/pkg_modules/@ohos/mpchart/src/main/ets/components/utils/Utils";
import ComponentBase from "@package:pkg_modules/.ohpm/@ohos+mpchart@3.0.27/pkg_modules/@ohos/mpchart/src/main/ets/components/components/ComponentBase";
export default class Description extends ComponentBase {
    /**
     * the text used in the description
     */
    private text: string = "Description Label";
    /**
     * the custom position of the description text
     */
    private mPosition: MPPointF | null = null;
    /**
     * the alignment of the description text
     */
    private mTextAlign: CanvasTextAlign = 'right';
    constructor() {
        super();
        // default size
        this.mTextSize = Utils.handleDataValues(8);
    }
    /**
     * Sets the text to be shown as the description.
     *
     * @param text
     */
    public setText(text: string): void {
        this.text = text;
    }
    /**
     * Returns the description text.
     *
     * @return
     */
    public getText(): string {
        return this.text;
    }
    /**
     * Sets a custom position for the description text in pixels on the screen.
     *
     * @param x - xcoordinate
     * @param y - ycoordinate
     */
    public setPosition(x: number, y: number): void {
        if (this.mPosition == null) {
            this.mPosition = MPPointF.getInstance(x, y);
        }
        else {
            this.mPosition.x = x;
            this.mPosition.y = y;
        }
    }
    /**
     * Returns the customized position of the description, or null if none set.
     *
     * @return
     */
    public getPosition(): MPPointF | null {
        return this.mPosition;
    }
    /**
     * Sets the text alignment of the description text. Default RIGHT.
     *
     * @param align
     */
    public setTextAlign(align: CanvasTextAlign) {
        this.mTextAlign = align;
    }
    /**
     * Returns the text alignment of the description.
     *
     * @return
     */
    public getTextAlign(): CanvasTextAlign {
        return this.mTextAlign;
    }
}
