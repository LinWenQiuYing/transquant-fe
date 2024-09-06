import { DataType, useDataSource } from "@transquant/utils";
import { useMount } from "ahooks";
import { Table, TableProps } from "antd";
import { observer } from "mobx-react";
import { useStores } from "../hooks";
import { InstallEvent } from "../types";

const columns: TableProps<DataType<InstallEvent>>["columns"] = [
  {
    title: "执行时间",
    dataIndex: "executeTime",
    key: "executeTime",
    width: "20%",
    ellipsis: true,
  },
  {
    title: "版本名",
    dataIndex: "version",
    key: "version",
    width: "20%",
    ellipsis: true,
  },
  {
    title: "已安装环境数",
    dataIndex: "installedCount",
    key: "installedCount",
    width: "20%",
    ellipsis: true,
  },
  {
    title: "不安装环境数",
    dataIndex: "notInstalledCount",
    key: "notInstalledCount",
    width: "20%",
    ellipsis: true,
  },
  {
    title: "总环境数",
    dataIndex: "totalCount",
    key: "totalCount",
    width: "20%",
    ellipsis: true,
  },
];

export default observer(function NoticeRecord() {
  const { getInstallEvents, installEvents, eventLoading } =
    useStores().systemStore;

  useMount(() => {
    getInstallEvents();
  });

  return (
    <div>
      <div className="flex justify-between mb-2">
        <span className="flex font-bold text-sm float-start">
          <div className="bg-red-600 w-[2px] h-4 relative mr-1 top-[2px]" />
          统一提醒记录
        </span>
      </div>
      <Table
        bordered
        size="small"
        loading={eventLoading}
        columns={columns}
        scroll={{ y: 200 }}
        pagination={false}
        dataSource={useDataSource(installEvents)}
      />
    </div>
  );
});
