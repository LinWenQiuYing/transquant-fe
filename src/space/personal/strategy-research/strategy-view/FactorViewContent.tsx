import { clsPrefix } from "@transquant/constants";
import { getCode, getTradeAnalysis } from "@transquant/space/common/api";
import TransactionAnalysis from "@transquant/space/common/TransactionAnalysis";
import { html2pdf } from "@transquant/utils";
import { Button, Card, Tabs, TabsProps } from "antd";
import dayjs from "dayjs";
import { observer } from "mobx-react";
import { useState } from "react";
import { useParams } from "react-router-dom";
import PerformanceView from "src/space/performance-view";
import { useStores } from "../../../hooks";
import AccountView from "./Account";
import OrderView from "./Order";
import PositionView from "./Position";
import ProfitView from "./profit";

export enum FactorViewTabEnum {
  Detail = "detail",
  Position = "position",
  Account = "account",
  Order = "order",
  TransactionAnalysis = "transactionAnalysis",
  Performance = "performance",
}

export default observer(function FactorViewContent() {
  const {
    resetCache,
    onCacheLibConfigChange,
    onPaginationChange,
    exportPositionDetail,
    strategyBaseInfo,
    exportAccountDetail,
    exportOrderDetail,
    positionLoading,
    accountLoading,
    orderLoading,
    getPositionDetail,
    getAccountDetail,
    getStrategyJsonData,
    getStrategyPerfJsonData,
    strategyPerformance,
    currentJob,
  } = useStores().strategyResearchStore;
  const [activeTab, setActiveTab] = useState(FactorViewTabEnum.Detail);
  const params = useParams();
  const strategyId = parseInt(params.id || "");

  const onChange = (key: string) => {
    resetCache();
    onCacheLibConfigChange({ pageNum: 1 });
    onPaginationChange({ pageNum: 1 });
    setActiveTab(key as FactorViewTabEnum);

    switch (key) {
      case FactorViewTabEnum.Detail:
        getStrategyJsonData(strategyId);
        break;
      case FactorViewTabEnum.Position:
        getPositionDetail({
          strategyId,
          date: dayjs().format("YYYY-MM-DD"),
        });
        break;
      case FactorViewTabEnum.Account:
        getAccountDetail({ strategyId, timeRangeType: 0 });
        break;

      default:
        break;
    }
  };

  const onDetailExport = () => {
    const element = document.querySelector<HTMLElement>(
      "#container .trans-quant-antd-spin-container"
    );
    if (!element) {
      return;
    }
    html2pdf(
      element,
      `${strategyBaseInfo?.projectName}_${strategyBaseInfo?.className}_${strategyBaseInfo?.name}`
    );
  };

  const onExport = () => {
    switch (activeTab) {
      case FactorViewTabEnum.Detail:
        onDetailExport();
        break;
      case FactorViewTabEnum.Position:
        exportPositionDetail(strategyId);
        break;
      case FactorViewTabEnum.Account:
        exportAccountDetail(strategyId);
        break;
      case FactorViewTabEnum.Order:
        exportOrderDetail(strategyId);
        break;
      default:
        break;
    }
  };

  const extraEl = (
    <Button
      type="primary"
      onClick={onExport}
      loading={
        (activeTab === FactorViewTabEnum.Position && positionLoading) ||
        (activeTab === FactorViewTabEnum.Account && accountLoading) ||
        (activeTab === FactorViewTabEnum.Order && orderLoading)
      }
    >
      导出
    </Button>
  );

  const items: TabsProps["items"] = [
    {
      key: FactorViewTabEnum.Detail,
      label: "收益详情",
      children: <ProfitView />,
    },
    {
      key: FactorViewTabEnum.Position,
      label: "持仓详情",
      children: <PositionView />,
    },
    {
      key: FactorViewTabEnum.Account,
      label: "账户详情",
      children: <AccountView />,
    },
    {
      key: FactorViewTabEnum.Order,
      label: "订单详情",
      children: <OrderView />,
    },
    {
      key: FactorViewTabEnum.TransactionAnalysis,
      label: "交易分析",
      children: (
        <TransactionAnalysis
          id={strategyId}
          getCode={getCode}
          getTradeAnalysis={getTradeAnalysis}
        />
      ),
    },
    {
      key: FactorViewTabEnum.Performance,
      label: "性能分析",
      children: (
        <PerformanceView
          id={strategyId}
          getPerformance={getStrategyPerfJsonData}
          data={JSON.parse(strategyPerformance).data}
        />
      ),
    },
  ];

  const getItem = () => {
    let _items = items;

    if (!currentJob?.analysisFlag) {
      _items = items.filter(
        (item) => item.key !== FactorViewTabEnum.TransactionAnalysis
      );
    }
    if (!currentJob?.performanceFlag) {
      _items = items.filter(
        (item) => item.key !== FactorViewTabEnum.Performance
      );
    }
    return _items;
  };

  return (
    <Card className={`${clsPrefix}-strategy-view-card`}>
      <Tabs
        items={getItem()}
        onChange={onChange}
        activeKey={activeTab}
        destroyInactiveTabPane
        tabBarExtraContent={
          activeTab === FactorViewTabEnum.TransactionAnalysis ||
          activeTab === FactorViewTabEnum.Performance
            ? null
            : extraEl
        }
      />
    </Card>
  );
});
