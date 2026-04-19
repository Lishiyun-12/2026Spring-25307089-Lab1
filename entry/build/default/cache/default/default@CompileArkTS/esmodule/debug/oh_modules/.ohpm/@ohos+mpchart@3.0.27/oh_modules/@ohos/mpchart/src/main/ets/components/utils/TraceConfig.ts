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
export namespace TraceLogConstants {
    export enum Tag {
        // 图例
        renderLegend = "renderLegend",
        // 网格线
        renderGridLines = "renderGridLines",
        // X轴&Y轴
        renderXAxisLine = "renderXAxisLine",
        renderXAxisLabels = "renderXAxisLabels",
        renderLinesInner = "renderLinesInner",
        renderXAxisLimitLine = "renderXAxisLimitLine",
        renderLimitLineLabel = "renderLimitLineLabel",
        renderYAxisLine = "renderYAxisLine",
        renderYAxisLabels = "renderYAxisLabels",
        renderYAxisLimitLine = "renderYAxisLimitLine",
        // 线形图
        LineChartSetData = "LineChartSetData",
        LineChartHighlight = "LineChartHighlight",
        LineChartCircle = "LineChartCircle",
        // 柱状图
        BarChartSetData = "BarChartSetData",
        BarChartHighlight = "BarChartHighlight",
        // 饼状图
        PieChartSetData = "PieChartSetData",
        PieChartDrawValues = "PieChartDrawValues",
        PieChartDrawHole = "PieChartDrawHole",
        PieChartDrawCenterText = "PieChartDrawCenterText",
        PieChartDrawRoundedSlices = "PieChartDrawRoundedSlices",
        // 玫瑰图
        RoseChartDrawSector = "RoseChartDrawSector",
        RoseChartDrawValue = "RoseChartDrawValue",
        // 雷达图
        RadarChartSetData = "RadarChartSetData",
        // 气泡图
        BubbleChartSetData = "BubbleChartSetData",
        BubbleChartDrawValues = "BubbleChartDrawValues",
        BubbleChartHighlight = "BubbleChartHighlight",
        // 蜡烛图
        CandleStickChartSetData = "CandleStickChartSetData",
        CandleStickChartDrawValues = "CandleStickChartDrawValues",
        // 散点图
        ScatterChartSetData = "ScatterChartSetData",
        ScatterChartDrawValues = "ScatterChartDrawValues",
        // 横条图
        HorizontalBarChartDrawData = "HorizontalBarChartDrawData",
        HorizontalBarRenderXAxisLabels = "HorizontalBarRenderXAxisLabels",
        HorizontalBarRenderYAxisLabels = "HorizontalBarRenderYAxisLabels",
        // 瀑布图
        WaterfallChartSetData = "WaterfallChartSetData",
        // 组合图
        CombinedChartSetData = "CombinedChartSetData",
        CombinedChartDrawValues = "CombinedChartDrawValues",
        AreaChartSetData = "AreaChartSetData",
        // 漏斗图
        FunnelChartSetData = "FunnelChartSetData",
        // 词云图
        WordCloudChartSetData = "WordCloudChartSetData",
        // 仪表盘
        GaugeChartDrawGauge = "GaugeChartDrawGauge"
    }
}
