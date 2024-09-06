import {
  CheckCircleOutlined,
  CloseCircleOutlined,
  DeleteOutlined,
  EditOutlined,
  PlusOutlined,
} from "@ant-design/icons";
import { Permission } from "@transquant/ui";
import { UUID } from "@transquant/utils";
import useMount from "ahooks/lib/useMount";
import {
  Button,
  Card,
  Divider,
  Form,
  Input,
  message,
  Popconfirm,
  Table,
  Tooltip,
  Typography,
} from "antd";
import { observer } from "mobx-react";
import React, { useEffect, useRef, useState } from "react";
import { EnvTemplate } from "../types";

type Item = Omit<EnvTemplate, "id"> & { key: React.Key };

interface EditableCellProps extends React.HTMLAttributes<HTMLElement> {
  editing: boolean;
  dataIndex: string;
  title: any;
  record: Omit<Item, "id">;
  index: number;
  children: React.ReactNode;
}

const placeholder: Record<string, string> = {
  name: "请输入模版名称",
  memLimit: "请输入内存上限",
  cpuLimit: "请输入CPU上限",
  gpuNum: "请输入GPU显存",
};

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
  const node = <Input placeholder={placeholder[dataIndex]} maxLength={15} />;

  return (
    <td {...restProps}>
      {editing ? (
        <Form.Item
          name={dataIndex}
          style={{ margin: 0 }}
          rules={[
            {
              required: true,
              message: `请输入${title}!`,
            },
          ]}
        >
          {node}
        </Form.Item>
      ) : (
        children
      )}
    </td>
  );
};

interface TemplateTableProps {
  templates: EnvTemplate[];
  addTemplate: Function;
  getAllTemplates: Function;
  deleteTemplate: Function;
  updateTemplate: Function;
}

export default observer(function EnvTemplateTable(props: TemplateTableProps) {
  const {
    templates,
    addTemplate,
    getAllTemplates,
    deleteTemplate,
    updateTemplate,
  } = props;
  const [form] = Form.useForm();
  const [data, setData] = useState<Omit<Item, "id">[]>([]);
  const [editingKey, setEditingKey] = useState<React.Key>("");

  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [isEdit, setIsEdit] = useState(false);

  const isEditing = (record: Item) => record.key === editingKey;

  useMount(() => {
    getAllTemplates();
  });

  useEffect(() => {
    const _templates: Omit<Item, "id">[] = templates.map(
      (item: EnvTemplate) => ({
        key: item.id,
        name: item.name,
        cpuLimit: item.cpuLimit,
        memLimit: item.memLimit,
        gpuNum: item.gpuNum,
      })
    );

    setData(_templates);
  }, [templates]);

  const edit = (record: Partial<Item> & { key: React.Key }) => {
    form.setFieldsValue({ name: "", sourceFile: "", type: 0, ...record });
    setEditingKey(record.key);
  };

  const save = async (record: Item) => {
    try {
      const row = (await form.validateFields()) as Item;

      const newData = [...data];
      const index = newData.findIndex((item) => record.key === item.key);

      if (index > -1) {
        setSaving(true);

        if (isEdit) {
          updateTemplate({ ...row, envTemplateId: record.key })
            .then(() => {
              message.success("保存成功");
              getAllTemplates();
              setEditingKey("");
            })
            .catch(() => {
              message.error("保存失败");
            })
            .finally(() => {
              setSaving(false);
            });
        } else {
          addTemplate(row)
            .then(() => {
              message.success("保存成功");
              getAllTemplates();
              setEditingKey("");
            })
            .catch(() => {
              message.error("保存失败");
            })
            .finally(() => {
              setSaving(false);
            });
        }
      } else {
        newData.push(row);
        setData(newData);
        setEditingKey("");
      }
    } catch {
      message.error("保存失败");
    }
  };

  const onDelete = (key: React.Key) => {
    setDeleting(true);
    deleteTemplate(key).finally(() => {
      setDeleting(false);
    });
  };

  const onEdit = (record: Partial<Item> & { key: React.Key }) => {
    form.setFieldsValue({ name: "", sourceFile: "", type: 0, ...record });
    setEditingKey(record.key);
    setIsEdit(true);
  };

  const columns = [
    {
      title: "模版名称",
      dataIndex: "name",
      width: "23%",
      editable: true,
      ellipsis: true,
    },
    {
      title: "内存上限（M）",
      dataIndex: "memLimit",
      width: "23%",
      editable: true,
      ellipsis: true,
    },
    {
      title: "CPU上限（Core）",
      dataIndex: "cpuLimit",
      width: "23%",
      editable: true,
      ellipsis: true,
    },
    {
      title: "GPU显存（G）",
      dataIndex: "gpuNum",
      width: "23%",
      editable: true,
      ellipsis: true,
      render(gpu?: number) {
        return gpu ?? "~";
      },
    },
    {
      title: "操作",
      dataIndex: "action",
      width: "8%",
      render: (_: any, record: Item) => {
        const editable = isEditing(record);
        return editable ? (
          <span>
            <Typography.Link style={{ marginRight: 8 }}>
              <Tooltip title="保存">
                <Typography.Link
                  disabled={editingKey === record.key && saving}
                  onClick={() => save(record)}
                >
                  <CheckCircleOutlined />
                </Typography.Link>
              </Tooltip>
            </Typography.Link>
            <Divider type="vertical" />
            <Typography.Link
              onClick={() => {
                setEditingKey("");
                setIsEdit(false);
                // 编辑已有item时取消直接返回
                if (typeof record.key === "number") return;

                const newData = data.slice(0, data.length - 1);
                setData(newData);
              }}
            >
              <Tooltip title="取消">
                <CloseCircleOutlined />
              </Tooltip>
            </Typography.Link>
          </span>
        ) : (
          <span>
            <Permission code="B190119" disabled>
              <Tooltip title="编辑">
                <Typography.Link onClick={() => onEdit(record)}>
                  <EditOutlined />
                </Typography.Link>
              </Tooltip>
            </Permission>
            <Divider type="vertical" />
            <Permission code="B190120" disabled>
              <Popconfirm
                title="确定要删除吗?"
                onConfirm={() => onDelete(record.key)}
              >
                <Tooltip title="删除">
                  <Typography.Link
                    disabled={editingKey === record.key && deleting}
                  >
                    <DeleteOutlined />
                  </Typography.Link>
                </Tooltip>
              </Popconfirm>
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

  const tableRef = useRef<HTMLDivElement>(null);

  const scrollToEnd = (count: number) => {
    const baseHeight = 40;
    const scrollElement = tableRef?.current?.getElementsByClassName(
      "trans-quant-antd-table-body"
    )[0];
    const cellHeight =
      tableRef?.current
        ?.getElementsByClassName("trans-quant-antd-table-cell ")[0]
        .getBoundingClientRect().height || baseHeight;
    if (!scrollElement) return;

    setTimeout(() => {
      scrollElement.scrollTop = count * cellHeight;
    }, 0);
  };

  const onAdd = () => {
    if (editingKey) {
      message.info("请先保存上次编辑模版");
      return;
    }

    const key = UUID();

    const newData = {
      key,
      name: "",
      cpuLimit: 5,
      memLimit: 10240,
      gpuNum: 0,
    };
    const _data = [...data, newData];
    setData(_data);
    edit(newData);

    scrollToEnd(_data.length);
  };

  return (
    <Card
      title="环境资源模版"
      extra={
        <Permission code="B190118" hidden>
          <Button type="primary" onClick={onAdd} icon={<PlusOutlined />}>
            添加
          </Button>
        </Permission>
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
          size="small"
          dataSource={data}
          scroll={{ y: 200 }}
          columns={mergedColumns}
          rowClassName="editable-row"
          pagination={false}
          ref={tableRef}
        />
      </Form>
    </Card>
  );
});
