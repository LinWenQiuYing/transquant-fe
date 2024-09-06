import { Theme } from "@transquant/constants";

export const COLORS = [
  "#1776FF",
  "#1BB46D",
  "#FE9E17",
  "#2A43C2",
  "#E31430",
  "#AA24C5",
];

const getSeries = (data: any[]) => {
  return data.map((item, index) => {
    return {
      data: item.value || [],
      type: "bar",
      itemStyle: {
        color: COLORS[index % COLORS.length],
      },
    };
  });
};

const getNormalOption = (data: any[], theme: Theme) => {
  return {
    backgroundColor: "transparent",
    tooltip: {
      show: true,
      trigger: "axis",
      className: `echarts-tooltip-${theme}`,
      axisPointer: {
        type: "cross",
      },
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
    dataZoom: {
      type: "slider",
      start: 0,
      end: 100,
    },
    series: getSeries(data),
  };
};

export default getNormalOption;
