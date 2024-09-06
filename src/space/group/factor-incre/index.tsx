import { useStores } from "@transquant/app/hooks";
import { ContentPanel, TitlePanel } from "@transquant/common";
import { clsPrefix, collapsedStyle, normalStyle } from "@transquant/constants";
import { Permission } from "@transquant/ui";
import { useMount, useUnmount } from "ahooks";
import { Button, Select } from "antd";
import { observer } from "mobx-react";
import { useState } from "react";
import { Outlet, useParams } from "react-router-dom";
import { useStores as usePersonStores } from "../../hooks";
import IncreTrackingModal from "../../incre-tracking-modal";
import { GroupTeamItem } from "../../types";
import { defaultRoutes } from "./helpers";
import IncreTracking from "./incre-tracking";
import "./index.less";

export default observer(function FactorResearch() {
  const { collapsed } = useStores().appStore;
  const {
    teamInstances,
    addQuartzTeamJob,
    pagination,
    selectedTeam,
    getFactorQuartzTeamJob,
    getSwitchTeamImageInstances,
    teams,
    onFactorSelectedTeamChange,
    getAllTeamInfos,
    reset,
    getTeamFactorOrStrategyProj,
  } = usePersonStores().groupFactorStore;
  const params = useParams();
  const [increTrackingVisible, setIncreTrackingVisible] = useState(false);

  useMount(() => {
    getAllTeamInfos("040102");
  });

  const render = () => {
    if (
      Reflect.ownKeys(params).includes("id") ||
      Reflect.ownKeys(params).includes("increid")
    ) {
      return <Outlet />;
    }

    return <IncreTracking />;
  };

  const [projects, setProjects] = useState<{ id: number; name: string }[]>([]);

  const onIncreTracking = async () => {
    getSwitchTeamImageInstances();
    setIncreTrackingVisible(true);
    const res = await getTeamFactorOrStrategyProj(1);
    setProjects(res);
  };

  const onTeamChange = (id: number) => {
    const target = teams.find((v: GroupTeamItem) => v.id === id);
    if (target) {
      onFactorSelectedTeamChange(target);
    }
    getFactorQuartzTeamJob(
      {
        pageNum: 1,
        pageSize: pagination.pageSize,
      },
      id
    );
  };

  useUnmount(() => {
    reset();
  });

  const extraEl = (
    <div>
      <span>团队选择：</span>
      <Select
        className="w-56 mr-4"
        value={selectedTeam.id}
        onChange={onTeamChange}
        options={teams}
        placeholder="请选择团队"
        fieldNames={{ label: "name", value: "id" }}
      />

      <Permission code="B040105" hidden>
        <Button type="primary" onClick={onIncreTracking}>
          新建
        </Button>
      </Permission>
    </div>
  );

  return (
    <Permission code="privateFactorIncre">
      <ContentPanel
        className={`${clsPrefix}-factor-incre`}
        title={
          <TitlePanel
            items={defaultRoutes}
            style={collapsed ? collapsedStyle : normalStyle}
          />
        }
        cardTitle="任务列表"
        extra={extraEl}
        content={render()}
      />
      {increTrackingVisible && (
        <IncreTrackingModal
          title="因子增量跟踪"
          projects={projects}
          imageInstances={teamInstances}
          addQuartzJob={addQuartzTeamJob}
          visible={increTrackingVisible}
          onVisibleChange={(value) => setIncreTrackingVisible(value)}
        />
      )}
    </Permission>
  );
});
