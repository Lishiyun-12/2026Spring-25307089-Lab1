import type RoseChart from '../charts/RoseChartModel';
import type { LabelInfo, SectorData, SectorInfo } from '../data/RoseData';
import { LogUtil } from "@package:pkg_modules/.ohpm/@ohos+mpchart@3.0.27/pkg_modules/@ohos/mpchart/src/main/ets/components/utils/LogUtil";
import { MPChartTraceUtil } from "@package:pkg_modules/.ohpm/@ohos+mpchart@3.0.27/pkg_modules/@ohos/mpchart/src/main/ets/components/utils/MPChartTraceUtil";
import { TraceLogConstants } from "@package:pkg_modules/.ohpm/@ohos+mpchart@3.0.27/pkg_modules/@ohos/mpchart/src/main/ets/components/utils/TraceConfig";
export default class RoseChartRender {
    protected mChart: RoseChart;
    private mPathBuffer: Path2D = new Path2D();
    private defaultColorArr: string[] = ['#FF9E7D', '#5470c6', '#91cc75', '#fac858', '#73c0de', '#3ba272', '#fc8452', '#9a60b4'];
    private mSectors: SectorInfo[] = [];
    private mLabelInfo: LabelInfo[] = [];
    constructor(chart: RoseChart) {
        this.mChart = chart;
    }
    private getMaxNumber(): number {
        let max = this.mChart.getRoseData()[0];
        for (let i = 0; i < this.mChart.getCopies(); i++) {
            if (this.mChart.getRoseData()[i].value > max.value) {
                max = this.mChart.getRoseData()[i];
            }
        }
        return max.value;
    }
    public invalidateCanvas(ctx: CanvasRenderingContext2D) {
        this.invalidateData();
        this.drawSector(ctx);
        if (this.mChart.getTitle().length > 0) {
            this.drawTitle(ctx);
        }
        this.drawSectorInfo(ctx);
        this.drawDataView(ctx);
    }
    public invalidateData() {
        if (this.mChart.getViewMode() === 'area') {
            this.invalidateAreaDate();
        }
        else {
            this.invalidateRadiusDate();
        }
    }
    private invalidateAreaDate() {
        const roseDataArr = this.mChart.getRoseData();
        const sum = roseDataArr.reduce((sum: number, item: SectorData): number => sum + item.value, 0);
        let startAngle = -Math.PI / 2;
        let endAngle = -Math.PI / 2;
        for (let i = 0; i < roseDataArr.length; i++) {
            startAngle = endAngle;
            const roseData = roseDataArr[i];
            endAngle = startAngle + roseData.value / sum * (Math.PI * 2);
            let step: number = 0;
            if (i < 8) {
                step = i;
            }
            else if (i >= 8) {
                step = i % 8 + 1;
            }
            let length = this.mChart.getInnerRadius() + roseData.value / this.getMaxNumber() * this.mChart.getMaxRadius();
            let fillColor: string = String(roseData.color || this.defaultColorArr[step]);
            if (roseData.selected) {
                length += 5;
            }
            this.mSectors.push({
                startAngle: startAngle,
                endAngle: endAngle,
                color: fillColor,
                label: roseData.label,
                value: roseData.value,
                outerRadius: length,
                innerRadius: this.mChart.getInnerRadius(),
                selected: roseData.selected,
                countingUnit: roseData.countingUnit,
                accessibleSelected: roseData.accessibleSelected
            });
        }
    }
    private invalidateRadiusDate() {
        const copies = this.mChart.getCopies();
        const angleStep = (Math.PI * 2) / copies;
        for (let i = 0; i < copies; i++) {
            let step: number = 0;
            if (i < 8) {
                step = i;
            }
            else if (i >= 8) {
                step = i % 8 + 1;
            }
            const roseData = this.mChart.getRoseData()[i];
            const startAngle = -Math.PI / 2 + i * angleStep;
            const endAngle = startAngle + angleStep;
            let length = this.mChart.getInnerRadius() + roseData.value / this.getMaxNumber() * this.mChart.getMaxRadius();
            let fillColor: string = String(roseData.color || this.defaultColorArr[step]);
            if (roseData.selected) {
                length += 5;
            }
            this.mSectors.push({
                startAngle: startAngle,
                endAngle: endAngle,
                color: fillColor,
                label: roseData.label,
                value: roseData.value,
                outerRadius: length,
                innerRadius: this.mChart.getInnerRadius(),
                selected: roseData.selected,
                countingUnit: roseData.countingUnit,
                accessibleSelected: roseData.accessibleSelected
            });
        }
    }
    private drawSector(ctx: CanvasRenderingContext2D) {
        try {
            LogUtil.log("RoseChartRenderer drawSector - start");
            MPChartTraceUtil.startInfo(TraceLogConstants.Tag.RoseChartDrawSector);
            this.mSectors.forEach(item => {
                this.mPathBuffer = new Path2D();
                // 外圆弧
                this.mPathBuffer.arc(this.mChart.getCenterX(), this.mChart.getCenterY(), item.outerRadius, item.startAngle, item.endAngle);
                this.mPathBuffer.lineTo(this.mChart.getCenterX() + this.mChart.getInnerRadius() * Math.cos(item.endAngle), this.mChart.getCenterY() + this.mChart.getInnerRadius() * Math.sin(item.endAngle));
                // 内圆弧（反向绘制）
                this.mPathBuffer.arc(this.mChart.getCenterX(), this.mChart.getCenterY(), item.innerRadius, item.endAngle, item.startAngle, true);
                this.mPathBuffer.closePath();
                ctx.fillStyle = item.color;
                ctx.fill(this.mPathBuffer);
                if (item.accessibleSelected) {
                    ctx.strokeStyle = '#00FF00'; // 设置边框颜色为绿色
                    ctx.lineWidth = 2; // 设置边框宽度
                    ctx.stroke(this.mPathBuffer); // 绘制路径边框
                }
                if (this.mChart.getShowDataView()) {
                    this.drawValue(ctx, item, item.startAngle, item.endAngle);
                }
            });
            LogUtil.info("RoseChartRenderer drawSector succeed  " + `Sectors:${JSON.stringify(this.mSectors)}`);
        }
        catch (e) {
            MPChartTraceUtil.startError(TraceLogConstants.Tag.BarChartSetData);
            LogUtil.error("RoseChartRenderer drawSector error", e);
        }
        finally {
            MPChartTraceUtil.finish(TraceLogConstants.Tag.BarChartSetData);
            LogUtil.log("RoseChartRenderer drawSector - end");
        }
    }
    public drawValue(ctx: CanvasRenderingContext2D, item: SectorInfo, startAngle: number, endAngle: number) {
        try {
            LogUtil.log("RoseChartRenderer drawValue - start");
            MPChartTraceUtil.startInfo(TraceLogConstants.Tag.RoseChartDrawValue);
            const exceedingLength = 10;
            const rayLength = this.mChart.getMaxRadius() + this.mChart.getInnerRadius() + exceedingLength;
            const angle = startAngle + (endAngle - startAngle) / 2;
            const innerX = this.mChart.getCenterX() + item.outerRadius * Math.cos(angle);
            const innerY = this.mChart.getCenterY() + item.outerRadius * Math.sin(angle);
            const rayPointX = this.mChart.getCenterX() + rayLength * Math.cos(angle);
            const rayPointY = this.mChart.getCenterY() + rayLength * Math.sin(angle);
            ctx.beginPath();
            ctx.strokeStyle = item.color;
            ctx.moveTo(innerX, innerY);
            ctx.lineTo(rayPointX, rayPointY);
            ctx.fillStyle = Color.Black;
            ctx.font = 'normal normal 30px sans-serif';
            ctx.lineWidth = 1;
            const textWidth = ctx.measureText(item.label).width;
            if ((Math.PI / 2) < angle && angle < (Math.PI * 3 / 2)) {
                ctx.lineTo(rayPointX - 15, rayPointY);
                ctx.fillText(`${item.label}`, rayPointX - textWidth - 20, rayPointY);
            }
            else {
                ctx.lineTo(rayPointX + 15, rayPointY);
                ctx.fillText(`${item.label}`, rayPointX + 20, rayPointY);
            }
            ctx.stroke();
            LogUtil.info("RoseChartRenderer drawValue succeed  " + `SectorInfo:${JSON.stringify(item)}`);
        }
        catch (e) {
            MPChartTraceUtil.startError(TraceLogConstants.Tag.BarChartSetData);
            LogUtil.error("RoseChartRenderer drawValue error", e);
        }
        finally {
            MPChartTraceUtil.finish(TraceLogConstants.Tag.BarChartSetData);
            LogUtil.log("RoseChartRenderer drawValue - end");
        }
    }
    public drawTitle(ctx: CanvasRenderingContext2D) {
        const canvasWidth = ctx.width;
        const canvasHeight = ctx.height;
        const titleStyles = this.mChart.getTitleStyles();
        const title = this.mChart.getTitle();
        ctx.beginPath();
        ctx.fillStyle = Color.Black;
        ctx.font = `${titleStyles.fontStyles} ${titleStyles.fontWeight} ${titleStyles.fontSize} ${titleStyles.fontFamily}`;
        const titleWidth = ctx.measureText(title).width;
        ctx.fillText(title, canvasWidth / 2 - titleWidth / 2, canvasHeight * 0.1);
        this.mLabelInfo.push({
            x: canvasWidth / 2 - titleWidth / 2,
            y: canvasHeight * 0.1 - ctx.measureText(title).height,
            width: ctx.measureText(title).width,
            height: ctx.measureText(title).height,
            label: title,
            isTouch: false
        });
        ctx.stroke();
    }
    public drawDataView(ctx: CanvasRenderingContext2D) {
        const labelInterval = 12; // 文本间隔
        const description = this.mChart.getDescription();
        let dataViewAlignments = this.dataViewAlignment(ctx.width, ctx.height);
        let alignmentsX = dataViewAlignments[0];
        let alignmentsY = dataViewAlignments[1];
        if (description === 'left' || description === 'right') {
            ctx.beginPath();
            ctx.font = 'normal normal 20px sans-serif';
            this.mSectors.forEach((item, index) => {
                ctx.fillText(item.label, alignmentsX, alignmentsY + 5 + labelInterval * (index - 1));
                this.mLabelInfo.push({
                    x: alignmentsX,
                    y: alignmentsY + 5 + labelInterval * (index - 1) - ctx.measureText(item.label).height,
                    width: ctx.measureText(item.label).width,
                    height: ctx.measureText(item.label).height,
                    label: item.label,
                    isTouch: false
                });
                ctx.fillStyle = Color.Black;
            });
            this.mSectors.forEach((item, index) => {
                ctx.fillStyle = item.color;
                ctx.fillRect(alignmentsX - 10, alignmentsY + labelInterval * (index - 1), 8, 8);
            });
            ctx.closePath();
            ctx.fill();
        }
        else if (description === 'noShow') {
            return;
        }
        else {
            ctx.beginPath();
            ctx.font = 'normal normal 20px sans-serif';
            let dataViewWidth = 0;
            let step1 = 0;
            let step2 = 0;
            this.mSectors.forEach((item) => {
                dataViewWidth += ctx.measureText(item.label).width + 10;
            });
            let startX = (ctx.width - dataViewWidth) / 2;
            this.mSectors.forEach((item, index) => {
                ctx.fillStyle = item.color;
                ctx.fillRect(startX + step1 + 15 * (index - 1), alignmentsY, 8, 8);
                step1 += ctx.measureText(item.label).width;
            });
            this.mSectors.forEach((item, index) => {
                ctx.fillStyle = Color.Black;
                ctx.fillText(item.label, startX + step2 + 10 + 15 * (index - 1), alignmentsY + 5);
                this.mLabelInfo.push({
                    x: startX + step2 + 10 + 15 * (index - 1),
                    y: alignmentsY + 5 - ctx.measureText(item.label).height,
                    width: ctx.measureText(item.label).width,
                    height: ctx.measureText(item.label).height,
                    label: item.label,
                    isTouch: false
                });
                step2 += ctx.measureText(item.label).width;
            });
            ctx.closePath();
            ctx.fill();
        }
    }
    private dataViewAlignment(ctxWidth: number, ctxHeight: number): [
        number,
        number
    ] {
        switch (this.mChart.getDescription()) {
            case 'right':
                return [ctxWidth - ctxWidth * 0.2, ctxHeight * 0.15];
            case 'left':
                return [ctxWidth - ctxWidth * 0.8, ctxHeight * 0.15];
            case 'top':
                return [0, ctxHeight * 0.15];
            case 'bottom':
                return [0, ctxHeight * 0.85];
            default:
                return [ctxWidth - ctxWidth * 0.2, ctxHeight * 0.15];
        }
    }
    public drawSectorInfo(ctx: CanvasRenderingContext2D) {
        this.mSectors.forEach(item => {
            if (!this.mChart.getShowValue() && !item.selected) {
                return;
            }
            const startAngle = item.startAngle * 180 / Math.PI;
            const endAngle = item.endAngle * 180 / Math.PI;
            const text = `${item.label}: ${item.value}${item.countingUnit ? item.countingUnit : ''}`;
            const radius = item.outerRadius + 5;
            // 计算总角度范围
            ctx.font = 'normal normal 30px Arial';
            const textWidth = ctx.measureText(text).width;
            const circumference = 2 * Math.PI * radius;
            const anglePerPixel = 360 / circumference;
            const totalAngle = textWidth * anglePerPixel;
            const textStartAngle = startAngle + (endAngle - startAngle - totalAngle) / 2;
            // 绘制每个字符
            let currentAngle = textStartAngle;
            ctx.beginPath();
            for (let i = 0; i < text.length; i++) {
                const char = text[i];
                const charWidth = ctx.measureText(char).width;
                ctx.save();
                ctx.translate(this.mChart.getCenterX() + Math.cos(currentAngle * Math.PI / 180) * radius, this.mChart.getCenterY() + Math.sin(currentAngle * Math.PI / 180) * radius);
                ctx.rotate((currentAngle + 90) * Math.PI / 180); // 文字朝向圆心
                ctx.fillText(char, 0, 0);
                ctx.restore();
                currentAngle += anglePerPixel * charWidth;
            }
            ctx.stroke();
        });
    }
    public FirstLoadAnimate(ctx: CanvasRenderingContext2D, i: number) {
        ctx.clearRect(0, 0, ctx.width, ctx.height);
        this.drawTitle(ctx);
        this.drawDataView(ctx);
        let start = -Math.PI / 2;
        let step = Math.PI / 180 * i;
        this.mSectors.forEach((item, index) => {
            let startAngle = start + step * index;
            let endAngle = start + step * (index + 1);
            if (startAngle >= item.startAngle) {
                startAngle = item.startAngle;
            }
            if (endAngle >= item.endAngle) {
                endAngle = item.endAngle;
            }
            this.mPathBuffer = new Path2D();
            // 外圆弧
            this.mPathBuffer.arc(this.mChart.getCenterX(), this.mChart.getCenterY(), item.outerRadius, startAngle, endAngle);
            this.mPathBuffer.lineTo(this.mChart.getCenterX() + this.mChart.getInnerRadius() * Math.cos(endAngle), this.mChart.getCenterY() + this.mChart.getInnerRadius() * Math.sin(endAngle));
            // 内圆弧（反向绘制）
            this.mPathBuffer.arc(this.mChart.getCenterX(), this.mChart.getCenterY(), item.innerRadius, endAngle, startAngle, true);
            this.mPathBuffer.closePath();
            this.drawValue(ctx, item, startAngle, endAngle);
            ctx.fillStyle = item.color;
            ctx.fill(this.mPathBuffer);
            ;
        });
    }
    public startAnimation(ctx: CanvasRenderingContext2D) {
        let i = 0;
        let startAnimation = setInterval(() => {
            i++;
            this.FirstLoadAnimate(ctx, i);
            if (i >= 60) {
                clearInterval(startAnimation);
                this.clearCanvas(ctx);
                this.invalidateCanvas(ctx);
            }
        }, 16);
    }
    public clearCanvas(c: any) {
        this.mSectors = [];
        if (c == null) {
            return;
        }
        if (c.reset) {
            c.reset();
        }
        else {
            c.clearRect(0, 0, c.width, c.height);
        }
    }
    public getSectors(): SectorInfo[] {
        return this.mSectors;
    }
    public getLabels(): LabelInfo[] {
        return this.mLabelInfo;
    }
}
;
