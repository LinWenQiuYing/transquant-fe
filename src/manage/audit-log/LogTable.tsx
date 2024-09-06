import { clsPrefix } from "@transquant/constants";
import { DataType } from "@transquant/utils";
import { Table } from "antd";
import type { ColumnsType } from "antd/es/table";
import classNames from "classnames";
import { observer } from "mobx-react";
import { useStores } from "../hooks";
import usePagination from "../hooks/usePagination";
import { AuditLogItem } from "../types";

const getDataSource = (data?: AuditLogItem[]) => {
  if (!data) return [];
  return data.map((item) => ({
    key: item.id,
    ...item,
  }));
};

export default observer(function LogTable() {
  const { getAuditLog, auditLog, loading } = useStores().auditLogStore;

  const columns: ColumnsType<DataType<AuditLogItem>> = [
    {
      title: "事件类型",
      dataIndex: "event",
      key: "event",
      ellipsis: true,
    },
    {
      title: "用户",
      dataIndex: "userName",
      key: "userName",
      ellipsis: true,
    },
    {
      title: "事件描述",
      dataIndex: "eventDesc",
      key: "eventDesc",
      ellipsis: true,
    },
    {
      title: "状态",
      dataIndex: "status",
      key: "status",
      ellipsis: true,
      render: (status) => {
        return (
          <span
            className={classNames(`${clsPrefix}-audit-log-status`, {
              success: status === 2,
              error: status === 1,
              pending: status === 0,
            })}
          >
            {status === 0 ? "运行中" : status === 1 ? "失败" : "成功"}
          </span>
        );
      },
    },
    {
      title: "日期时间",
      dataIndex: "createTime",
      key: "createTime",
      ellipsis: true,
    },
    {
      title: "ip地址",
      dataIndex: "ipAddress",
      key: "ipAddress",
      ellipsis: true,
    },
  ];

  return (
    <Table
      columns={columns}
      dataSource={getDataSource(auditLog?.list)}
      loading={loading}
      size="small"
      scroll={{ y: "calc(100vh - 320px)" }}
      pagination={{
        ...usePagination({
          total: auditLog?.total,
          onRequest(pageIndex, pageSize) {
            getAuditLog({ pageIndex, pageSize });
          },
        }),
      }}
    />
  );
});
