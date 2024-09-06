import { clsPrefix } from "@transquant/constants";
import { Permission } from "@transquant/ui";
import { DataType, usePagination } from "@transquant/utils";
import { Card, Table, Typography } from "antd";
import type { ColumnsType } from "antd/es/table";
import { observer } from "mobx-react";
import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useStores } from "../../hooks";
import { WorkflowInstanceItem } from "../../types";
import OperatorMenu from "./OperatorMenu";
import SearchHeader from "./SearchHeader";

export default observer(function WorkflowInstance() {
  const {
    workflowInstance,
    workflowInstanceLoading,
    onWorkflowInstancePagination,
    workflowInstancePagination,
    // onSelectedKeysChange,
    getWorkflowInstance,
    commandType,
    flowStatusOptions,
  } = useStores().projectManageStore;
  const [collapse, setCollapse] = useState(false);
  const navigate = useNavigate();
  const { pathname } = useLocation();

  const handleCheckProject = (data: WorkflowInstanceItem) => {
    navigate(`${pathname}/detail/${data.id}`);
  };

  const columns: ColumnsType<DataType<WorkflowInstanceItem>> = [
    {
      title: "序号",
      dataIndex: "index",
      key: "index",
      width: 60,
      fixed: "left",
    },
    {
      title: "工作流实例名称",
      dataIndex: "name",
      key: "name",
      width: 200,
      fixed: "left",
      ellipsis: true,
      render: (name, record: WorkflowInstanceItem) => {
        return (
          <Permission code="B100116" disabled>
            <Typography.Link onClick={() => handleCheckProject(record)}>
              {name}
            </Typography.Link>
          </Permission>
        );
      },
    },
    {
      title: "状态",
      key: "status",
      dataIndex: "status",
      width: 100,
      render: (status) => {
        const state = flowStatusOptions.find((v) => v.value === status);
        return state?.label;
      },
    },
    {
      title: "运行类型",
      dataIndex: "runType",
      key: "runType",
      width: 100,
      render: (text) => {
        return commandType[text];
      },
    },
    {
      title: "调度时间",
      dataIndex: "useTime",
      key: "useTime",
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
      title: "运行次数",
      dataIndex: "runs",
      key: "runs",
      width: 100,
    },
    {
      title: "操作",
      key: "action",
      fixed: "right",
      width: 140,
      render: (_: any, data: DataType<WorkflowInstanceItem>) => (
        <OperatorMenu data={data} />
      ),
    },
  ];

  const getDataSource = (data: WorkflowInstanceItem[] | undefined) => {
    if (!data) return [];

    return data.map((item) => ({
      key: item.id,
      ...item,
    }));
  };

  return (
    <Card title="工作流实例" className={`${clsPrefix}-workflow-instance`}>
      <Table
        columns={columns}
        dataSource={getDataSource(workflowInstance?.list)}
        size="small"
        loading={workflowInstanceLoading}
        scroll={{
          x: "max-content",
          y: collapse ? "calc(100vh - 346px)" : "calc(100vh - 394px)",
        }}
        pagination={{
          ...usePagination({
            total: workflowInstance?.total,
            IPageNum: workflowInstancePagination.pageNum,
            IPageSize: workflowInstancePagination.pageSize,
            onPaginationChange: onWorkflowInstancePagination,
            onRequest() {
              getWorkflowInstance();
            },
          }),
        }}
        title={() => <SearchHeader onCollapseChange={setCollapse} />}
      />
    </Card>
  );
});
