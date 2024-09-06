import { DeleteOutlined, SettingOutlined } from "@ant-design/icons";
import Permission, { ResultValue } from "@transquant/manage/permission";
import { Permission as PermissionBtn } from "@transquant/ui";
import { DataType } from "@transquant/utils";
import { Divider, Modal, Space, Tooltip, Typography } from "antd";
import { observer } from "mobx-react";
import { useState } from "react";
import { useStores } from "../../../hooks";
import { IRoleItem } from "../../../types";

interface OperatorMenuProps {
  data: DataType<IRoleItem>;
}

export default observer(function OperatorMenu(props: OperatorMenuProps) {
  const { data } = props;
  const {
    deleteRoleOfTeam,
    selectedGroup,
    permission,
    getAllPermissions4Roles,
    updateRolePermission,
  } = useStores().organizationStore;
  const [permissionVisible, setPermissionVisible] = useState(false);

  const onRemove = () => {
    Modal.confirm({
      title: "删除角色",
      content:
        "该操作不会删除用户，仅为删除角色。删除角色后，该角色用户将不再属于该部门，不再拥有该角色及其权限。",
      onOk: () => {
        deleteRoleOfTeam(data.id);
      },
    });
  };

  const onSetting = async () => {
    if (!selectedGroup) return;
    getAllPermissions4Roles(data.id);
    setPermissionVisible(true);
  };

  const onOk = (value: ResultValue) => {
    updateRolePermission(value, data.id).then(() =>
      setPermissionVisible(false)
    );
  };

  return (
    <>
      <Space>
        <PermissionBtn code="B150110" disabled>
          <Tooltip title="权限设置">
            <Typography.Link onClick={onSetting}>
              <SettingOutlined />
            </Typography.Link>
          </Tooltip>
        </PermissionBtn>

        <Divider type="vertical" />
        <PermissionBtn code="B150111" disabled>
          <Tooltip title="删除">
            <Typography.Link onClick={onRemove}>
              <DeleteOutlined />
            </Typography.Link>
          </Tooltip>
        </PermissionBtn>
      </Space>

      {permissionVisible && permission && (
        <Permission
          permission={permission}
          visible={permissionVisible}
          onVisibleChange={setPermissionVisible}
          onOk={onOk}
        />
      )}
    </>
  );
});
