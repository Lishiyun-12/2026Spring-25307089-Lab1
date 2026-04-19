import type ViewPortHandler from '../utils/ViewPortHandler';
/**
 * Abstract baseclass of all Renderers.
 *
 *
 */
export default abstract class Renderer {
    /**
     * the component that handles the drawing area of the chart and it's offsets
     */
    protected mViewPortHandler: ViewPortHandler | null = null;
    constructor(viewPortHandler: ViewPortHandler) {
        if (viewPortHandler) {
            this.mViewPortHandler = viewPortHandler;
        }
    }
}
