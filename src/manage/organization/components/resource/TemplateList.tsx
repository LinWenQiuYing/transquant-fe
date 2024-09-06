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
  Divider,
  Form,
  Input,
  message,
  Popconfirm,
  Select,
  Space,
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
import { useStores } from "../../../hooks";
import { TemplateType } from "../../../types";

type UploadChange = Pick<UploadProps, "onChange">;

interface Item {
  id?: number;
  key: string;
  name: string;
  sourceFile: UploadChangeParam | string;
  type: TemplateType;
  groupId: number;
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

export default observer(function TemplateList() {
  const {
    getAllTemplate,
    templates,
    selectedGroup,
    deleteTemplate,
    downloadTemplateZip,
    addGroupTemplateFile,
  } = useStores().organizationStore;
  const [form] = Form.useForm();
  const [data, setData] = useState<Item[]>([]);
  const [editingKey, setEditingKey] = useState("");

  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const isEditing = (record: Item) => record.key === editingKey;

  useMount(() => {
    if (!selectedGroup) return;
    getAllTemplate(selectedGroup.id);
  });

  useEffect(() => {
    const _templates = templates.map((item: any) => ({
      id: item.id,
      key: item.id,
      groupId: selectedGroup?.id || -1,
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
        formData.append("teamId", `${selectedGroup!.id}`);
        addGroupTemplateFile(formData as any)
          .then(() => {
            message.success("保存成功");
            getAllTemplate(selectedGroup!.id);
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
    deleteTemplate(key as number).finally(() => {
      setDeleting(false);
    });
  };

  const onDowloadSourceFile = (fileName: string, id: number) => {
    downloadTemplateZip(fileName, id);
  };

  const columns = [
    {
      title: "模版名称",
      dataIndex: "name",
      width: "20%",
      editable: true,
    },
    {
      title: "源文件",
      dataIndex: "sourceFile",
      width: "28%",
      editable: true,
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
      render: (type: TemplateType) => {
        return type === 0 ? "策略项目" : "因子项目";
      },
    },
    {
      title: "创建时间",
      dataIndex: "createTime",
      width: "20%",
    },
    {
      title: "操作",
      dataIndex: "action",
      render: (_: any, record: Item) => {
        const editable = isEditing(record);
        return editable ? (
          <Space>
            <Typography.Link
              onClick={() => save(record.key)}
              disabled={editingKey === record.key && saving}
            >
              <Tooltip title="保存">
                <CheckCircleOutlined />
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
          </Space>
        ) : (
          <Space>
            <Permission code="B150119" disabled>
              <Popconfirm
                title="确定要删除吗?"
                onConfirm={() => onDelete(record.key)}
              >
                <Tooltip title="删除">
                  <Button
                    type="link"
                    loading={editingKey === record.key && deleting}
                    disabled={editingKey === record.key && deleting}
                  >
                    <Typography.Link>
                      <DeleteOutlined />
                    </Typography.Link>
                  </Button>
                </Tooltip>
              </Popconfirm>
            </Permission>
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
      groupId: selectedGroup?.id || -1,
      sourceFile: null as any,
      type: "0" as unknown as TemplateType,
      createTime: "",
    };
    setData([...data, newData]);

    edit(newData);
  };

  return (
    <div className="mt-6">
      <div className="flex items-center justify-between mb-4">
        <div>
          <div className="w-1 h-5 mr-2 bg-red-600 float-start" />
          模版列表
        </div>
        <Permission code="B150118" hidden>
          <Button icon={<PlusOutlined />} type="primary" onClick={onAdd}>
            添加模版
          </Button>
        </Permission>
      </div>
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
          columns={mergedColumns}
          scroll={{ y: 200 }}
          rowClassName="editable-row"
          pagination={false}
        />
      </Form>
    </div>
  );
});
