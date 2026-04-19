/*
 *  Copyright (c) 2025 Huawei Device Co., Ltd.
 *  Licensed under the Apache License, Version 2.0 (the "License");
 *  you may not use this file except in compliance with the License.
 *  You may obtain a copy of the License at
 *
 *       http://www.apache.org/licenses/LICENSE-2.0
 *
 *  Unless required by applicable law or agreed to in writing, software
 *  distributed under the License is distributed on an "AS IS" BASIS,
 *  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *  See the License for the specific language governing permissions and
 *  limitations under the License.
 */
export class AccountData {
    id: string = '';
    accountType: number = 0;
    typeText: string = '';
    amount: number = 0;
}
export interface AccountItem {
    icon: Resource;
    accountType: number;
    typeText: string;
}
export const PayList: Array<AccountItem> = [
    {
        icon: { "id": 125832402, "type": 40000, params: [], "bundleName": "com.example.rdb", "moduleName": "entry" },
        accountType: 0,
        typeText: 'foods'
    },
    {
        icon: { "id": 125833865, "type": 40000, params: [], "bundleName": "com.example.rdb", "moduleName": "entry" },
        accountType: 0,
        typeText: 'snacks'
    },
    {
        icon: { "id": 125832236, "type": 40000, params: [], "bundleName": "com.example.rdb", "moduleName": "entry" },
        accountType: 0,
        typeText: 'fuel'
    },
    {
        icon: { "id": 125832626, "type": 40000, params: [], "bundleName": "com.example.rdb", "moduleName": "entry" },
        accountType: 0,
        typeText: 'travel'
    },
    {
        icon: { "id": 125833560, "type": 40000, params: [], "bundleName": "com.example.rdb", "moduleName": "entry" },
        accountType: 0,
        typeText: 'games'
    },
    {
        icon: { "id": 125832579, "type": 40000, params: [], "bundleName": "com.example.rdb", "moduleName": "entry" },
        accountType: 0,
        typeText: 'pets'
    }
];
export const EarnList: Array<AccountItem> = [
    {
        icon: { "id": 125832878, "type": 40000, params: [], "bundleName": "com.example.rdb", "moduleName": "entry" },
        accountType: 1,
        typeText: 'income'
    },
    {
        icon: { "id": 125832319, "type": 40000, params: [], "bundleName": "com.example.rdb", "moduleName": "entry" },
        accountType: 1,
        typeText: 'invest'
    }
];
export const ImageList: Record<string, Resource> = {
    'foods': { "id": 125832402, "type": 40000, params: [], "bundleName": "com.example.rdb", "moduleName": "entry" },
    'snacks': { "id": 125833865, "type": 40000, params: [], "bundleName": "com.example.rdb", "moduleName": "entry" },
    'fuel': { "id": 125832236, "type": 40000, params: [], "bundleName": "com.example.rdb", "moduleName": "entry" },
    'travel': { "id": 125832626, "type": 40000, params: [], "bundleName": "com.example.rdb", "moduleName": "entry" },
    'games': { "id": 125833560, "type": 40000, params: [], "bundleName": "com.example.rdb", "moduleName": "entry" },
    'pets': { "id": 125832579, "type": 40000, params: [], "bundleName": "com.example.rdb", "moduleName": "entry" },
    'income': { "id": 125832878, "type": 40000, params: [], "bundleName": "com.example.rdb", "moduleName": "entry" },
    'invest': { "id": 125832319, "type": 40000, params: [], "bundleName": "com.example.rdb", "moduleName": "entry" }
};
export const TextList: Record<string, Resource> = {
    'foods': { "id": 16777230, "type": 10003, params: [], "bundleName": "com.example.rdb", "moduleName": "entry" },
    'snacks': { "id": 16777240, "type": 10003, params: [], "bundleName": "com.example.rdb", "moduleName": "entry" },
    'fuel': { "id": 16777231, "type": 10003, params: [], "bundleName": "com.example.rdb", "moduleName": "entry" },
    'travel': { "id": 16777241, "type": 10003, params: [], "bundleName": "com.example.rdb", "moduleName": "entry" },
    'games': { "id": 16777232, "type": 10003, params: [], "bundleName": "com.example.rdb", "moduleName": "entry" },
    'pets': { "id": 16777238, "type": 10003, params: [], "bundleName": "com.example.rdb", "moduleName": "entry" },
    'income': { "id": 16777233, "type": 10003, params: [], "bundleName": "com.example.rdb", "moduleName": "entry" },
    'invest': { "id": 16777236, "type": 10003, params: [], "bundleName": "com.example.rdb", "moduleName": "entry" }
};
export interface AccountTable {
    tableName: string;
    sqlCreate: string;
    columns: string[];
}
