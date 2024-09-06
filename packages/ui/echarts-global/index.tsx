import {
  BarChart,
  BoxplotChart,
  CandlestickChart,
  HeatmapChart,
  LineChart,
} from "echarts/charts";
import {
  DatasetComponent,
  DataZoomComponent,
  GridComponent,
  LegendComponent,
  MarkAreaComponent,
  MarkPointComponent,
  TitleComponent,
  ToolboxComponent,
  TooltipComponent,
  // 内置数据转换器组件 (filter, sort)
  TransformComponent,
  VisualMapComponent,
} from "echarts/components";
import * as echarts from "echarts/core";
import { LabelLayout, UniversalTransition } from "echarts/features";
import { CanvasRenderer } from "echarts/renderers";

export default function initGlobalEcharts() {
  // 注册必须的组件
  echarts.use([
    TitleComponent,
    GridComponent,
    DatasetComponent,
    BoxplotChart,
    TransformComponent,
    MarkAreaComponent,
    VisualMapComponent,
    MarkPointComponent,
    BarChart,
    HeatmapChart,
    LabelLayout,
    UniversalTransition,
    CanvasRenderer,
    LegendComponent,
    TooltipComponent,
    DataZoomComponent,
    CandlestickChart,
    LineChart,
    ToolboxComponent,
  ]);
}
