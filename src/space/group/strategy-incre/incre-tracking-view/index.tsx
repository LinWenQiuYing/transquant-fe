import { clsPrefix } from "@transquant/constants";
import {
  getQuartzCode,
  getQuartzTradeAnalysis,
} from "@transquant/space/common/api";
import TransactionAnalysis from "@transquant/space/common/TransactionAnalysis";
import { useMount } from "ahooks";
import {
  Button,
  Descriptions,
  DescriptionsProps,
  Divider,
  Tabs,
  TabsProps,
  Tooltip,
} from "antd";
import classNames from "classnames";
import dayjs from "dayjs";
import { observer } from "mobx-react";
import { useState } from "react";
import { useParams } from "react-router-dom";
import CodeFile from "../../../common/CodeFile";
import Log from "../../../common/Log";
import { useStores } from "../../../hooks";
import { IncreTrackingStatus } from "../incre-tracking";
import AccountView from "./Account";
import "./index.less";
import OrderView from "./Order";
import PositionView from "./Position";
import ProfitView from "./Profit";

export enum TabEnum {
  Profit = "profit",
  Position = "position",
  Account = "account",
  Order = "order",
  TransactionAnalysis = "transactionAnalysis",
  CodeFile = "codeFile",
  Log = "log",
}

export default observer(function IncreTrackingView() {
  const {
    currentJob,
    getCodeTree,
    getQuartzLog,
    getPositionList,
    getDailyPnlList,
    getAccountList,
    getStrategyReturnKPI,
    getStrategyReturnList,
    codeTree,
    codeTreeLoading,
    getFileContent,
    fileContent,
    fileContentLoading,
    logs,
    logsLoading,
    getQuartzLogContent,
    getQuartzCommandLogContent,
    commandLogContent,
    logContent,
    positionLoading,
    accountLoading,
    orderLoading,
    exportJobAccountDetail,
    exportJobOrderDetail,
    exportJobPositionDetail,
  } = useStores().groupStrategyStore;
  const [activeTab, setActiveTab] = useState(TabEnum.Profit);

  const params = useParams();
  const quartzDetailId = parseInt(params.increid || "");

  const items: DescriptionsProps["items"] = [
    {
      key: "1",
      label: "任务名称",
      children: currentJob?.jobName,
    },
    {
      key: "2",
      label: "项目类名",
      children: currentJob?.className,
    },
    {
      key: "3",
      label: "策略名称",
      children: currentJob?.name,
    },
    {
      key: "4",
      label: "状态",
      children: (
        <span
          className={classNames(`${clsPrefix}-status`, {
            pending: currentJob?.runStatus === 3,
            error: currentJob?.runStatus === 1,
            running: currentJob?.runStatus === 0,
            success: currentJob?.runStatus === 2,
          })}
        >
          {
            IncreTrackingStatus[
              currentJob?.runStatus as keyof typeof IncreTrackingStatus
            ]
          }
        </span>
      ),
    },
    {
      key: "5",
      label: "开始时间",
      children: currentJob?.startTime,
    },
    {
      key: "6",
      label: "数据存储",
      children: (
        <Tooltip title="strategy_return,strategy_position,strategy_account,strategy_trade_history">
          <div style={{ width: 200 }} className={`${clsPrefix}-ellipsis`}>
            strategy_return,strategy_position,strategy_account,strategy_trade_history
          </div>
        </Tooltip>
      ),
    },
  ];

  const onChange = (key: string) => {
    setActiveTab(key as TabEnum);
    switch (key) {
      case TabEnum.Profit:
        getStrategyReturnKPI();
        getStrategyReturnList();
        getDailyPnlList();
        break;
      case TabEnum.Position:
        getPositionList({ date: dayjs().format("YYYY-MM-DD") });
        break;
      case TabEnum.Account:
        getAccountList({ timeRangeType: 0 });
        break;
      case TabEnum.CodeFile:
        getCodeTree();
        break;
      case TabEnum.Log:
        getQuartzLog();
        break;
      default:
        break;
    }
  };

  const tabs: TabsProps["items"] = [
    {
      key: TabEnum.Profit,
      label: "收益详情",
      children: <ProfitView />,
    },
    {
      key: TabEnum.Position,
      label: "持仓详情",
      children: <PositionView />,
    },
    {
      key: TabEnum.Account,
      label: "账户详情",
      children: <AccountView />,
    },
    {
      key: TabEnum.Order,
      label: "订单详情",
      children: <OrderView />,
    },
    {
      key: TabEnum.TransactionAnalysis,
      label: "交易分析",
      children: (
        <TransactionAnalysis
          id={quartzDetailId}
          getCode={getQuartzCode}
          getTradeAnalysis={getQuartzTradeAnalysis}
        />
      ),
    },
    {
      key: TabEnum.CodeFile,
      label: "代码文件",
      children: (
        <CodeFile
          codeTree={codeTree}
          codeTreeLoading={codeTreeLoading}
          getFileContent={getFileContent}
          fileContent={fileContent}
          fileContentLoading={fileContentLoading}
        />
      ),
    },
    {
      key: TabEnum.Log,
      label: "日志",
      children: (
        <Log
          logs={logs}
          logContent={logContent}
          commandLogContent={commandLogContent}
          logsLoading={logsLoading}
          getQuartzLogContent={getQuartzLogContent}
          getQuartzCommandLogContent={getQuartzCommandLogContent}
        />
      ),
    },
  ];

  const getItem = () => {
    let _items = tabs;

    if (!currentJob?.analysisFlag) {
      _items = tabs.filter((item) => item.key !== TabEnum.TransactionAnalysis);
    }
    return _items;
  };

  useMount(() => {
    onChange(TabEnum.Profit);
  });

  const onExport = () => {
    switch (activeTab) {
      case TabEnum.Position:
        exportJobPositionDetail();
        break;
      case TabEnum.Account:
        exportJobAccountDetail();
        break;
      case TabEnum.Order:
        exportJobOrderDetail();
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
        (activeTab === TabEnum.Position && positionLoading) ||
        (activeTab === TabEnum.Account && accountLoading) ||
        (activeTab === TabEnum.Order && orderLoading)
      }
    >
      导出
    </Button>
  );

  const hasExportBtn = [TabEnum.Position, TabEnum.Account, TabEnum.Order];

  return (
    <div className={`${clsPrefix}-incre-tracking-view`}>
      <Descriptions items={items} />
      <Divider dashed style={{ margin: "10px 0" }} />
      <Tabs
        items={getItem()}
        destroyInactiveTabPane
        onChange={onChange}
        tabBarExtraContent={hasExportBtn.includes(activeTab) ? extraEl : null}
      />
    </div>
  );
});
