import { Button, Form, Input, Modal, Upload } from "antd";
import { observer } from "mobx-react";
import { useState } from "react";
import { useStores } from "../hooks";

interface IUploadFile {
  visible: boolean;
  onVisibleChange: (value: boolean) => void;
}

const defaultFormValues = {
  name: "",
  file: undefined,
};

export default observer(function UploadFile(props: IUploadFile) {
  const { visible, onVisibleChange } = props;
  const { uploadFile } = useStores().dataManageStore;

  const [form] = Form.useForm();
  const [formValues, setFormValues] = useState(defaultFormValues);

  const onFormValueChange = (value: any) => {
    if ("file" in value) {
      const filename = value?.file?.file?.name || "";

      setFormValues({
        ...formValues,
        file: value.file.file.originFileObj,
        name: filename,
      });
      form.setFieldValue("name", filename);
      return;
    }

    setFormValues({ ...formValues, ...value });
  };

  const onOk = async () => {
    form
      .validateFields()
      .then(async () => {
        await uploadFile(formValues);
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
        <Form.Item name="name" label="文件名称" required>
          <Input
            placeholder="文件名称"
            maxLength={50}
            showCount
            allowClear
            disabled
          />
        </Form.Item>
        <Form.Item
          name="file"
          label="上传文件"
          required
          rules={[
            {
              required: true,
              message: "请上传文件",
            },
          ]}
        >
          <Upload action="/tqlab/template/empty">
            <Button type="primary">上传文件</Button>
          </Upload>
        </Form.Item>
      </Form>
    </Modal>
  );
});
