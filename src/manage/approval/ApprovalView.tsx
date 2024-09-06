import { clsPrefix } from "@transquant/constants";
import { useStores as usePersonalStores } from "@transquant/person/hooks";
import { CategoryEmum } from "@transquant/person/publish/approve-record";
import { DataType, useDataSource, usePagination } from "@transquant/utils";
import { useMount, useUnmount } from "ahooks";
import { Card, Table, Tag } from "antd";
import type { ColumnsType } from "antd/es/table";
import classNames from "classnames";
import { observer } from "mobx-react";
import { useState } from "react";
import { useStores } from "../hooks";
import { ApprovalItem } from "../types";
import "./index.less";
import OperatorMenu from "./OperatorMenu";
import SearchHeader from "./SearchHeader";

export enum OrderStatus {
  "审核中",
  "入库",
  "驳回",
}

export default observer(function ApprovalView() {
  const {
    getTeamApprovalList,
    approvalList,
    approvalListLoading,
    pagination,
    onPaginationChange,
    reset,
  } = useStores().approvalStore;
  const { getAllTeamInfos, getPublisherList, getAuditorList } =
    usePersonalStores().publishStore;
  const [collapse, setCollapse] = useState(true);

  useMount(() => {
    getAllTeamInfos("160101");
    getPublisherList();
    getAuditorList();
  });

  useUnmount(() => {
    reset();
  });

  const columns: ColumnsType<DataType<ApprovalItem>> = [
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
      title: "发布人",
      dataIndex: "publisher",
      key: "publisher",
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
      ellipsis: true,
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
      fixed: "right",
      ellipsis: true,
      render: (_: any, data: DataType<ApprovalItem>) => (
        <OperatorMenu data={data} />
      ),
    },
  ];

  return (
    <Card
      title="日志列表"
      style={{ marginTop: 20 }}
      className={`${clsPrefix}-approval-log-card`}
    >
      <Table
        columns={columns}
        dataSource={useDataSource<ApprovalItem>(approvalList?.list)}
        size="small"
        loading={approvalListLoading}
        className={`${clsPrefix}-publish-table`}
        scroll={{
          x: 1300,
          y: collapse ? "calc(100vh - 360px)" : "calc(100vh - 456px)",
        }}
        pagination={{
          ...usePagination({
            total: approvalList?.total,
            IPageNum: pagination.pageNum,
            IPageSize: pagination.pageSize,
            onPaginationChange,
            onRequest(pageIndex, pageSize) {
              getTeamApprovalList({ pageNum: pageIndex, pageSize });
            },
          }),
        }}
        title={() => <SearchHeader onCollapseChange={setCollapse} />}
      />
    </Card>
  );
});
