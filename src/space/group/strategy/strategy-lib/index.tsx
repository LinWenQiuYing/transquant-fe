import { PopoverTag } from "@transquant/common";
import { clsPrefix } from "@transquant/constants";
import { DataType, usePagination } from "@transquant/utils";
import { Table } from "antd";
import type { ColumnsType } from "antd/es/table";
import { observer } from "mobx-react";
import { useState } from "react";
import { useDataSource, useStores } from "../../../hooks";
import { GroupStrategyLibItem } from "../../../types";
import "./index.less";
import OperatorMenu from "./OperatorMenu";
import SearchHeader from "./SearchHeader";

export default observer(function FactorLib() {
  const {
    strategyLib,
    strategyLibLoading,
    pagination,
    onPaginationChange,
    getTeamStrategyResultList,
  } = useStores().groupStrategyStore;
  const [collapse, setCollapse] = useState(true);

  const columns: ColumnsType<DataType<GroupStrategyLibItem>> = [
    {
      title: "项目名称",
      dataIndex: "projectName",
      fixed: "left",
      width: 200,
      ellipsis: true,
      render: (name) => {
        return <div style={{ color: "var(--red-600" }}>{name}</div>;
      },
    },
    {
      title: "类名",
      dataIndex: "className",
      width: 200,
    },
    {
      title: "策略名称",
      dataIndex: "name",
      width: 200,
    },
    {
      title: "标签",
      key: "tags",
      dataIndex: "tags",
      width: 300,
      render: (_, { tags }) => <PopoverTag tags={tags} />,
    },
    {
      title: "申请工单",
      dataIndex: "code",
      width: 200,
    },
    {
      title: "发布人",
      dataIndex: "publisher",
      width: 200,
    },
    {
      title: "修改时间",
      dataIndex: "srcUpdateTime",
      width: 200,
    },
    {
      title: "回测时间",
      dataIndex: "triggerTime",
      width: 200,
    },
    {
      title: "回测时间区间",
      dataIndex: "timeRange",
      width: 200,
    },
    {
      title: "年化收益率",
      dataIndex: "annStrategyReturn",
      width: 200,
    },
    {
      title: "Alpha",
      dataIndex: "alpha",
      width: 200,
    },
    {
      title: "Beta",
      dataIndex: "beta",
      width: 200,
    },
    {
      title: "基准",
      dataIndex: "benchmark",
      width: 200,
    },
    {
      title: "基准年化收益",
      dataIndex: "annBenchmarkReturn",
      width: 200,
    },
    {
      title: "夏普率",
      dataIndex: "sharpRatio",
      width: 200,
    },
    {
      title: "索提诺比率",
      dataIndex: "sortinoRatio",
      width: 200,
    },
    {
      title: "最大回撤",
      dataIndex: "maxDrawdown",
      width: 200,
    },
    {
      title: "最大回撤区间",
      dataIndex: "maxDrawdownRange",
      width: 200,
    },
    {
      title: "波动率",
      dataIndex: "volatility",
      width: 200,
    },
    {
      title: "操作",
      key: "action",
      width: 100,
      fixed: "right",
      render: (_: any, data: DataType<GroupStrategyLibItem>) => (
        <OperatorMenu data={data} />
      ),
    },
  ];

  return (
    <Table
      columns={columns}
      dataSource={useDataSource<GroupStrategyLibItem>(strategyLib?.list)}
      size="small"
      loading={strategyLibLoading}
      className={`${clsPrefix}-factor-lib-table`}
      scroll={{
        x: 1300,
        y: collapse ? "calc(100vh - 340px)" : "calc(100vh - 500px)",
      }}
      pagination={{
        ...usePagination({
          total: strategyLib?.total,
          IPageNum: pagination.pageNum,
          IPageSize: pagination.pageSize,
          onPaginationChange,
          onRequest() {
            getTeamStrategyResultList();
          },
        }),
      }}
      title={() => <SearchHeader onCollapseChange={setCollapse} />}
    />
  );
});
