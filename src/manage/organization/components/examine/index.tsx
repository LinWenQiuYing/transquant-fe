import { PopoverTag } from "@transquant/common";
import { CategoryEmum } from "@transquant/person/publish/approve-record";
import { useDataSource } from "@transquant/space/hooks";
import { DataType } from "@transquant/utils";
import { useMount } from "ahooks";
import { Table } from "antd";
import type { ColumnsType } from "antd/es/table";
import { observer } from "mobx-react";
import { useStores } from "../../../hooks";
import { Examine } from "../../../types";
import OperatorMenu from "./OperatorMenu";

const columns: ColumnsType<DataType<Examine>> = [
  {
    title: "流程",
    dataIndex: "process",
    key: "process",
    width: "15%",
    ellipsis: true,
  },
  {
    title: "审核方式",
    dataIndex: "category",
    key: "category",
    width: "15%",
    ellipsis: true,
    render(value) {
      return <span>{CategoryEmum[value]}</span>;
    },
  },
  {
    title: "审核员",
    dataIndex: "auditors",
    key: "auditors",
    width: "30%",
    ellipsis: true,
    render: (menus: string[]) => <PopoverTag tags={menus} />,
  },
  {
    title: "可发布人员",
    dataIndex: "publishers",
    key: "publishers",
    width: "30%",
    ellipsis: true,
    render: (menus: string[]) => <PopoverTag tags={menus} />,
  },
  {
    title: "操作",
    dataIndex: "action",
    key: "action",
    width: "10%",
    render: (_: any, raw: DataType<Examine>) => <OperatorMenu data={raw} />,
  },
];

export default observer(function Examine() {
  const { examine, getProcessConfig } = useStores().organizationStore;
  useMount(() => {
    getProcessConfig();
  });

  return (
    <Table
      bordered
      size="small"
      dataSource={useDataSource<Examine>(examine)}
      columns={columns}
      pagination={false}
      scroll={{ y: "calc(100vh - 500px)" }}
    />
  );
});
