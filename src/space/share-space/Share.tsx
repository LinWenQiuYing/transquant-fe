import { DataType, useDataSource } from "@transquant/utils";
import { Empty, Table } from "antd";
import type { ColumnsType } from "antd/es/table";
import { observer } from "mobx-react";
import { useStores } from "../hooks";
import { ShareItem, UserItem } from "../types";
import OperatorMenu from "./OperatorMenu";

export const SpaceStatus = {
  0: "未启动",
  1: "启动中",
  2: "固化中",
  3: "升级中",
  4: "销毁中",
  5: "重启中",
  6: "运行中",
  7: "资源申请中",
};

export default observer(function ShareList() {
  const { shareList, shareListLoading } = useStores().shareStore;
  const columns: ColumnsType<DataType<ShareItem>> = [
    {
      title: "空间名称",
      dataIndex: "name",
      key: "name",
      ellipsis: true,
      width: "20%",
    },
    {
      title: "成员",
      dataIndex: "userList",
      key: "userList",
      ellipsis: true,
      width: "20%",
      render(userList: UserItem[]) {
        return <>{userList.map((item) => item.realName).join(",")}</>;
      },
    },
    {
      title: "创建时间",
      dataIndex: "createTime",
      key: "createTime",
      ellipsis: true,
      width: "15%",
    },
    {
      title: "空间状态",
      dataIndex: "status",
      key: "status",
      ellipsis: true,
      width: "10%",
      render(status: keyof typeof SpaceStatus) {
        return SpaceStatus[status];
      },
    },
    {
      title: "备注",
      dataIndex: "remark",
      key: "remark",
      ellipsis: true,
      width: "25%",
    },
    {
      title: "操作",
      dataIndex: "action",
      key: "action",
      width: "10%",
      render(_, raw: ShareItem) {
        return <OperatorMenu data={raw} />;
      },
    },
  ];

  return (
    <Table
      columns={columns}
      dataSource={useDataSource<ShareItem>(shareList?.shareSpaceList)}
      size="small"
      loading={shareListLoading}
      pagination={false}
      style={{ minHeight: 300 }}
      scroll={{ y: "calc(100vh - 300px)" }}
      locale={{
        emptyText: <Empty description="请选择团队" />,
      }}
    />
  );
});
