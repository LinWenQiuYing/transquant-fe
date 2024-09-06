import { PlusOutlined } from "@ant-design/icons";
import { Permission } from "@transquant/ui";
import { Button, Card, Empty, Tabs, TabsProps } from "antd";
import { observer } from "mobx-react";
import { useEffect, useState } from "react";
import { useStores } from "../../hooks";
import Examine from "./examine";
import Member from "./member";
import MemberModal from "./member/MemberModal";
import Resource from "./resource";
import Role from "./role";
import RoleModal from "./role/RoleModal";

enum TabEnum {
  Member = "member",
  Role = "role",
  Resource = "resource",
  Approval = "approval",
}

const items: TabsProps["items"] = [
  {
    key: TabEnum.Member,
    label: "成员列表",
    children: <Member />,
  },
  {
    key: TabEnum.Role,
    label: "角色列表",
    children: <Role />,
  },
  {
    key: TabEnum.Resource,
    label: "资源管理",
    children: <Resource />,
  },
  {
    key: TabEnum.Approval,
    label: "审批设置",
    children: <Examine />,
  },
];

export default observer(function ContentView() {
  const { selectedGroup, getAllSimpleUsers, getRoleListOfTeam } =
    useStores().organizationStore;
  const [activeTab, setActiveTab] = useState(TabEnum.Member);
  const [memberModalVisible, setMemberModalVisible] = useState(false);
  const [roleModalVisible, setRoleModalVisible] = useState(false);

  const createMember = async () => {
    await Promise.all([
      getAllSimpleUsers(),
      getRoleListOfTeam(selectedGroup!.id),
    ]);
    setMemberModalVisible(true);
  };

  const createRole = async () => {
    setRoleModalVisible(true);
  };

  useEffect(() => {
    setActiveTab(TabEnum.Member);
  }, [selectedGroup]);

  const getExtra = () => {
    switch (activeTab) {
      case TabEnum.Member:
        return (
          <Permission code="B150107" hidden>
            <Button
              type="primary"
              icon={<PlusOutlined />}
              disabled={!selectedGroup}
              onClick={createMember}
            >
              添加成员
            </Button>
          </Permission>
        );
      case TabEnum.Role:
        return (
          <Permission code="B150109" hidden>
            <Button
              type="primary"
              icon={<PlusOutlined />}
              disabled={!selectedGroup}
              onClick={createRole}
            >
              添加角色
            </Button>
          </Permission>
        );
      default:
        break;
    }
  };

  return (
    <Card className="[&>.trans-quant-antd-card-body]:py-2 flex-1">
      {selectedGroup ? (
        <Tabs
          items={items}
          tabBarExtraContent={getExtra()}
          activeKey={activeTab}
          onChange={(value) => setActiveTab(value as TabEnum)}
          destroyInactiveTabPane
        />
      ) : (
        <Empty description="请选择团队" className="mt-20" />
      )}

      {memberModalVisible && (
        <MemberModal
          title="添加成员"
          visible={memberModalVisible}
          onVisibleChange={(value) => setMemberModalVisible(value)}
        />
      )}
      {roleModalVisible && (
        <RoleModal
          title="添加角色"
          visible={roleModalVisible}
          onVisibleChange={setRoleModalVisible}
        />
      )}
    </Card>
  );
});
