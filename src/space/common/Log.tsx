import { python } from "@codemirror/lang-python";
import { clsPrefix } from "@transquant/constants";
import { IconFont } from "@transquant/ui";
import { DataType } from "@transquant/utils";
import { materialLight } from "@uiw/codemirror-theme-material";
import CodeMirror from "@uiw/react-codemirror";
import {
  Modal,
  Space,
  Table,
  Tabs,
  TabsProps,
  Tooltip,
  Typography,
} from "antd";
import type { ColumnsType } from "antd/es/table";
import classNames from "classnames";
import { observer } from "mobx-react";
import { useState } from "react";
import { useDataSource } from "../hooks";
import { Log } from "../types";
import "./index.less";

interface LogViewProps {
  logs: Log[];
  logsLoading: boolean;
  getQuartzLogContent: (logId: number) => Promise<void>;
  getQuartzCommandLogContent: (logId: number) => Promise<void>;
  commandLogContent: string;
  logContent: string;
}

enum LogEnum {
  RUN = "run",
  EXECUTE = "execute",
}

const OperatorMenu = observer(
  (props: { onView: (data: DataType<Log>) => void; data: DataType<Log> }) => {
    return (
      <Space>
        <Tooltip title="查看详情">
          <Typography.Link onClick={() => props.onView(props.data)}>
            <IconFont type="chakanxiangqing" />
          </Typography.Link>
        </Tooltip>
      </Space>
    );
  }
);

export default observer(function LogView(props: LogViewProps) {
  const {
    logs,
    logsLoading,
    getQuartzLogContent,
    logContent,
    getQuartzCommandLogContent,
    commandLogContent,
  } = props;
  const [logVisible, setLogVisible] = useState(false);

  const onView = (data: DataType<Log>) => {
    getQuartzLogContent(data.id);
    getQuartzCommandLogContent(data.id);
    setLogVisible(true);
  };

  const columns: ColumnsType<DataType<Log>> = [
    {
      title: "任务名称",
      dataIndex: "name",
      key: "name",
      width: 200,
      ellipsis: true,
      fixed: "left",
    },
    {
      title: "任务类型",
      key: "type",
      dataIndex: "type",
      width: 200,
      render(value: number) {
        return value === 0 ? "策略" : "因子";
      },
    },
    {
      title: "运行状态",
      dataIndex: "status",
      key: "status",
      ellipsis: true,
      width: 200,
      render: (status) => {
        return (
          <span
            className={classNames(`${clsPrefix}-status`, {
              success: status === 1,
              error: status === 2,
              running: status === 0,
            })}
          >
            {status === 0 ? "运行中" : status === 1 ? "成功" : "失败"}
          </span>
        );
      },
    },
    {
      title: "开始时间",
      dataIndex: "startTime",
      key: "startTime",
      width: 200,
      ellipsis: true,
    },
    {
      title: "结束时间",
      dataIndex: "endTime",
      key: "endTime",
      width: 200,
      ellipsis: true,
    },
    {
      title: "操作",
      key: "action",
      width: 180,
      fixed: "right",
      render: (_: any, data: DataType<Log>) => (
        <OperatorMenu data={data} onView={onView} />
      ),
    },
  ];

  const items: TabsProps["items"] = [
    {
      key: LogEnum.RUN,
      label: "运行日志",
      children: (
        <div className={`${clsPrefix}-incre-tracking-view-log`}>
          <CodeMirror
            value={logContent}
            theme={materialLight}
            extensions={[python()]}
            height="100%"
            editable={false}
            style={{ height: "100%" }}
          />
        </div>
      ),
    },
    {
      key: LogEnum.EXECUTE,
      label: "执行日志",
      children: (
        <div className={`${clsPrefix}-incre-tracking-view-log`}>
          <CodeMirror
            value={commandLogContent}
            theme={materialLight}
            extensions={[python()]}
            height="100%"
            editable={false}
            style={{ height: "100%" }}
          />
        </div>
      ),
    },
  ];

  return (
    <div>
      <Table
        columns={columns}
        dataSource={useDataSource<Log>(logs)}
        size="small"
        loading={logsLoading}
        scroll={{ x: 1100, y: "calc(100vh - 340px)" }}
        pagination={{
          size: "small",
          showTotal: (total) => `总共${total}条记录`,
          showSizeChanger: true,
          showQuickJumper: true,
          pageSizeOptions: ["10", "15", "30", "50"],
        }}
      />
      {logVisible && (
        <Modal
          title="运行日志"
          open={logVisible}
          width={1300}
          onCancel={() => setLogVisible(false)}
          onOk={() => setLogVisible(false)}
        >
          <Tabs items={items} />
        </Modal>
      )}
    </div>
  );
});
