import { DataType, usePagination } from "@transquant/utils";
import { Table, Tooltip } from "antd";
import type { ColumnsType } from "antd/es/table";
import { observer } from "mobx-react";
import { useStores } from "../../hooks";
import { EnvironmentListItem } from "../../types";
import OperatorMenu from "./OperatorMenu";

export default observer(function EnvironmentTable() {
  const {
    environmentList,
    environmentPagination,
    environmentListLoading,
    onEnvironmentPaginationChange,
    getEnvironmentList,
  } = useStores().environmentManageStore;

  const columns: ColumnsType<DataType<EnvironmentListItem>> = [
    {
      title: "序号",
      dataIndex: "index",
      key: "index",
      width: 60,
      fixed: "left",
    },
    {
      title: "环境名称",
      dataIndex: "name",
      key: "name",
      width: 200,
      fixed: "left",
      ellipsis: true,
    },
    {
      title: "环境配置",
      key: "params",
      dataIndex: "params",
      width: 200,
      ellipsis: true,
      render: (params) => {
        return (
          <Tooltip title={params}>
            <span style={{ cursor: "pointer" }}>{params}</span>
          </Tooltip>
        );
      },
    },
    {
      title: "环境描述",
      dataIndex: "desc",
      key: "desc",
      width: 180,
      ellipsis: true,
      render: (desc) => {
        return desc || "--";
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
      width: 60,
      render: (_: any, data: DataType<EnvironmentListItem>) => (
        <OperatorMenu data={data} />
      ),
    },
  ];

  const getDataEnvironment = (data: EnvironmentListItem[] | undefined) => {
    if (!data) return [];

    return data.map((item) => ({
      key: item.id,
      ...item,
    }));
  };

  return (
    <div>
      <Table
        columns={columns}
        dataSource={getDataEnvironment(environmentList?.list)}
        size="small"
        loading={environmentListLoading}
        scroll={{
          x: "max-content",
          y: "calc(100vh - 340px)",
        }}
        pagination={{
          ...usePagination({
            total: environmentList?.total,
            IPageNum: environmentPagination.pageNum,
            IPageSize: environmentPagination.pageSize,
            onPaginationChange: onEnvironmentPaginationChange,
            onRequest() {
              getEnvironmentList();
            },
          }),
        }}
      />
    </div>
  );
});
