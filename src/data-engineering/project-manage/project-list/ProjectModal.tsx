import { clsPrefix } from "@transquant/constants";
import { DataType } from "@transquant/utils";
import { Form, Input, Modal } from "antd";
import { observer } from "mobx-react";
import { useEffect, useState } from "react";

import { useStores } from "../../hooks";
import { ProjectFormValueType, ProjectListItem } from "../../types";

interface ProjectModalProps<T> {
  title?: string;
  data?: T;
  visible: boolean;
  onVisibleChange: (value: boolean) => void;
}

const defaultFormValues: ProjectFormValueType = {
  projectName: "",
  desc: "",
};

export default observer(function ProjectModal<
  T extends DataType<ProjectListItem>
>(props: ProjectModalProps<T>) {
  const { title, visible, onVisibleChange, data } = props;
  const { createProject, editProject } = useStores().projectManageStore;

  const [form] = Form.useForm();
  const [formValues, setFormValues] = useState(defaultFormValues);
  const isEdit = title === "编辑项目";

  const onFormValueChange = (value: any) => {
    setFormValues({ ...formValues, ...value });
  };

  useEffect(() => {
    if (!data) return;
    if (isEdit) {
      setFormValues({
        projectName: data.name,
        desc: data.desc,
      });
      form.setFieldsValue({
        projectName: data.name,
        desc: data.desc,
      });
    }
  }, [data, visible]);

  const onOk = async () => {
    form
      .validateFields()
      .then(() => {
        if (isEdit && data) {
          editProject(data.code, formValues);
        } else {
          createProject(formValues);
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
      className={`${clsPrefix}-project-modal`}
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
          name="projectName"
          label="项目名称："
          required
          rules={[
            {
              required: true,
              message: "请输入项目名称！",
            },
          ]}
        >
          <Input
            placeholder="请输入项目名称"
            maxLength={50}
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
