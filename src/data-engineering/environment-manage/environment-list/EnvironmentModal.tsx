import { clsPrefix } from "@transquant/constants";
import { DataType } from "@transquant/utils";
import { Button, Form, Input, Modal } from "antd";
import { observer } from "mobx-react";
import { useEffect, useState } from "react";

import { useStores } from "../../hooks";
import { EnvironmentFormValueType, EnvironmentListItem } from "../../types";

interface EnvironmentModalProps<T> {
  title?: string;
  data?: T;
  visible: boolean;
  onVisibleChange: (value: boolean) => void;
}

const defaultFormValues: EnvironmentFormValueType = {
  name: "",
  params: "",
  desc: "",
};

export default observer(function EnvironmentModal<
  T extends DataType<EnvironmentListItem>
>(props: EnvironmentModalProps<T>) {
  const { title, visible, onVisibleChange, data } = props;
  const { createEnvironment, editEnvironment } =
    useStores().environmentManageStore;

  const [form] = Form.useForm();
  const [formValues, setFormValues] = useState(defaultFormValues);
  const isEdit = title === "编辑环境";

  const onFormValueChange = (value: any) => {
    setFormValues({ ...formValues, ...value });
  };

  useEffect(() => {
    if (!data) return;
    if (isEdit) {
      setFormValues({
        name: data.name,
        params: data.params,
        desc: data.desc,
      });
      form.setFieldsValue({
        name: data.name,
        params: data.params,
        desc: data.desc,
      });
    }
  }, [data, visible]);

  const onOk = async () => {
    form
      .validateFields()
      .then(() => {
        if (isEdit && data) {
          editEnvironment(data.code, formValues);
        } else {
          createEnvironment(formValues);
        }
        onVisibleChange(false);
      })
      .catch(() => {});
  };

  return (
    <Modal
      title={title}
      open={visible}
      destroyOnClose
      maskClosable={false}
      onCancel={() => onVisibleChange(false)}
      width={572}
      onOk={onOk}
      className={`${clsPrefix}-environment-modal`}
      footer={[
        <Button key="back" onClick={() => onVisibleChange(false)}>
          取消
        </Button>,
        <Button key="submit" type="primary" onClick={onOk}>
          确定
        </Button>,
      ]}
    >
      <Form
        form={form}
        layout="vertical"
        preserve={false}
        onValuesChange={onFormValueChange}
        initialValues={formValues}
        autoComplete="off"
      >
        <Form.Item
          name="name"
          label="环境名称："
          required
          rules={[
            {
              required: true,
              message: "请输入环境名称！",
            },
          ]}
        >
          <Input
            placeholder="请输入环境名称"
            maxLength={50}
            showCount
            allowClear
          />
        </Form.Item>
        <Form.Item
          name="params"
          label="环境配置："
          required
          rules={[
            {
              required: true,
              message: "请输入环境配置！",
            },
          ]}
        >
          <Input.TextArea
            placeholder="请输入环境配置"
            maxLength={200}
            autoSize={{ minRows: 6, maxRows: 8 }}
            showCount
            allowClear
          />
        </Form.Item>
        <Form.Item name="desc" label="描述：">
          <Input.TextArea
            placeholder="请输入描述"
            maxLength={200}
            showCount
            allowClear
          />
        </Form.Item>
      </Form>
    </Modal>
  );
});
