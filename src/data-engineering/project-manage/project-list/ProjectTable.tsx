import { paths } from "@transquant/constants";
import { Permission } from "@transquant/ui";
import { DataType, usePagination } from "@transquant/utils";
import { Table, Typography } from "antd";
import type { ColumnsType } from "antd/es/table";
import { observer } from "mobx-react";
import { useNavigate } from "react-router-dom";
import { useStores } from "../../hooks";
import { ProjectListItem } from "../../types";
import OperatorMenu from "./OperatorMenu";

export default observer(function ProjectTable({
  fromManage,
}: {
  fromManage: boolean;
}) {
  const {
    projectList,
    projectPagination,
    projectListLoading,
    onProjectPaginationChange,
    getProjectList,
    onProjectInfo,
  } = useStores().projectManageStore;

  const navigate = useNavigate();

  const handleCheckProject = (data: ProjectListItem) => {
    onProjectInfo(data);
    navigate(`${paths.projectManage}/${data.code}`);
  };

  const columns: ColumnsType<DataType<ProjectListItem>> = [
    {
      title: "序号",
      dataIndex: "index",
      key: "index",
      width: 60,
      fixed: "left",
    },
    {
      title: "项目名称",
      dataIndex: "name",
      key: "name",
      width: 200,
      fixed: "left",
      ellipsis: true,
      render: (name, record: ProjectListItem) => {
        if (fromManage) {
          return <span>{name}</span>;
        }
        return (
          <Permission code="B100104" disabled>
            <Typography.Link onClick={() => handleCheckProject(record)}>
              {name}
            </Typography.Link>
          </Permission>
        );
      },
    },
    {
      title: "工作流定义数",
      dataIndex: "jobNumber",
      key: "jobNumber",
      width: 120,
    },
    {
      title: "正在运行的流程数",
      dataIndex: "ingNumber",
      key: "ingNumber",
      width: 180,
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
    {
      title: "操作",
      key: "action",
      fixed: "right",
      width: 100,
      render: (_: any, data: DataType<ProjectListItem>) => (
        <OperatorMenu data={data} fromManage={fromManage} />
      ),
    },
  ];

  const getDataSource = (data: ProjectListItem[] | undefined) => {
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
        dataSource={getDataSource(projectList?.list)}
        size="small"
        loading={projectListLoading}
        scroll={{
          x: 1100,
          y: "calc(100vh - 294px)",
        }}
        pagination={{
          ...usePagination({
            total: projectList?.total,
            IPageNum: projectPagination.pageNum,
            IPageSize: projectPagination.pageSize,
            onPaginationChange: onProjectPaginationChange,
            onRequest() {
              getProjectList(fromManage);
            },
          }),
        }}
      />
    </div>
  );
});
