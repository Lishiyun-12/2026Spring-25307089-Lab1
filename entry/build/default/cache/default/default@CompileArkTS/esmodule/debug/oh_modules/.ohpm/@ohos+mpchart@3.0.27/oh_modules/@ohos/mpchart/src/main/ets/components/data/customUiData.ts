import type EntryOhos from './EntryOhos';
// @Observed
export class CustomUiInfo {
    width: number;
    height: number;
    showUi: boolean;
    x: number;
    y: number;
    offsetLeft: number;
    offsetRight: number;
    data: EntryOhos | null;
    isInbounds: boolean;
    constructor(width: number, height: number, showUi: boolean = false, x: number = 0, y: number = 0, offsetLeft: number = 0, offsetRight: number = 0, data: EntryOhos | null = null, isInbounds: boolean = false) {
        this.x = x;
        this.y = y;
        this.offsetLeft = offsetLeft;
        this.offsetRight = offsetRight;
        this.data = data;
        this.isInbounds = isInbounds;
        this.width = width;
        this.height = height;
        this.showUi = showUi;
    }
}
