import { useDataSource } from "@transquant/utils";
import { useMount } from "ahooks";
import { Table } from "antd";
import type { ColumnsType } from "antd/es/table";
import { observer } from "mobx-react";
import { useStores } from "../hooks";
import { ShareEnv } from "../types";
import ShareSpaceOperatorMenu from "./ShareSpaceOperatorMenu";
import ShareSpaceSearchHeader from "./ShareSpaceSearchHeader";

const columns: ColumnsType<ShareEnv> = [
  {
    title: "协作空间名称",
    dataIndex: "name",
  },
  {
    title: "空间内人数",
    dataIndex: "count",
  },
  {
    title: "成员",
    dataIndex: "memberList",
    render: (value: string[]) => {
      return (
        <span>
          {value.map(
            (item, index) => `${item}${index !== value.length - 1 ? "、" : ""}`
          )}
        </span>
      );
    },
  },
  {
    title: "所属团队",
    dataIndex: "teamName",
    render(_, record: ShareEnv) {
      return <span>{record.teamName ?? "--"}</span>;
    },
  },
  {
    title: "内存上限（M）",
    dataIndex: "cpuMemLimit",
    render(_, record: ShareEnv) {
      return <span>{record.cpuMemLimit ?? "--"}</span>;
    },
  },
  {
    title: "CPU上限（Core）",
    dataIndex: "cpuCoreLimit",
    width: 180,
    render(_, record: ShareEnv) {
      return <span>{record.cpuCoreLimit ?? "-"}</span>;
    },
  },
  {
    title: "GPU显存（G）",
    dataIndex: "gpuMem",
  },
  {
    title: "操作",
    dataIndex: "action",
    render(_, record: ShareEnv) {
      return <ShareSpaceOperatorMenu env={record} />;
    },
  },
];

export default observer(function ShareSpaceTable() {
  const { getShareEnvList, shareEnvList } = useStores().environmentStore;

  useMount(() => {
    getShareEnvList();
  });

  return (
    <Table
      columns={columns}
      dataSource={useDataSource<ShareEnv>(shareEnvList)}
      scroll={{ y: "calc(100vh - 320px)", x: 1100 }}
      size="small"
      title={() => <ShareSpaceSearchHeader />}
    />
  );
});
