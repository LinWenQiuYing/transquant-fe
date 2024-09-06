import { clsPrefix } from "@transquant/constants";
import { Table, Tooltip } from "antd";
import classNames from "classnames";
import { observer } from "mobx-react";
import { useState } from "react";
import { useStores } from "../../../hooks";
import usePagination from "../../../hooks/usePagination";
import { MemberItem, Role } from "../../../types";
import MemberModal from "./MemberModal";
import OperatorMenu from "./OperatorMenu";

export enum MemberStatus {
  "正常" = 0,
  "删除" = 1,
  "停用" = 2,
  "挂起" = 3,
}

const columns = [
  {
    title: "姓名",
    key: "realName",
    dataIndex: "realName",
    ellipsis: true,
  },
  {
    title: "用户名",
    key: "username",
    dataIndex: "username",
    ellipsis: true,
  },
  {
    title: "角色",
    key: "roles",
    dataIndex: "roles",
    ellipsis: true,
    render: (roles: Role[]) => {
      return (
        <div>
          {roles.map((role, index) => (
            <span key={role.id} title={role.name}>
              {role.name}
              {index === roles.length - 1 ? "" : "、"}
            </span>
          ))}
        </div>
      );
    },
  },
  {
    title: "添加时间",
    key: "createTime",
    ellipsis: true,
    dataIndex: "createTime",
  },
  {
    title: "用户状态",
    key: "status",
    dataIndex: "status",
    ellipsis: true,
    render: (status: MemberStatus) => {
      return (
        <span
          className={classNames(`${clsPrefix}-status`, {
            success: status === MemberStatus.正常,
            error: status === MemberStatus.停用,
            pending: status === MemberStatus.挂起,
          })}
        >
          {status === MemberStatus.挂起 ? (
            <Tooltip title="需修改密码，满足系统安全策略">
              {MemberStatus[status]}
            </Tooltip>
          ) : (
            MemberStatus[status]
          )}
        </span>
      );
    },
  },
  {
    title: "操作",
    width: 100,
    key: "action",
    fixed: "right" as any,
    render: (_: any, row: any) => <OperatorMenu data={row} />,
  },
];

const getDataSource = (data?: MemberItem[]) => {
  if (!data) return [];

  return data.map((item) => ({
    key: item.id,
    ...item,
  }));
};

export default observer(function RoleTable() {
  const [memberModalVisible, setMemberModalVisible] = useState(false);

  const { memberTable, memeberTableLoading, getMembersByTeam, selectedGroup } =
    useStores().organizationStore;

  return (
    <div>
      <Table
        size="small"
        columns={columns}
        loading={memeberTableLoading}
        dataSource={getDataSource(memberTable?.list)}
        scroll={{ y: "calc(100vh - 500px)" }}
        pagination={{
          ...usePagination({
            total: memberTable?.total,
            id: selectedGroup?.id,
            onRequest(pageIndex, pageSize) {
              if (!selectedGroup) return;
              getMembersByTeam({
                pageIndex,
                pageSize,
                teamId: selectedGroup.id,
              });
            },
          }),
        }}
      />
      {memberModalVisible && (
        <MemberModal
          title="新增角色"
          visible={memberModalVisible}
          onVisibleChange={(visible: boolean) => setMemberModalVisible(visible)}
        />
      )}
    </div>
  );
});
