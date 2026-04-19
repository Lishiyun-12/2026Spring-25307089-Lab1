import type { DashPathEffect } from '../data/Paint';
import ColorTemplate from "@package:pkg_modules/.ohpm/@ohos+mpchart@3.0.27/pkg_modules/@ohos/mpchart/src/main/ets/components/utils/ColorTemplate";
import { LegendForm } from "@package:pkg_modules/.ohpm/@ohos+mpchart@3.0.27/pkg_modules/@ohos/mpchart/src/main/ets/components/components/Legend";
export default class LegendEntry {
    // constructor();
    //
    // constructor(label: string, form: LegendForm, formSize: number, formLineWidth: number,
    //             formLineDashEffect: DashPathEffect, formColor: number);
    /**
     *
     * @param label The legend entry text. A `null` label will start a group.
     * @param form The form to draw for this entry.
     * @param formSize Set to NaN to use the legend's default.
     * @param formLineWidth Set to NaN to use the legend's default.
     * @param formLineDashEffect Set to nil to use the legend's default.
     * @param formColor The color for drawing the form.
     */
    constructor(label?: string | null, form?: LegendForm | null, formSize?: number | null, formLineWidth?: number | null, formLineDashEffect?: DashPathEffect | null, formColor?: number | null) {
        this.label = label ? label : '';
        this.form = form ? form : LegendForm.DEFAULT;
        this.formSize = formSize == null || formSize == undefined ? Number.NaN : formSize;
        this.formLineWidth = formLineWidth == null || formLineWidth == undefined ? Number.NaN : formLineWidth;
        this.formLineDashEffect = formLineDashEffect == undefined || formLineDashEffect == null ? null : formLineDashEffect;
        this.formColor = formColor == null || formColor == undefined ? 0 : formColor;
    }
    /**
     * The legend entry text.
     * A `null` label will start a group.
     */
    public label: string = '';
    /**
     * The form to draw for this entry.
     *
     * `NONE` will avoid drawing a form, and any related space.
     * `EMPTY` will avoid drawing a form, but keep its space.
     * `DEFAULT` will use the Legend's default.
     */
    public form: LegendForm = LegendForm.DEFAULT;
    /**
     * Form size will be considered except for when .None is used
     *
     * Set as NaN to use the legend's default
     */
    public formSize: number = Number.NaN;
    /**
     * Line width used for shapes that consist of lines.
     *
     * Set as NaN to use the legend's default
     */
    public formLineWidth: number = Number.NaN;
    /**
     * Line dash path effect used for shapes that consist of lines.
     *
     * Set to null to use the legend's default
     */
    public formLineDashEffect: DashPathEffect | null = null;
    /**
     * The color for drawing the form
     */
    public formColor: number = ColorTemplate.COLOR_NONE;
}
