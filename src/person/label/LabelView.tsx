import {
  CloseCircleOutlined,
  DeleteOutlined,
  EditOutlined,
  SaveOutlined,
} from "@ant-design/icons";
import { clsPrefix } from "@transquant/constants";
import { Label } from "@transquant/ui";
import { useMount } from "ahooks";
import {
  Card,
  Divider,
  Form,
  Input,
  Popconfirm,
  Space,
  Table,
  Tooltip,
  Typography,
} from "antd";
import { observer } from "mobx-react";
import React, { useEffect, useState } from "react";
import { useStores } from "../hooks";

const { Link } = Typography;

interface DataType extends Label {
  key: number;
}

interface EditableCellProps extends React.HTMLAttributes<HTMLElement> {
  editing: boolean;
  dataIndex: string;
  title: any;
  inputType: "number" | "text";
  record: DataType;
  index: number;
  children: React.ReactNode;
}

const EditableCell: React.FC<EditableCellProps> = ({
  editing,
  dataIndex,
  title,
  inputType,
  record,
  index,
  children,
  ...restProps
}) => {
  const inputNode = <Input placeholder="请输入" />;

  return (
    <td {...restProps}>
      {editing ? (
        <Form.Item
          name={dataIndex}
          style={{ margin: 0 }}
          rules={[
            {
              required: dataIndex === "name",
              message: `此列为必填项！`,
            },
          ]}
        >
          {inputNode}
        </Form.Item>
      ) : (
        children
      )}
    </td>
  );
};

export default observer(function PersonalLabel() {
  const { filterLabels, deleteTag, updateTag, getTags, onSearchValueChange } =
    useStores().labelStore;

  const [data, setData] = useState<DataType[]>([]);
  const [editingKey, setEditingKey] = useState<React.Key>("");
  const [form] = Form.useForm();

  useMount(() => {
    getTags();
  });

  useEffect(() => {
    const originData = filterLabels.map((item) => ({ ...item, key: item.id }));

    setData(originData);
  }, [filterLabels]);

  const cancel = () => {
    setEditingKey("");
  };

  const onDelete = (raw: DataType) => {
    deleteTag(raw.id).then(() => {
      getTags();
    });
  };

  const save = async (key: React.Key) => {
    const row = (await form.validateFields()) as DataType;

    const newData = [...data];
    const index = newData.findIndex((item) => key === item.key);
    // 当前项编辑结果

    const item = newData[index];
    newData.splice(index, 1, {
      ...item,
      ...row,
    });
    const newItem = newData[index];

    updateTag({ id: newItem.id, name: newItem.name }).then(() => {
      getTags();
      setEditingKey("");
    });
  };

  const edit = (record: Partial<DataType> & { key: React.Key }) => {
    form.setFieldsValue({ name: "", ...record });
    setEditingKey(record.key);
  };

  const isEditing = (record: DataType) => record.key === editingKey;

  const columns = [
    {
      title: "标签名称",
      dataIndex: "name",
      key: "name",
      editable: true,
    },
    {
      title: "操作",
      key: "action",
      width: 160,
      editable: false,
      render: (_: any, record: DataType) => {
        const editable = isEditing(record);
        return editable ? (
          <span className={`${clsPrefix}-image-manage-table-operation`}>
            <Link onClick={() => save(record.key)} style={{ marginRight: 8 }}>
              <Tooltip title="保存">
                <SaveOutlined />
              </Tooltip>
            </Link>
            <Divider type="vertical" />
            <Link>
              <Popconfirm title="确定要取消吗？" onConfirm={cancel}>
                <Tooltip title="取消">
                  <CloseCircleOutlined />
                </Tooltip>
              </Popconfirm>
            </Link>
          </span>
        ) : (
          <Space className={`${clsPrefix}-image-manage-table-operation`}>
            <Link disabled={editingKey !== ""} onClick={() => edit(record)}>
              <Tooltip title="编辑">
                <EditOutlined />
              </Tooltip>
            </Link>
            <Divider type="vertical" />
            <Link disabled={editingKey !== ""}>
              <Popconfirm
                placement="left"
                title={
                  <div>
                    <p>删除将使拥有该标签的所有项目、</p>
                    <p>研究文件、表等失去该标签，确认删除？</p>
                  </div>
                }
                onConfirm={() => onDelete(record)}
              >
                <Tooltip title="删除">
                  <DeleteOutlined />
                </Tooltip>
              </Popconfirm>
            </Link>
          </Space>
        );
      },
    },
  ];

  const mergedColumns = columns.map((col) => {
    if (!col.editable) {
      return col;
    }
    return {
      ...col,
      onCell: (record: DataType) => ({
        record,
        dataIndex: col.dataIndex,
        title: col.title,
        editing: isEditing(record),
      }),
    };
  });

  return (
    <Card
      title="标签列表"
      className={`${clsPrefix}-person-label-view`}
      extra={
        <Input.Search
          placeholder="请输入搜索关键字"
          onChange={(e) => onSearchValueChange(e.target.value)}
          style={{ width: 300, marginRight: 20 }}
        />
      }
    >
      <Form form={form} component={false}>
        <Table
          components={{
            body: {
              cell: EditableCell,
            },
          }}
          bordered
          columns={mergedColumns}
          dataSource={data}
        />
      </Form>
    </Card>
  );
});
