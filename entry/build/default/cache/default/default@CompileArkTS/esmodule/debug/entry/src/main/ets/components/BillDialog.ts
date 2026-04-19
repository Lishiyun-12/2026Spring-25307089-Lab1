if (!("finalizeConstruction" in ViewPU.prototype)) {
    Reflect.set(ViewPU.prototype, "finalizeConstruction", () => { });
}
interface BillDialog_Params {
    controller?: CustomDialogController;
    isInsert?: boolean;
    newAccount?: AccountData;
    confirm?: (isInsert: boolean, newAccount: AccountData) => void;
    payList?: Array<AccountItem>;
    earnList?: Array<AccountItem>;
    bgColor?: string;
    curIndex?: number;
    curType?: string;
    scroller?: Scroller;
    inputAmount?;
}
import hilog from "@ohos:hilog";
import { EarnList, PayList, TextList } from "@bundle:com.example.rdb/entry/ets/viewmodel/BillViewModel";
import type { AccountData, AccountItem } from "@bundle:com.example.rdb/entry/ets/viewmodel/BillViewModel";
import CommonConstants from "@bundle:com.example.rdb/entry/ets/common/CommonConstants";
export class BillDialog extends ViewPU {
    constructor(parent, params, __localStorage, elmtId = -1, paramsLambda = undefined, extraInfo) {
        super(parent, __localStorage, elmtId, extraInfo);
        if (typeof paramsLambda === "function") {
            this.paramsGenerator_ = paramsLambda;
        }
        this.controller = undefined;
        this.__isInsert = new SynchedPropertySimpleTwoWayPU(params.isInsert, this, "isInsert");
        this.__newAccount = new SynchedPropertyObjectTwoWayPU(params.newAccount, this, "newAccount");
        this.confirm = undefined;
        this.__payList = new ObservedPropertyObjectPU(PayList, this, "payList");
        this.__earnList = new ObservedPropertyObjectPU(EarnList, this, "earnList");
        this.__bgColor = new ObservedPropertySimplePU('', this, "bgColor");
        this.__curIndex = new ObservedPropertySimplePU(0, this, "curIndex");
        this.__curType = new ObservedPropertySimplePU('', this, "curType");
        this.scroller = new Scroller();
        this.inputAmount = '';
        this.setInitiallyProvidedValue(params);
        this.finalizeConstruction();
    }
    setInitiallyProvidedValue(params: BillDialog_Params) {
        if (params.controller !== undefined) {
            this.controller = params.controller;
        }
        if (params.confirm !== undefined) {
            this.confirm = params.confirm;
        }
        if (params.payList !== undefined) {
            this.payList = params.payList;
        }
        if (params.earnList !== undefined) {
            this.earnList = params.earnList;
        }
        if (params.bgColor !== undefined) {
            this.bgColor = params.bgColor;
        }
        if (params.curIndex !== undefined) {
            this.curIndex = params.curIndex;
        }
        if (params.curType !== undefined) {
            this.curType = params.curType;
        }
        if (params.scroller !== undefined) {
            this.scroller = params.scroller;
        }
        if (params.inputAmount !== undefined) {
            this.inputAmount = params.inputAmount;
        }
    }
    updateStateVars(params: BillDialog_Params) {
    }
    purgeVariableDependenciesOnElmtId(rmElmtId) {
        this.__isInsert.purgeDependencyOnElmtId(rmElmtId);
        this.__newAccount.purgeDependencyOnElmtId(rmElmtId);
        this.__payList.purgeDependencyOnElmtId(rmElmtId);
        this.__earnList.purgeDependencyOnElmtId(rmElmtId);
        this.__bgColor.purgeDependencyOnElmtId(rmElmtId);
        this.__curIndex.purgeDependencyOnElmtId(rmElmtId);
        this.__curType.purgeDependencyOnElmtId(rmElmtId);
    }
    aboutToBeDeleted() {
        this.__isInsert.aboutToBeDeleted();
        this.__newAccount.aboutToBeDeleted();
        this.__payList.aboutToBeDeleted();
        this.__earnList.aboutToBeDeleted();
        this.__bgColor.aboutToBeDeleted();
        this.__curIndex.aboutToBeDeleted();
        this.__curType.aboutToBeDeleted();
        SubscriberManager.Get().delete(this.id__());
        this.aboutToBeDeletedInternal();
    }
    private controller?: CustomDialogController;
    setController(ctr: CustomDialogController) {
        this.controller = ctr;
    }
    private __isInsert: SynchedPropertySimpleTwoWayPU<boolean>;
    get isInsert() {
        return this.__isInsert.get();
    }
    set isInsert(newValue: boolean) {
        this.__isInsert.set(newValue);
    }
    private __newAccount: SynchedPropertySimpleOneWayPU<AccountData>;
    get newAccount() {
        return this.__newAccount.get();
    }
    set newAccount(newValue: AccountData) {
        this.__newAccount.set(newValue);
    }
    private confirm?: (isInsert: boolean, newAccount: AccountData) => void;
    private __payList: ObservedPropertyObjectPU<Array<AccountItem>>;
    get payList() {
        return this.__payList.get();
    }
    set payList(newValue: Array<AccountItem>) {
        this.__payList.set(newValue);
    }
    private __earnList: ObservedPropertyObjectPU<Array<AccountItem>>;
    get earnList() {
        return this.__earnList.get();
    }
    set earnList(newValue: Array<AccountItem>) {
        this.__earnList.set(newValue);
    }
    private __bgColor: ObservedPropertySimplePU<string>;
    get bgColor() {
        return this.__bgColor.get();
    }
    set bgColor(newValue: string) {
        this.__bgColor.set(newValue);
    }
    private __curIndex: ObservedPropertySimplePU<number>;
    get curIndex() {
        return this.__curIndex.get();
    }
    set curIndex(newValue: number) {
        this.__curIndex.set(newValue);
    }
    private __curType: ObservedPropertySimplePU<string>;
    get curType() {
        return this.__curType.get();
    }
    set curType(newValue: string) {
        this.__curType.set(newValue);
    }
    private scroller: Scroller;
    private inputAmount;
    TabBuilder(index: number, parent = null) {
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Column.create();
            Column.width({ "id": 16777250, "type": 10002, params: [], "bundleName": "com.example.rdb", "moduleName": "entry" });
            Column.padding({ top: { "id": 16777258, "type": 10002, params: [], "bundleName": "com.example.rdb", "moduleName": "entry" }, bottom: { "id": 16777264, "type": 10002, params: [], "bundleName": "com.example.rdb", "moduleName": "entry" } });
            Column.margin({ bottom: { "id": 16777264, "type": 10002, params: [], "bundleName": "com.example.rdb", "moduleName": "entry" } });
            Column.border({
                width: { bottom: this.curIndex === index ? { "id": 16777247, "type": 10002, params: [], "bundleName": "com.example.rdb", "moduleName": "entry" } : '' },
                color: this.curIndex === index ? '#0A59F7' : Color.White
            });
        }, Column);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create(index === 0 ? { "id": 16777237, "type": 10003, params: [], "bundleName": "com.example.rdb", "moduleName": "entry" } : { "id": 16777234, "type": 10003, params: [], "bundleName": "com.example.rdb", "moduleName": "entry" });
            Text.fontSize({ "id": 16777267, "type": 10002, params: [], "bundleName": "com.example.rdb", "moduleName": "entry" });
            Text.fontColor(this.curIndex === index ? '#0A59F7' : Color.Gray);
        }, Text);
        Text.pop();
        Column.pop();
    }
    aboutToAppear() {
        this.inputAmount = this.newAccount.amount.toString();
        this.curIndex = this.newAccount.accountType;
        this.curType = this.newAccount.typeText;
    }
    selectAccount(item: AccountItem) {
        this.newAccount.accountType = item.accountType;
        this.newAccount.typeText = item.typeText;
        this.curType = item.typeText;
    }
    initialRender() {
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Column.create();
            Column.width('100%');
            Column.height(440);
            Column.borderRadius({ topLeft: { "id": 16777266, "type": 10002, params: [], "bundleName": "com.example.rdb", "moduleName": "entry" }, topRight: { "id": 16777266, "type": 10002, params: [], "bundleName": "com.example.rdb", "moduleName": "entry" } });
            Column.backgroundColor(Color.White);
            Column.align(Alignment.BottomEnd);
        }, Column);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Image.create({ "id": 0, "type": 30000, params: ['half.png'], "bundleName": "com.example.rdb", "moduleName": "entry" });
            Image.width({ "id": 16777249, "type": 10002, params: [], "bundleName": "com.example.rdb", "moduleName": "entry" });
            Image.height({ "id": 16777254, "type": 10002, params: [], "bundleName": "com.example.rdb", "moduleName": "entry" });
            Image.onClick(() => {
                this.controller?.close();
            });
        }, Image);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Tabs.create({ barPosition: BarPosition.Start, index: this.curIndex });
            Tabs.width('100%');
            Tabs.height(CommonConstants.TABS_HEIGHT);
            Tabs.vertical(false);
            Tabs.barMode(BarMode.Fixed);
            Tabs.onChange((index) => {
                this.curIndex = index;
            });
        }, Tabs);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            TabContent.create(() => {
                this.observeComponentCreation2((elmtId, isInitialRender) => {
                    Scroll.create(this.scroller);
                    Scroll.scrollable(ScrollDirection.Horizontal);
                    Scroll.scrollBar(BarState.Off);
                }, Scroll);
                this.observeComponentCreation2((elmtId, isInitialRender) => {
                    Row.create();
                }, Row);
                this.observeComponentCreation2((elmtId, isInitialRender) => {
                    ForEach.create();
                    const forEachItemGenFunction = _item => {
                        const item = _item;
                        this.observeComponentCreation2((elmtId, isInitialRender) => {
                            Column.create();
                            Column.width({ "id": 16777251, "type": 10002, params: [], "bundleName": "com.example.rdb", "moduleName": "entry" });
                            Column.aspectRatio(CommonConstants.FULL_SIZE);
                            Column.padding({ top: { "id": 16777260, "type": 10002, params: [], "bundleName": "com.example.rdb", "moduleName": "entry" } });
                            Column.margin({ top: { "id": 16777262, "type": 10002, params: [], "bundleName": "com.example.rdb", "moduleName": "entry" }, left: { "id": 16777260, "type": 10002, params: [], "bundleName": "com.example.rdb", "moduleName": "entry" } });
                            Column.align(Alignment.TopStart);
                            Column.backgroundColor(this.curType === item.typeText ? '#0A59F7' : { "id": 16777242, "type": 10001, params: [], "bundleName": "com.example.rdb", "moduleName": "entry" });
                            Column.borderRadius({ "id": 16777274, "type": 10002, params: [], "bundleName": "com.example.rdb", "moduleName": "entry" });
                            Column.onClick(() => {
                                this.selectAccount(item);
                            });
                        }, Column);
                        this.observeComponentCreation2((elmtId, isInitialRender) => {
                            Row.create();
                            Row.alignItems(VerticalAlign.Center);
                            Row.justifyContent(FlexAlign.Center);
                            Row.width(40);
                            Row.height(40);
                            Row.backgroundColor(this.curType === item.typeText ? Color.White : 'rgba(10, 89, 247, 0.15)');
                            Row.borderRadius('50%');
                        }, Row);
                        this.observeComponentCreation2((elmtId, isInitialRender) => {
                            SymbolGlyph.create(item.icon);
                            SymbolGlyph.fontSize(24);
                            SymbolGlyph.fontWeight(400);
                            SymbolGlyph.fontColor(this.curType === item.typeText ? ['#0A59F7'] : ['#0A59F7']);
                        }, SymbolGlyph);
                        Row.pop();
                        this.observeComponentCreation2((elmtId, isInitialRender) => {
                            Text.create(TextList[item.typeText]);
                            Text.fontSize({ "id": 16777269, "type": 10002, params: [], "bundleName": "com.example.rdb", "moduleName": "entry" });
                            Text.fontColor(this.curType === item.typeText ? Color.White : '#0A59F7');
                            Text.margin({ top: { "id": 16777264, "type": 10002, params: [], "bundleName": "com.example.rdb", "moduleName": "entry" } });
                        }, Text);
                        Text.pop();
                        Column.pop();
                    };
                    this.forEachUpdateFunction(elmtId, this.payList, forEachItemGenFunction, (item: AccountItem, index: number) => index.toString(), false, true);
                }, ForEach);
                ForEach.pop();
                Row.pop();
                Scroll.pop();
            });
            TabContent.tabBar({ builder: () => {
                    this.TabBuilder.call(this, 0);
                } });
            TabContent.margin({ bottom: { "id": 16777259, "type": 10002, params: [], "bundleName": "com.example.rdb", "moduleName": "entry" } });
        }, TabContent);
        TabContent.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            TabContent.create(() => {
                this.observeComponentCreation2((elmtId, isInitialRender) => {
                    Scroll.create(this.scroller);
                    Scroll.scrollable(ScrollDirection.Horizontal);
                    Scroll.scrollBar(BarState.Off);
                }, Scroll);
                this.observeComponentCreation2((elmtId, isInitialRender) => {
                    Row.create();
                }, Row);
                this.observeComponentCreation2((elmtId, isInitialRender) => {
                    ForEach.create();
                    const forEachItemGenFunction = _item => {
                        const item = _item;
                        this.observeComponentCreation2((elmtId, isInitialRender) => {
                            Column.create();
                            Column.width({ "id": 16777251, "type": 10002, params: [], "bundleName": "com.example.rdb", "moduleName": "entry" });
                            Column.aspectRatio(CommonConstants.FULL_SIZE);
                            Column.padding({ top: { "id": 16777260, "type": 10002, params: [], "bundleName": "com.example.rdb", "moduleName": "entry" } });
                            Column.margin({ top: { "id": 16777262, "type": 10002, params: [], "bundleName": "com.example.rdb", "moduleName": "entry" }, left: { "id": 16777260, "type": 10002, params: [], "bundleName": "com.example.rdb", "moduleName": "entry" } });
                            Column.align(Alignment.TopStart);
                            Column.backgroundColor(this.curType === item.typeText ? '#0A59F7' : { "id": 16777242, "type": 10001, params: [], "bundleName": "com.example.rdb", "moduleName": "entry" });
                            Column.borderRadius({ "id": 16777274, "type": 10002, params: [], "bundleName": "com.example.rdb", "moduleName": "entry" });
                            Column.onClick(() => {
                                this.selectAccount(item);
                            });
                        }, Column);
                        this.observeComponentCreation2((elmtId, isInitialRender) => {
                            Row.create();
                            Row.alignItems(VerticalAlign.Center);
                            Row.justifyContent(FlexAlign.Center);
                            Row.width(40);
                            Row.height(40);
                            Row.backgroundColor(this.curType === item.typeText ? Color.White : 'rgba(10, 89, 247, 0.15)');
                            Row.borderRadius('50%');
                        }, Row);
                        this.observeComponentCreation2((elmtId, isInitialRender) => {
                            SymbolGlyph.create(item.icon);
                            SymbolGlyph.fontSize(24);
                            SymbolGlyph.fontWeight(400);
                            SymbolGlyph.fontColor(this.curType === item.typeText ? ['#0A59F7'] : ['#0A59F7']);
                        }, SymbolGlyph);
                        Row.pop();
                        this.observeComponentCreation2((elmtId, isInitialRender) => {
                            Text.create(item.typeText === 'income' ? { "id": 16777233, "type": 10003, params: [], "bundleName": "com.example.rdb", "moduleName": "entry" } : { "id": 16777236, "type": 10003, params: [], "bundleName": "com.example.rdb", "moduleName": "entry" });
                            Text.fontSize({ "id": 16777269, "type": 10002, params: [], "bundleName": "com.example.rdb", "moduleName": "entry" });
                            Text.fontColor(this.curType === item.typeText ? Color.White : '#0A59F7');
                            Text.margin({ top: { "id": 16777264, "type": 10002, params: [], "bundleName": "com.example.rdb", "moduleName": "entry" } });
                        }, Text);
                        Text.pop();
                        Column.pop();
                    };
                    this.forEachUpdateFunction(elmtId, this.earnList, forEachItemGenFunction, (item: AccountItem, index: number) => index.toString(), false, true);
                }, ForEach);
                ForEach.pop();
                Row.pop();
                Scroll.pop();
            });
            TabContent.tabBar({ builder: () => {
                    this.TabBuilder.call(this, 1);
                } });
            TabContent.margin({ bottom: { "id": 16777259, "type": 10002, params: [], "bundleName": "com.example.rdb", "moduleName": "entry" } });
        }, TabContent);
        TabContent.pop();
        Tabs.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Column.create();
            Column.width('100%');
            Column.padding({ left: { "id": 16777260, "type": 10002, params: [], "bundleName": "com.example.rdb", "moduleName": "entry" }, right: { "id": 16777260, "type": 10002, params: [], "bundleName": "com.example.rdb", "moduleName": "entry" } });
        }, Column);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create({ "id": 16777225, "type": 10003, params: [], "bundleName": "com.example.rdb", "moduleName": "entry" });
            Text.width('100%');
            Text.fontSize({ "id": 16777268, "type": 10002, params: [], "bundleName": "com.example.rdb", "moduleName": "entry" });
            Text.fontColor(Color.Black);
        }, Text);
        Text.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Column.create();
            Column.height({ "id": 16777253, "type": 10002, params: [], "bundleName": "com.example.rdb", "moduleName": "entry" });
            Column.padding({ top: { "id": 16777263, "type": 10002, params: [], "bundleName": "com.example.rdb", "moduleName": "entry" }, bottom: { "id": 16777261, "type": 10002, params: [], "bundleName": "com.example.rdb", "moduleName": "entry" } });
            Column.borderWidth({ bottom: CommonConstants.FULL_SIZE });
            Column.borderColor({ "id": 16777243, "type": 10001, params: [], "bundleName": "com.example.rdb", "moduleName": "entry" });
        }, Column);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            TextInput.create({
                placeholder: { "id": 16777235, "type": 10003, params: [], "bundleName": "com.example.rdb", "moduleName": "entry" },
                text: this.newAccount.amount === 0 ? this.inputAmount : this.newAccount.amount.toString()
            });
            TextInput.padding({
                left: CommonConstants.MINIMUM_SIZE,
                top: CommonConstants.MINIMUM_SIZE,
                bottom: CommonConstants.MINIMUM_SIZE
            });
            TextInput.borderRadius(CommonConstants.MINIMUM_SIZE);
            TextInput.backgroundColor(Color.White);
            TextInput.type(InputType.Number);
            TextInput.onChange((value: string) => {
                this.inputAmount = value;
            });
        }, TextInput);
        Column.pop();
        Column.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Column.create();
            Column.layoutWeight(CommonConstants.FULL_SIZE);
            Column.padding({
                bottom: { "id": 16777266, "type": 10002, params: [], "bundleName": "com.example.rdb", "moduleName": "entry" },
                left: { "id": 16777266, "type": 10002, params: [], "bundleName": "com.example.rdb", "moduleName": "entry" },
                right: { "id": 16777266, "type": 10002, params: [], "bundleName": "com.example.rdb", "moduleName": "entry" }
            });
            Column.justifyContent(FlexAlign.End);
        }, Column);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Button.createWithChild();
            Button.width('100%');
            Button.height({ "id": 16777252, "type": 10002, params: [], "bundleName": "com.example.rdb", "moduleName": "entry" });
            Button.onClick(() => {
                if (this.newAccount.typeText === '' || this.curIndex !== this.newAccount.accountType) {
                    try {
                        this.getUIContext().getPromptAction().showToast({
                            message: CommonConstants.TOAST_TEXT_1,
                            bottom: CommonConstants.PROMPT_BOTTOM
                        });
                    }
                    catch (err) {
                        hilog.error(0x0000, 'BillDialog', `showToast failed, Code:${err.code},message: ${err.message}`);
                    }
                }
                else {
                    let regex: RegExp = new RegExp('[1-9][0-9]*');
                    let matchValue: Array<string> | null = this.inputAmount.match(regex);
                    if (matchValue !== null && matchValue[0] === this.inputAmount) {
                        this.newAccount.amount = Number(this.inputAmount);
                        this.confirm && this.confirm(this.isInsert, ObservedObject.GetRawObject(this.newAccount));
                        this.controller?.close();
                    }
                    else {
                        try {
                            this.getUIContext().getPromptAction().showToast({
                                message: CommonConstants.TOAST_TEXT_2,
                                bottom: CommonConstants.PROMPT_BOTTOM
                            });
                        }
                        catch (err) {
                            hilog.error(0x0000, 'BillDialog', `showToast failed, Code:${err.code},message: ${err.message}`);
                        }
                    }
                }
            });
        }, Button);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create({ "id": 16777224, "type": 10003, params: [], "bundleName": "com.example.rdb", "moduleName": "entry" });
            Text.fontSize({ "id": 16777267, "type": 10002, params: [], "bundleName": "com.example.rdb", "moduleName": "entry" });
            Text.fontColor(Color.White);
        }, Text);
        Text.pop();
        Button.pop();
        Column.pop();
        Column.pop();
    }
    rerender() {
        this.updateDirtyElements();
    }
}
