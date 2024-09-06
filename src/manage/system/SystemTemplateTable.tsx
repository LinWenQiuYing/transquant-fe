import {
  CheckCircleOutlined,
  CloseCircleOutlined,
  DeleteOutlined,
  PlusOutlined,
  UploadOutlined,
} from "@ant-design/icons";
import { USER_TOKEN } from "@transquant/constants";
import { Permission } from "@transquant/ui";
import { ls, UUID } from "@transquant/utils";
import useMount from "ahooks/lib/useMount";
import {
  Button,
  Card,
  Divider,
  Form,
  Input,
  message,
  Popconfirm,
  Select,
  Table,
  Tooltip,
  Typography,
  Upload,
  UploadProps,
} from "antd";
import { RcFile } from "antd/es/upload";
import { UploadChangeParam } from "antd/lib/upload";
import { observer } from "mobx-react";
import React, { useEffect, useState } from "react";
import { Template, TemplateType } from "../types";

type UploadChange = Pick<UploadProps, "onChange">;

interface Item {
  id?: number;
  key: string;
  name: string;
  sourceFile: UploadChangeParam | string;
  type: TemplateType;
  createTime: string;
}

interface EditableCellProps extends React.HTMLAttributes<HTMLElement> {
  editing: boolean;
  dataIndex: string;
  title: any;
  record: Item;
  index: number;
  children: React.ReactNode;
}

// 上传文件类型校验
const isZip = (file: any) => {
  return /\.(zip)$/.test(file.name);
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
  const [showUploadList, setShowUploadList] = useState(true);
  let node = <Input placeholder="请输入模版名称" />;
  const onUploadChange: UploadChange["onChange"] = (fileInfo) => {
    if (fileInfo.file.status === "done") {
      if (!isZip(fileInfo.file)) {
        message.warning("非zip文件类型");
        return;
      }
      message.success("导入成功");
    }
  };

  const beforeUpload = (file: RcFile) => {
    const isLt50M = file.size / 1024 / 1024 <= 50;

    if (!isLt50M) {
      message.info("文件勿超50Mb");
      setShowUploadList(false);
    } else {
      setShowUploadList(true);
    }

    return isLt50M;
  };

  if (dataIndex === "sourceFile") {
    node = (
      <Upload
        action="/tqlab/template/empty"
        accept=".zip"
        maxCount={1}
        headers={{ token: ls.getItem(USER_TOKEN) }}
        onChange={onUploadChange}
        beforeUpload={beforeUpload}
        showUploadList={showUploadList}
      >
        <Button
          type="primary"
          icon={<UploadOutlined />}
          style={{ marginRight: 10 }}
        >
          上传
        </Button>
        <Typography.Text disabled>文件勿超50Mb</Typography.Text>
      </Upload>
    );
  }

  if (dataIndex === "type") {
    node = (
      <Select>
        <Select.Option key="0">策略项目</Select.Option>
        <Select.Option key="1">因子项目</Select.Option>
      </Select>
    );
  }

  return (
    <td {...restProps}>
      {editing ? (
        <Form.Item
          name={dataIndex}
          style={{ margin: 0 }}
          rules={[
            {
              required: true,
              message:
                dataIndex === "sourceFile"
                  ? `请上传${title}`
                  : `请输入${title}!`,
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
  templates: Template[];
  addTemplate: Function;
  getAllTemplates: Function;
  deleteTemplate: Function;
  downloadFn: Function;
}

export default observer(function SystemTemplateTable(
  props: TemplateTableProps
) {
  const {
    templates,
    addTemplate,
    getAllTemplates,
    deleteTemplate,
    downloadFn,
  } = props;
  const [form] = Form.useForm();
  const [data, setData] = useState<Item[]>([]);
  const [editingKey, setEditingKey] = useState("");

  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const isEditing = (record: Item) => record.key === editingKey;

  useMount(() => {
    getAllTemplates();
  });

  useEffect(() => {
    const _templates = templates.map((item: any) => ({
      id: item.id,
      key: item.id,
      name: item.name,
      sourceFile: item.filePath,
      type: item.type,
      createTime: item.createTime,
    }));

    setData(_templates);
  }, [templates]);

  const edit = (record: Partial<Item> & { key: React.Key }) => {
    form.setFieldsValue({ name: "", sourceFile: "", type: 0, ...record });
    setEditingKey(record.key);
  };

  const save = async (key: React.Key) => {
    try {
      const row = (await form.validateFields()) as Item;

      if (!row.sourceFile) {
        return;
      }

      const newData = [...data];
      const index = newData.findIndex((item) => key === item.key);
      if (index > -1) {
        setSaving(true);

        const formData = new FormData();
        formData.append(
          "file",
          (row.sourceFile as UploadChangeParam).file.originFileObj!
        );
        formData.append("name", row.name);
        formData.append("type", `${row.type}`);
        addTemplate(formData)
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

  const onDowloadSourceFile = (fileName: string, id: number) => {
    downloadFn(fileName, id);
  };

  const columns = [
    {
      title: "模版名称",
      dataIndex: "name",
      width: "25%",
      editable: true,
      ellipsis: true,
    },
    {
      title: "源文件",
      dataIndex: "sourceFile",
      width: "25%",
      editable: true,
      ellipsis: true,
      render: (fileName: string, record: Item) => {
        return (
          <Typography.Link
            onClick={() => onDowloadSourceFile(fileName, record.id || -1)}
          >
            {fileName}
          </Typography.Link>
        );
      },
    },
    {
      title: "模版类型",
      dataIndex: "type",
      width: "20%",
      editable: true,
      ellipsis: true,
      render: (type: TemplateType) => {
        return type === 0 ? "策略项目" : "因子项目";
      },
    },
    {
      title: "创建时间",
      dataIndex: "createTime",
      width: "20%",
      ellipsis: true,
    },
    {
      title: "操作",
      dataIndex: "action",
      width: "10%",
      render: (_: any, record: Item) => {
        const editable = isEditing(record);
        return editable ? (
          <span>
            <Typography.Link style={{ marginRight: 8 }}>
              <Tooltip title="保存">
                <Typography.Link
                  disabled={editingKey === record.key && saving}
                  onClick={() => save(record.key)}
                >
                  <CheckCircleOutlined />
                </Typography.Link>
              </Tooltip>
            </Typography.Link>
            <Divider type="vertical" />
            <Typography.Link
              onClick={() => {
                const newData = data.slice(0, data.length - 1);
                setEditingKey("");
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
            <Permission code="B190107" disabled>
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

  const onAdd = () => {
    if (editingKey) {
      message.info("请先保存上次编辑模版");
      return;
    }

    const newData = {
      key: UUID(),
      name: ``,
      sourceFile: null as any,
      type: "0" as unknown as TemplateType,
      createTime: "",
    };
    setData([...data, newData]);

    edit(newData);
  };

  return (
    <Card
      title="系统默认模版"
      extra={
        <Permission code="B190106" hidden>
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
        />
      </Form>
    </Card>
  );
});
