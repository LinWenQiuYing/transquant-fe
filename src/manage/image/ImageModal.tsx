import { nameReg, nameRegMessage } from "@transquant/constants";
import { DataType } from "@transquant/utils";
import { Form, Input, Modal } from "antd";
import { observer } from "mobx-react";
import { useEffect, useState } from "react";
import { useStores } from "../hooks";
import { Image } from "../types";

interface ImageModalProps {
  title?: string;
  data?: DataType<Image>;
  visible: boolean;
  onVisibleChange: (value: boolean) => void;
}

const defaultFormValues = {
  name: "",
  path: "",
  desc: "",
};

export default observer(function ImageModal(props: ImageModalProps) {
  const { title, data, visible, onVisibleChange } = props;

  const { addImage, updateImage } = useStores().imageStore;
  const isEdit = "data" in props;

  const [form] = Form.useForm();
  const [formValues] = useState(defaultFormValues);

  useEffect(() => {
    if (isEdit) {
      form.setFieldsValue({ ...defaultFormValues, ...data });
    }
  }, [data, visible]);

  const onOk = async () => {
    form.validateFields().then(async (values) => {
      form.resetFields();

      if (isEdit) {
        await updateImage({ ...values, id: data?.id });
      } else {
        await addImage(values);
      }
      onVisibleChange(false);
    });
  };

  return (
    <Modal
      title={title}
      open={visible}
      destroyOnClose
      maskClosable
      onCancel={() => onVisibleChange(false)}
      width={600}
      onOk={onOk}
    >
      <Form
        form={form}
        preserve={false}
        layout="vertical"
        labelCol={{ span: 4 }}
        initialValues={formValues}
      >
        <Form.Item
          name="name"
          label="镜像名称"
          rules={[
            {
              required: true,
              message: nameRegMessage,
              pattern: nameReg,
            },
          ]}
        >
          <Input placeholder="请输入镜像名称" maxLength={10} />
        </Form.Item>
        <Form.Item
          name="path"
          label="镜像地址"
          rules={[
            {
              required: true,
              message: "请输入镜像地址",
            },
          ]}
        >
          <Input placeholder="请输入镜像地址" disabled={isEdit} />
        </Form.Item>
        <Form.Item name="desc" label="描述">
          <Input placeholder="请输入描述" />
        </Form.Item>
      </Form>
    </Modal>
  );
});
