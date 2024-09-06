import { Form, Input, Modal } from "antd";
import { observer } from "mobx-react";
import { useEffect, useState } from "react";
import { useStores } from "../hooks";

interface IRename {
  data: Partial<{ name: string; fullName: string }>;
  visible: boolean;
  onVisibleChange: (value: boolean) => void;
}

const defaultFormValues = {
  name: "",
};

export default observer(function Rename(props: IRename) {
  const { visible, onVisibleChange, data } = props;
  const { rename } = useStores().dataManageStore;

  const [form] = Form.useForm();
  const [formValues, setFormValues] = useState(defaultFormValues);

  useEffect(() => {
    if (!data) return;
    const newValues = {
      name: data.name || "",
    };
    setFormValues(newValues);
    form.setFieldsValue(newValues);
  }, [data]);

  const onFormValueChange = (value: any) => {
    setFormValues({ ...formValues, ...value });
  };

  const onOk = async () => {
    form
      .validateFields()
      .then(async () => {
        await rename({ name: formValues.name, fullName: data.fullName || "" });
      })
      .then(() => {
        onVisibleChange(false);
      });
  };

  return (
    <Modal
      open={visible}
      onCancel={() => onVisibleChange(false)}
      onOk={onOk}
      width={800}
      destroyOnClose
    >
      <Form
        form={form}
        layout="vertical"
        preserve={false}
        initialValues={formValues}
        autoComplete="off"
        onValuesChange={onFormValueChange}
      >
        <Form.Item
          name="name"
          label="名称"
          required
          rules={[
            {
              required: true,
              message: "请输入名称",
            },
          ]}
        >
          <Input placeholder="请输入名称" maxLength={50} showCount allowClear />
        </Form.Item>
      </Form>
    </Modal>
  );
});
