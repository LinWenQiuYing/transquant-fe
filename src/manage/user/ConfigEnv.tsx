/* eslint-disable prettier/prettier */
import { LoadingOutlined } from "@ant-design/icons";
import { UUID } from "@transquant/utils";
import { useMount } from "ahooks";
import {
  Button,
  Form,
  Input,
  message,
  Popconfirm,
  Select,
  Table,
  Typography,
} from "antd";
import { observer } from "mobx-react";
import React, { useState } from "react";
import { When } from "react-if";
import { useStores } from "../hooks";
import { EnvTemp, Host, ImageInstance } from "../types";

interface Item {
  key: string;
  name?: string;
  envTemplateId?: number;
  node?: string;
  cpuMemLimit?: number;
  cpuMemRequest?: number;
  cpuCoreLimit?: number;
  cpuCoreRequest?: number;
  gpuMem: number;
  imageId: number;
  id: number;
  imageName?: string;
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
          options={envTemplates.map((item) => ({
            label: `${item.name},内存上限（${
              item.memLimit ?? "~"
            }M），CPU上限（${item.cpuLimit ?? "~"}Core），GPU（${
              item.gpuNum ?? "~"
            }G）`,
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
              value={host.nodeName}
              key={host.nodeName}
              disabled={host.exceedLimit}
            >
              {`${host.nodeName}，已预占（内存${host.preOccupyMem}/${host.totalMem}M，CPU${host.preOccupyCpu}/${host.totalCpu}Core，GPU${host.preOccupyGpu}/${host.totalGpu}G）`}
            </Select.Option>
          ))}
        </Select>
      );
    }
  }

  if (inputType === "text") {
    node = (
      <Input placeholder="请输入名称" disabled={creating} maxLength={15} />
    );
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
  envTemplates,
  hosts,
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
  const requireItems = ["name", "imageName", "envTemplateId", "node"];

  return (
    <td {...restProps}>
      {editing ? (
        <Form.Item
          name={requireItems.includes(dataIndex) ? dataIndex : undefined}
          style={{ margin: 0 }}
          rules={[
            {
              required: dataIndex === "name" || dataIndex === "imageName",
              message: `请输入${title}!`,
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

interface ConfigEnvProps {
  data: { id: number; groupId?: number; type: number };
  type?: "group" | "personal";
}

export default observer(function ConfigEnv(props: ConfigEnvProps) {
  const { data: userData } = props;

  const { userStore } = useStores();
  const {
    getPrivateEnvList,
    getAllImageList,
    createPrivateEnv,
    deletePrivateEnv,
    getNodeResourceUsage,
    hosts,
    allImages,
    envTemplates,
  } = userStore;

  const [form] = Form.useForm();
  const [data, setData] = useState<Item[]>([]);
  const [editingKey, setEditingKey] = useState("");
  const [creating, setCreating] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [deleteId, setDeleteId] = useState(-1);

  const getImageInstancesList = () => {
    if (userData.type === 0) {
      getPrivateEnvList(userData.id).then((data: ImageInstance[]) => {
        const instances: Item[] = data.map((item) => ({
          key: String(item.id),
          ...item,
          cpuMemRequest: item.cpuMem,
          cpuCoreRequest: item.cpuCore,
          gpu: item.gpuCore,
        }));

        setData(instances);
      });
    }
  };

  useMount(() => {
    getImageInstancesList();
    getNodeResourceUsage();
    getAllImageList();
  });

  const isEditing = (record: Item) => {
    // record.id < 0 证明是新增的，未落库的
    return record.key === editingKey || record.id < 0;
  };

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
          userId: userData.id,
          envTemplateId: row.envTemplateId!,
          node: row.node,
          imageId: Number(row.imageName),
          name: row.name || "",
        };

        // 创建用户镜像实例
        createPrivateEnv(rowItem)
          .then(() => {
            message.success("环境创建成功");
            getImageInstancesList();

            setEditingKey("");
          })
          .catch(() => {
            message.error("环境创建失败");
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
    setDeleting(true);
    setDeleteId(id);

    deletePrivateEnv({
      jupyterEnvId: id,
      userId: userData.id,
    })
      .then(() => {
        getImageInstancesList();
        message.success("删除成功");
      })
      .catch(() => {
        message.error("删除失败");
      })
      .finally(() => {
        setDeleting(false);
      });
  };

  const columns = [
    {
      title: "环境名称",
      dataIndex: "name",
      width: 200,
      editable: true,
      ellipsis: true,
      fixed: "left" as const,
    },
    {
      title: "镜像",
      dataIndex: "imageName",
      width: 200,
      ellipsis: true,
      editable: true,
    },
    {
      title: "资源配置",
      dataIndex: "envTemplateId",
      width: 500,
      ellipsis: true,
      editable: true,
    },
    {
      title: "部署服务器",
      dataIndex: "node",
      width: 600,
      ellipsis: true,
      editable: true,
    },
    {
      title: "操作",
      dataIndex: "operation",
      width: 100,
      fixed: "right" as const,
      ellipsis: true,
      render: (_: any, record: Item) => {
        const editable = isEditing(record);
        return editable ? (
          <span>
            <Typography.Link
              onClick={() => onCreate(record.key)}
              style={{ marginRight: 8 }}
            >
              <Button type="link" disabled={creating}>
                创建
              </Button>
            </Typography.Link>

            <When condition={creating}>
              <LoadingOutlined style={{ float: "right", marginTop: "4px" }} />
            </When>
          </span>
        ) : (
          <>
            <Typography.Link>
              <Popconfirm
                title="确定要删除吗?"
                onConfirm={() => onDelete(record.id)}
              >
                <Button type="link" disabled={deleting}>
                  删除
                </Button>
              </Popconfirm>
            </Typography.Link>
            <When condition={deleting && record.id === deleteId}>
              <LoadingOutlined style={{ float: "right", marginTop: "4px" }} />
            </When>
          </>
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
        editing: isEditing(record),
        allImages,
        envTemplates,
        creating,
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
      cpuCoreRequest: undefined,
      cpuCoreLimit: 5,
      imageId: +new Date(),
      id: -1,
      node: undefined,
      imageName: undefined,
    };
    setData([...data, newData]);

    edit(newData);
  };

  return (
    <>
      <Form form={form} component={false} size="small" preserve={false}>
        <Table
          components={{
            body: {
              cell: EditableCell,
            },
          }}
          bordered
          dataSource={data}
          scroll={{ x: 1100 }}
          columns={mergedColumns}
          rowClassName="editable-row"
          pagination={false}
        />
      </Form>
      <Button
        type="dashed"
        disabled={creating || deleting}
        block
        style={{ marginTop: 20 }}
        onClick={onAdd}
      >
        添加
      </Button>
    </>
  );
});
