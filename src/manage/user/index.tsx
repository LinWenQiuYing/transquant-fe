import { PlusOutlined } from "@ant-design/icons";
import { useStores as useAppStore } from "@transquant/app/hooks";
import { BreadcrumbItem, ContentPanel, TitlePanel } from "@transquant/common";
import { clsPrefix, collapsedStyle, normalStyle } from "@transquant/constants";
import { Permission } from "@transquant/ui";
import { useUnmount } from "ahooks";
import { Button, Input, Space } from "antd";
import { observer } from "mobx-react";
import { useState } from "react";
import { useStores } from "../hooks";
import { defaultRoutes } from "./helpers";
import "./index.less";
import UserModal from "./UserModal";
import UserTable from "./UserTable";

export default observer(function UserManage() {
  const { collapsed } = useAppStore().appStore;
  const { createLoading, onSearchValueChange } = useStores().userStore;
  const [userModalVisible, setUserModalVisible] = useState(false);

  const getBreadcrumbItems = () => {
    const items: BreadcrumbItem[] = defaultRoutes;

    return items;
  };

  useUnmount(() => {
    onSearchValueChange("");
  });

  const extraEl = (
    <Space>
      <Input.Search
        style={{ width: 300 }}
        placeholder="请输入用户名"
        onChange={(e) => onSearchValueChange(e.target.value)}
      />
      <Permission code="B130102" hidden>
        <Button
          type="primary"
          loading={createLoading}
          icon={<PlusOutlined />}
          onClick={() => setUserModalVisible(true)}
        >
          添加
        </Button>
      </Permission>
    </Space>
  );

  return (
    <Permission code="user">
      <div className={`${clsPrefix}-user`}>
        <ContentPanel
          title={
            <TitlePanel
              items={getBreadcrumbItems()}
              style={collapsed ? collapsedStyle : normalStyle}
            />
          }
          cardTitle="用户列表"
          extra={extraEl}
          content={<UserTable />}
        />
        <UserModal
          title="添加用户"
          visible={userModalVisible}
          onVisibleChange={(value) => setUserModalVisible(value)}
        />
      </div>
    </Permission>
  );
});
