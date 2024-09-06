import { useDataSource } from "@transquant/utils";
import { Modal, Spin, Table, Tabs, TabsProps, Tree } from "antd";
import type { ColumnsType } from "antd/es/table";
import { DataNode } from "antd/es/tree";
import { toJS } from "mobx";
import { observer } from "mobx-react";
import { useEffect, useState } from "react";
import { useStores } from "../hooks";
import { PageMenuItem, UserPermission } from "../types";

export enum PermissionEnum {
  Page = "page",
  Data = "data",
}

interface PermissionModalProps {
  visible: boolean;
  onVisibleChange: (value: boolean) => void;
}

const getTreeData = (menus: PageMenuItem[]): DataNode[] => {
  return menus.map((menu) => ({
    title: menu.name,
    key: menu.code,
    children: getTreeData(menu.children),
  }));
};

const DataPermission = observer(() => {
  const { userPermission, permissionLoading } = useStores().userStore;

  const columns: ColumnsType<UserPermission> = [
    {
      title: "数据库",
      dataIndex: "db",
      width: "25%",
    },
    {
      title: "表",
      dataIndex: "table",
      render(value) {
        return <span>{value || "--"}</span>;
      },
      width: "25%",
    },
    {
      title: "权限",
      dataIndex: "permissions",
      width: "50%",
      render: (permissions: string[] = []) => {
        return (
          <div>
            {permissions.map((permission, index) => (
              <span key={permission}>
                {permission}
                {index === permissions.length - 1 ? "" : "、"}
              </span>
            ))}
          </div>
        );
      },
    },
  ];

  return (
    <Table
      size="small"
      columns={columns}
      loading={permissionLoading}
      dataSource={useDataSource<UserPermission>(userPermission)}
      bordered
      scroll={{ y: 400 }}
    />
  );
});

const PagePermission = observer(() => {
  const { allMenus, userMenuPermissions, permissionLoading } =
    useStores().userStore;

  const [expandedKeys, setExpandedKeys] = useState<string[]>([]);

  useEffect(() => {
    const keys: string[] = [];
    function getKeys(menus: PageMenuItem[]) {
      menus.forEach((menu) => {
        keys.push(menu.code);
        if (menu.children.length) {
          getKeys(menu.children);
        }
      });
    }
    getKeys(allMenus);
    setExpandedKeys(keys);
  }, [allMenus]);

  const onExpand = (newExpandedKeys: React.Key[]) => {
    setExpandedKeys(newExpandedKeys as string[]);
  };

  return (
    <Spin spinning={permissionLoading}>
      <Tree
        checkable
        disabled
        checkedKeys={[...toJS(userMenuPermissions), "B100102"]}
        style={{ minHeight: 500 }}
        expandedKeys={expandedKeys}
        onExpand={onExpand}
        treeData={getTreeData(allMenus)}
        height={500}
        blockNode
        showLine
      />
    </Spin>
  );
});

export default function PerssionModal(props: PermissionModalProps) {
  const { visible, onVisibleChange } = props;
  const items: TabsProps["items"] = [
    {
      key: PermissionEnum.Page,
      label: "界面权限",
      children: <PagePermission />,
    },
    {
      key: PermissionEnum.Data,
      label: "数据权限",
      children: <DataPermission />,
    },
  ];
  return (
    <Modal
      title="用户权限"
      destroyOnClose
      open={visible}
      onCancel={() => onVisibleChange(false)}
      footer={null}
      width={800}
    >
      <Tabs items={items} defaultActiveKey={PermissionEnum.Page} />
    </Modal>
  );
}
