import { clsPrefix } from "@transquant/constants";
import { ECOption, useEcharts } from "@transquant/utils";
import { useMount } from "ahooks";
import { Card, DatePicker, Table } from "antd";
import { observer } from "mobx-react";
import { useEffect, useState } from "react";
import { useStores } from "../../hooks";
import { PieDataType, ViewItemType } from "../../types";

interface ViewProps {
  title: string;
  style: React.CSSProperties;
}

const { RangePicker } = DatePicker;

const presetColor = [
  "#8BDBAF",
  "#A2E56F",
  "#91CAFF",
  "#97A3B7",
  "#FFB882",
  "#FF9195",
  "#ADECFF",
  "#A2B5E8",
  "#CBAFF0",
  "#E69BEB",
  "#FEDC91",
];

const columns = [
  {
    title: "序号",
    key: "index",
    dataIndex: "index",
    width: 45,
  },
  {
    title: "数量",
    key: "number",
    dataIndex: "number",
    width: 60,
  },
  {
    title: "状态",
    key: "status",
    dataIndex: "status",
    ellipsis: true,
  },
];

const getDataSource = (data?: ViewItemType[]) => {
  if (!data) return [];

  return data.map((item, index: number) => ({
    key: item.status,
    index: index + 1,
    ...item,
  }));
};

export default observer(function PieChart(props: ViewProps) {
  const { title, style } = props;
  const {
    getProcessStateCount,
    getTaskStateCount,
    projectInfo,
    flowStatusOptions,
    taskStatusOptions,
  } = useStores().projectManageStore;
  const [pieData, setPieData] = useState<PieDataType>();

  const pieOptions: ECOption = {
    title: {
      text: `${pieData?.total}`,
      subtext: "总数",
      left: "48%",
      top: "70",
      textAlign: "center",
      textStyle: {
        fontSize: 28,
      },
    },
    color: presetColor,
    tooltip: {
      trigger: "item",
    },
    legend: {
      top: "240",
      left: "center",
    },
    series: [
      {
        type: "pie",
        radius: ["35%", "60%"],
        center: ["50%", "100"],
        avoidLabelOverlap: false,
        label: {
          show: false,
          position: "center",
        },
        labelLine: {
          show: false,
        },
        data: pieData?.data?.map((item) => ({
          value: item.number,
          name: item.status,
        })),
      },
    ],
  };

  const {
    domRef: pieRef,
    update: pieRefUpdate,
    chart: pieChart,
  } = useEcharts<HTMLDivElement>(pieOptions);

  pieChart?.on("legendselectchanged", function (params: any) {
    const selectedTeams = Object.entries(params?.selected)
      .filter((item) => item[1])
      .map((item) => item[0]);

    const total = pieData?.data.reduce((sum, curr) => {
      if (selectedTeams.includes(curr.status)) {
        sum += curr.number;
      } else {
        sum += 0;
      }
      return sum;
    }, 0);

    pieChart.setOption({
      title: {
        text: total,
      },
    });
  });

  useEffect(() => {
    pieRefUpdate(pieOptions);
  }, [pieData]);

  const getData = async (dateString?: string[]) => {
    let data1: any = {};
    let data2: any = {};
    if (title === "任务实例状态统计") {
      if (dateString) {
        data1 = await getTaskStateCount(
          `${dateString[0]} 00:00:00`,
          `${dateString[1]} 00:00:00`
        );
      } else {
        data1 = await getTaskStateCount();
      }
      data2 = {
        total: data1.totalCount,
        data: data1.taskInstanceStatusCounts.map((item: any) => {
          const status = taskStatusOptions.find((v) => v.value === item.state);
          return {
            number: item.count,
            status: status?.label,
          };
        }),
      };
    } else {
      if (dateString) {
        data1 = await getProcessStateCount(
          `${dateString[0]} 00:00:00`,
          `${dateString[1]} 00:00:00`
        );
      } else {
        data1 = await getProcessStateCount();
      }
      data2 = {
        total: data1.totalCount,
        data: data1.workflowInstanceStatusCounts.map((item: any) => {
          const status = flowStatusOptions.find((v) => v.value === item.state);
          return {
            number: item.count,
            status: status?.label,
          };
        }),
      };
    }
    setPieData(data2);
  };

  useMount(async () => {
    if (projectInfo && projectInfo.code) {
      getData();
    }
  });

  const extraEl = (
    <RangePicker
      format="YYYY-MM-DD"
      onChange={async (_value, dateString) => {
        if (!projectInfo) return;
        getData(dateString);
      }}
    />
  );

  return (
    <Card
      title={title}
      extra={extraEl}
      className={`${clsPrefix}-project-view-item pie-chart`}
      style={style}
    >
      <div
        ref={pieRef}
        style={{ height: 300 }}
        className={`${clsPrefix}-project-view-item-pie`}
      />
      <Table
        size="small"
        columns={columns}
        className={`${clsPrefix}-project-view-item-table`}
        dataSource={getDataSource(pieData?.data)}
        pagination={false}
      />
    </Card>
  );
});
