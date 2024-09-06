import { clsPrefix } from "@transquant/constants";
import { DataType, usePagination } from "@transquant/utils";
import { Card, Table } from "antd";
import type { ColumnsType } from "antd/es/table";
import classNames from "classnames";
import { observer } from "mobx-react";
import { useStores } from "../../hooks";
import { JobDefinitionItem } from "../../types";
import "./index.less";
import OperatorMenu from "./OperatorMenu";
import SearchHeader from "./SearchHeader";

export default observer(function JobDefinition() {
  const {
    jobDefinition,
    jobDefinitionLoading,
    onJobDefinitionPagination,
    jobDefinitionPagination,
    getJobDefinition,
    workflowStatus,
  } = useStores().projectManageStore;

  const columns: ColumnsType<DataType<JobDefinitionItem>> = [
    {
      title: "序号",
      dataIndex: "index",
      key: "index",
      width: 60,
      fixed: "left",
    },
    {
      title: "任务名称",
      dataIndex: "jobName",
      key: "jobName",
      width: 200,
      fixed: "left",
      ellipsis: true,
      render: (jobName) => {
        // record: JobDefinitionItem todo
        return (
          <span style={{ color: "#E31430", cursor: "pointer" }}>{jobName}</span>
        );
      },
    },
    {
      title: "工作流名称",
      dataIndex: "workflowName",
      key: "workflowName",
      width: 200,
      ellipsis: true,
    },
    {
      title: "工作流状态",
      key: "workflowStatus",
      dataIndex: "workflowStatus",
      width: 100,
      render: (text) => {
        return (
          <span
            className={classNames(`${clsPrefix}-status`, {
              success: text === "ONLINE",
              pending: text === "OFFLINE",
            })}
          >
            {workflowStatus[text]}
          </span>
        );
      },
    },
    {
      title: "任务类型",
      dataIndex: "jobType",
      key: "jobType",
      width: 100,
    },
    {
      title: "版本",
      dataIndex: "version",
      key: "version",
      width: 100,
    },
    {
      title: "上游任务",
      dataIndex: "upstreamTasks",
      key: "upstreamTasks",
      width: 150,
    },
    {
      title: "创建时间",
      dataIndex: "createTime",
      key: "createTime",
      width: 180,
    },
    {
      title: "更新时间",
      dataIndex: "updateTime",
      key: "updateTime",
      width: 180,
    },
    {
      title: "操作",
      key: "action",
      fixed: "right",
      width: 80,
      render: (_: any, data: DataType<JobDefinitionItem>) => (
        <OperatorMenu data={data} />
      ),
    },
  ];

  const getDataSource = (data: JobDefinitionItem[] | undefined) => {
    if (!data) return [];

    return data.map((item) => ({
      key: item.id,
      ...item,
    }));
  };

  return (
    <Card title="任务定义" className={`${clsPrefix}-job-definition`}>
      <Table
        columns={columns}
        dataSource={getDataSource(jobDefinition?.list)}
        size="small"
        loading={jobDefinitionLoading}
        scroll={{
          x: "max-content",
          y: "calc(100vh - 346px)",
        }}
        pagination={{
          ...usePagination({
            total: jobDefinition?.total,
            IPageNum: jobDefinitionPagination.pageNum,
            IPageSize: jobDefinitionPagination.pageSize,
            onPaginationChange: onJobDefinitionPagination,
            onRequest() {
              getJobDefinition();
            },
          }),
        }}
        title={() => <SearchHeader />}
      />
    </Card>
  );
});
