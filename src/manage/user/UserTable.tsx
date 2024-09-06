/* eslint-disable prettier/prettier */
import { PopoverTag } from "@transquant/common";
import { clsPrefix } from "@transquant/constants";
import { DataType } from "@transquant/utils";
import { useMount } from "ahooks";
import { Table, Tooltip } from "antd";
import { ColumnsType } from "antd/es/table";
import classNames from "classnames";
import { observer } from "mobx-react";
import { useState } from "react";
import { useStores } from "../hooks";
import usePagination from "../hooks/usePagination";
import { UserItem } from "../types";
import "./index.less";
import OperatorMenu from "./OperatorMenu";
import UserModal from "./UserModal";

export enum UserStatus {
  "正常" = 0,
  "删除" = 1,
  "停用" = 2,
  "挂起" = 3,
}

const columns: ColumnsType<DataType<UserItem>> = [
  {
    title: "ID",
    key: "id",
    dataIndex: "id",
    width: 200,
    fixed: "left",
  },
  {
    title: "用户名",
    key: "username",
    dataIndex: "username",
    width: 200,
  },
  {
    title: "姓名",
    key: "realName",
    dataIndex: "realName",
    width: 200,
  },
  {
    title: "所属团队",
    key: "teams",
    dataIndex: "teams",
    width: 300,
    render: (_, { teams }) => <PopoverTag tags={teams} />,
  },
  {
    title: "邮箱",
    key: "email",
    dataIndex: "email",
    width: 200,
  },
  {
    title: "添加时间",
    key: "createTime",
    dataIndex: "createTime",
    width: 200,
  },
  {
    title: "用户状态",
    key: "status",
    dataIndex: "status",
    width: 200,
    render: (status: UserStatus) => {
      return (
        <span
          className={classNames(`${clsPrefix}-status`, {
            success: status === UserStatus.正常,
            error: status === UserStatus.停用,
            pending: status === UserStatus.挂起,
          })}
        >
          {status === UserStatus.挂起 ? (
            <Tooltip title="需修改密码，满足系统安全策略">
              {UserStatus[status]}
            </Tooltip>
          ) : (
            UserStatus[status]
          )}
        </span>
      );
    },
  },
  {
    title: "操作",
    width: 200,
    key: "action",
    fixed: "right",
    render: (_: any, row: any) => <OperatorMenu data={row} />,
  },
];

const getDataSource = (data: UserItem[]) => {
  return data.map((item) => ({
    key: item.id,
    ...item,
  }));
};

export default observer(function UserTable() {
  const [userModalVisible, setUserModalVisible] = useState(false);

  const { filterAllUsers, loading, getAllUsers } = useStores().userStore;

  useMount(() => {
    getAllUsers();
  });

  return (
    <div>
      <Table
        size="small"
        columns={columns}
        loading={loading}
        dataSource={getDataSource(filterAllUsers)}
        scroll={{ y: "calc(100vh - 320px)", x: 1100 }}
        pagination={{
          ...usePagination({
            total: filterAllUsers.length,
          }),
        }}
      />
      {userModalVisible && (
        <UserModal
          title="编辑用户"
          visible={userModalVisible}
          onVisibleChange={(visible: boolean) => setUserModalVisible(visible)}
        />
      )}
    </div>
  );
});
