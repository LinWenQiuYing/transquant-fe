import { PopoverTag } from "@transquant/common";
import { DataType, usePagination } from "@transquant/utils";
import { Table } from "antd";
import type { ColumnsType } from "antd/es/table";
import { observer } from "mobx-react";
import { useDataSource, useStores } from "../../../hooks";
import { ProjectItem } from "../../../types";
import "./index.less";
import OperatorMenu from "./OperatorMenu";
import SearchHeader from "./SearchHeader";

export default observer(function ProjectList() {
  const {
    projects,
    getFactorProject,
    pagination,
    factorProjectListLoading,
    onPaginationChange,
  } = useStores().factorResearchStore;

  const columns: ColumnsType<DataType<ProjectItem>> = [
    {
      title: "项目名称",
      dataIndex: "name",
      key: "name",
      width: 200,
      ellipsis: true,
      fixed: "left",
      render: (name) => {
        return <div style={{ color: "var(--red-600" }}>{name}</div>;
      },
    },
    {
      title: "标签",
      key: "tags",
      dataIndex: "tags",
      width: 200,
      render: (_, { tags }) => <PopoverTag tags={tags} />,
    },
    {
      title: "创建时间",
      dataIndex: "folderTime",
      key: "folderTime",
      width: 200,
      ellipsis: true,
    },
    {
      title: "备注信息",
      dataIndex: "comment",
      key: "comment",
      width: 200,
      ellipsis: true,
    },
    {
      title: "操作",
      key: "action",
      width: 220,
      fixed: "right",
      render: (_: any, data: DataType<ProjectItem>) => (
        <OperatorMenu data={data} />
      ),
    },
  ];

  return (
    <div>
      <Table
        columns={columns}
        dataSource={useDataSource<ProjectItem>(projects?.list)}
        size="small"
        loading={!projects?.list || factorProjectListLoading}
        scroll={{ x: 1100, y: "calc(100vh - 340px)" }}
        pagination={{
          ...usePagination({
            total: projects?.total,
            IPageNum: pagination.pageNum,
            IPageSize: pagination.pageSize,
            onPaginationChange,
            onRequest(pageIndex, pageSize) {
              getFactorProject({ pageNum: pageIndex, pageSize });
            },
          }),
        }}
        title={() => <SearchHeader />}
      />
    </div>
  );
});
