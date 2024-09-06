import { useMount, useUnmount } from "ahooks";
import { Select, Tabs, TabsProps } from "antd";
import { observer } from "mobx-react";
import { useStores } from "../../hooks";
import { GroupTeamItem } from "../../types";
import ProjectList from "./project-list";
import StrategyLib from "./strategy-lib";

export enum StrategyResearchTabEnum {
  ProjectList = "projectList",
  StategyLib = "strategyLib",
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
    teams,
    selectedTeam,
    getAllTeamInfos,
    onStrategySelectedTeamChange,
    getTeamStrategyProject,
    getTeamStrategyResultList,
    resetCache,
    activeTab,
    onGroupStrategyTabChange,
  } = useStores().groupStrategyStore;

  const onTeamChange = (id: number) => {
    const target = teams.find((v: GroupTeamItem) => v.id === id);
    if (target) {
      onStrategySelectedTeamChange(target);
    }
    if (activeTab === StrategyResearchTabEnum.ProjectList) {
      getTeamStrategyProject();
    } else if (activeTab === StrategyResearchTabEnum.StategyLib) {
      getTeamStrategyResultList();
    }
  };

  useMount(async () => {
    await getAllTeamInfos();
    getTeamStrategyProject();
  });

  useUnmount(() => {
    resetCache();
  });

  const extraEl = (
    <div className="table-right">
      <span className="table-right-label">团队选择：</span>
      <Select
        className="w-56 table-right-options"
        value={selectedTeam.id}
        onChange={onTeamChange}
        options={teams}
        placeholder="请选择团队"
        fieldNames={{ label: "name", value: "id" }}
      />
    </div>
  );

  return (
    <div>
      <Tabs
        items={items}
        onChange={onGroupStrategyTabChange}
        activeKey={activeTab}
        destroyInactiveTabPane
        tabBarExtraContent={extraEl}
      />
    </div>
  );
});
