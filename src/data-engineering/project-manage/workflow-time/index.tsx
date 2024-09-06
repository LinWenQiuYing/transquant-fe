import { clsPrefix } from "@transquant/constants";
import { DataType, usePagination } from "@transquant/utils";
import { useMount } from "ahooks";
import { Button, Card, Select, Space, Table } from "antd";
import type { ColumnsType } from "antd/es/table";
import classNames from "classnames";
import { observer } from "mobx-react";
import { useState } from "react";
import { useStores } from "../../hooks";
import { WorkflowTimeItem } from "../../types";
import "./index.less";
import OperatorMenu from "./OperatorMenu";

export default observer(function WorkflowTime() {
  const {
    workflowTime,
    workflowTimeLoading,
    onWorkflowTimePagination,
    workflowTimePagination,
    getWorkflowTime,
    getWorkFlowDefinitionList,
    releaseState,
    failureStrategy,
    flowValue,
    onFlowValue,
  } = useStores().projectManageStore;
  const [flowOptions, setFlowOptions] = useState([]);

  const columns: ColumnsType<DataType<WorkflowTimeItem>> = [
    {
      title: "序号",
      dataIndex: "index",
      key: "index",
      width: 60,
      fixed: "left",
    },
    {
      title: "工作流名称",
      dataIndex: "name",
      key: "name",
      width: 200,
      fixed: "left",
      ellipsis: true,
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
      title: "定时",
      key: "crontab",
      dataIndex: "crontab",
      width: 180,
    },
    {
      title: "失败策略",
      key: "failStrategy",
      dataIndex: "failStrategy",
      width: 100,
      render: (text) => {
        return failureStrategy[text];
      },
    },
    {
      title: "状态",
      key: "status",
      dataIndex: "status",
      width: 100,
      render: (text: string) => {
        return (
          <span
            className={classNames(`${clsPrefix}-status`, {
              success: text === "ONLINE",
              pending: text === "OFFLINE",
            })}
          >
            {releaseState[text]}
          </span>
        );
      },
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
      width: 140,
      render: (_: any, data: DataType<WorkflowTimeItem>) => (
        <OperatorMenu data={data} />
      ),
    },
  ];

  const getDataSource = (data: WorkflowTimeItem[] | undefined) => {
    if (!data) return [];

    return data.map((item) => ({
      key: item.id,
      ...item,
    }));
  };

  useMount(async () => {
    let list = await getWorkFlowDefinitionList();
    list = list.map((item: any) => {
      return {
        value: item.code,
        label: item.name,
      };
    });
    setFlowOptions(list);
  });

  const extraEl = (
    <Space>
      <Select
        allowClear
        style={{ width: "200px" }}
        placeholder="工作流"
        value={flowValue}
        onChange={(value) => {
          onFlowValue(value);
        }}
        options={flowOptions}
      />
      <Button type="primary" onClick={getWorkflowTime}>
        查询
      </Button>
    </Space>
  );

  return (
    <Card
      title="定时管理"
      extra={extraEl}
      className={`${clsPrefix}-workflow-time`}
    >
      <Table
        columns={columns}
        dataSource={getDataSource(workflowTime?.list)}
        size="small"
        loading={workflowTimeLoading}
        scroll={{
          x: "max-content",
          y: "calc(100vh - 294px)",
        }}
        pagination={{
          ...usePagination({
            total: workflowTime?.total,
            IPageNum: workflowTimePagination.pageNum,
            IPageSize: workflowTimePagination.pageSize,
            onPaginationChange: onWorkflowTimePagination,
            onRequest() {
              getWorkflowTime();
            },
          }),
        }}
      />
    </Card>
  );
});
