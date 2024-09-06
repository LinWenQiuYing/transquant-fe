import { QuestionCircleOutlined } from "@ant-design/icons";
import { CustomTitle, IconFont } from "@transquant/ui";
import { DataType, useDataSource } from "@transquant/utils";
import { Table, TableColumnsType, Tooltip, Typography } from "antd";
import { TableRowSelection } from "antd/es/table/interface";
import Permission from "../../permission";
import useRole, { RoleType } from "./use-role";

export default function Role(props: ReturnType<typeof useRole>) {
  const {
    title,
    roles,
    selectedRowKeys,
    onSelectedRowKeysChange,
    permission,
    permissionVisible,
    onViewClick,
    onPermissionVisibleChange,
  } = props;

  const columns: TableColumnsType<DataType<RoleType>> = [
    {
      title: "角色",
      dataIndex: "roleName",
    },
    {
      title: "所属原团队",
      dataIndex: "belongTeamName",
    },
    {
      title: "角色描述",
      dataIndex: "desc",
    },
    {
      title: "操作",
      dataIndex: "operation",
      render(_, record) {
        return (
          <Tooltip title="查看详情">
            <Typography.Link onClick={() => onViewClick(record.id)}>
              <IconFont type="chakanxiangqing" />
            </Typography.Link>
          </Tooltip>
        );
      },
    },
  ];

  const rowSelection: TableRowSelection<DataType<RoleType>> = {
    selectedRowKeys,
    onChange: (
      selectedRowKeys: React.Key[],
      selectedRows: DataType<RoleType>[]
    ) => {
      onSelectedRowKeysChange(selectedRowKeys as number[]);
      props.onChange(selectedRows);
    },
  };

  return (
    <div>
      <CustomTitle
        title="选择角色"
        tip={
          <Tooltip title={title}>
            <QuestionCircleOutlined />
          </Tooltip>
        }
      />
      <Table
        rowSelection={{
          type: "checkbox",
          ...rowSelection,
        }}
        rowKey={(record: DataType<RoleType>) => {
          return record.id;
        }}
        columns={columns}
        dataSource={useDataSource(roles)}
        pagination={false}
        scroll={{ y: 400 }}
        size="small"
      />
      {permissionVisible && permission && (
        <Permission
          permission={permission}
          visible={permissionVisible}
          onVisibleChange={onPermissionVisibleChange}
          readonly
        />
      )}
    </div>
  );
}
