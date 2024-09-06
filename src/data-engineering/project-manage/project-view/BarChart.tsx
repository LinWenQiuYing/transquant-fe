import { clsPrefix } from "@transquant/constants";
import { ECOption, useEcharts } from "@transquant/utils";
import { Card, Empty } from "antd";
import { observer } from "mobx-react";
import { useEffect } from "react";
import { BarDataType } from "../../types";

const emptyCenterSylte: React.CSSProperties = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
};

interface ViewProps {
  title: string;
  data?: BarDataType;
}

export default observer(function BarChart(props: ViewProps) {
  const { title, data } = props;
  // const { projectInfo } = useStores().projectManageStore;

  const barOptions: ECOption = {
    backgroundColor: "transparent",
    tooltip: {
      show: true,
      className: `echarts-tooltip-light`,
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
      // axisLine: { show: false },
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
          color: "#bebebe",
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
        emphasis: {
          focus: "series",
        },
        itemStyle: {
          color: "#FFE6E5",
        },
        data: data?.userList.map((item) => ({
          value: item.number,
          name: item.status,
        })),
      },
    ],
  };

  const {
    domRef: barRef,
    update: barRefUpdate,
    chart: barChart,
  } = useEcharts<HTMLDivElement>(barOptions);

  barChart?.on("legendselectchanged", function (params: any) {
    const selectedTeams = Object.entries(params?.selected)
      .filter((item) => item[1])
      .map((item) => item[0]);

    const total = data?.userList.reduce((sum, curr) => {
      if (selectedTeams.includes(curr.status)) {
        sum += curr.number;
      } else {
        sum += 0;
      }
      return sum;
    }, 0);

    barChart.setOption({
      title: {
        text: total,
      },
    });
  });

  useEffect(() => {
    barRefUpdate(barOptions);
  }, [data]);

  return (
    <Card title={title} className={`${clsPrefix}-project-view-item bar-chart`}>
      <div
        ref={barRef}
        style={{ height: 300 }}
        className={`${clsPrefix}-project-view-item-bar`}
      />
      {!data?.count && (
        <Empty style={emptyCenterSylte} description="暂无数据" />
      )}
    </Card>
  );
});
