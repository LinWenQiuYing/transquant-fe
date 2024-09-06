/* eslint-disable prettier/prettier */
import {
  CheckCircleOutlined,
  CloseCircleOutlined,
  DeleteOutlined,
  LoadingOutlined,
  PlusOutlined,
} from "@ant-design/icons";
import { Permission } from "@transquant/ui";
import { UUID } from "@transquant/utils";
import { useMount } from "ahooks";
import {
  Button,
  Form,
  Input,
  InputNumber,
  message,
  Popconfirm,
  Select,
  Space,
  Table,
  Tooltip,
  Typography,
} from "antd";
import { observer } from "mobx-react";
import React, { useState } from "react";
import { When } from "react-if";
import { useStores } from "../../../hooks";
import { EnvTemp, Host, ImageInstance } from "../../../types";

interface Item {
  key: string;
  name?: string;
  node?: string;
  envTemplateId?: number;
  cpuMemLimit?: number;
  cpuMemRequest?: number;
  cpuCoreLimit?: number;
  cpuCoreRequest?: number;
  gpuMem: number;
  imageId: number;
  id: number;
  imageName?: string;
  envStatus?: number;
}

interface EditableCellProps extends React.HTMLAttributes<HTMLElement> {
  editing: boolean;
  dataIndex: string;
  title: any;
  inputType: "number" | "select" | "text";
  record: Item;
  index: number;
  children: React.ReactNode;
  allImages: {
    id: number;
    name: string;
  }[];
  envTemplates: EnvTemp[];
  hosts: Host[];
  creating: boolean;
}

const getInputNode = (
  inputType: "number" | "text" | "select",
  dataIndex: string,
  allImages: {
    id: number;
    name: string;
  }[],
  envTemplates: EnvTemp[],
  hosts: Host[],
  creating: boolean
) => {
  let node;

  if (inputType === "number") {
    if (dataIndex === "memory") {
      node = (
        <Space className="memory">
          <Form.Item name="cpuMemLimit">
            <InputNumber disabled={creating} min={1} placeholder="请输入..." />
          </Form.Item>
        </Space>
      );
    } else if (dataIndex === "cpu") {
      node = (
        <Space className="cpuCore">
          <Form.Item name="cpuCoreLimit">
            <InputNumber disabled={creating} min={1} placeholder="请输入..." />
          </Form.Item>
        </Space>
      );
    } else if (dataIndex === "gpu") {
      node = <InputNumber disabled={creating} placeholder="请输入..." />;
    }
  }

  if (inputType === "select") {
    if (dataIndex === "imageName") {
      node = (
        <Select placeholder="请选择镜像名称" disabled={creating}>
          {allImages?.map((image) => (
            <Select.Option value={image.id} key={image.id}>
              {image.name}
            </Select.Option>
          ))}
        </Select>
      );
    }
    if (dataIndex === "envTemplateId") {
      node = (
        <Select
          placeholder="请选择资源模版"
          disabled={creating}
          options={envTemplates?.map((item) => ({
            label: `${item.name}，内存上限（${item.memLimit}M），CPU上限（${item.cpuLimit}Core），GPU（${item.gpuNum}G）`,
            value: item.id,
          }))}
        />
      );
    }
    if (dataIndex === "node") {
      node = (
        <Select placeholder="请选择部署服务器" disabled={creating}>
          {hosts?.map((host) => (
            <Select.Option
              disabled={host.exceedLimit}
              value={host.nodeName}
              key={host.nodeName}
            >
              {`${host.nodeName}，已预占（${host.preOccupyMem}/${host.totalMem}M，${host.preOccupyCpu}/${host.totalCpu}Core，${host.preOccupyGpu}/${host.totalGpu}G）`}
            </Select.Option>
          ))}
        </Select>
      );
    }
  }

  if (inputType === "text") {
    node = <Input placeholder="请输入名称" disabled={creating} />;
  }

  return node;
};

const getChildren = (
  dataIndex: string,
  record: Item,
  children: React.ReactNode
) => {
  if (dataIndex === "envTemplateId") {
    return (
      <span>{`内存上限（${record.cpuMemLimit ?? "~"}M），CPU上限（${
        record.cpuCoreLimit ?? "~"
      }Core），GPU（${record.gpuMem ?? "~"}G）`}</span>
    );
  }
  if (dataIndex === "node") {
    return record.node;
  }
  return children;
};

const EditableCell: React.FC<EditableCellProps> = ({
  editing,
  dataIndex,
  title,
  inputType,
  record,
  index,
  children,
  allImages,
  creating,
  hosts,
  envTemplates,
  ...restProps
}) => {
  const inputNode = getInputNode(
    inputType,
    dataIndex,
    allImages,
    envTemplates,
    hosts,
    creating
  );
  const requireItems = ["name", "imageName", "gpu", "node", "envTemplateId"];

  return (
    <td {...restProps}>
      {editing ? (
        <Form.Item
          name={requireItems.includes(dataIndex) ? dataIndex : undefined}
          style={{ margin: 0 }}
          rules={[
            {
              required:
                dataIndex === "name" ||
                dataIndex === "imageName" ||
                dataIndex === "envTemplateId",
              message:
                dataIndex === "name" ? `请输入${title}!` : `请选择${title}`,
            },
          ]}
        >
          {inputNode}
        </Form.Item>
      ) : (
        getChildren(dataIndex, record, children)
      )}
    </td>
  );
};

export default observer(function GroupEnv() {
  const {
    getConfigTeamImageInstance,
    createTeamEnv,
    selectedGroup,
    deleteTeamEnv,
    getAllImageList,
    imageList: allImages,
    getEnvTemplates,
    envTemplates,
  } = useStores().organizationStore;
  const { getNodeResourceUsage, hosts } = useStores().userStore;

  const [form] = Form.useForm();
  const [data, setData] = useState<Item[]>([]);
  const [editingKey, setEditingKey] = useState("");
  const [creating, setCreating] = useState(false);

  const getImageInstancesList = () => {
    getConfigTeamImageInstance().then((data: ImageInstance[]) => {
      const instances: Item[] = data.map((item) => ({
        key: String(item.id),
        ...item,
        cpuMemRequest: item.cpuMem,
        cpuCoreRequest: item.cpuCore,
        gpu: item.gpuCore,
      }));

      setData(instances);
    });
  };

  useMount(() => {
    getImageInstancesList();
    getNodeResourceUsage();
    getAllImageList();
    getEnvTemplates();
  });

  const edit = (record: Partial<Item> & { key: React.Key }) => {
    form.setFieldsValue({ name: "", ...record });
    setEditingKey(record.key);
  };

  const onCreate = async (key: React.Key) => {
    try {
      const row = (await form.validateFields()) as Item;

      const newData = [...data];
      const index = newData.findIndex((item) => key === item.key);

      if (index > -1) {
        setCreating(true);

        const rowItem = {
          envTemplateId: row.envTemplateId || 0,
          teamId: selectedGroup!.id,
          node: row.node,
          imageId: Number(row.imageName),
          name: row.name || "",
        };

        // 创建用户镜像实例
        createTeamEnv(rowItem)
          .then(() => {
            message.success("镜像创建成功");
            getImageInstancesList();

            setEditingKey("");
          })
          .catch(() => {
            message.error("镜像创建失败");
          })
          .finally(() => {
            setCreating(false);
          });
      } else {
        newData.push(row);
        setData(newData);
        setEditingKey("");
      }
    } catch {
      message.info("镜像创建失败");
    }
  };

  const onDelete = (id: number) => {
    deleteTeamEnv({
      jupyterEnvId: id,
      teamId: selectedGroup!.id,
    })
      .then(() => {
        getImageInstancesList();
        message.success("删除成功");
      })
      .catch(() => {
        message.error("删除失败");
      })
      .finally(() => {});
  };

  const columns = [
    {
      title: "环境名称",
      dataIndex: "name",
      width: "15%",
      editable: true,
    },
    {
      title: "镜像",
      dataIndex: "imageName",
      width: "15%",
      editable: true,
    },
    {
      title: "资源配置",
      dataIndex: "envTemplateId",
      width: "35%",
      editable: true,
    },
    {
      title: "部署服务器",
      dataIndex: "node",
      width: "25%",
      editable: true,
    },
    {
      title: "操作",
      dataIndex: "operation",
      width: "10%",
      fixed: "right" as "right",
      render: (_: any, record: Item) => {
        const editable = record.key === editingKey || record.id < 0;
        // const editable = isEditing(record);
        return editable ? (
          <Space>
            <Tooltip title="保存">
              <Typography.Link
                onClick={() => onCreate(record.key)}
                style={{ marginRight: 8 }}
                // disabled={creating}
              >
                <CheckCircleOutlined />
              </Typography.Link>
            </Tooltip>
            <Tooltip title="取消">
              <Typography.Link
                onClick={() => {
                  const newData = data.slice(0, data.length - 1);
                  setEditingKey("");
                  setData(newData);
                }}
              >
                <CloseCircleOutlined />
              </Typography.Link>
            </Tooltip>

            <When condition={creating}>
              <LoadingOutlined style={{ float: "right", marginTop: "4px" }} />
            </When>
          </Space>
        ) : (
          <Permission code="B150122" disabled>
            <Popconfirm
              title="确定要删除吗?"
              onConfirm={() => onDelete(record.id)}
            >
              <Tooltip title="删除">
                <Typography.Link>
                  <DeleteOutlined />
                </Typography.Link>
              </Tooltip>
            </Popconfirm>
          </Permission>
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
        inputType: col.dataIndex === "name" ? "text" : "select",
        dataIndex: col.dataIndex,
        title: col.title,
        editing: record.key === editingKey || record.id < 0,
        allImages,
        creating,
        envTemplates,
        hosts,
      }),
    };
  });

  const onAdd = () => {
    const isCreating = data.find((item) => item.id === -1);

    if (isCreating) {
      message.info("镜像实例创建不允许并发操作");
      return;
    }

    const newData = {
      key: UUID(),
      name: undefined,
      gpuMem: 0,
      cpuMemRequest: undefined,
      cpuMemLimit: 10240,
      cpuCoreLimit: 5,
      cpuCoreRequest: undefined,
      imageId: +new Date(),
      id: -1,
      node: undefined,
      imageName: undefined,
    };
    setData([...data, newData]);

    edit(newData);
  };

  return (
    <div className="mt-6">
      <div className="flex items-center justify-between mb-4">
        <div>
          <div className="w-1 h-5 mr-2 bg-red-600 float-start" />
          团队环境
        </div>
        <Permission code="B150120" hidden>
          <Button icon={<PlusOutlined />} type="primary" onClick={onAdd}>
            添加环境
          </Button>
        </Permission>
      </div>
      <Form form={form} component={false} size="small" preserve={false}>
        <Table
          components={{
            body: {
              cell: EditableCell,
            },
          }}
          bordered
          dataSource={data}
          columns={mergedColumns}
          rowClassName="editable-row"
          pagination={false}
          scroll={{ x: 1600, y: 200 }}
        />
      </Form>
    </div>
  );
});
