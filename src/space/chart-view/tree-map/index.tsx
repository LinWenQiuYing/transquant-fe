import { useSize, useUpdateEffect } from "ahooks";
import type { DatePickerProps } from "antd";
import { Card, DatePicker } from "antd";
import dayjs from "dayjs";
import * as echarts from "echarts/core";
import { EChartsType } from "echarts/core";
import { observer } from "mobx-react";
import moment from "moment";
import { useEffect, useRef, useState } from "react";
import { getOptions } from "./options";

interface TreeMapProps {
  data: any;
}

export default observer(function TreeMapChartView(props: TreeMapProps) {
  const { data } = props;

  const echartRef = useRef(null);
  const size = useSize(echartRef);
  const [echart, setEchart] = useState<EChartsType | null>(null);
  const [timeRange, setTimeRange] = useState<[string, string]>(["", ""]);
  const [date, setDate] = useState("");

  const renderChart = (date: string) => {
    if (!echartRef.current) return;
    const myChart = echarts.init(echartRef.current);

    setEchart(myChart);

    const option = getOptions({
      data: data.data[date],
    });

    setTimeout(() => {
      myChart.setOption(option);
    }, 300);
  };

  useEffect(() => {
    const timestamps = Object.keys(data.data);
    const latestDate = timestamps[timestamps.length - 1];
    setTimeRange([timestamps[0], latestDate]);
    setDate(latestDate);
  }, [data]);

  useEffect(() => {
    echart?.dispose();

    renderChart(date);
  }, [date]);

  useUpdateEffect(() => {
    if (echart) {
      echart.resize();
    }
  }, [size?.width, size?.height]);

  const onChange: DatePickerProps["onChange"] = (date, dateString) => {
    setDate(dateString);
  };

  const disabledDate: DatePickerProps["disabledDate"] = (current) => {
    return (
      current &&
      current > moment(timeRange[1]) &&
      current < moment(timeRange[0])
    );
  };

  const getExtra = () => {
    return (
      <div>
        <DatePicker
          onChange={onChange}
          disabledDate={disabledDate}
          showToday={false}
          value={dayjs(date)}
        />
      </div>
    );
  };

  return (
    <div>
      <Card
        title={data.title}
        bordered={false}
        size="small"
        extra={getExtra()}
      />
      <div ref={echartRef} style={{ width: "100%", height: "560px" }} />
    </div>
  );
});
