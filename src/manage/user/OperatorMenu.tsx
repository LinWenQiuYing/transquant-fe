import { MoreOutlined } from "@ant-design/icons";
import { getAccess, IconFont, Permission } from "@transquant/ui";
import { DataType } from "@transquant/utils";
import {
  Divider,
  Dropdown,
  MenuProps,
  Modal,
  Space,
  Tooltip,
  Typography,
} from "antd";
import { observer } from "mobx-react";
import { MenuClickEventHandler } from "rc-menu/lib/interface";
import { useState } from "react";
import { useStores } from "../hooks";
import { UserItem } from "../types";
import ConfigEnv from "./ConfigEnv";
import PermissionModal from "./PerssionModal";
import UserModal from "./UserModal";

interface OperatorMenuProps {
  data: DataType<UserItem>;
}

export default observer(function OperatorMenu(props: OperatorMenuProps) {
  const { data } = props;
  const {
    deleteUser,
    getAllMenus,
    getUserDBPermission,
    getMenuAuthByUserId,
    onPermissionLoadingChange,
    getEnvTemplates,
  } = useStores().userStore;
  // 编辑用户弹框
  const [userModalVisible, setUserModalVisible] = useState(false);
  // 配置环境弹框
  const [configEnvVisible, setConfigEnvVisible] = useState(false);
  // 用户权限弹框
  const [permissionVisible, setPermissionVisible] = useState(false);

  const onDelete = () => {
    Modal.confirm({
      title: (
        <div>
          是否确认删除用户
          <span style={{ color: "var(--red-600)" }}>「{data.username}」</span>？
        </div>
      ),
      onOk: () => {
        deleteUser(data.id);
      },
    });
  };

  const items: MenuProps["items"] = [
    {
      key: "edit",
      label: "编辑",
      disabled: !getAccess("B130105"),
    },
    {
      key: "delete",
      label: !data.canDel ? (
        <Tooltip title="该用户为团队审核员，无法删除">删除</Tooltip>
      ) : (
        "删除"
      ),
      disabled: !getAccess("B130106") || !data.canDel,
    },
  ];

  const onItemClick: MenuClickEventHandler = async (info) => {
    switch (info.key) {
      case "edit":
        setUserModalVisible(true);
        break;
      case "delete":
        onDelete();
        break;
      default:
        break;
    }
  };

  const onView = async () => {
    setPermissionVisible(true);
    try {
      await getAllMenus();
      await getUserDBPermission(data.id);
      await getMenuAuthByUserId(data.id);
    } finally {
      onPermissionLoadingChange(false);
    }
  };

  return (
    <>
      <Space>
        <Permission code="B130103" disabled>
          <Tooltip title="配置环境">
            <Typography.Link
              onClick={() => {
                getEnvTemplates();
                setConfigEnvVisible(true);
              }}
            >
              <IconFont type="peizhihuanjing" />
            </Typography.Link>
          </Tooltip>
        </Permission>
        <Divider type="vertical" />
        <Permission code="B130104" disabled>
          <Tooltip title="查看权限">
            <Typography.Link onClick={onView}>
              <IconFont type="chakanquanxian" />
            </Typography.Link>
          </Tooltip>
        </Permission>
        <Divider type="vertical" />
        <Tooltip title="更多">
          <Dropdown menu={{ items, onClick: onItemClick }}>
            <Typography.Link>
              <MoreOutlined style={{ rotate: "90deg" }} />
            </Typography.Link>
          </Dropdown>
        </Tooltip>
      </Space>

      {userModalVisible && (
        <UserModal
          title="编辑用户"
          visible={userModalVisible}
          data={data}
          onVisibleChange={(visible: boolean) => setUserModalVisible(visible)}
        />
      )}

      {configEnvVisible && (
        <Modal
          title="配置环境"
          open={configEnvVisible}
          destroyOnClose
          maskClosable={false}
          onCancel={() => setConfigEnvVisible(false)}
          onOk={() => setConfigEnvVisible(false)}
          width="80%"
          footer={null}
        >
          <ConfigEnv data={{ ...data, type: 0 }} />
        </Modal>
      )}
      {permissionVisible && (
        <PermissionModal
          visible={permissionVisible}
          onVisibleChange={(value) => setPermissionVisible(value)}
        />
      )}
    </>
  );
});
