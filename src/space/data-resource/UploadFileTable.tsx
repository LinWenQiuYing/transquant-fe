import { useDataSource } from "@transquant/utils";
import { Table } from "antd";
import type { ColumnsType } from "antd/es/table";
import { observer } from "mobx-react";
import { useStores } from "../hooks";
import { UploadHistoryItem } from "../types";

enum UploadStatusEnum {
  "准备上传",
  "上传中",
  "上传成功",
  "上传失败",
}

const columns: ColumnsType<UploadHistoryItem> = [
  {
    title: "时间",
    dataIndex: "updateTime",
    key: "updateTime",
  },
  {
    title: "操作人",
    dataIndex: "realName",
    key: "realName",
  },
  {
    title: "文件名",
    dataIndex: "fileName",
    key: "fileName",
  },
  {
    title: "状态",
    dataIndex: "status",
    key: "status",
    render(status: number) {
      return <span>{UploadStatusEnum[status]}</span>;
    },
  },
];

export default observer(function UploadFileTable() {
  const { uploadHistoryList, uploadHistoryListLoading } =
    useStores().dataResourceStore;

  return (
    <Table
      columns={columns}
      dataSource={useDataSource<UploadHistoryItem>(uploadHistoryList)}
      loading={uploadHistoryListLoading}
    />
  );
});
