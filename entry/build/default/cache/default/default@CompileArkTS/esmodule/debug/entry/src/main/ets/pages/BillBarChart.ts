if (!("finalizeConstruction" in ViewPU.prototype)) {
    Reflect.set(ViewPU.prototype, "finalizeConstruction", () => { });
}
interface BillBarChart_Params {
    accounts?: Array<AccountData>;
    settings?: RenderingContextSettings;
    context?: CanvasRenderingContext2D;
}
import type { AccountData } from '../viewmodel/BillViewModel';
export class BillBarChart extends ViewPU {
    constructor(parent, params, __localStorage, elmtId = -1, paramsLambda = undefined, extraInfo) {
        super(parent, __localStorage, elmtId, extraInfo);
        if (typeof paramsLambda === "function") {
            this.paramsGenerator_ = paramsLambda;
        }
        this.__accounts = new SynchedPropertyObjectOneWayPU(params.accounts, this, "accounts");
        this.settings = new RenderingContextSettings(true);
        this.context = new CanvasRenderingContext2D(this.settings);
        this.setInitiallyProvidedValue(params);
        this.finalizeConstruction();
    }
    setInitiallyProvidedValue(params: BillBarChart_Params) {
        if (params.accounts === undefined) {
            this.__accounts.set([]);
        }
        if (params.settings !== undefined) {
            this.settings = params.settings;
        }
        if (params.context !== undefined) {
            this.context = params.context;
        }
    }
    updateStateVars(params: BillBarChart_Params) {
        this.__accounts.reset(params.accounts);
    }
    purgeVariableDependenciesOnElmtId(rmElmtId) {
        this.__accounts.purgeDependencyOnElmtId(rmElmtId);
    }
    aboutToBeDeleted() {
        this.__accounts.aboutToBeDeleted();
        SubscriberManager.Get().delete(this.id__());
        this.aboutToBeDeletedInternal();
    }
    private __accounts: SynchedPropertySimpleOneWayPU<Array<AccountData>>;
    get accounts() {
        return this.__accounts.get();
    }
    set accounts(newValue: Array<AccountData>) {
        this.__accounts.set(newValue);
    }
    private settings: RenderingContextSettings;
    private context: CanvasRenderingContext2D;
    private getCategoryAmounts(): Map<number, number> {
        let map: Map<number, number> = new Map<number, number>();
        for (let i = 0; i < this.accounts.length; i++) {
            let account = this.accounts[i];
            let type: number = account.accountType;
            let amount: number = account.amount;
            if (map.has(type)) {
                let oldValue = map.get(type);
                if (oldValue !== undefined) {
                    map.set(type, oldValue + amount);
                }
            }
            else {
                map.set(type, amount);
            }
        }
        return map;
    }
    private getTypeText(type: number): string {
        if (type === 0) {
            return '餐饮';
        }
        else if (type === 1) {
            return '购物';
        }
        else if (type === 2) {
            return '交通';
        }
        else if (type === 3) {
            return '娱乐';
        }
        return '其他';
    }
    private getCategoryKeys(map: Map<number, number>): number[] {
        let keys: number[] = [];
        let allKeys = map.keys();
        let next = allKeys.next();
        while (next.value !== undefined) {
            keys.push(next.value);
            next = allKeys.next();
        }
        return keys;
    }
    private getCategoryValues(map: Map<number, number>): number[] {
        let values: number[] = [];
        let allValues = map.values();
        let next = allValues.next();
        while (next.value !== undefined) {
            values.push(next.value);
            next = allValues.next();
        }
        return values;
    }
    private drawChart() {
        let categoryMap: Map<number, number> = this.getCategoryAmounts();
        let amounts: number[] = this.getCategoryValues(categoryMap);
        let maxAmount: number = 1;
        for (let i = 0; i < amounts.length; i++) {
            if (amounts[i] > maxAmount) {
                maxAmount = amounts[i];
            }
        }
        let barWidth: number = 40;
        let startX: number = 30;
        let height: number = 160;
        let bottomY: number = height - 20;
        let gap: number = 20;
        let types: number[] = this.getCategoryKeys(categoryMap);
        for (let i = 0; i < types.length; i++) {
            let type = types[i];
            let amount = categoryMap.get(type);
            if (amount === undefined) {
                continue;
            }
            let barHeight: number = (amount / maxAmount) * (height - 40);
            let x: number = startX + i * (barWidth + gap);
            let y: number = bottomY - barHeight;
            this.context.fillStyle = '#36a';
            this.context.fillRect(x, y, barWidth, barHeight);
            this.context.fillStyle = '#333';
            this.context.font = '12px';
            this.context.fillText(amount.toString(), x + 5, y - 5);
        }
    }
    initialRender() {
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Column.create();
            Column.width('100%');
            Column.padding(10);
            Column.backgroundColor('#ffffff');
            Column.borderRadius(12);
        }, Column);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create('📊 支出统计');
            Text.fontSize(18);
            Text.fontWeight(FontWeight.Bold);
            Text.margin({ bottom: 10 });
        }, Text);
        Text.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            If.create();
            if (this.accounts.length === 0) {
                this.ifElseBranchUpdateFunction(0, () => {
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Text.create('暂无账单数据');
                        Text.fontSize(14);
                        Text.fontColor('#999');
                        Text.height(200);
                        Text.textAlign(TextAlign.Center);
                    }, Text);
                    Text.pop();
                });
            }
            else {
                this.ifElseBranchUpdateFunction(1, () => {
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Column.create();
                    }, Column);
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Canvas.create(this.context);
                        Canvas.width('100%');
                        Canvas.height(200);
                        Canvas.backgroundColor('#f5f5f5');
                        Canvas.borderRadius(8);
                        Canvas.onReady(() => {
                            this.drawChart();
                        });
                    }, Canvas);
                    Canvas.pop();
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Row.create();
                        Row.width('100%');
                        Row.margin({ top: 8 });
                    }, Row);
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        ForEach.create();
                        const forEachItemGenFunction = _item => {
                            const type = _item;
                            this.observeComponentCreation2((elmtId, isInitialRender) => {
                                Text.create(this.getTypeText(type));
                                Text.fontSize(12);
                                Text.width(100 / this.getCategoryAmounts().size + '%');
                                Text.textAlign(TextAlign.Center);
                            }, Text);
                            Text.pop();
                        };
                        this.forEachUpdateFunction(elmtId, this.getCategoryKeys(this.getCategoryAmounts()), forEachItemGenFunction, (type: number) => type.toString(), false, false);
                    }, ForEach);
                    ForEach.pop();
                    Row.pop();
                    Column.pop();
                });
            }
        }, If);
        If.pop();
        Column.pop();
    }
    rerender() {
        this.updateDirtyElements();
    }
}
