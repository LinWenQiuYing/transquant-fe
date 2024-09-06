/* eslint-disable camelcase */
import { clsPrefix } from "@transquant/constants";
import PerformanceView from "@transquant/space/performance-view";
import { html2pdf } from "@transquant/utils";
import { Button, Card, Tabs, TabsProps } from "antd";
import { observer } from "mobx-react";
import { useState } from "react";
import { useParams, useSearchParams } from "react-router-dom";
import { useStores } from "../../../hooks";
import DetailView from "./DetailView";

export enum FactorViewTabEnum {
  Detail = "detail",
  Performance = "performance",
}

let items: TabsProps["items"] = [
  {
    key: FactorViewTabEnum.Detail,
    label: "因子详情",
    children: <DetailView />,
  },
];

export default observer(function FactorViewContent() {
  const { factorBaseInfo, factorPerformance, getPerformanceJsonData } =
    useStores().factorResearchStore;
  const [activeTab, setActiveTab] = useState(FactorViewTabEnum.Detail);
  const [URLSearchParams] = useSearchParams();
  const performanceFlag = URLSearchParams.get("performanceFlag");
  const factorId = useParams().id || -1;

  const onChange = (key: string) => {
    setActiveTab(key as FactorViewTabEnum);
  };

  const onExport = () => {
    const element = document.querySelector<HTMLElement>(
      "#container .trans-quant-antd-spin-container"
    );
    if (!element) {
      return;
    }
    html2pdf(
      element,
      `${factorBaseInfo?.projectName}_${factorBaseInfo?.className}_${factorBaseInfo?.name}`
    );
  };

  const extraEl = (
    <Button type="primary" onClick={onExport}>
      导出
    </Button>
  );

  if (performanceFlag && +performanceFlag) {
    items = [
      {
        key: FactorViewTabEnum.Detail,
        label: "因子详情",
        children: <DetailView />,
      },
      {
        key: FactorViewTabEnum.Performance,
        label: "性能分析",
        children: (
          <PerformanceView
            id={Number(factorId)}
            getPerformance={getPerformanceJsonData}
            data={JSON.parse(factorPerformance)?.data}
          />
        ),
      },
    ];
  }

  return (
    <Card className={`${clsPrefix}-factor-view-card`}>
      <Tabs
        items={items}
        onChange={onChange}
        activeKey={activeTab}
        tabBarExtraContent={activeTab === FactorViewTabEnum.Detail && extraEl}
      />
    </Card>
  );
});
