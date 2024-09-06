import { Theme } from "@transquant/constants";
import { useMount, useSize, useUpdateEffect } from "ahooks";
import { Card } from "antd";
import * as echarts from "echarts/core";
import { EChartsType } from "echarts/core";
import { useRef, useState } from "react";

interface BarProps {
  data: any;
}

const getSeriesData = (data: any[]) => {
  const values: number[] = [];
  const seriesData = data.map((item) => {
    values.push(item[2]);
    return [item[1], item[0], item[2] || "-"];
  });

  return { values, seriesData };
};

const getOption = (data: any, theme: Theme) => {
  const { seriesData, values } = getSeriesData(data.data);
  return {
    backgroundColor: "transparent",
    tooltip: {
      className: `echarts-tooltip-${theme}`,
    },
    dataZoom: {
      type: "slider",
      start: 0,
      end: 100,
    },
    visualMap: {
      min: values.length ? Math.min(...values) : 0,
      max: values.length ? Math.max(...values) : 1,
      calculable: true,
      orient: "vertical",
      bottom: "30%",
      right: "0%",
      inRange: {
        color: ["rgb(136, 49, 51)", "rgb(255,255,255)", "rgb(48, 85, 171)"],
      },
    },
    grid: {
      left: "4%",
      right: "4%",
    },
    xAxis: {
      type: "category",
      show: true,
      data: data.xAxisData,
      axisLine: { show: false },
      axisTick: { show: false },
    },
    yAxis: {
      type: "category",
      data: data.yAxisData,
      axisLine: {
        show: false,
      },
      axisLabel: {
        show: true,
        color: "#ccc",
      },
    },
    series: {
      type: "heatmap",
      data: seriesData,
      label: {
        show: true,
      },
      emphasis: {
        itemStyle: {
          shadowBlur: 10,
          shadowColor: "rgba(0, 0, 0, 0.5)",
        },
      },
    },
  };
};

export default function HeatMap(props: BarProps) {
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
