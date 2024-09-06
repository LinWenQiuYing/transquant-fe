import { PopoverTag } from "@transquant/common";
import { DataType } from "@transquant/utils";
import { Table } from "antd";
import type { ColumnsType } from "antd/es/table";
import { observer } from "mobx-react";
import { useDataSource, useStores } from "../hooks";
import { FactorResultItem } from "../types";

const columns: ColumnsType<DataType<FactorResultItem>> = [
  {
    title: "类名",
    dataIndex: "className",
    width: 200,
    fixed: "left" as "left",
  },
  {
    title: "因子名称",
    dataIndex: "name",
    width: 200,
  },
  {
    title: "标签",
    key: "tags",
    dataIndex: "tags",
    width: 300,
    ellipsis: true,
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
    title: "IC",
    dataIndex: "ic",
    width: 200,
  },
  {
    title: "IR",
    dataIndex: "ir",
    width: 200,
  },
  {
    title: "因子年化收益率",
    dataIndex: "annFactorReturn",
    width: 200,
  },
];
export default observer(function FactorResultList() {
  const { factorResultList } = useStores().factorResearchStore;
  return (
    <Table
      columns={columns}
      dataSource={useDataSource<FactorResultItem>(factorResultList)}
      pagination={false}
      scroll={{ x: 1200, y: 200 }}
    />
  );
});
