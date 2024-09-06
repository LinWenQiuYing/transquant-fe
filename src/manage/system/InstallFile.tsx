import {
  CheckCircleOutlined,
  CloseCircleOutlined,
  DeleteOutlined,
  PlusOutlined,
  UploadOutlined,
} from "@ant-design/icons";
import { USER_TOKEN } from "@transquant/constants";
import { Permission } from "@transquant/ui";
import {
  DataType,
  formatBytes,
  ls,
  useDataSource,
  UUID,
} from "@transquant/utils";
import useMount from "ahooks/lib/useMount";
import {
  Button,
  Divider,
  Form,
  Input,
  message,
  Popconfirm,
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
import React, { useRef, useState } from "react";
import { useStores } from "../hooks";
import useTableScroll from "../hooks/useTableScroll";
import { InstallFile } from "../types";

type UploadChange = Pick<UploadProps, "onChange">;

interface EditableCellProps extends React.HTMLAttributes<HTMLElement> {
  editing: boolean;
  dataIndex: string;
  title: any;
  record: InstallFile;
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
  const [showUploadList, setShowUploadList] = useState(true);
  let node = (
    <Input
      placeholder={dataIndex === "version" ? "请输入版本号" : `请输入${title}`}
    />
  );
  const onUploadChange: UploadChange["onChange"] = (fileInfo) => {
    if (fileInfo.file.status === "done") {
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

  if (dataIndex === "fileName") {
    node = (
      <Upload
        action="/tqlab/template/empty"
        accept="*"
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
      </Upload>
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

export default observer(function InstallFile() {
  const { getInstallFiles, fileLoading, addInstallFile, deleteInstallFile } =
    useStores().systemStore;
  const [form] = Form.useForm();
  const [editingKey, setEditingKey] = useState("");

  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [fileList, setFileList] = useState<InstallFile[]>([]);

  const isEditing = (record: DataType<InstallFile>) =>
    record.key === editingKey;

  const refreshScripts = async () => {
    const files = await getInstallFiles();
    setFileList(files);
  };

  useMount(async () => {
    await refreshScripts();
  });

  const edit = (record: Partial<DataType<InstallFile>>) => {
    form.setFieldsValue({ name: "", sourceFile: "", type: 0, ...record });
    setEditingKey(`${record.key}`);
  };

  const save = async () => {
    const row = (await form.validateFields()) as DataType<InstallFile>;
    if (!row.fileName) {
      return;
    }
    const data = {
      file: (row.fileName as unknown as UploadChangeParam).file.originFileObj!,
    };
    addInstallFile(data)
      .then(async () => {
        message.success("添加成功");
        setEditingKey("");
        await refreshScripts();
      })
      .catch(() => {
        message.error("保存失败");
      })
      .finally(() => {
        setSaving(false);
      });
  };

  const onDelete = (key: React.Key) => {
    setDeleting(true);

    deleteInstallFile(`${key}`).finally(() => {
      setDeleting(false);
      refreshScripts();
    });
  };

  const columns = [
    {
      title: "文件",
      dataIndex: "fileName",
      key: "fileName",
      width: "30%",
      ellipsis: true,
      editable: true,
    },
    {
      title: "上传时间",
      dataIndex: "uploadTime",
      key: "uploadTime",
      width: "30%",
      ellipsis: true,
      editable: false,
    },
    {
      title: "大小",
      dataIndex: "size",
      key: "size",
      width: "30%",
      ellipsis: true,
      editable: false,
      render(size: number) {
        return size !== undefined ? formatBytes(size) : "";
      },
    },
    {
      title: "操作",
      dataIndex: "action",
      width: "10%",
      render: (_: any, record: DataType<InstallFile>) => {
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
                const newData = fileList.slice(0, fileList.length - 1);
                setEditingKey("");
                setFileList(newData);
              }}
            >
              <Tooltip title="取消">
                <CloseCircleOutlined />
              </Tooltip>
            </Typography.Link>
          </span>
        ) : (
          <Space>
            <Permission code="B190105" disabled>
              <Popconfirm
                title="确定要删除吗?"
                onConfirm={() => onDelete(record.id)}
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
      onCell: (record: DataType<InstallFile>) => ({
        record,
        dataIndex: col.dataIndex,
        title: col.title,
        editing: isEditing(record),
      }),
    };
  });

  const tableRef = useRef<HTMLDivElement>(null);
  const { scrollToEnd } = useTableScroll({ ref: tableRef });

  const onAdd = () => {
    if (editingKey) {
      message.info("请先保存上次编辑模版");
      return;
    }

    const newData = {
      key: UUID(),
      comment: "",
      fileName: "",
      imageName: undefined,
      version: "",
    } as unknown as InstallFile;
    const _data = [...fileList, newData];
    setFileList(_data);

    scrollToEnd(_data.length);
    edit(newData);
  };

  return (
    <div className="mb-8">
      <div className="flex justify-between mb-2">
        <span className="flex text-sm font-bold float-start">
          <div className="bg-red-600 w-[2px] h-4 relative mr-1 top-[2px]" />
          安装文件
        </span>
        <Permission code="B190104" hidden>
          <Button type="primary" onClick={onAdd} icon={<PlusOutlined />}>
            添加
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
          loading={fileLoading}
          dataSource={useDataSource<InstallFile>(fileList)}
          scroll={{ y: 200 }}
          columns={mergedColumns as any}
          rowClassName="editable-row"
          pagination={false}
          ref={tableRef}
        />
      </Form>
    </div>
  );
});
