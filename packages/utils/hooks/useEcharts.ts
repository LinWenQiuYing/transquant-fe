import { useSize, useUnmount } from "ahooks";
import type {
  BarSeriesOption,
  LineSeriesOption,
  PieSeriesOption,
  ScatterSeriesOption,
} from "echarts/charts";
import { BarChart, LineChart, PieChart, ScatterChart } from "echarts/charts";
import type {
  DatasetComponentOption,
  GridComponentOption,
  LegendComponentOption,
  TitleComponentOption,
  ToolboxComponentOption,
  TooltipComponentOption,
} from "echarts/components";
import {
  DatasetComponent,
  GridComponent,
  LegendComponent,
  TitleComponent,
  ToolboxComponent,
  TooltipComponent,
  TransformComponent,
} from "echarts/components";
import * as echarts from "echarts/core";
import { LabelLayout, UniversalTransition } from "echarts/features";
import { CanvasRenderer } from "echarts/renderers";
import { useEffect, useRef, useState } from "react";

export type ECOption = echarts.ComposeOption<
  | BarSeriesOption
  | PieSeriesOption
  | LineSeriesOption
  | ScatterSeriesOption
  | TitleComponentOption
  | LegendComponentOption
  | TooltipComponentOption
  | GridComponentOption
  | ToolboxComponentOption
  | DatasetComponentOption
>;

echarts.use([
  TitleComponent,
  LegendComponent,
  TooltipComponent,
  GridComponent,
  DatasetComponent,
  TransformComponent,
  ToolboxComponent,
  BarChart,
  LineChart,
  PieChart,
  ScatterChart,
  LabelLayout,
  UniversalTransition,
  CanvasRenderer,
]);

/**
 * Echarts hooks函数
 * @param options - 图表配置
 * @param renderFun - 图表渲染函数(例如：图表监听函数)
 * @param
 * @description 按需引入图表组件，没注册的组件需要先引入
 */
export default function useEcharts<T extends HTMLElement>(
  options: ECOption,
  renderFun?: (chartInstance: echarts.ECharts) => void
) {
  const domRef = useRef<T>(null);
  const { width, height } = useSize(domRef);
  const [chart, setChart] = useState<echarts.ECharts | null>(null);

  function isRendered() {
    return Boolean(domRef.current && chart);
  }

  function update(updateOptions: ECOption) {
    if (isRendered()) {
      chart?.clear();

      chart!.setOption({ ...updateOptions, backgroundColor: "transparent" });
    }
  }

  async function render() {
    if (domRef.current) {
      if (chart) {
        chart.dispose();
      }
      const _chart = echarts.init(domRef.current);
      setChart(_chart);

      if (renderFun) {
        renderFun(_chart);
      }
      update(options);
    }
  }

  function resize() {
    chart?.resize();
  }

  function destroy() {
    chart?.dispose();
  }

  useEffect(() => {
    if (width === 0 && height === 0) {
      // 节点被删除 将chart置为空
      setChart(null);
    }
    if (!isRendered()) {
      render();
    } else {
      resize();
    }
  }, [width, height]);

  useEffect(() => {
    update(options);
  }, [options]);

  useUnmount(() => {
    destroy();
  });

  return {
    domRef,
    update,
    chart,
  };
}
