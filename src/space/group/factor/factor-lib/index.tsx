import { PopoverTag } from "@transquant/common";
import { clsPrefix } from "@transquant/constants";
import { DataType, usePagination } from "@transquant/utils";
import { Table } from "antd";
import type { ColumnsType } from "antd/es/table";
import { observer } from "mobx-react";
import { useState } from "react";
import { useDataSource, useStores } from "../../../hooks";
import { GroupFactorLibItem } from "../../../types";
import "./index.less";
import OperatorMenu from "./OperatorMenu";
import SearchHeader from "./SearchHeader";

export default observer(function FactorLib() {
  const {
    factorLib,
    factorLibLoading,
    pagination,
    onPaginationChange,
    getTeamFactorResultList,
  } = useStores().groupFactorStore;
  const [collapse, setCollapse] = useState(true);

  const columns: ColumnsType<DataType<GroupFactorLibItem>> = [
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
      title: "因子名称",
      dataIndex: "name",
      width: 200,
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
      title: "发布人",
      dataIndex: "publisher",
      key: "publisher",
      width: 100,
    },
    {
      title: "申请工单",
      dataIndex: "code",
      key: "code",
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
      render: (_: any, data: DataType<GroupFactorLibItem>) => (
        <OperatorMenu data={data} />
      ),
    },
  ];

  return (
    <Table
      columns={columns}
      dataSource={useDataSource<GroupFactorLibItem>(factorLib?.list)}
      size="small"
      loading={factorLibLoading}
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
          onRequest() {
            getTeamFactorResultList();
          },
        }),
      }}
      title={() => <SearchHeader onCollapseChange={setCollapse} />}
    />
  );
});
