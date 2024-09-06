import { MonacoEditor } from "@transquant/common";
import { Form, Input, Modal, Select } from "antd";
import { observer } from "mobx-react";
import { useEffect, useMemo, useState } from "react";
import { useStores } from "../hooks";
import { FileInfo } from "./OperatorMenu";

interface ICreateFile {
  data?: Partial<FileInfo>;
  visible: boolean;
  onVisibleChange: (value: boolean) => void;
}

const defaultFormValues = {
  fileName: "",
  suffix: "py",
  content: "",
};

export default observer(function CreateFile(props: ICreateFile) {
  const { visible, onVisibleChange, data } = props;
  const { createFile, updateFile } = useStores().dataManageStore;

  const [form] = Form.useForm();
  const [formValues, setFormValues] = useState(defaultFormValues);

  const isEdit = useMemo(() => {
    return "data" in props;
  }, [props]);

  useEffect(() => {
    if (!isEdit) return;
    const newValues = {
      fileName: data?.fileName || "",
      suffix: "py",
      content: data?.content || "",
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
        if (isEdit) {
          updateFile({
            fullName: data?.fullName || "",
            content: formValues.content,
          });
        } else {
          await createFile(formValues);
        }
      })
      .then(() => {
        // onVisibleChange(false);
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
        <div className="grid grid-cols-2 gap-x-6 ">
          <Form.Item
            name="fileName"
            label="文件名称"
            required
            rules={[
              {
                required: true,
                message: "请输入文件名称",
              },
            ]}
          >
            <Input
              placeholder="请输入文件名称"
              maxLength={50}
              showCount
              allowClear
            />
          </Form.Item>
          <Form.Item
            name="suffix"
            label="文件格式"
            required
            rules={[
              {
                required: true,
                message: "请选择文件格式",
              },
            ]}
          >
            <Select
              disabled
              placeholder="请选择文件格式"
              options={[
                {
                  value: "py",
                  label: "py",
                },
              ]}
            />
          </Form.Item>
        </div>
        <Form.Item name="content" label="文件内容">
          <MonacoEditor
            value={formValues.content}
            onChange={(value) => {
              onFormValueChange({ content: value });

              form.setFieldValue("content", value);
            }}
          />
        </Form.Item>
      </Form>
    </Modal>
  );
});
