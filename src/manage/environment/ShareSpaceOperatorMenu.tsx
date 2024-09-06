import { EditOutlined } from "@ant-design/icons";
import { Permission } from "@transquant/ui";
import { Form, Modal, Select, Space, Typography } from "antd";
import { observer } from "mobx-react";
import { useEffect, useState } from "react";
import { useStores } from "../hooks";
import { EnvTemp, ShareEnv } from "../types";

interface UpdateEnvModalProps {
  title?: string;
  updateShareEnv: ({
    shareId,
    envTemplateId,
  }: {
    shareId: number;
    envTemplateId: number;
  }) => void;
  env: ShareEnv;
  visible: boolean;
  onVisibleChange: (value: boolean) => void;
  envTemplates: EnvTemp[];
}

export type IFormValues = {
  shareId: number;
  envTemplateId: number;
};

function UpdateEnvModal(props: UpdateEnvModalProps) {
  const {
    visible,
    onVisibleChange,
    title = "修改环境",
    env,
    updateShareEnv,
    envTemplates,
  } = props;

  const [form] = Form.useForm();
  const [formValues, setFormValues] = useState<Partial<IFormValues>>();
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    setFormValues({
      shareId: env.id,
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
        await updateShareEnv({ ...values, shareId: env.id });
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
      </Form>
    </Modal>
  );
}

interface ShareSpaceOperatorMenuProps {
  env: ShareEnv;
}

export default observer(function ShareSpaceOperatorMenu(
  props: ShareSpaceOperatorMenuProps
) {
  const { env } = props;
  const { getHostInfo, updateShareEnv, envTemplates, getEnvTemplates } =
    useStores().environmentStore;
  const [visible, setVisible] = useState(false);

  return (
    <>
      <Space>
        <Permission code="B170108" disabled>
          <Typography.Link
            onClick={() => {
              getHostInfo();
              getEnvTemplates("170103");
              setVisible(true);
            }}
          >
            <EditOutlined />
          </Typography.Link>
        </Permission>
      </Space>
      <UpdateEnvModal
        env={env}
        updateShareEnv={updateShareEnv}
        visible={visible}
        onVisibleChange={(value) => setVisible(value)}
        envTemplates={envTemplates}
      />
    </>
  );
});
