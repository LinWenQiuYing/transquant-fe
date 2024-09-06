import { getAccess, Permission } from "@transquant/ui";
import { DataType, usePagination } from "@transquant/utils";
import { Table, Tooltip, Typography } from "antd";
import type { ColumnsType } from "antd/es/table";
import { observer } from "mobx-react";
import { useStores } from "../../hooks";
import { SourceListItem } from "../../types";
import OperatorMenu from "./OperatorMenu";

export default observer(function SourceTable({
  readonly,
}: {
  readonly: boolean;
}) {
  const {
    sourceList,
    sourcePagination,
    sourceListLoading,
    onSourcePaginationChange,
    getSourceList,
  } = useStores().sourceCenterStore;

  const columns: ColumnsType<DataType<SourceListItem>> = [
    {
      title: "序号",
      dataIndex: "index",
      key: "index",
      width: 60,
      fixed: "left",
    },
    {
      title: "源名称",
      dataIndex: "name",
      key: "name",
      width: 200,
      fixed: "left",
      ellipsis: true,
    },
    // {
    //   title: "所属用户",
    //   key: "person",
    //   dataIndex: "person",
    //   width: 180,
    //   ellipsis: true,
    // },
    {
      title: "源类型",
      dataIndex: "type",
      key: "type",
      width: 100,
      ellipsis: true,
    },
    {
      title: "参数",
      dataIndex: "params",
      key: "params",
      width: 180,
      render: (params) => {
        return (
          <Permission code={readonly ? "B090101" : "B200104"} disabled>
            <Tooltip
              title={
                getAccess(readonly ? "B090101" : "B200104") ? (
                  <code>{params}</code>
                ) : (
                  ""
                )
              }
              trigger="click"
            >
              <Typography.Link>点击查看</Typography.Link>
            </Tooltip>
          </Permission>
        );
      },
    },
    {
      title: "描述",
      dataIndex: "desc",
      key: "desc",
      width: 300,
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
    !readonly
      ? {
          title: "操作",
          key: "action",
          fixed: "right",
          width: 120,
          render: (_: any, data: DataType<SourceListItem>) => (
            <OperatorMenu data={data} readonly={readonly} />
          ),
        }
      : {},
  ];

  const getDataSource = (data: SourceListItem[] | undefined) => {
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
        dataSource={getDataSource(sourceList?.list)}
        size="small"
        loading={sourceListLoading}
        scroll={{
          x: 1500,
          y: "calc(100vh - 340px)",
        }}
        pagination={{
          ...usePagination({
            total: sourceList?.total,
            IPageNum: sourcePagination.pageNum,
            IPageSize: sourcePagination.pageSize,
            onPaginationChange: onSourcePaginationChange,
            onRequest() {
              getSourceList(readonly);
            },
          }),
        }}
      />
    </div>
  );
});
