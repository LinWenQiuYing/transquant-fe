import {
  CheckCircleOutlined,
  CloseCircleOutlined,
  EditOutlined,
} from "@ant-design/icons";
import { Permission } from "@transquant/ui";
import useMount from "ahooks/lib/useMount";
import {
  Card,
  ConfigProvider,
  Divider,
  Empty,
  Form,
  Input,
  Table,
  Tooltip,
  Typography,
} from "antd";
import { observer } from "mobx-react";
import React, { useEffect, useState } from "react";
import { PipItem } from "../types";

interface Item {
  id?: number;
  key: string;
  name: string;
  url: string;
  time: string;
}

interface EditableCellProps extends React.HTMLAttributes<HTMLElement> {
  editing: boolean;
  dataIndex: string;
  title: any;
  record: Item;
  index: number;
  children: React.ReactNode;
}

const EditableCell: React.FC<EditableCellProps> = ({
  editing,
  dataIndex,
  title,
  record,
  index,
  children,
  onChange,
  ...restProps
}) => {
  return (
    <td {...restProps}>
      {editing ? (
        <Form.Item name={dataIndex} style={{ margin: 0 }}>
          <Input
            maxLength={dataIndex === "name" ? 40 : 256}
            autoFocus={dataIndex === "name"}
            placeholder={dataIndex === "name" ? "请输入名称" : "请输入地址"}
          />
        </Form.Item>
      ) : (
        children
      )}
    </td>
  );
};

interface TemplateTableProps {
  templates: PipItem[];
  addTemplate: Function;
  getAllTemplates: Function;
}

export default observer(function SystemTemplateTable(
  props: TemplateTableProps
) {
  const { templates, addTemplate, getAllTemplates } = props;
  const [form] = Form.useForm();
  const [data, setData] = useState<Item[]>([]);
  const [editingKey, setEditingKey] = useState("");

  const [saving, setSaving] = useState(false);

  const isEditing = (record: Item) => record.key === editingKey;

  useMount(() => {
    getAllTemplates();
  });

  useEffect(() => {
    const _templates = templates.map((item: any) => ({
      id: item.id,
      key: item.id,
      name: item.name,
      url: item.url,
      time: item.time,
    }));

    setData(_templates);
  }, [templates]);

  const edit = (record: Partial<Item> & { key: React.Key }) => {
    form.setFieldsValue(record);
    setEditingKey(record.key);
  };

  const save = async () => {
    const row = (await form.validateFields()) as Item;
    setSaving(true);
    addTemplate({ id: templates[0]?.id, name: row.name, url: row.url })
      .then(() => {
        getAllTemplates();
        setEditingKey("");
      })
      .finally(() => {
        setSaving(false);
      });
  };

  const columns = [
    {
      title: "名称",
      dataIndex: "name",
      width: "25%",
      editable: true,
      ellipsis: true,
    },
    {
      title: "地址",
      dataIndex: "url",
      width: "35%",
      editable: true,
      ellipsis: true,
    },
    {
      title: "设置时间",
      dataIndex: "time",
      width: "25%",
      ellipsis: true,
    },
    {
      title: "操作",
      dataIndex: "action",
      width: "15%",
      render: (_: any, record: Item) => {
        const editable = isEditing(record);
        return editable ? (
          <span>
            <Typography.Link style={{ marginRight: 8 }}>
              <Tooltip title="保存">
                <Typography.Link
                  disabled={editingKey === record.key && saving}
                  onClick={() => save()}
                >
                  <CheckCircleOutlined />
                </Typography.Link>
              </Tooltip>
            </Typography.Link>
            <Divider type="vertical" />
            <Typography.Link
              onClick={() => {
                if (record.id === -1) {
                  setData([]);
                } else {
                  setEditingKey("");
                }
              }}
            >
              <Tooltip title="取消">
                <CloseCircleOutlined />
              </Tooltip>
            </Typography.Link>
          </span>
        ) : (
          <span>
            <Permission code="B190108" disabled>
              <Tooltip title="编辑">
                <Typography.Link
                  disabled={editingKey === record.key}
                  onClick={() => edit(record)}
                >
                  <EditOutlined />
                </Typography.Link>
              </Tooltip>
            </Permission>
          </span>
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
      onCell: (record: Item) => ({
        record,
        dataIndex: col.dataIndex,
        title: col.title,
        editing: isEditing(record),
      }),
    };
  });

  const onAdd = () => {
    const newItem = { id: -1, key: "-1", name: "", url: "", time: "" };
    setData([newItem]);
    setEditingKey("-1");
  };

  const customizeRenderEmpty = () => {
    return (
      <Empty
        description={
          <div>
            暂无PIP源，请
            <Typography.Link onClick={onAdd}>点击添加</Typography.Link>
          </div>
        }
      />
    );
  };

  return (
    <Card title="系统默认PIP源">
      <Form form={form} component={false}>
        <ConfigProvider renderEmpty={customizeRenderEmpty}>
          <Table
            components={{
              body: {
                cell: EditableCell,
              },
            }}
            bordered
            size="small"
            dataSource={data}
            scroll={{ y: 200 }}
            columns={mergedColumns}
            rowClassName="editable-row"
            pagination={false}
          />
        </ConfigProvider>
      </Form>
    </Card>
  );
});
