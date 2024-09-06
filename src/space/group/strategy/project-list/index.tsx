import { PopoverTag } from "@transquant/common";
import { DataType, usePagination } from "@transquant/utils";
import { Table } from "antd";
import type { ColumnsType } from "antd/es/table";
import { observer } from "mobx-react";
import { useState } from "react";
import { useStores } from "../../../hooks";
import { GroupProjectItem } from "../../../types";
import "./index.less";
import OperatorMenu from "./OperatorMenu";
import SearchHeader from "./SearchHeader";

export default observer(function ProjectList() {
  const {
    projects,
    strategyProjectListLoading,
    pagination,
    onPaginationChange,
    getTeamStrategyProject,
  } = useStores().groupStrategyStore;
  const [collapse, setCollapse] = useState(true);

  const columns: ColumnsType<DataType<GroupProjectItem>> = [
    {
      title: "项目名称",
      dataIndex: "name",
      key: "name",
      width: 200,
      fixed: "left",
      ellipsis: true,
      render: (name) => {
        return <div style={{ color: "var(--red-600" }}>{name}</div>;
      },
    },
    {
      title: "标签",
      key: "tags",
      dataIndex: "tags",
      width: 300,
      render: (_, { tags }) => <PopoverTag tags={tags} />,
    },
    {
      title: "发布人",
      dataIndex: "publisher",
      key: "publisher",
      width: 100,
    },
    {
      title: "所有者",
      dataIndex: "owner",
      key: "owner",
      ellipsis: true,
      width: 160,
    },
    {
      title: "发布时间",
      dataIndex: "folderTime",
      key: "folderTime",
      width: 200,
    },
    {
      title: "申请工单",
      dataIndex: "code",
      key: "code",
      width: 200,
    },
    {
      title: "描述",
      dataIndex: "comment",
      key: "comment",
      width: 350,
      ellipsis: true,
    },
    {
      title: "操作",
      key: "action",
      fixed: "right",
      width: 180,
      render: (_: any, data: DataType<GroupProjectItem>) => (
        <OperatorMenu data={data} />
      ),
    },
  ];

  const getDataSource = (data: GroupProjectItem[] | undefined) => {
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
        dataSource={getDataSource(projects?.list)}
        size="small"
        loading={strategyProjectListLoading}
        scroll={{
          x: 1500,
          y: collapse ? "calc(100vh - 340px)" : "calc(100vh - 388px)",
        }}
        pagination={{
          ...usePagination({
            total: projects?.total,
            IPageNum: pagination.pageNum,
            IPageSize: pagination.pageSize,
            onPaginationChange,
            onRequest() {
              getTeamStrategyProject();
            },
          }),
        }}
        title={() => <SearchHeader onCollapseChange={setCollapse} />}
      />
    </div>
  );
});
