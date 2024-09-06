import { clsPrefix } from "@transquant/constants";
import { DataType, usePagination } from "@transquant/utils";
import { Table } from "antd";
import type { ColumnsType } from "antd/es/table";
import { observer } from "mobx-react";
import { useDataSource, useStores } from "../../../hooks";
import { FactorLibItem } from "../../../types";
import "./index.less";
import SearchHeader from "./SearchHeader";

import { PopoverTag } from "@transquant/common";
import { useState } from "react";
import OperatorMenu from "./OperatorMenu";

export default observer(function FactorLib() {
  const {
    getFactorResultList,
    factorLib,
    factorLibLoading,
    pagination,
    onPaginationChange,
  } = useStores().factorResearchStore;
  const [collapse, setCollapse] = useState(true);

  const columns: ColumnsType<DataType<FactorLibItem>> = [
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
      ellipsis: true,
    },
    {
      title: "因子名称",
      dataIndex: "name",
      width: 200,
      ellipsis: true,
    },
    {
      title: "标签",
      key: "tags",
      dataIndex: "tags",
      width: 300,
      ellipsis: true,
      render: (_, { tags }) => <PopoverTag tags={tags} />,
    },
    {
      title: "修改时间",
      dataIndex: "srcUpdateTime",
      width: 200,
      ellipsis: true,
    },
    {
      title: "回测时间",
      dataIndex: "triggerTime",
      width: 200,
      ellipsis: true,
    },
    {
      title: "回测时间区间",
      ellipsis: true,
      dataIndex: "timeRange",
      width: 200,
    },
    {
      title: "IC",
      dataIndex: "ic",
      width: 200,
    },
    {
      title: "IR",
      dataIndex: "ir",
      width: 200,
    },
    {
      title: "因子年化收益率",
      dataIndex: "annFactorReturn",
      width: 200,
    },
    {
      title: "操作",
      key: "action",
      width: 100,
      fixed: "right",
      render: (_: any, data: DataType<FactorLibItem>) => (
        <OperatorMenu data={data} />
      ),
    },
  ];

  return (
    <Table
      columns={columns}
      dataSource={useDataSource<FactorLibItem>(factorLib?.list)}
      size="small"
      loading={!factorLib?.list || factorLibLoading}
      className={`${clsPrefix}-factor-lib-table`}
      scroll={{
        x: 1300,
        y: collapse ? "calc(100vh - 340px)" : "calc(100vh - 436px)",
      }}
      pagination={{
        ...usePagination({
          total: factorLib?.total,
          IPageNum: pagination.pageNum,
          IPageSize: pagination.pageSize,
          onPaginationChange,
          onRequest(pageIndex, pageSize) {
            getFactorResultList({ pageNum: pageIndex, pageSize });
          },
        }),
      }}
      title={() => <SearchHeader onCollapseChange={setCollapse} />}
    />
  );
});
