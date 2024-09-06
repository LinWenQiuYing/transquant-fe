import { useStores } from "@transquant/app/hooks";
import { BreadcrumbItem, ContentPanel, TitlePanel } from "@transquant/common";
import { collapsedStyle, normalStyle } from "@transquant/constants";
import { IconFont, Permission } from "@transquant/ui";
import { Button, Tabs, TabsProps } from "antd";
import { observer } from "mobx-react";
import { useState } from "react";
import { useStores as useManageStores } from "../hooks";
import EnvironmentTable from "./Environment";
import { defaultRoutes } from "./helpers";
import "./index.less";
import NodeTable from "./Node";
import ResourceQuotaModal from "./ResourceQuotaModal";
import ShareSpace from "./ShareSpace";

enum TabEnum {
  Environment = "environment",
  Node = "node",
  Share = "share",
}

export default observer(function Environment() {
  const { collapsed } = useStores().appStore;
  const { getResourceQuota } = useManageStores().environmentStore;
  const [activeTab, setActiveTab] = useState(TabEnum.Node);
  const [resourceQuotaVisible, setResourceQuotaVisible] = useState(false);

  const getBreadcrumbItems = () => {
    const items: BreadcrumbItem[] = defaultRoutes;

    return items;
  };

  const items: TabsProps["items"] = [
    {
      key: TabEnum.Node,
      label: "节点列表",
      children: <NodeTable />,
    },
    {
      key: TabEnum.Environment,
      label: "个人/团队环境",
      children: <EnvironmentTable />,
    },
    {
      key: TabEnum.Share,
      label: "协作空间环境",
      children: <ShareSpace />,
    },
  ];

  const onQuotaClick = () => {
    getResourceQuota();
    setResourceQuotaVisible(true);
  };

  const tabExtra = () => {
    if (activeTab === TabEnum.Node) {
      return (
        <Button
          type="primary"
          icon={<IconFont type="ziyuanxianzhi" />}
          onClick={onQuotaClick}
        >
          资源预占限制管理
        </Button>
      );
    }
  };

  return (
    <>
      <Permission code="envManage">
        <ContentPanel
          title={
            <TitlePanel
              items={getBreadcrumbItems()}
              style={collapsed ? collapsedStyle : normalStyle}
            />
          }
          content={
            <Tabs
              items={items}
              activeKey={activeTab}
              onChange={(value) => setActiveTab(value as TabEnum)}
              destroyInactiveTabPane
              tabBarExtraContent={tabExtra()}
            />
          }
          className="[&>.trans-quant-content-panel-card]:m-5 [&>.trans-quant-content-panel-card>.trans-quant-antd-card-body]:pt-0"
        />
      </Permission>
      {resourceQuotaVisible && (
        <ResourceQuotaModal
          visible={resourceQuotaVisible}
          onVisibleChange={setResourceQuotaVisible}
        />
      )}
    </>
  );
});
