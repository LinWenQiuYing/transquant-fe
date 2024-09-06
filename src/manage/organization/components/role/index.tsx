import { clsPrefix } from "@transquant/constants";
import { Table } from "antd";
import { observer } from "mobx-react";
import { useState } from "react";
import { useStores } from "../../../hooks";
import usePagination from "../../../hooks/usePagination";
import { IRoleItem } from "../../../types";
import OperatorMenu from "./OperatorMenu";
import RoleModal from "./RoleModal";

export enum MemberStatus {
  "正常" = 0,
  "删除" = 1,
  "停用" = 2,
  "挂起" = 3,
}

const columns = [
  {
    title: "角色名",
    key: "name",
    dataIndex: "name",
    width: "25%",
    ellipsis: true,
  },
  {
    title: "角色描述",
    key: "description",
    ellipsis: true,
    dataIndex: "description",
    width: "25%",
    render: (description: string) => {
      return (
        <div className={`${clsPrefix}-ellipsis`} title={description}>
          {description}
        </div>
      );
    },
  },
  {
    title: "操作",
    width: "10%",
    key: "action",
    fixed: "right" as any,
    render: (_: any, row: any) => <OperatorMenu data={row} />,
  },
];

const getDataSource = (data?: IRoleItem[]) => {
  if (!data) return [];

  return data.map((item) => ({
    key: item.id,
    ...item,
  }));
};

export default observer(function MemberTable() {
  const [roleModalVisible, setRoleModalVisible] = useState(false);

  const { roleTableLoading, getRolesByTeam, roleTable, selectedGroup } =
    useStores().organizationStore;

  return (
    <div>
      <Table
        size="small"
        columns={columns}
        loading={roleTableLoading}
        dataSource={getDataSource(roleTable?.list)}
        scroll={{ y: "calc(100vh - 500px)" }}
        pagination={{
          ...usePagination({
            total: roleTable?.total,
            id: selectedGroup?.id,
            onRequest(pageIndex, pageSize) {
              if (!selectedGroup) return;
              getRolesByTeam({
                pageIndex,
                pageSize,
                teamId: selectedGroup!.id,
              });
            },
          }),
        }}
      />
      {roleModalVisible && (
        <RoleModal
          title="新增成员"
          visible={roleModalVisible}
          onVisibleChange={(visible: boolean) => setRoleModalVisible(visible)}
        />
      )}
    </div>
  );
});
