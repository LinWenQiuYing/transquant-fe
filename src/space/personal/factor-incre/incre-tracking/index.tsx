import { PopoverTag } from "@transquant/common";
import { clsPrefix } from "@transquant/constants";
import { IncreTrackingStatus } from "@transquant/space/group/strategy-incre/incre-tracking";
import { DataType } from "@transquant/utils";
import { useMount } from "ahooks";
import { Table } from "antd";
import type { ColumnsType } from "antd/es/table";
import classNames from "classnames";
import { observer } from "mobx-react";
import { useState } from "react";
import { useDataSource, useStores } from "../../../hooks";
import { Job } from "../../../types";
import "./index.less";
import OperatorMenu from "./OperatorMenu";
import SearchHeader from "./SearchHeader";

export default observer(function IncreTracking() {
  const { jobs, factorQuartzJobLoading, getFactorQuartzJob } =
    useStores().factorResearchStore;
  const [collapse, setCollapse] = useState(true);

  useMount(() => {
    getFactorQuartzJob();
  });

  const columns: ColumnsType<DataType<Job>> = [
    {
      title: "任务名称",
      dataIndex: "jobName",
      fixed: "left",
      width: 200,
      ellipsis: true,
      render: (name) => {
        return <div style={{ color: "var(--red-600" }}>{name}</div>;
      },
    },
    {
      title: "类名",
      dataIndex: "className",
      width: 200,
      ellipsis: true,
    },
    {
      title: "因子名称",
      dataIndex: "name",
      width: 200,
      ellipsis: true,
    },
    {
      title: "标签",
      key: "tags",
      dataIndex: "tags",
      width: 300,
      ellipsis: true,
      render: (_, { tags }) => <PopoverTag tags={tags} />,
    },
    {
      title: "创建时间",
      dataIndex: "createTime",
      width: 200,
      ellipsis: true,
    },
    {
      title: "状态",
      dataIndex: "runStatus",
      key: "runStatus",
      ellipsis: true,
      width: 200,
      render: (status) => {
        return (
          <span
            className={classNames(`${clsPrefix}-status`, {
              pending: status === 3,
              error: status === 1,
              running: status === 0,
              success: status === 2,
            })}
          >
            {IncreTrackingStatus[status as keyof typeof IncreTrackingStatus]}
          </span>
        );
      },
    },
    {
      title: "历史回测开始时间",
      dataIndex: "startTime",
      width: 200,
      ellipsis: true,
    },
    {
      title: "调度频率",
      ellipsis: true,
      dataIndex: "scheduleFrequency",
      width: 200,
      render: (scheduleFrequency: number) => {
        return (
          <span>{scheduleFrequency === 0 ? "每天" : scheduleFrequency}</span>
        );
      },
    },
    {
      title: "调度时间",
      dataIndex: "scheduleTime",
      width: 200,
    },
    {
      title: "告警邮箱",
      dataIndex: "warningEmail",
      width: 200,
      ellipsis: true,
    },
    {
      title: "上次计算成功时间",
      dataIndex: "lastSuccessTime",
      width: 200,
    },
    {
      title: "操作",
      key: "action",
      width: 180,
      fixed: "right",
      render: (_: any, data: DataType<Job>) => <OperatorMenu data={data} />,
    },
  ];

  return (
    <Table
      columns={columns}
      dataSource={useDataSource<Job>(jobs)}
      size="small"
      loading={factorQuartzJobLoading}
      className={`${clsPrefix}-factor-lib-table`}
      scroll={{
        x: 1300,
        y: collapse ? "calc(100vh - 340px)" : "calc(100vh - 436px)",
      }}
      pagination={{
        size: "small",
        showTotal: (total) => `总共${total}条记录`,
        showSizeChanger: true,
        showQuickJumper: true,
        pageSizeOptions: ["10", "15", "30", "50"],
      }}
      title={() => <SearchHeader onCollapseChange={setCollapse} />}
    />
  );
});
