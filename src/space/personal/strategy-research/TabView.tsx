import { PlusOutlined } from "@ant-design/icons";
import { Permission } from "@transquant/ui";
import { useMount, useUnmount } from "ahooks";
import { Button, Tabs, TabsProps } from "antd";
import { observer } from "mobx-react";
import { useState } from "react";
import { useStores } from "../../hooks";
import ProjectList from "./project-list";
import StrategyLib from "./strategy-lib";
import StrategyModal from "./StrategyModal";

export enum StrategyResearchTabEnum {
  ProjectList = "projectList",
  StategyLib = "strategyLib",
  IncreTracking = "increTracking",
}

const items: TabsProps["items"] = [
  {
    key: StrategyResearchTabEnum.ProjectList,
    label: "项目列表",
    children: <ProjectList />,
  },
  {
    key: StrategyResearchTabEnum.StategyLib,
    label: "策略库",
    children: <StrategyLib />,
  },
];

export default observer(function TabView() {
  const {
    getStrategyProject,
    getStrategyTemplate,
    getTags,
    resetCache,
    activeTab,
    onStrategyTabChange,
  } = useStores().strategyResearchStore;

  const [factorModalVisible, setFactorModalVisible] = useState(false);

  useMount(() => {
    getStrategyProject({
      pageNum: 1,
      pageSize: 15,
    });
  });

  useUnmount(() => {
    resetCache();
  });

  const createProject = async () => {
    await Promise.all([getStrategyTemplate(), getTags()]);

    setFactorModalVisible(true);
  };

  const extraEl = (
    <Permission code="B030201" hidden>
      <Button icon={<PlusOutlined />} type="primary" onClick={createProject}>
        新建
      </Button>
    </Permission>
  );

  return (
    <div>
      <Tabs
        items={items}
        onChange={onStrategyTabChange}
        activeKey={activeTab}
        destroyInactiveTabPane
        tabBarExtraContent={
          activeTab === StrategyResearchTabEnum.ProjectList ? extraEl : null
        }
      />
      <StrategyModal
        title="新建策略项目"
        visible={factorModalVisible}
        onVisibleChange={(value) => setFactorModalVisible(value)}
      />
    </div>
  );
});
