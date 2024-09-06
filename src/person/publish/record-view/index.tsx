import { CheckCircleFilled, CloseCircleFilled } from "@ant-design/icons";
import { clsPrefix } from "@transquant/constants";
import { Button, Card, Space, Tabs, TabsProps } from "antd";
import { observer } from "mobx-react";
import { useState } from "react";
import { useParams } from "react-router-dom";
import { useStores } from "../../hooks";
import ApprovedModal from "./ApprovedModal";
import DescriptionDoc from "./DescriptionDoc";
import FactorList from "./FactorList";
import "./index.less";
import PublishDetail from "./PublishDetail";
import RejectModal from "./RejectModal";
import StrategyList from "./StrategyList";

enum RecordViewTab {
  PublishDetail = "publishDetail",
  DescriptionDoc = "descriptionDoc",
  FactorList = "factorList",
}

export default observer(function TabView() {
  const { approvalInfo, getUserListByTeam, getTeamTags } =
    useStores().publishStore;
  const [activeTab, setActiveTab] = useState(RecordViewTab.PublishDetail);
  const [rejectVisible, setRejectVisible] = useState(false);
  const [approvedVisible, setApprovedVisible] = useState(false);
  const params = useParams();

  const onChange = (key: string) => {
    setActiveTab(key as RecordViewTab);
  };

  const items: TabsProps["items"] = [
    {
      key: RecordViewTab.PublishDetail,
      label: "发布详情",
      children: <PublishDetail />,
    },
    {
      key: RecordViewTab.DescriptionDoc,
      label: "描述文档",
      children: <DescriptionDoc />,
    },
    {
      key: RecordViewTab.FactorList,
      label: approvalInfo?.type === 0 ? "因子列表" : "策略列表",
      children: approvalInfo?.type === 0 ? <FactorList /> : <StrategyList />,
    },
  ];

  const onPassClick = async () => {
    await getUserListByTeam(approvalInfo?.targetTeamId);
    await getTeamTags(approvalInfo?.targetTeamId);
    setApprovedVisible(true);
  };

  const extraEl = (
    <Space>
      <Button
        icon={<CloseCircleFilled />}
        onClick={() => setRejectVisible(true)}
      >
        驳回
      </Button>
      <Button icon={<CheckCircleFilled />} type="primary" onClick={onPassClick}>
        通过
      </Button>
    </Space>
  );

  return (
    <Card className={`${clsPrefix}-publish-record-view`}>
      <Tabs
        items={items}
        onChange={onChange}
        activeKey={activeTab}
        tabBarExtraContent={
          params.type === "approve" &&
          activeTab === RecordViewTab.PublishDetail &&
          approvalInfo?.canOperate &&
          extraEl
        }
      />
      {rejectVisible && (
        <RejectModal
          visible={rejectVisible}
          onVisibleChange={(value) => setRejectVisible(value)}
        />
      )}
      {approvedVisible && (
        <ApprovedModal
          title={approvalInfo?.type === 0 ? "新建因子项目" : "新建策略项目"}
          visible={approvedVisible}
          onVisibleChange={(value) => setApprovedVisible(value)}
        />
      )}
    </Card>
  );
});
