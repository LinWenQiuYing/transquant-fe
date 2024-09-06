import { CloseOutlined } from "@ant-design/icons";
import useMount from "ahooks/lib/useMount";
import { Tabs, TabsProps } from "antd";
import { observer } from "mobx-react";
import { useState } from "react";
import { useStores } from "../hooks";
import PersonalTable from "./PersonalTable";
import TeamTable from "./TeamTable";

enum ImageTab {
  Personal = "personal",
  Team = "team",
}

export interface TabViewProps {
  onVisibleChange: (value: boolean) => void;
}

export default observer(function TabView(props: TabViewProps) {
  const { getPersonalImageInstances, getSwitchTeamImageInstances } =
    useStores().imageStore;
  const [activeTab, setActiveTab] = useState(ImageTab.Personal);

  useMount(() => {
    getPersonalImageInstances();
  });

  const onChange = (key: string) => {
    if (key === ImageTab.Personal) {
      getPersonalImageInstances();
    } else {
      getSwitchTeamImageInstances();
    }
    setActiveTab(key as ImageTab);
  };

  const items: TabsProps["items"] = [
    {
      key: ImageTab.Personal,
      label: "个人环境",
      children: <PersonalTable {...props} />,
    },
    {
      key: ImageTab.Team,
      label: "团队环境",
      children: <TeamTable {...props} />,
    },
  ];

  return (
    <Tabs
      items={items}
      onChange={onChange}
      activeKey={activeTab}
      destroyInactiveTabPane
      tabBarExtraContent={
        <CloseOutlined onClick={() => props.onVisibleChange(false)} />
      }
    />
  );
});
