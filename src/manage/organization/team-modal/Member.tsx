import { QuestionCircleOutlined } from "@ant-design/icons";
import { CustomTitle } from "@transquant/ui";
import { DataType, useDataSource } from "@transquant/utils";
import { Select, Table, TableColumnsType, Tooltip } from "antd";
import { TableRowSelection } from "antd/es/table/interface";
import useMember, { MemberType } from "./use-member";

export default function Member(props: ReturnType<typeof useMember>) {
  const {
    title,
    members,
    selectedRoles,
    selectedRowKeys,
    onSelectChange,
    onSelectedRowKeysChange,
  } = props;

  const roleOptions = selectedRoles.map((role) => {
    return {
      label: role.roleName,
      value: role.id,
    };
  });

  const columns: TableColumnsType<DataType<MemberType>> = [
    {
      title: "用户名",
      dataIndex: "realName",
    },
    {
      title: "所属原团队",
      dataIndex: "belongTeamName",
    },
    {
      title: "角色配置",
      dataIndex: "role",
      render(_, record) {
        const disabled = !selectedRowKeys.includes(record.id);

        return (
          <Select
            placeholder="请选择角色"
            options={roleOptions}
            className="w-full"
            disabled={disabled}
            onChange={onSelectChange(record.id)}
          />
        );
      },
    },
  ];

  const rowSelection: TableRowSelection<DataType<MemberType>> = {
    selectedRowKeys,
    onChange: (selectedRowKeys: React.Key[]) => {
      onSelectedRowKeysChange(selectedRowKeys as number[]);
    },
  };

  return (
    <div>
      <CustomTitle
        title="选择成员"
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
        rowKey={(record: DataType<MemberType>) => {
          return record.id;
        }}
        columns={columns}
        dataSource={useDataSource(members)}
        pagination={false}
        scroll={{ y: 400 }}
        size="small"
      />
    </div>
  );
}
