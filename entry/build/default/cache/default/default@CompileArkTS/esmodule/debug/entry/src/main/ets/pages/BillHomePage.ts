if (!("finalizeConstruction" in ViewPU.prototype)) {
    Reflect.set(ViewPU.prototype, "finalizeConstruction", () => { });
}
interface BillHomePage_Params {
    accounts?: Array<AccountData>;
    searchText?: string;
    isEdit?: boolean;
    isInsert?: boolean;
    newAccount?: AccountData;
    index?: number;
    deleteList?: Array<AccountData>;
    context?: common.UIAbilityContext;
    rdbManager?: RdbManager;
    searchController?: SearchController;
    dialogController?: CustomDialogController;
    // Function for Monitoring Data Changes.
    eventFunc?;
}
import type common from "@ohos:app.ability.common";
import { LengthMetrics } from "@ohos:arkui.node";
import hilog from "@ohos:hilog";
import systemDateTime from "@ohos:systemDateTime";
import { ImageList, TextList } from "@bundle:com.example.rdb/entry/ets/viewmodel/BillViewModel";
import type { AccountData } from "@bundle:com.example.rdb/entry/ets/viewmodel/BillViewModel";
import CommonConstants from "@bundle:com.example.rdb/entry/ets/common/CommonConstants";
import { BillDialog } from "@bundle:com.example.rdb/entry/ets/components/BillDialog";
import { RdbManager } from "@bundle:com.example.rdb/entry/ets/utils/RdbManager";
import { BillBarChart } from "@bundle:com.example.rdb/entry/ets/pages/BillBarChart";
class BillHomePage extends ViewPU {
    constructor(parent, params, __localStorage, elmtId = -1, paramsLambda = undefined, extraInfo) {
        super(parent, __localStorage, elmtId, extraInfo);
        if (typeof paramsLambda === "function") {
            this.paramsGenerator_ = paramsLambda;
        }
        this.__accounts = new ObservedPropertyObjectPU([], this, "accounts");
        this.__searchText = new ObservedPropertySimplePU('', this, "searchText");
        this.__isEdit = new ObservedPropertySimplePU(false, this, "isEdit");
        this.__isInsert = new ObservedPropertySimplePU(false, this, "isInsert");
        this.__newAccount = new ObservedPropertyObjectPU({
            id: '',
            accountType: 0,
            typeText: '',
            amount: 0
        }, this, "newAccount");
        this.__index = new ObservedPropertySimplePU(-1, this, "index");
        this.deleteList = [];
        this.context = this.getUIContext().getHostContext() as common.UIAbilityContext;
        this.rdbManager = new RdbManager(this.context);
        this.searchController = new SearchController();
        this.dialogController = new CustomDialogController({
            builder: () => {
                let jsDialog = new BillDialog(this, {
                    isInsert: this.__isInsert,
                    newAccount: this.__newAccount,
                    confirm: (isInsert: boolean, newAccount: AccountData) => this.accept(isInsert, newAccount)
                }, undefined, -1, () => { }, { page: "entry/src/main/ets/pages/BillHomePage.ets", line: 45, col: 14 });
                jsDialog.setController(this.dialogController);
                ViewPU.create(jsDialog);
                let paramsLambda = () => {
                    return {
                        isInsert: this.__isInsert,
                        newAccount: this.__newAccount,
                        confirm: (isInsert: boolean, newAccount: AccountData) => this.accept(isInsert, newAccount)
                    };
                };
                jsDialog.paramsGenerator_ = paramsLambda;
            },
            keyboardAvoidDistance: LengthMetrics.vp(0),
            customStyle: true,
            alignment: DialogAlignment.Bottom
        }, this);
        this.eventFunc = (value: string) => {
            const list: AccountData[] = JSON.parse(value);
            this.rdbManager.updateLocalDataBase(this.accounts, list);
            this.accounts = list;
        };
        this.setInitiallyProvidedValue(params);
        this.finalizeConstruction();
    }
    setInitiallyProvidedValue(params: BillHomePage_Params) {
        if (params.accounts !== undefined) {
            this.accounts = params.accounts;
        }
        if (params.searchText !== undefined) {
            this.searchText = params.searchText;
        }
        if (params.isEdit !== undefined) {
            this.isEdit = params.isEdit;
        }
        if (params.isInsert !== undefined) {
            this.isInsert = params.isInsert;
        }
        if (params.newAccount !== undefined) {
            this.newAccount = params.newAccount;
        }
        if (params.index !== undefined) {
            this.index = params.index;
        }
        if (params.deleteList !== undefined) {
            this.deleteList = params.deleteList;
        }
        if (params.context !== undefined) {
            this.context = params.context;
        }
        if (params.rdbManager !== undefined) {
            this.rdbManager = params.rdbManager;
        }
        if (params.searchController !== undefined) {
            this.searchController = params.searchController;
        }
        if (params.dialogController !== undefined) {
            this.dialogController = params.dialogController;
        }
        if (params.eventFunc !== undefined) {
            this.eventFunc = params.eventFunc;
        }
    }
    updateStateVars(params: BillHomePage_Params) {
    }
    purgeVariableDependenciesOnElmtId(rmElmtId) {
        this.__accounts.purgeDependencyOnElmtId(rmElmtId);
        this.__searchText.purgeDependencyOnElmtId(rmElmtId);
        this.__isEdit.purgeDependencyOnElmtId(rmElmtId);
        this.__isInsert.purgeDependencyOnElmtId(rmElmtId);
        this.__newAccount.purgeDependencyOnElmtId(rmElmtId);
        this.__index.purgeDependencyOnElmtId(rmElmtId);
    }
    aboutToBeDeleted() {
        this.__accounts.aboutToBeDeleted();
        this.__searchText.aboutToBeDeleted();
        this.__isEdit.aboutToBeDeleted();
        this.__isInsert.aboutToBeDeleted();
        this.__newAccount.aboutToBeDeleted();
        this.__index.aboutToBeDeleted();
        SubscriberManager.Get().delete(this.id__());
        this.aboutToBeDeletedInternal();
    }
    private __accounts: ObservedPropertyObjectPU<Array<AccountData>>;
    get accounts() {
        return this.__accounts.get();
    }
    set accounts(newValue: Array<AccountData>) {
        this.__accounts.set(newValue);
    }
    private __searchText: ObservedPropertySimplePU<string>;
    get searchText() {
        return this.__searchText.get();
    }
    set searchText(newValue: string) {
        this.__searchText.set(newValue);
    }
    private __isEdit: ObservedPropertySimplePU<boolean>;
    get isEdit() {
        return this.__isEdit.get();
    }
    set isEdit(newValue: boolean) {
        this.__isEdit.set(newValue);
    }
    private __isInsert: ObservedPropertySimplePU<boolean>;
    get isInsert() {
        return this.__isInsert.get();
    }
    set isInsert(newValue: boolean) {
        this.__isInsert.set(newValue);
    }
    private __newAccount: ObservedPropertyObjectPU<AccountData>;
    get newAccount() {
        return this.__newAccount.get();
    }
    set newAccount(newValue: AccountData) {
        this.__newAccount.set(newValue);
    }
    private __index: ObservedPropertySimplePU<number>;
    get index() {
        return this.__index.get();
    }
    set index(newValue: number) {
        this.__index.set(newValue);
    }
    private deleteList: Array<AccountData>;
    private context: common.UIAbilityContext;
    private rdbManager: RdbManager;
    private searchController: SearchController;
    private dialogController: CustomDialogController;
    async accept(isInsert: boolean, newAccount: AccountData): Promise<void> {
        if (isInsert) {
            const time = systemDateTime.getTime();
            newAccount.id = `id_${time}`;
            await this.rdbManager.insertData(newAccount);
            this.accounts.push(newAccount);
            hilog.info(0x0000, 'hilog', `The account inserted is:  ${JSON.stringify(newAccount)}`);
        }
        else {
            await this.rdbManager.updateData(newAccount);
            const list = this.accounts.map((item: AccountData) => {
                const result = item.id === newAccount.id ? newAccount : item;
                return result;
            });
            this.accounts = list;
            this.index = -1;
        }
    }
    async aboutToAppear() {
        await this.rdbManager.setDistributedTables(this.context);
        this.rdbManager.subscribeDataChange();
        const result: AccountData[] = await this.rdbManager.query('', true);
        this.accounts = result;
        this.context.eventHub.on('dataChange', this.eventFunc);
    }
    aboutToDisappear(): void {
        this.context.eventHub.off('dataChange', this.eventFunc);
    }
    // Function for Monitoring Data Changes.
    private eventFunc;
    selectListItem(item: AccountData) {
        this.isInsert = false;
        this.index = this.accounts.indexOf(item);
        this.newAccount = {
            id: item.id,
            accountType: item.accountType,
            typeText: item.typeText,
            amount: item.amount
        };
    }
    deleteListItem() {
        this.deleteList.forEach(async (item: AccountData) => {
            const index = this.accounts.findIndex((account: AccountData) => account.id === item.id);
            this.accounts.splice(index, 1);
            await this.rdbManager.deleteData(item);
        });
        this.deleteList = [];
        this.isEdit = false;
    }
    initialRender() {
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Column.create();
            Column.width('100%');
            Column.height('100%');
            Column.padding({ left: 16, right: 16 });
            Column.backgroundColor({ "id": 16777242, "type": 10001, params: [], "bundleName": "com.example.rdb", "moduleName": "entry" });
            Column.expandSafeArea([SafeAreaType.SYSTEM], [SafeAreaEdge.TOP, SafeAreaEdge.BOTTOM]);
        }, Column);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Stack.create({ alignContent: Alignment.TopStart });
            Stack.width('100%');
            Stack.height('100%');
        }, Stack);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Flex.create({ direction: FlexDirection.Column });
        }, Flex);
        this.NavigationTitle.bind(this)();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Search.create({
                value: this.searchText,
                placeholder: CommonConstants.SEARCH_TEXT,
                controller: this.searchController
            });
            Search.width('100%');
            Search.height(40);
            Search.flexShrink(0);
            Search.borderRadius(24);
            Search.margin({
                top: 8,
                bottom: 16
            });
            Search.placeholderColor('rgba(0, 0, 0, 0.6)');
            Search.placeholderFont({
                size: 16,
                weight: 400,
            });
            Search.textFont({ size: 16 });
            Search.padding({
                top: 9,
                right: 12,
                bottom: 9,
                left: 12
            });
            Search.onChange(async (searchValue: string) => {
                this.searchText = searchValue;
                if (searchValue === '') {
                    const result: AccountData[] = await this.rdbManager.query('', true);
                    this.accounts = result;
                }
            });
            Search.onSubmit(async (searchValue: string) => {
                if (searchValue === '') {
                    const result: AccountData[] = await this.rdbManager.query('', true);
                    this.accounts = result;
                }
                else {
                    const keyList: Array<string> = Object.keys(TextList);
                    const typeText = keyList.find(key => {
                        let result: string = '';
                        try {
                            result = this.context.resourceManager.getStringByNameSync(key);
                        }
                        catch (err) {
                            hilog.error(0x0000, 'BillHomePage', `getStringByNameSync failed, Code:${err.code},message: ${err.message}`);
                        }
                        return result === searchValue;
                    });
                    const result: AccountData[] = await this.rdbManager.query(typeText || '', false);
                    this.accounts = result;
                }
            });
        }, Search);
        Search.pop();
        {
            this.observeComponentCreation2((elmtId, isInitialRender) => {
                if (isInitialRender) {
                    let componentCall = new BillBarChart(this, { accounts: this.accounts }, undefined, elmtId, () => { }, { page: "entry/src/main/ets/pages/BillHomePage.ets", line: 171, col: 11 });
                    ViewPU.create(componentCall);
                    let paramsLambda = () => {
                        return {
                            accounts: this.accounts
                        };
                    };
                    componentCall.paramsGenerator_ = paramsLambda;
                }
                else {
                    this.updateStateVarsOfChildByElmtId(elmtId, {
                        accounts: this.accounts
                    });
                }
            }, { name: "BillBarChart" });
        }
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            List.create({ space: CommonConstants.FULL_SIZE });
            List.width('100%');
            List.flexGrow(1);
            List.borderRadius(16);
            List.clip(true);
            List.padding({
                top: this.accounts.length ? 4 : 0,
                bottom: this.accounts.length ? 4 : 0
            });
        }, List);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            ForEach.create();
            const forEachItemGenFunction = (_item, index: number) => {
                const item = _item;
                {
                    const itemCreation = (elmtId, isInitialRender) => {
                        ViewStackProcessor.StartGetAccessRecordingFor(elmtId);
                        ListItem.create(deepRenderFunction, true);
                        if (!isInitialRender) {
                            ListItem.pop();
                        }
                        ViewStackProcessor.StopGetAccessRecording();
                    };
                    const itemCreation2 = (elmtId, isInitialRender) => {
                        ListItem.create(deepRenderFunction, true);
                        ListItem.width('100%');
                        ListItem.height(48);
                        ListItem.padding({
                            left: 12,
                            right: 12,
                        });
                        ListItem.backgroundColor(Color.White);
                        ListItem.onClick(() => {
                            this.selectListItem(item);
                            this.dialogController.open();
                        });
                    };
                    const deepRenderFunction = (elmtId, isInitialRender) => {
                        itemCreation(elmtId, isInitialRender);
                        this.observeComponentCreation2((elmtId, isInitialRender) => {
                            Column.create();
                        }, Column);
                        this.observeComponentCreation2((elmtId, isInitialRender) => {
                            Row.create();
                            Row.width('100%');
                            Row.padding({ top: 4, bottom: 4 });
                        }, Row);
                        this.observeComponentCreation2((elmtId, isInitialRender) => {
                            Row.create();
                            Row.alignItems(VerticalAlign.Center);
                            Row.justifyContent(FlexAlign.Center);
                            Row.width(40);
                            Row.height(40);
                            Row.backgroundColor('rgba(10, 89, 247, 0.15)');
                            Row.borderRadius(40);
                            Row.margin({ right: 16 });
                        }, Row);
                        this.observeComponentCreation2((elmtId, isInitialRender) => {
                            SymbolGlyph.create(ImageList[item.typeText]);
                            SymbolGlyph.fontSize(24);
                            SymbolGlyph.fontWeight(400);
                            SymbolGlyph.fontColor(['#0A59F7']);
                        }, SymbolGlyph);
                        Row.pop();
                        this.observeComponentCreation2((elmtId, isInitialRender) => {
                            Text.create(TextList[item.typeText]);
                            Text.fontSize({ "id": 16777267, "type": 10002, params: [], "bundleName": "com.example.rdb", "moduleName": "entry" });
                            Text.fontColor('rgba(0, 0, 0, 0.9)');
                            Text.lineHeight(21);
                        }, Text);
                        Text.pop();
                        this.observeComponentCreation2((elmtId, isInitialRender) => {
                            Blank.create();
                            Blank.layoutWeight(1);
                        }, Blank);
                        Blank.pop();
                        this.observeComponentCreation2((elmtId, isInitialRender) => {
                            Text.create(item.accountType === 0 ? '-' + item.amount.toString() : '+' + item.amount.toString());
                            Text.fontSize(16);
                            Text.fontColor(item.accountType === 0 ? { "id": 16777245, "type": 10001, params: [], "bundleName": "com.example.rdb", "moduleName": "entry" } : { "id": 16777244, "type": 10001, params: [], "bundleName": "com.example.rdb", "moduleName": "entry" });
                        }, Text);
                        Text.pop();
                        this.observeComponentCreation2((elmtId, isInitialRender) => {
                            If.create();
                            if (this.isEdit) {
                                this.ifElseBranchUpdateFunction(0, () => {
                                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                                        Row.create();
                                        Row.margin({ left: 10 });
                                    }, Row);
                                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                                        Toggle.create({ type: ToggleType.Checkbox });
                                        Toggle.onChange((isOn) => {
                                            if (isOn) {
                                                this.deleteList.push(item);
                                            }
                                            else {
                                                let index = this.deleteList.indexOf(item);
                                                this.deleteList.splice(index, 1);
                                            }
                                        });
                                    }, Toggle);
                                    Toggle.pop();
                                    Row.pop();
                                });
                            }
                            else {
                                this.ifElseBranchUpdateFunction(1, () => {
                                });
                            }
                        }, If);
                        If.pop();
                        Row.pop();
                        this.observeComponentCreation2((elmtId, isInitialRender) => {
                            If.create();
                            if (index !== this.accounts.length - 1) {
                                this.ifElseBranchUpdateFunction(0, () => {
                                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                                        Divider.create();
                                        Divider.color('rgba(0,0,0,0.2)');
                                        Divider.strokeWidth(0.5);
                                        Divider.margin({
                                            left: 68
                                        });
                                    }, Divider);
                                });
                            }
                            else {
                                this.ifElseBranchUpdateFunction(1, () => {
                                });
                            }
                        }, If);
                        If.pop();
                        Column.pop();
                        ListItem.pop();
                    };
                    this.observeComponentCreation2(itemCreation2, ListItem);
                    ListItem.pop();
                }
            };
            this.forEachUpdateFunction(elmtId, this.accounts, forEachItemGenFunction, (item: AccountData) => item.id, true, false);
        }, ForEach);
        ForEach.pop();
        List.pop();
        Flex.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            If.create();
            if (!this.isEdit) {
                this.ifElseBranchUpdateFunction(0, () => {
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Row.create();
                        Row.alignItems(VerticalAlign.Center);
                        Row.justifyContent(FlexAlign.Center);
                        Row.width(48);
                        Row.height(48);
                        Row.backgroundColor('#0A59F7');
                        Row.borderRadius('50%');
                        Row.position({ left: '50%', bottom: 26 });
                        Row.translate({ x: '-50%' });
                        Row.onClick(() => {
                            this.isInsert = true;
                            this.newAccount = {
                                id: '',
                                accountType: 0,
                                typeText: '',
                                amount: 0
                            };
                            this.dialogController.open();
                        });
                    }, Row);
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        SymbolGlyph.create({ "id": 125831481, "type": 40000, params: [], "bundleName": "com.example.rdb", "moduleName": "entry" });
                        SymbolGlyph.fontSize(24);
                        SymbolGlyph.fontColor([Color.White]);
                        SymbolGlyph.fontWeight(400);
                    }, SymbolGlyph);
                    Row.pop();
                });
            }
            else {
                this.ifElseBranchUpdateFunction(1, () => {
                });
            }
        }, If);
        If.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            If.create();
            if (this.isEdit) {
                this.ifElseBranchUpdateFunction(0, () => {
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Column.create();
                        Column.position({ left: '50%', bottom: 0 });
                        Column.translate({ x: '-50%' });
                        Column.onClick(() => {
                            this.deleteListItem();
                        });
                    }, Column);
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        SymbolGlyph.create({ "id": 125831542, "type": 40000, params: [], "bundleName": "com.example.rdb", "moduleName": "entry" });
                        SymbolGlyph.fontSize(20);
                        SymbolGlyph.fontColor([Color.Black]);
                        SymbolGlyph.fontWeight(400);
                    }, SymbolGlyph);
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Text.create({ "id": 16777226, "type": 10003, params: [], "bundleName": "com.example.rdb", "moduleName": "entry" });
                        Text.fontSize(12);
                        Text.fontColor('rgba(0, 0, 0, 0.9)');
                        Text.lineHeight(16);
                        Text.fontWeight(400);
                        Text.margin({ top: 6 });
                    }, Text);
                    Text.pop();
                    Column.pop();
                });
            }
            else {
                this.ifElseBranchUpdateFunction(1, () => {
                });
            }
        }, If);
        If.pop();
        Stack.pop();
        Column.pop();
    }
    NavigationTitle(parent = null) {
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Flex.create({ alignItems: ItemAlign.Center });
            Flex.height(56);
            Flex.flexShrink(0);
        }, Flex);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            If.create();
            if (this.isEdit) {
                this.ifElseBranchUpdateFunction(0, () => {
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Row.create();
                        Row.alignItems(VerticalAlign.Center);
                        Row.justifyContent(FlexAlign.Center);
                        Row.width(40);
                        Row.height(40);
                        Row.backgroundColor('rgba(0, 0, 0, 0.05)');
                        Row.borderRadius(40);
                        Row.margin({ right: 8 });
                        Row.onClick(() => {
                            if (this.isEdit) {
                                this.isEdit = !this.isEdit;
                            }
                        });
                    }, Row);
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        SymbolGlyph.create({ "id": 125831487, "type": 40000, params: [], "bundleName": "com.example.rdb", "moduleName": "entry" });
                        SymbolGlyph.fontColor(['rgba(0,0,0,0.9)']);
                        SymbolGlyph.fontSize(24);
                    }, SymbolGlyph);
                    Row.pop();
                });
            }
            else {
                this.ifElseBranchUpdateFunction(1, () => {
                });
            }
        }, If);
        If.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create(this.isEdit ? { "id": 16777228, "type": 10003, params: [], "bundleName": "com.example.rdb", "moduleName": "entry" } : { "id": 16777223, "type": 10003, params: [], "bundleName": "com.example.rdb", "moduleName": "entry" });
            Text.fontSize(20);
            Text.fontWeight(700);
            Text.lineHeight(27);
            Text.fontColor('rgba(0, 0, 0, 0.9)');
            Text.flexGrow(1);
        }, Text);
        Text.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Row.create();
            Row.alignItems(VerticalAlign.Center);
            Row.justifyContent(FlexAlign.Center);
            Row.width(40);
            Row.height(40);
            Row.backgroundColor('rgba(0, 0, 0, 0.05)');
            Row.borderRadius(40);
            Row.onClick(() => {
                if (this.accounts.length === 0) {
                    try {
                        this.getUIContext().getPromptAction().showToast({ message: { "id": 16777222, "type": 10003, params: [], "bundleName": "com.example.rdb", "moduleName": "entry" } });
                    }
                    catch (error) {
                        hilog.error(0x0000, 'BillHomePage', `have error .Code:${error.code},message: ${error.message}`);
                    }
                    return;
                }
                this.isEdit = !this.isEdit;
            });
        }, Row);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            If.create();
            if (this.isEdit) {
                this.ifElseBranchUpdateFunction(0, () => {
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        SymbolGlyph.create({ "id": 125831490, "type": 40000, params: [], "bundleName": "com.example.rdb", "moduleName": "entry" });
                        SymbolGlyph.fontColor(['rgba(0,0,0,0.9)']);
                        SymbolGlyph.fontSize(24);
                    }, SymbolGlyph);
                });
            }
            else {
                this.ifElseBranchUpdateFunction(1, () => {
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        SymbolGlyph.create({ "id": 125831624, "type": 40000, params: [], "bundleName": "com.example.rdb", "moduleName": "entry" });
                        SymbolGlyph.fontSize(24);
                        SymbolGlyph.fontWeight(400);
                    }, SymbolGlyph);
                });
            }
        }, If);
        If.pop();
        Row.pop();
        Flex.pop();
    }
    rerender() {
        this.updateDirtyElements();
    }
    static getEntryName(): string {
        return "BillHomePage";
    }
}
registerNamedRoute(() => new BillHomePage(undefined, {}), "", { bundleName: "com.example.rdb", moduleName: "entry", pagePath: "pages/BillHomePage", pageFullPath: "entry/src/main/ets/pages/BillHomePage", integratedHsp: "false", moduleType: "followWithHap" });
