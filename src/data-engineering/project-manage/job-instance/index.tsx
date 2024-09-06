import { clsPrefix } from "@transquant/constants";
import { Permission } from "@transquant/ui";
import { DataType, usePagination } from "@transquant/utils";
import { Card, Table, Typography } from "antd";
import type { ColumnsType } from "antd/es/table";
import { observer } from "mobx-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useStores } from "../../hooks";
import { JobInstanceItem } from "../../types";
import "./index.less";
import OperatorMenu from "./OperatorMenu";
import SearchHeader from "./SearchHeader";

export default observer(function JobInstance() {
  const {
    projectInfo,
    jobInstance,
    jobInstanceLoading,
    onJobInstancePagination,
    jobInstancePagination,
    getJobInstance,
    taskStatusOptions,
  } = useStores().projectManageStore;
  const [collapse, setCollapse] = useState(false);
  // const { pathname } = useLocation();
  const navigate = useNavigate();
  const handleCheckProject = (data: JobInstanceItem) => {
    navigate(
      `/transmatrix/project-manage/${projectInfo?.code}/job-instance/instance/${data.workflowId}`
    );
  };

  const columns: ColumnsType<DataType<JobInstanceItem>> = [
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
    },
    {
      title: "工作流实例",
      dataIndex: "workflowName",
      key: "workflowName",
      width: 250,
      ellipsis: true,
      render: (text, record: JobInstanceItem) => {
        return (
          <Permission code="B100129" disabled>
            <Typography.Link onClick={() => handleCheckProject(record)}>
              {text}
            </Typography.Link>
          </Permission>
        );
      },
    },
    {
      title: "执行用户",
      dataIndex: "excuteUser",
      key: "excuteUser",
      width: 100,
    },
    {
      title: "节点类型",
      dataIndex: "nodeType",
      key: "nodeType",
      width: 100,
    },
    {
      title: "状态",
      key: "status",
      dataIndex: "status",
      width: 100,
      render: (status) => {
        const state = taskStatusOptions.find((v) => v.value === status);
        return state?.label;
      },
    },
    {
      title: "提交时间",
      dataIndex: "submitTime",
      key: "submitTime",
      width: 180,
    },
    {
      title: "开始时间",
      dataIndex: "startTime",
      key: "startTime",
      width: 180,
    },
    {
      title: "结束时间",
      dataIndex: "endTime",
      key: "endTime",
      width: 180,
    },
    {
      title: "运行时长",
      dataIndex: "runTime",
      key: "runTime",
      width: 150,
    },
    {
      title: "操作",
      key: "action",
      fixed: "right",
      width: 130,
      render: (_: any, data: DataType<JobInstanceItem>) => (
        <OperatorMenu data={data} />
      ),
    },
  ];

  const getDataSource = (data: JobInstanceItem[] | undefined) => {
    if (!data) return [];

    return data.map((item) => ({
      key: item.id,
      ...item,
    }));
  };

  return (
    <Card title="任务实例" className={`${clsPrefix}-job-instance`}>
      <Table
        columns={columns}
        dataSource={getDataSource(jobInstance?.list)}
        size="small"
        loading={jobInstanceLoading}
        scroll={{
          x: "max-content",
          y: collapse ? "calc(100vh - 346px)" : "calc(100vh - 394px)",
        }}
        pagination={{
          ...usePagination({
            total: jobInstance?.total,
            IPageNum: jobInstancePagination.pageNum,
            IPageSize: jobInstancePagination.pageSize,
            onPaginationChange: onJobInstancePagination,
            onRequest() {
              getJobInstance();
            },
          }),
        }}
        title={() => <SearchHeader onCollapseChange={setCollapse} />}
      />
    </Card>
  );
});
