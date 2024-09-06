import { clsPrefix } from "@transquant/constants";
import { Permission } from "@transquant/ui";
import { DataType, usePagination } from "@transquant/utils";
import { Button, Card, Input, Space, Table, Tooltip, Typography } from "antd";
import type { SearchProps } from "antd/es/input/Search";
import type { ColumnsType } from "antd/es/table";
import classNames from "classnames";
import { observer } from "mobx-react";
import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useStores } from "../../hooks";
import { WorkflowDefinitionItem } from "../../types";
import ImportModal from "./ImportModal";
import "./index.less";
import OperatorMenu from "./OperatorMenu";

const { Search } = Input;

export default observer(function WorkflowDefinition() {
  const {
    workflowDefinition,
    workflowDefinitionLoading,
    onWorkflowDefinitionPagination,
    onWorkflowDefinitionSearchConfig,
    workflowDefinitionPagination,
    getWorkflowDefinition,
    releaseState,
    batchExport,
    batchDelete,
  } = useStores().projectManageStore;
  const navigate = useNavigate();
  const { pathname } = useLocation();

  const handleNameClick = (record: WorkflowDefinitionItem) => {
    navigate(`${pathname}/detail/${record.code}`);
  };

  const columns: ColumnsType<DataType<WorkflowDefinitionItem>> = [
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
      render: (name, record: WorkflowDefinitionItem) => {
        return (
          <Permission code="B100106" disabled>
            <Typography.Link onClick={() => handleNameClick(record)}>
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
      title: "定时状态",
      key: "timeStatus",
      dataIndex: "timeStatus",
      width: 100,
      render: (text: string) => {
        return (
          (text && (
            <span
              className={classNames(`${clsPrefix}-status`, {
                success: text === "ONLINE",
                pending: text === "OFFLINE",
              })}
            >
              {releaseState[text]}
            </span>
          )) ||
          "--"
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
      title: "描述",
      dataIndex: "desc",
      key: "desc",
      width: 200,
      ellipsis: true,
    },
    {
      title: "操作",
      key: "action",
      fixed: "right",
      width: 200,
      render: (_: any, data: DataType<WorkflowDefinitionItem>) => (
        <OperatorMenu data={data} />
      ),
    },
  ];

  const getDataSource = (data: WorkflowDefinitionItem[] | undefined) => {
    if (!data) return [];

    return data.map((item) => ({
      key: item.id,
      ...item,
    }));
  };

  const onSearch: SearchProps["onSearch"] = (value) => {
    onWorkflowDefinitionSearchConfig({ searchVal: value });
    getWorkflowDefinition();
  };

  const [selectedRowKeys, setSelectedRowKeys] = useState<string[]>([]);
  const [importVisible, setImportVisible] = useState(false);

  const handleCreateWorkflow = () => {
    navigate("create");
  };

  const handleImportWorkFlow = () => {
    setImportVisible(true);
  };

  const handleBatchExport = () => {
    batchExport(selectedRowKeys);
  };

  const handleBatchDelete = () => {
    batchDelete(selectedRowKeys);
  };

  const extraEl = (
    <Space>
      <Search
        placeholder="请输入关键字"
        allowClear
        onSearch={onSearch}
        style={{ width: 200 }}
      />
      <Permission code="B100105" hidden>
        <Button type="primary" onClick={handleCreateWorkflow}>
          创建工作流
        </Button>
      </Permission>
      <Button type="primary" onClick={handleImportWorkFlow}>
        导入工作流
      </Button>
      <Tooltip title="至少选择一个工作流">
        <Button
          type="primary"
          disabled={!selectedRowKeys.length}
          onClick={handleBatchExport}
        >
          批量导出
        </Button>
      </Tooltip>
      <Tooltip title="至少选择一个工作流">
        <Button
          type="primary"
          disabled={!selectedRowKeys.length}
          onClick={handleBatchDelete}
        >
          批量删除
        </Button>
      </Tooltip>
    </Space>
  );

  const rowSelection = {
    onChange: (selectedRowKeys: React.Key[]) => {
      setSelectedRowKeys(selectedRowKeys as string[]);
    },
  };

  return (
    <Card
      title="工作流定义"
      extra={extraEl}
      className={`${clsPrefix}-workflow-define`}
    >
      <Table
        rowSelection={{
          type: "checkbox",
          ...rowSelection,
        }}
        columns={columns}
        dataSource={getDataSource(workflowDefinition?.list)}
        size="small"
        loading={workflowDefinitionLoading}
        rowKey={(record) => record.code}
        scroll={{
          x: "max-content",
          y: "calc(100vh - 294px)",
        }}
        pagination={{
          ...usePagination({
            total: workflowDefinition?.total,
            IPageNum: workflowDefinitionPagination.pageNum,
            IPageSize: workflowDefinitionPagination.pageSize,
            onPaginationChange: onWorkflowDefinitionPagination,
            onRequest() {
              getWorkflowDefinition();
            },
          }),
        }}
      />
      {importVisible && (
        <ImportModal
          visible={importVisible}
          onVisibleChange={setImportVisible}
        />
      )}
    </Card>
  );
});
