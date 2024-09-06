import { Theme } from "@transquant/constants";
import { useMount, useSize, useUpdateEffect } from "ahooks";
import { Card } from "antd";

import * as echarts from "echarts/core";
import { EChartsType } from "echarts/core";
import { useRef, useState } from "react";
import getHistogramOption from "./getHistogramOption";
import getNormalOption from "./getNormalOption";

interface BarProps {
  data: any;
}

export default function Bar(props: BarProps) {
  const { data } = props;
  const echartRef = useRef(null);
  const size = useSize(echartRef);
  const [echart, setEchart] = useState<EChartsType | null>(null);
  const theme = Theme.Light;

  useMount(() => {
    if (!echartRef.current) return;
    const myChart = echarts.init(echartRef.current);
    setEchart(myChart);
    let option: any;

    if (data.histogram) {
      option = getHistogramOption(data.data, theme);
    } else {
      option = getNormalOption(data.data, theme);
    }
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
