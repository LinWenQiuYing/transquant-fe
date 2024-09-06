import { useDataSource } from "@transquant/utils";
import { useMount } from "ahooks";
import { Table, Tag } from "antd";
import type { ColumnsType } from "antd/es/table";
import { observer } from "mobx-react";
import { useStores } from "../hooks";
import { Environment } from "../types/environment";
import EnvironmentOperatorMenu from "./EnvironmentOperatorMenu";
import EnvSearchHeader from "./EnvSearchHeader";

const compatibleRender = (text: string) => <span>{text ?? "--"}</span>;

const columns: ColumnsType<Environment> = [
  {
    title: "环境名称",
    dataIndex: "name",
  },
  {
    title: "环境类型",
    dataIndex: "envType",
    render(envType: number) {
      return <Tag color="red">{envType === 0 ? "个人" : "团队"}</Tag>;
    },
  },
  {
    title: "所属个人",
    dataIndex: "userName",
    render: compatibleRender,
  },
  {
    title: "所属团队",
    dataIndex: "teamName",
    render: compatibleRender,
  },
  {
    title: "内存上限（M）",
    dataIndex: "memory",
    render(_, record: Environment) {
      return <span>{record.cpuMemLimit ?? "-"}</span>;
    },
  },
  {
    title: "CPU上限（Core）",
    dataIndex: "cpu",
    width: 180,
    render(_, record: Environment) {
      return <span>{record.cpuCoreLimit ?? "-"}</span>;
    },
  },
  {
    title: "GPU显存（G）",
    dataIndex: "gpuMem",
    render(_, record: Environment) {
      return <span>{record.gpuMem ?? "-"}</span>;
    },
  },
  {
    title: "部署服务器",
    dataIndex: "node",
  },
  {
    title: "操作",
    dataIndex: "action",
    render(_, record: Environment) {
      return <EnvironmentOperatorMenu env={record} />;
    },
  },
];

export default observer(function EnvironmentTable() {
  const { getManagedEnvList, envList, getNodeList } =
    useStores().environmentStore;

  useMount(() => {
    getManagedEnvList();
    getNodeList();
  });

  return (
    <Table
      columns={columns}
      dataSource={useDataSource<Environment>(envList)}
      scroll={{ y: "calc(100vh - 320px)", x: 1100 }}
      size="small"
      title={() => <EnvSearchHeader />}
    />
  );
});
