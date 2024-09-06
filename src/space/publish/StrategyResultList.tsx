import { PopoverTag } from "@transquant/common";
import { DataType } from "@transquant/utils";
import { Table } from "antd";
import type { ColumnsType } from "antd/es/table";
import { observer } from "mobx-react";
import { useDataSource, useStores } from "../hooks";
import { StrategyLibItem } from "../types";

const columns: ColumnsType<DataType<StrategyLibItem>> = [
  {
    title: "类名",
    dataIndex: "className",
    width: 200,
  },
  {
    title: "策略名称",
    dataIndex: "name",
    width: 200,
  },
  {
    title: "标签",
    key: "tags",
    dataIndex: "tags",
    width: 300,
    render: (_, { tags }) => <PopoverTag tags={tags} />,
  },
  {
    title: "修改时间",
    dataIndex: "srcUpdateTime",
    width: 200,
  },
  {
    title: "回测时间",
    dataIndex: "triggerTime",
    width: 200,
  },
  {
    title: "回测时间区间",
    dataIndex: "timeRange",
    width: 200,
  },
  {
    title: "年化收益率",
    dataIndex: "annStrategyReturn",
    width: 200,
  },
  {
    title: "Alpha",
    dataIndex: "alpha",
    width: 200,
  },
  {
    title: "Beta",
    dataIndex: "beta",
    width: 200,
  },
  {
    title: "基准",
    dataIndex: "benchmark",
    width: 200,
  },
  {
    title: "基准年化收益",
    dataIndex: "annBenchmarkReturn",
    width: 200,
  },
  {
    title: "夏普率",
    dataIndex: "sharpRatio",
    width: 200,
  },
  {
    title: "索提诺比率",
    dataIndex: "sortinoRatio",
    width: 200,
  },
  {
    title: "最大回撤",
    dataIndex: "maxDrawdown",
    width: 200,
  },
  {
    title: "最大回撤区间",
    dataIndex: "maxDrawdownRange",
    width: 200,
  },
  {
    title: "波动率",
    dataIndex: "volatility",
    width: 200,
  },
];
export default observer(function StrategyResultList() {
  const { strategyResultList } = useStores().strategyResearchStore;
  return (
    <Table
      columns={columns}
      dataSource={useDataSource<StrategyLibItem>(strategyResultList)}
      pagination={false}
      scroll={{ x: 2400, y: 200 }}
    />
  );
});
