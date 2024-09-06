import { clsPrefix } from "@transquant/constants";
import { DataType, useDataSource } from "@transquant/utils";
import { useMount } from "ahooks";
import { Table, Tag } from "antd";
import type { ColumnsType } from "antd/es/table";
import classNames from "classnames";
import { observer } from "mobx-react";
import { useState } from "react";
import { useStores } from "../../hooks";
import { Audit } from "../../types";
import "./index.less";
import OperatorMenu from "./OperatorMenu";
import SearchHeader from "./SearchHeader";

const auditStatus = {
  "1": "已通过",
  "2": "未通过",
  "99": "审批中",
  "100": "待审核",
};

export enum OrderStatus {
  "审核中",
  "入库",
  "驳回",
}

export enum CategoryEmum {
  "逐层审批",
  "无需审批",
  "全部通过",
  "任一人通过",
}

export default observer(function ApproveRecord() {
  const { getMyAuditList, audit, auditLoading } = useStores().publishStore;
  const [collapse, setCollapse] = useState(true);

  useMount(() => {
    getMyAuditList({ pageNum: 1, pageSize: 15 });
  });

  const columns: ColumnsType<DataType<Audit>> = [
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
      width: 200,
      ellipsis: true,
    },
    {
      title: "审批状态",
      dataIndex: "auditStatus",
      ellipsis: true,
      width: 200,
      render: (status: number) => {
        return (
          <span
            className={classNames(`${clsPrefix}-status`, {
              success: status === 1,
              error: status === 2,
              running: status === 99,
            })}
          >
            {auditStatus[`${status}` as keyof typeof auditStatus]}
          </span>
        );
      },
    },
    {
      title: "工单状态",
      dataIndex: "status",
      width: 200,
      ellipsis: true,
      render: (status: OrderStatus) => {
        return (
          <span
            className={classNames(`${clsPrefix}-status`, {
              pending: status === OrderStatus.入库,
              error: status === OrderStatus.驳回,
              success: status === OrderStatus.审核中,
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
      render: (_: any, data: DataType<Audit>) => <OperatorMenu data={data} />,
    },
  ];

  return (
    <Table
      columns={columns}
      dataSource={useDataSource<Audit>(audit)}
      size="small"
      loading={auditLoading}
      className={`${clsPrefix}-publish-table`}
      scroll={{
        x: 1300,
        y: collapse ? "calc(100vh - 340px)" : "calc(100vh - 468px)",
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
