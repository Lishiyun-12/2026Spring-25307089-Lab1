/*
 * Copyright (C) 2025 Huawei Device Co., Ltd.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
export default class Constants {
    static readonly UI_CONTEXT: string = 'uiContext';
    static readonly BAR_CHART_ACCESS: string = 'barChartAccess';
    static readonly PIE_CHART_ACCESS: string = 'pieChartAccess';
    static readonly WATER_CHART_ACCESS: string = 'waterChartAccess';
    static readonly LEGEND_ACCESS: string = 'legendAccess';
    static readonly LEGEND_ACCESS_LABEL: string = 'legendAccessLabel';
    static readonly LEGEND_ACCESS_BOOL: string = 'legendAccessBool';
}
export interface AccessClick {
    x: number;
    y: number;
}
export interface LegendRect {
    x: number;
    y: number;
    width: number;
    height: number;
}
