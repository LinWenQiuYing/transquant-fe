/* eslint-disable prettier/prettier */
import { DataType, usePagination } from "@transquant/utils";
import { Table } from "antd";
import type { ColumnsType } from "antd/es/table";
import { observer } from "mobx-react";
import { useStores } from "../hooks";
import { Message } from "../types";
import "./index.less";
import OperatorMenu from "./OperatorMenu";
import SearchHeader from "./SearchHeader";

enum MessageType {
  "发布通知",
  "增量跟踪",
  "协作空间",
  "数据资源",
  "研究环境",
  "数据工程",
  "环境管理",
}

const columns: ColumnsType<DataType<Message>> = [
  {
    title: "时间",
    key: "createTime",
    dataIndex: "createTime",
    width: 180,
  },
  {
    title: "类型",
    key: "type",
    dataIndex: "type",
    width: 120,
    render: (_, { type }) => MessageType[type],
  },
  {
    title: "内容",
    key: "message",
    dataIndex: "message",
    width: 300,
  },
  {
    title: "操作",
    width: 100,
    key: "action",
    fixed: "right" as any,
    render: (text, record) => <OperatorMenu data={record} />,
  },
];

const getDataSource = (data: Message[] | undefined) => {
  if (!data) return [];

  return data.map((item) => ({
    key: item.id,
    ...item,
  }));
};

export default observer(function UserTable() {
  const {
    allMessages,
    tableLoading,
    getAllMessages,
    pagination,
    onPaginationChange,
  } = useStores().messageStore;

  return (
    <div>
      <Table
        size="small"
        columns={columns}
        loading={tableLoading}
        dataSource={getDataSource(allMessages?.list)}
        scroll={{ y: "calc(100vh - 320px)" }}
        pagination={{
          ...usePagination({
            total: allMessages?.total,
            IPageNum: pagination.pageNum,
            IPageSize: pagination.pageSize,
            onPaginationChange,
            onRequest() {
              getAllMessages();
            },
          }),
        }}
        title={() => <SearchHeader />}
      />
    </div>
  );
});
