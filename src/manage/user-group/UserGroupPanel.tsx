import { EditOutlined, SettingOutlined } from "@ant-design/icons";
import { IconFont, Permission as PermissionBtn } from "@transquant/ui";
import { Button, Card, Empty, Space } from "antd";
import { observer } from "mobx-react";
import { useState } from "react";
import { useStores } from "../hooks";
import Permission, { ResultValue } from "../permission";
import UserGroupModal from "./UserGroupModal";

export default observer(function UserGroupPanel() {
  const {
    selectedGroup,
    getAllPermissions4Group,
    permission,
    updateGroupPermission,
  } = useStores().userGroupStore;
  const [editVisible, setEditVisible] = useState(false);
  const [permissionVisible, setPermissionVisible] = useState(false);

  const onEdit = () => setEditVisible(true);

  const onPermissionChange = () => {
    setPermissionVisible(true);
    getAllPermissions4Group();
  };

  const extraEl = (
    <Space>
      <PermissionBtn code="B140102" hidden>
        <Button
          type="primary"
          disabled={!selectedGroup}
          onClick={onEdit}
          icon={<EditOutlined />}
          className={
            selectedGroup?.name === "超级管理员组" ? "hidden" : "visible"
          }
        >
          编辑
        </Button>
      </PermissionBtn>
      <PermissionBtn code="B140103" hidden>
        <Button
          type="primary"
          disabled={!selectedGroup}
          icon={<SettingOutlined />}
          onClick={onPermissionChange}
          className={
            selectedGroup?.name === "超级管理员组" ? "hidden" : "visible"
          }
        >
          权限设置
        </Button>
      </PermissionBtn>
    </Space>
  );

  const onOk = (data: ResultValue) => {
    updateGroupPermission(data).then(() => setPermissionVisible(false));
  };

  return (
    <Card title="用户组详情" extra={extraEl}>
      {selectedGroup ? (
        <div className="flex flex-col h-24 gap-4 min-h-24">
          <div className="text-2xl font-bold">
            <IconFont type="tuandui1" className="mr-2 text-red-600" />
            <span>{selectedGroup.name}</span>
          </div>
          <div>
            <span className="text-gray-400">用户组说明：</span>
            <span>{selectedGroup.description}</span>
          </div>
        </div>
      ) : (
        <Empty
          description="请选择用户组"
          className="h-24"
          imageStyle={{ height: 60 }}
        />
      )}
      {editVisible && (
        <UserGroupModal
          type="edit"
          data={{
            name: selectedGroup!.name,
            desc: selectedGroup!.description,
            id: selectedGroup!.id,
          }}
          visible={editVisible}
          onVisibleChange={setEditVisible}
        />
      )}
      {permissionVisible && permission && (
        <Permission
          permission={permission}
          visible={permissionVisible}
          onVisibleChange={setPermissionVisible}
          onOk={onOk}
        />
      )}
    </Card>
  );
});
