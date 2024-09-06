import { useMount, useUnmount } from "ahooks";
import { Tabs, TabsProps } from "antd";
import { observer } from "mobx-react";
import { useStores } from "../hooks";
import ApplicationRecord from "./application-record";
import ApproveRecord from "./approve-record";

export enum RecordTab {
  Application = "application",
  Approve = "approve",
}

const items: TabsProps["items"] = [
  {
    key: RecordTab.Application,
    label: "申请记录",
    children: <ApplicationRecord />,
  },
  {
    key: RecordTab.Approve,
    label: "审批记录",
    children: <ApproveRecord />,
  },
];

export default observer(function TabView() {
  const {
    getTeamList4MyPublish,
    getTeamList4MyAudit,
    getAuditorList4MyPublish,
    getAuditorList4MyAudit,
    getPublisherList4MyAudit,
    onActiveTabChange,
    activeTab,
    resetCache,
  } = useStores().publishStore;

  useMount(() => {
    getTeamList4MyPublish();
    getAuditorList4MyPublish();
    getAuditorList4MyAudit();
    getPublisherList4MyAudit();
  });

  useUnmount(() => {
    resetCache();
  });

  const onChange = (key: string) => {
    resetCache();
    onActiveTabChange(key as RecordTab);
    if (key === RecordTab.Application) {
      getTeamList4MyPublish();
    }
    if (key === RecordTab.Approve) {
      getTeamList4MyAudit();
    }
  };

  return (
    <Tabs
      items={items}
      onChange={onChange}
      activeKey={activeTab}
      destroyInactiveTabPane
    />
  );
});
