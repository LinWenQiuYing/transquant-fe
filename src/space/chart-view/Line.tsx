import { Theme } from "@transquant/constants";
import { isArray } from "@transquant/utils";
import { useMount, useSize, useUpdateEffect } from "ahooks";
import { Card } from "antd";
import * as echarts from "echarts/core";
import { EChartsType } from "echarts/core";
import { useRef, useState } from "react";

interface LineProps {
  data: any;
}

const COLORS = [
  "#1776FF",
  "#1BB46D",
  "#FE9E17",
  "#2A43C2",
  "#E31430",
  "#AA24C5",
  "#2A33C2",
  "#2FA9E6",
  "#1726FF",
  "#1dB46D",
  "#6503CA",
  "#AA04C5",
];

const getMarkPoint = (markers: any[]) => {
  const points: any[] = [];
  if (!markers) return points;

  markers.forEach((item: any) => {
    points.push({
      coord: [item.timestamp, item.value],
      itemStyle: {
        color: item.buy ? "#f80000" : item.sell ? "#58b861" : "#ff7d00",
      },
      label: {
        show: true,
        offset: [0, 10],
      },
    });
  });

  return points;
};

const getData = (data: any) => {
  if (data.value.length && !isArray(data.value[0])) {
    return data.value;
  }

  return data.value.map((item: any) => item.val);
};

const getSeries = (data: any[]) => {
  const series = data.map((item, index) => {
    return {
      name: item.name,
      data: getData(item),
      yAxisIndex: item.axisPosition === "left" ? 0 : 1,
      type: "line",
      step: item?.step,
      symbolSize: 0,
      emphasis: {
        focus: "series",
      },
      itemStyle: {
        color: COLORS[index % COLORS.length], // 红色
      },
      markPoint: {
        data: getMarkPoint(item.marker),
        symbol: "circle",
        symbolSize: 5,
        label: {
          formatter(param: any) {
            return param.data.markerLabel;
          },
          color: "#fff",
        },
      },
    };
  });

  return series;
};

const getOption = (data: any, theme: Theme) => {
  const axisData = data.data[0].timestamps;

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
    // toolbox: {
    //   show: true,
    //   feature: {
    //     myTool1: {
    //       show: true,
    //       title: "下载数据",
    //       icon: "M494.933333 782.933333c2.133333 2.133333 4.266667 4.266667 8.533334 6.4h8.533333c6.4 0 10.666667-2.133333 14.933333-6.4l2.133334-2.133333 275.2-275.2c8.533333-8.533333 8.533333-21.333333 0-29.866667-8.533333-8.533333-21.333333-8.533333-29.866667 0L533.333333 716.8V128c0-12.8-8.533333-21.333333-21.333333-21.333333s-21.333333 8.533333-21.333333 21.333333v588.8L249.6 475.733333c-8.533333-8.533333-21.333333-8.533333-29.866667 0-8.533333 8.533333-8.533333 21.333333 0 29.866667l275.2 277.333333zM853.333333 874.666667H172.8c-12.8 0-21.333333 8.533333-21.333333 21.333333s8.533333 21.333333 21.333333 21.333333H853.333333c12.8 0 21.333333-8.533333 21.333334-21.333333s-10.666667-21.333333-21.333334-21.333333z",

    //       onclick(data: any) {
    //         console.log(data.option, 111);
    //       },
    //     },
    //   },
    // },
    xAxis: {
      show: true,
      type: "category",
      boundaryGap: true,
      data: axisData,
      axisLine: {
        onZero: false,
        show: true,
        lineStyle: {
          color: "rgba(255, 255, 255, 0.15)",
        },
      },
      axisTick: { show: false },
      splitLine: { show: false },
    },
    yAxis: data.doubleAxis
      ? [
          {
            show: true,
            gridIndex: 0,
            splitNumber: 2,
            type: "value",
            boundaryGap: false,
            position: "left",
            axisLabel: {
              show: true,
              color: "#f40",
              // formatter(value: number) {
              //   return `${value.toFixed(2)}%`;
              // },
            },
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
          },
          {
            show: true,
            gridIndex: 0,
            splitNumber: 2,
            position: "right",
            boundaryGap: false,
            type: "value",
            axisLabel: {
              show: true,
              color: "#f40",
              // formatter(value: number) {
              //   return `${value.toFixed(2)}%`;
              // },
            },
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
          },
        ]
      : {
          show: true,
          gridIndex: 0,
          splitNumber: 2,
          type: "value",
          scale: true,
          axisLabel: {
            show: true,
            color: "#f40",
          },
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
        },
    dataZoom: {
      type: "slider",
      start: 0,
      end: 100,
    },
    series: getSeries(data.data),
  };
};

export default function Line(props: LineProps) {
  const { data } = props;
  const echartRef = useRef(null);
  const size = useSize(echartRef);
  const [echart, setEchart] = useState<EChartsType | null>(null);
  const theme = Theme.Light;

  useMount(() => {
    if (!echartRef.current) return;
    const myChart = echarts.init(echartRef.current);
    setEchart(myChart);

    const option = getOption(data, theme);

    myChart.setOption(option);
  });

  useUpdateEffect(() => {
    if (echart) {
      echart.resize();
    }
  }, [size?.width, size?.height]);

  return (
    <div>
      <Card title={data.title} bordered={false} size="small" />
      <div ref={echartRef} style={{ width: "100%", height: "400px" }} />
    </div>
  );
}
