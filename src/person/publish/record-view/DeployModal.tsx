import useMount from "ahooks/lib/useMount";
import { Form, Input, Modal, Select } from "antd";
import { observer } from "mobx-react";
import { useEffect, useState } from "react";

import { useStores } from "../../hooks";

interface DeployModalProps {
  title?: string;
  personalProjectName?: string;
  processInstanceId?: number;
  visible: boolean;
  onVisibleChange: (value: boolean) => void;
}

const defaultFormValues = {
  personalProjectName: "",
  tags: [],
  comment: "",
};

export default observer(function DeployModal(props: DeployModalProps) {
  const {
    title = "新建因子项目",
    visible,
    onVisibleChange,
    personalProjectName,
    processInstanceId,
  } = props;
  const { deployIntoPersonalSpace, allTags, getTags } =
    useStores().publishStore;

  const [form] = Form.useForm();
  const [formValues, setFormValues] = useState<any>(defaultFormValues);

  useMount(() => {
    getTags();
  });

  useEffect(() => {
    const newFormValues = {
      personalProjectName,
      tags: [],
      comment: "",
    };

    form.setFieldsValue(newFormValues);
    setFormValues(newFormValues);
  }, [personalProjectName, visible]);

  const onOk = async () => {
    form.validateFields().then(async (values) => {
      form.resetFields();

      deployIntoPersonalSpace({ ...values, processInstanceId });
      onVisibleChange(false);
    });
  };
  return (
    <Modal
      title={title}
      open={visible}
      destroyOnClose
      maskClosable={false}
      onCancel={() => onVisibleChange(false)}
      width={600}
      onOk={onOk}
    >
      <Form
        form={form}
        layout="vertical"
        preserve={false}
        initialValues={formValues}
      >
        <Form.Item
          name="personalProjectName"
          label="项目名称"
          rules={[
            {
              required: true,
              message:
                "名称不能为空且不能为纯数字，且只允许中文、英文、数字、和'_'",
              pattern: /^(?![0-9]+$)[\u4300-\u9fa5_a-zA-Z0-9]+$/,
            },
          ]}
        >
          <Input placeholder="请输入项目名称" maxLength={15} />
        </Form.Item>
        <Form.Item name="tags" label="标签设置">
          <Select
            placeholder="请选择项目标签"
            mode="tags"
            tokenSeparators={[","]}
          >
            {allTags.map((label: any) => (
              <Select.Option key={label.name}>{label.name}</Select.Option>
            ))}
          </Select>
        </Form.Item>

        <Form.Item name="comment" label="备注">
          <Input.TextArea
            placeholder="请输入备注信息"
            maxLength={50}
            showCount
          />
        </Form.Item>
      </Form>
    </Modal>
  );
});
