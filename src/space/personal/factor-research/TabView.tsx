import { PlusOutlined } from "@ant-design/icons";
import { Permission } from "@transquant/ui";
import { useMount, useUnmount } from "ahooks";
import { Button, Tabs, TabsProps } from "antd";
import { observer } from "mobx-react";
import { useState } from "react";
import { useStores } from "../../hooks";
import FactorLib from "./factor-lib";
import FactorModal from "./FactorModal";
import ProjectList from "./project-list";

export enum FactorResearchTabEnum {
  ProjectList = "projectList",
  StategyLib = "strategyLib",
  IncreTracking = "increTracking",
}

const items: TabsProps["items"] = [
  {
    key: FactorResearchTabEnum.ProjectList,
    label: "项目列表",
    children: <ProjectList />,
  },
  {
    key: FactorResearchTabEnum.StategyLib,
    label: "因子库",
    children: <FactorLib />,
  },
];

export default observer(function TabView() {
  const {
    getFactorProject,
    getFactorTemplate,
    getTags,
    resetCache,
    activeTab,
    onFactorTabChange,
  } = useStores().factorResearchStore;

  const [factorModalVisible, setFactorModalVisible] = useState(false);

  useMount(() => {
    getFactorProject({
      pageNum: 1,
      pageSize: 15,
    });
  });

  useUnmount(() => {
    resetCache();
  });

  const createProject = async () => {
    await Promise.all([getFactorTemplate(), getTags()]);

    setFactorModalVisible(true);
  };

  const extraEl = (
    <Permission code="B030101" hidden>
      <Button icon={<PlusOutlined />} type="primary" onClick={createProject}>
        新建
      </Button>
    </Permission>
  );

  return (
    <div>
      <Tabs
        items={items}
        onChange={onFactorTabChange}
        activeKey={activeTab}
        destroyInactiveTabPane
        tabBarExtraContent={
          activeTab === FactorResearchTabEnum.ProjectList ? extraEl : null
        }
      />
      <FactorModal
        title="新建因子项目"
        visible={factorModalVisible}
        onVisibleChange={(value) => setFactorModalVisible(value)}
      />
    </div>
  );
});
