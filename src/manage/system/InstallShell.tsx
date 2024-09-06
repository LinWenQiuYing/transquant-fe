import {
  CheckCircleOutlined,
  CloseCircleOutlined,
  DeleteOutlined,
  PlusOutlined,
  QuestionCircleOutlined,
  UploadOutlined,
} from "@ant-design/icons";
import { USER_TOKEN } from "@transquant/constants";
import { IconFont, Permission } from "@transquant/ui";
import { DataType, ls, useDataSource, UUID } from "@transquant/utils";
import useMount from "ahooks/lib/useMount";
import {
  Button,
  Divider,
  Form,
  Input,
  message,
  Modal,
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
import React, { useRef, useState } from "react";
import { useStores, useTableScroll } from "../hooks";
import { Image, Script } from "../types";

type UploadChange = Pick<UploadProps, "onChange">;

interface EditableCellProps extends React.HTMLAttributes<HTMLElement> {
  editing: boolean;
  dataIndex: string;
  title: any;
  record: Script;
  index: number;
  allImages: Image[];
  children: React.ReactNode;
}

// 上传文件类型校验
const isSh = (file: any) => {
  return /\.(sh)$/.test(file.name);
};

const EditableCell: React.FC<EditableCellProps> = ({
  editing,
  dataIndex,
  title,
  record,
  index,
  children,
  onChange,
  allImages,
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
      if (!isSh(fileInfo.file)) {
        message.warning("非sh文件类型");
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

  if (dataIndex === "imageName") {
    node = (
      <Select placeholder="请选择镜像">
        {allImages?.map((image) => (
          <Select.Option value={image.id} key={image.id}>
            {image.name}
          </Select.Option>
        ))}
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
              required: dataIndex !== "comment",
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

export default observer(function InstallShell() {
  const {
    getAllScripts,
    scriptListLoading,
    getAllImageList,
    allImages,
    addInstallScript,
    deleteInstallScript,
    installNotification,
    getInstallEvents,
  } = useStores().systemStore;
  const [form] = Form.useForm();
  const [editingKey, setEditingKey] = useState("");

  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [scriptList, setScriptList] = useState<Script[]>([]);

  const isEditing = (record: DataType<Script>) => record.key === editingKey;

  const refreshScripts = async () => {
    const scripts = await getAllScripts();
    setScriptList(scripts);
  };

  useMount(async () => {
    getAllImageList();
    await refreshScripts();
  });

  const edit = (record: Partial<DataType<Script>>) => {
    form.setFieldsValue({ name: "", sourceFile: "", type: 0, ...record });
    setEditingKey(`${record.key}`);
  };

  const save = async () => {
    const row = (await form.validateFields()) as DataType<Script>;
    if (!row.fileName) {
      return;
    }
    const data = {
      version: row.version,
      imageId: row.imageName,
      comment: row.comment,
      file: (row.fileName as unknown as UploadChangeParam).file.originFileObj!,
    };
    addInstallScript(data)
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

    deleteInstallScript(`${key}`).finally(() => {
      setDeleting(false);
      refreshScripts();
    });
  };

  const onNotice = (key: React.Key) => {
    Modal.confirm({
      title: "统一提醒",
      content:
        "该功能将在环境启动时弹窗提醒用户是否要安装该脚本。提醒范围为，由该脚本所属的基础镜像所创建的所有环境。为保证该安装不会影响到用户投研，是否安装将交由用户决定",
      onOk() {
        installNotification(`${key}`).finally(() => {
          refreshScripts();
          getInstallEvents();
        });
      },
    });
  };

  const columns = [
    {
      title: (
        <div>
          版本号
          <Tooltip title="格式为v[数字].[数字].[数字]，例如v1.0.0">
            <QuestionCircleOutlined className="ml-2 text-gray-400 cursor-pointer" />
          </Tooltip>
        </div>
      ),
      dataIndex: "version",
      key: "version",
      width: "15%",
      ellipsis: true,
      editable: true,
    },
    {
      title: "所属基础镜像",
      dataIndex: "imageName",
      key: "imageName",
      width: "20%",
      ellipsis: true,
      editable: true,
    },
    {
      title: "文件",
      dataIndex: "fileName",
      key: "fileName",
      width: "20%",
      ellipsis: true,
      render: (fileName: string) => {
        return <span>{fileName}</span>;
      },
      editable: true,
    },
    {
      title: "上传时间",
      dataIndex: "uploadTime",
      key: "uploadTime",
      width: "20%",
      ellipsis: true,
    },
    {
      title: "备注",
      dataIndex: "comment",
      key: "comment",
      width: "20%",
      ellipsis: true,
      editable: true,
    },
    {
      title: "操作",
      dataIndex: "action",
      width: "10%",
      render: (_: any, record: DataType<Script>) => {
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
                const newData = scriptList.slice(0, scriptList.length - 1);
                setEditingKey("");
                setScriptList(newData);
              }}
            >
              <Tooltip title="取消">
                <CloseCircleOutlined />
              </Tooltip>
            </Typography.Link>
          </span>
        ) : (
          <Space>
            <Permission code="B190102" disabled>
              <Tooltip title="统一提醒">
                <Typography.Link>
                  <IconFont
                    type="bell-ringing-04"
                    onClick={() => onNotice(record.id)}
                  />
                </Typography.Link>
              </Tooltip>
            </Permission>
            <Divider type="vertical" />
            <Permission code="B190103" disabled>
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
      onCell: (record: DataType<Script>) => ({
        record,
        dataIndex: col.dataIndex,
        title: col.title,
        allImages,
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
    } as unknown as Script;
    const data = [...scriptList, newData];
    setScriptList(data);
    scrollToEnd(data.length);
    edit(newData);
  };

  return (
    <div className="mb-8">
      <div className="flex justify-between mb-2">
        <span className="flex text-sm font-bold float-start">
          <div className="bg-red-600 w-[2px] h-4 relative mr-1 top-[2px]" />
          安装脚本
        </span>
        <Permission code="B190101" hidden>
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
          loading={scriptListLoading}
          dataSource={useDataSource<Script>(scriptList)}
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
