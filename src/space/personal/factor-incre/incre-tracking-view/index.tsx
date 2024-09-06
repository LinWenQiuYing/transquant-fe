import { clsPrefix } from "@transquant/constants";
import { IncreTrackingStatus } from "@transquant/space/group/strategy-incre/incre-tracking";
import { useMount } from "ahooks";
import {
  Descriptions,
  DescriptionsProps,
  Divider,
  Tabs,
  TabsProps,
  Tooltip,
} from "antd";
import classNames from "classnames";
import { observer } from "mobx-react";
import CodeFile from "../../../common/CodeFile";
import Log from "../../../common/Log";
import { useStores } from "../../../hooks";
import "./index.less";

export enum TabEnum {
  CodeFile = "codeFile",
  Log = "log",
}

export default observer(function IncreTrackingView() {
  const {
    currentJob,
    getCodeTree,
    getQuartzLog,
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
    getSaveTablesForFactorJob,
    logContent,
    factorTables,
  } = useStores().factorResearchStore;

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
        <Tooltip title={factorTables}>
          <div style={{ width: 200 }} className={`${clsPrefix}-ellipsis`}>
            {factorTables}
          </div>
        </Tooltip>
      ),
    },
  ];

  const onChange = (key: string) => {
    switch (key) {
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
          logsLoading={logsLoading}
          logContent={logContent}
          commandLogContent={commandLogContent}
          getQuartzCommandLogContent={getQuartzCommandLogContent}
          getQuartzLogContent={getQuartzLogContent}
        />
      ),
    },
  ];

  useMount(() => {
    getSaveTablesForFactorJob();
    onChange(TabEnum.CodeFile);
  });

  return (
    <div className={`${clsPrefix}-incre-tracking-view`}>
      <Descriptions items={items} />
      <Divider dashed />
      <Tabs items={tabs} destroyInactiveTabPane onChange={onChange} />
    </div>
  );
});
