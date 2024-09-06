import { useMount, useUnmount } from "ahooks";
import { Select, Tabs, TabsProps } from "antd";
import { observer } from "mobx-react";
import { useStores } from "../../hooks";
import { GroupTeamItem } from "../../types";
import FactorLib from "./factor-lib";
import ProjectList from "./project-list";

export enum FactorResearchTabEnum {
  ProjectList = "projectList",
  FactorLib = "FactorLib",
}

const items: TabsProps["items"] = [
  {
    key: FactorResearchTabEnum.ProjectList,
    label: "项目列表",
    children: <ProjectList />,
  },
  {
    key: FactorResearchTabEnum.FactorLib,
    label: "因子库",
    children: <FactorLib />,
  },
];

export default observer(function TabView() {
  const {
    teams,
    selectedTeam,
    onFactorSelectedTeamChange,
    getAllTeamInfos,
    getTeamFactorProject,
    getTeamFactorResultList,
    reset,
    activeTab,
    onGroupFactorTabChange,
  } = useStores().groupFactorStore;

  const onTeamChange = (id: number) => {
    const target = teams.find((v: GroupTeamItem) => v.id === id);
    if (target) {
      onFactorSelectedTeamChange(target);
    }
    if (activeTab === FactorResearchTabEnum.ProjectList) {
      getTeamFactorProject();
    } else if (activeTab === FactorResearchTabEnum.FactorLib) {
      getTeamFactorResultList();
    }
  };

  useMount(async () => {
    await getAllTeamInfos();
    getTeamFactorProject();
  });

  useUnmount(() => {
    reset();
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
        onChange={onGroupFactorTabChange}
        activeKey={activeTab}
        destroyInactiveTabPane
        tabBarExtraContent={extraEl}
      />
    </div>
  );
});
