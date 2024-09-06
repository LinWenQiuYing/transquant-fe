import { useStores } from "@transquant/app/hooks";
import { ContentPanel, TitlePanel } from "@transquant/common";
import { clsPrefix, collapsedStyle, normalStyle } from "@transquant/constants";
import { Permission } from "@transquant/ui";
import { Button } from "antd";
import { observer } from "mobx-react";
import { useState } from "react";
import { Outlet, useParams } from "react-router-dom";
import { useStores as usePersonStores } from "../../hooks";
import IncreTrackingModal from "../../incre-tracking-modal";
import { defaultRoutes } from "./helpers";
import IncreTracking from "./incre-tracking";
import "./index.less";

export default observer(function FactorResearch() {
  const { collapsed } = useStores().appStore;
  const {
    imageInstances,
    addQuartzJob,
    getPrivateEnvList,
    getFactorOrStrategyProj,
  } = usePersonStores().factorResearchStore;
  const params = useParams();
  const [increTrackingVisible, setIncreTrackingVisible] = useState(false);

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
    getPrivateEnvList();
    setIncreTrackingVisible(true);
    const res = await getFactorOrStrategyProj(1);
    setProjects(res);
  };

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
        extra={
          <Permission code="B030106" hidden>
            <Button type="primary" onClick={onIncreTracking}>
              新建
            </Button>
          </Permission>
        }
        content={render()}
      />
      {increTrackingVisible && (
        <IncreTrackingModal
          title="因子增量跟踪"
          projects={projects}
          imageInstances={imageInstances}
          addQuartzJob={addQuartzJob}
          visible={increTrackingVisible}
          onVisibleChange={(value) => setIncreTrackingVisible(value)}
        />
      )}
    </Permission>
  );
});
