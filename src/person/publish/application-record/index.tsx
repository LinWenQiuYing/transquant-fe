import { clsPrefix } from "@transquant/constants";
import { DataType, useDataSource, usePagination } from "@transquant/utils";
import { Table, Tag } from "antd";
import type { ColumnsType } from "antd/es/table";
import classNames from "classnames";
import { observer } from "mobx-react";
import { useState } from "react";
import { useStores } from "../../hooks";
import { PublishItem } from "../../types";
import { CategoryEmum, OrderStatus } from "../approve-record";
import "./index.less";
import OperatorMenu from "./OperatorMenu";
import SearchHeader from "./SearchHeader";

export default observer(function ApplicationRecord() {
  const {
    getMyPublishList,
    publish,
    publishLoading,
    pagination,
    onPaginationChange,
  } = useStores().publishStore;
  const [collapse, setCollapse] = useState(true);

  const columns: ColumnsType<DataType<PublishItem>> = [
    {
      title: "提交时间",
      dataIndex: "commitTime",
      key: "commitTime",
      fixed: "left",
      width: 200,
      ellipsis: true,
    },
    {
      title: "项目名称",
      dataIndex: "projectName",
      key: "projectName",
      width: 200,
      ellipsis: true,
    },
    {
      title: "项目类型",
      dataIndex: "projectType",
      width: 200,
      ellipsis: true,
      render(value: number) {
        return (
          <Tag color={value === 0 ? "blue" : "red"} bordered={false}>
            {value === 0 ? "因子" : "策略"}
          </Tag>
        );
      },
    },
    {
      title: "发布团队",
      dataIndex: "targetTeamName",
      key: "targetTeamName",
      width: 200,
      ellipsis: true,
    },
    {
      title: "工单状态",
      dataIndex: "status",
      ellipsis: true,
      width: 200,
      render: (status: OrderStatus) => {
        return (
          <span
            className={classNames(`${clsPrefix}-status`, {
              success: status === OrderStatus.入库,
              error: status === OrderStatus.驳回,
              pending: status === OrderStatus.审核中,
            })}
          >
            {OrderStatus[status]}
          </span>
        );
      },
    },
    {
      title: "审批方式",
      dataIndex: "category",
      width: 200,
      ellipsis: true,
      render(value) {
        return <span>{CategoryEmum[value]}</span>;
      },
    },
    {
      title: "审核员",
      dataIndex: "auditors",
      width: 200,
      ellipsis: true,
    },
    {
      title: "申请工单",
      dataIndex: "order",
      width: 200,
    },
    {
      title: "申请原因",
      dataIndex: "reason",
      width: 200,
      ellipsis: true,
    },
    {
      title: "操作",
      key: "action",
      width: 100,
      ellipsis: true,
      fixed: "right",
      render: (_: any, data: DataType<PublishItem>) => (
        <OperatorMenu data={data} />
      ),
    },
  ];

  return (
    <Table
      columns={columns}
      dataSource={useDataSource<PublishItem>(publish?.list)}
      size="small"
      loading={publishLoading}
      className={`${clsPrefix}-publish-table`}
      scroll={{
        x: 1300,
        y: collapse ? "calc(100vh - 340px)" : "calc(100vh - 468px)",
      }}
      pagination={{
        ...usePagination({
          total: publish?.total,
          IPageNum: pagination.pageNum,
          IPageSize: pagination.pageSize,
          onPaginationChange,
          onRequest(pageIndex, pageSize) {
            getMyPublishList({ pageNum: pageIndex, pageSize });
          },
        }),
      }}
      title={() => <SearchHeader onCollapseChange={setCollapse} />}
    />
  );
});
