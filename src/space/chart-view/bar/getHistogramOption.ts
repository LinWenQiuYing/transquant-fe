import { Theme } from "@transquant/constants";
import * as ecStat from "echarts-stat";
import * as echarts from "echarts/core";

// See https://github.com/ecomfe/echarts-stat
echarts.registerTransform((ecStat as any).transform.histogram);

const getSource = (data: any) => {
  if (!data.length) return [];
  return data[0].value.map((item: any) => {
    return [item, 1];
  });
};

const getHistogramOption = (data: any, theme: Theme) => {
  const source = getSource(data);
  const option = {
    backgroundColor: "transparent",
    tooltip: {
      show: true,
      className: `echarts-tooltip-${theme}`,
    },
    axisPointer: {
      link: [
        {
          xAxisIndex: "all",
        },
      ],
      label: {
        backgroundColor: "#1F7EFF",
      },
    },
    dataset: [
      {
        source,
      },
      {
        transform: {
          type: "ecStat:histogram",
          config: {},
        },
      },
    ],
    grid: {
      top: "8%",
      left: "4%",
      right: "4%",
      bottom: "20%",
      containLabel: true,
    },
    xAxis: {
      type: "category",
      show: true,
      axisLine: { show: false },
      axisTick: { show: false },
      gridIndex: 0,
      axisPointer: {
        type: "line",
      },
    },
    yAxis: {
      type: "value",
      gridIndex: 0,
      scale: true,
      splitLine: {
        show: true,
        lineStyle: {
          type: "dashed",
          color: theme === "light" ? "#bebebe" : "#4e4e4e",
        },
      },
      axisLine: {
        show: false,
      },
      axisLabel: {
        show: true,
        color: "#ccc",
      },
    },
    series: [
      {
        type: "bar",
        label: {
          show: true,
          position: "top",
        },
        encode: { x: 0, y: 1, itemName: 4 },
        datasetIndex: 1,
      },
    ],
  };

  return option;
};

export default getHistogramOption;
