import { useStores } from "@transquant/app/hooks";
import { BreadcrumbItem, ContentPanel, TitlePanel } from "@transquant/common";
import { clsPrefix, collapsedStyle, normalStyle } from "@transquant/constants";
import { Permission } from "@transquant/ui";
import { useMount, useUnmount } from "ahooks";
import { Select, Space } from "antd";
import { observer } from "mobx-react";
import { useState } from "react";
import { useStores as useSpaceStores } from "../hooks";
import InstallModal from "../image/InstallModal";
import { defaultRoutes } from "./helpers";
import "./index.less";
import Share from "./Share";
import ShareModal from "./ShareModal";

export default observer(function ShareSpace() {
  const { collapsed } = useStores().appStore;
  const {
    getAllTeamInfos,
    teams,
    onCurrentTeamIdChange,
    currentTeamId,
    getShareSpace,
    resetState,
    installToken,
    installVisible,
    upgradeShareEnv,
    onInstallVisibleChange,
  } = useSpaceStores().shareStore;
  const [shareVisible, setShareVisible] = useState(false);

  useMount(async () => {
    const teams = (await getAllTeamInfos()) || [];
    if (currentTeamId !== undefined) return;
    if (teams.length) {
      const firstTeam = teams[0];
      onCurrentTeamIdChange(firstTeam.id);
      getShareSpace(firstTeam.id);
    }
  });

  const getBreadcrumbItems = () => {
    const items: BreadcrumbItem[] = defaultRoutes;

    return items;
  };

  const onTeamChange = (id: number) => {
    onCurrentTeamIdChange(id);
    getShareSpace(id);
  };

  useUnmount(() => {
    resetState();
  });

  return (
    <Permission code="shareSpace">
      <div>
        <ContentPanel
          className={`${clsPrefix}-share-space`}
          cardTitle="空间列表"
          extra={
            <Space>
              <div>
                团队选择：
                <Select
                  style={{ width: 200 }}
                  placeholder="请选择团队"
                  onChange={onTeamChange}
                  value={currentTeamId}
                >
                  {teams.map((item) => (
                    <Select.Option key={item.id} value={item.id}>
                      {item.name}
                    </Select.Option>
                  ))}
                </Select>
              </div>
            </Space>
          }
          title={
            <TitlePanel
              items={getBreadcrumbItems()}
              style={collapsed ? collapsedStyle : normalStyle}
            />
          }
          content={<Share />}
        />
        {shareVisible && (
          <ShareModal
            visible={shareVisible}
            onVisibleChange={(value) => setShareVisible(value)}
          />
        )}
        <InstallModal
          visible={installVisible}
          onVisibleChange={onInstallVisibleChange}
          envToken={installToken}
          upgrade={upgradeShareEnv}
        />
      </div>
    </Permission>
  );
});
