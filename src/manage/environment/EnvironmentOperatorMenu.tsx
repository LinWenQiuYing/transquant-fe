import { EditOutlined } from "@ant-design/icons";
import { Permission } from "@transquant/ui";
import { Form, Modal, Select, Space, Typography } from "antd";
import { observer } from "mobx-react";
import { useEffect, useState } from "react";
import { useStores } from "../hooks";
import { EnvTemp, Host as HostInfo } from "../types";
import { Environment } from "../types/environment";

interface UpdateEnvModalProps {
  title?: string;
  updateManageEnv: (data: Partial<IFormValues>) => void;
  env: Environment;
  hosts: HostInfo[];
  visible: boolean;
  onVisibleChange: (value: boolean) => void;
  envTemplates: EnvTemp[];
}

export type IFormValues = {
  cpuLimit: number;
  effectNow: boolean;
  envId: number;
  gpuCore: number;
  memLimit: number;
  node: string;
  solidify: boolean;
};

const defaultFormValues = {
  effectNow: true,
  solidify: false,
};

function UpdateEnvModal(props: UpdateEnvModalProps) {
  const {
    visible,
    onVisibleChange,
    title = "修改环境",
    env,
    hosts,
    updateManageEnv,
    envTemplates,
  } = props;

  const [form] = Form.useForm();
  const [formValues, setFormValues] =
    useState<Partial<IFormValues>>(defaultFormValues);
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    setFormValues({
      ...defaultFormValues,
      ...env,
      cpuLimit: env.cpuCoreLimit,
      memLimit: env.cpuMemLimit,
    });
  }, [env]);

  const onFormValueChange = (value: any) => {
    setFormValues({ ...formValues, ...value });
  };

  const onOk = () => {
    setUpdating(true);
    form
      .validateFields()
      .then(async (values) => {
        await updateManageEnv({ ...values, envId: env.id });
        onVisibleChange(false);
      })
      .finally(() => {
        setUpdating(false);
      });
  };

  return (
    <Modal
      title={title}
      open={visible}
      onCancel={() => onVisibleChange(false)}
      onOk={onOk}
      okButtonProps={{ loading: updating }}
    >
      <Form
        form={form}
        layout="vertical"
        preserve={false}
        initialValues={formValues}
        onValuesChange={onFormValueChange}
      >
        <Form.Item
          label="资源配置"
          name="envTemplateId"
          rules={[
            {
              required: true,
              message: "请选择资源模版",
            },
          ]}
        >
          <Select
            placeholder="请选择资源模版"
            options={envTemplates.map((item) => ({
              label: `${item.name},内存上限（${item.memLimit}M），CPU上限（${item.cpuLimit}Core），GPU（${item.gpuNum}G）`,
              value: item.id,
            }))}
          />
        </Form.Item>
        <Form.Item
          name="node"
          label="部署服务器"
          rules={[
            {
              required: true,
              message: "请选择部署服务器",
            },
          ]}
        >
          <Select
            placeholder="请选择部署服务器"
            options={hosts.map((host) => ({
              label: `${host.nodeName}，已预占（${host.preOccupyMem}/${host.totalMem}M，${host.preOccupyCpu}/${host.totalCpu}Core，${host.preOccupyGpu}/${host.totalGpu}G）`,
              value: host.nodeName,
              disabled: host.exceedLimit,
            }))}
          />
        </Form.Item>
      </Form>
    </Modal>
  );
}

interface EnvironmentOperatorMenuProps {
  env: Environment;
}

export default observer(function EnvironmentOperatorMenu(
  props: EnvironmentOperatorMenuProps
) {
  const { env } = props;
  const {
    updateManageEnv,
    hostInfos,
    getNodeResourceUsage,
    envTemplates,
    getEnvTemplates,
  } = useStores().environmentStore;
  const [visible, setVisible] = useState(false);

  return (
    <>
      <Space>
        <Permission code="B170104" disabled>
          <Typography.Link
            onClick={() => {
              getNodeResourceUsage();
              getEnvTemplates("170102");
              setVisible(true);
            }}
          >
            <EditOutlined />
          </Typography.Link>
        </Permission>
      </Space>
      <UpdateEnvModal
        env={env}
        hosts={hostInfos}
        updateManageEnv={updateManageEnv}
        visible={visible}
        onVisibleChange={(value) => setVisible(value)}
        envTemplates={envTemplates}
      />
    </>
  );
});
