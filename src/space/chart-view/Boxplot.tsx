import { Theme } from "@transquant/constants";
import { useMount, useSize, useUpdateEffect } from "ahooks";
import { Card } from "antd";

import * as echarts from "echarts/core";
import { EChartsType } from "echarts/core";
import { useRef, useState } from "react";

interface BarProps {
  data: any;
}

const getOption = (data: any, theme: Theme) => {
  return {
    backgroundColor: "transparent",
    tooltip: {
      show: true,
      trigger: "axis",
      className: `echarts-tooltip-${theme}`,
      axisPointer: {
        type: "cross",
      },
      formatter: (params: any) => {
        const serie = params[0];
        let txt = "";
        txt +=
          `${serie.name}<br>${serie.marker}upper：${serie.data[5]}` +
          `<br>${serie.marker}Q3：${serie.data[4]}` +
          `<br>${serie.marker}median：${serie.data[3]}` +
          `<br>${serie.marker}Q1:${serie.data[2]}` +
          `<br>${serie.marker}lower：${serie.data[1]}` +
          `<br>`;
        return txt;
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
    },
    xAxis: {
      type: "category",
      show: true,
      data: data.xAxisData,
      axisLine: { show: false },
      axisTick: { show: false },
      axisLabel: {
        formatter: "{value}",
      },
      axisPointer: {
        type: "line",
      },
    },
    yAxis: {
      type: "value",
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
    series: {
      type: "boxplot",

      data: data.data.map((item: any) => item.value),
    },
  };
};

export default function Boxplot(props: BarProps) {
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
      <div ref={echartRef} style={{ width: "100%", height: "360px" }} />
    </div>
  );
}
