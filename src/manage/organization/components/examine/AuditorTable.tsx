import { DeleteOutlined } from "@ant-design/icons";
import { Form, Popconfirm, Select, SelectProps, Table, Typography } from "antd";
import type { FormInstance } from "antd/es/form";
import React from "react";
import { SimpleUser } from "../../../types";

export interface AuditorDataType {
  key: React.Key;
  orderNumber: number;
  auditorId?: number;
  id?: number;
}

const EditableContext = React.createContext<FormInstance<any> | null>(null);

interface EditableRowProps {
  index: number;
}

const EditableRow: React.FC<EditableRowProps> = ({ index, ...props }) => {
  const [form] = Form.useForm();
  return (
    <Form form={form} component={false}>
      <EditableContext.Provider value={form}>
        <tr {...props} />
      </EditableContext.Provider>
    </Form>
  );
};

interface EditableCellProps {
  title: React.ReactNode;
  editable: boolean;
  children: React.ReactNode;
  dataIndex: keyof AuditorDataType;
  record: AuditorDataType;
  auditors: SimpleUser[];
  editing: boolean;
  handleSave: (record: AuditorDataType) => void;
}

const EditableCell: React.FC<EditableCellProps> = ({
  title,
  editable,
  children,
  dataIndex,
  record,
  handleSave,
  editing,
  auditors,
  ...restProps
}) => {
  const onChange: SelectProps["onChange"] = (value) => {
    const recordValue = { ...record, auditorId: value, id: +value };
    handleSave(recordValue);
  };

  return (
    <td {...restProps}>
      {editing && !record.auditorId ? (
        <Form.Item name={dataIndex} style={{ margin: 0 }}>
          <Select
            placeholder="请选择审核人员"
            onChange={onChange}
            value={record.auditorId}
          >
            {auditors.map((auditor) => (
              <Select.Option key={auditor.id}>{auditor.realName}</Select.Option>
            ))}
          </Select>
        </Form.Item>
      ) : (
        children
      )}
    </td>
  );
};

type EditableTableProps = Parameters<typeof Table>[0];

type ColumnTypes = Exclude<EditableTableProps["columns"], undefined>;

interface AuditorTableProps {
  allAuditors: SimpleUser[];
  auditors: SimpleUser[];
  dataSource: AuditorDataType[];
  onDataSourceChange: (value: AuditorDataType[]) => void;
}

const AuditorTable: React.FC<AuditorTableProps> = (props) => {
  const { dataSource, onDataSourceChange, auditors, allAuditors } = props;

  const handleDelete = (key: React.Key) => {
    const newData = dataSource
      .filter((item) => item.key !== key)
      .map((item, index) => ({
        ...item,
        orderNumber: index + 1,
      }));
    onDataSourceChange(newData);
  };

  const defaultColumns: (ColumnTypes[number] & {
    editable?: boolean;
    dataIndex: string;
  })[] = [
    {
      title: "序号",
      dataIndex: "orderNumber",
      width: "30%",
      editable: false,
    },
    {
      title: "审核员",
      dataIndex: "auditorId",
      width: "50%",
      editable: true,
      render(value: string) {
        const name = allAuditors?.find(
          (auditor) => `${auditor.id}` === `${value}`
        )?.realName;

        return <span>{name}</span>;
      },
    },
    {
      title: "操作",
      dataIndex: "operation",
      render: (_, record: any) =>
        dataSource.length >= 1 ? (
          <Popconfirm
            title="确认删除?"
            onConfirm={() => handleDelete(record.key)}
          >
            <Typography.Link>
              <DeleteOutlined />
            </Typography.Link>
          </Popconfirm>
        ) : null,
    },
  ];

  const handleSave = (row: AuditorDataType) => {
    const newData = [...dataSource];
    const index = newData.findIndex((item) => row.key === item.key);
    const item = newData[index];
    newData.splice(index, 1, {
      ...item,
      ...row,
    });
    onDataSourceChange(newData);
  };

  const components = {
    body: {
      row: EditableRow,
      cell: EditableCell,
    },
  };

  const columns = defaultColumns.map((col) => {
    if (!col.editable) {
      return col;
    }
    return {
      ...col,
      onCell: (record: AuditorDataType, rowIndex: number) => ({
        record,
        editable: col.editable,
        dataIndex: col.dataIndex,
        title: col.title,
        auditors,
        editing: rowIndex === dataSource.length - 1,
        handleSave,
      }),
    };
  });

  return (
    <Table
      components={components}
      rowClassName={() => "editable-row"}
      bordered
      dataSource={dataSource}
      scroll={{ y: 200 }}
      columns={columns as ColumnTypes}
      pagination={false}
    />
  );
};

export default AuditorTable;
