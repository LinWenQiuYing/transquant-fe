import { IconFont } from "@transquant/ui";
import { DataType } from "@transquant/utils";
import { Form, Input, Modal, Select, Tag } from "antd";
import { observer } from "mobx-react";
import { useEffect, useState } from "react";

import { When } from "react-if";
import { useStores } from "../../hooks";
import { ProjectItem } from "../../types";

interface FactorModalProps<T> {
  title?: string;
  data?: T;
  visible: boolean;
  onVisibleChange: (value: boolean) => void;
}

const defaultFormValues = {
  projectName: "",
  tags: [],
  templateId: undefined,
  comment: "",
};

export default observer(function StrategyModal<T extends DataType<ProjectItem>>(
  props: FactorModalProps<T>
) {
  const { title, visible, onVisibleChange, data } = props;
  const { createStrategyProject, updateStrategyProject, templates, allTags } =
    useStores().strategyResearchStore;

  const [form] = Form.useForm();
  const [formValues] = useState(defaultFormValues);
  const isEdit = "data" in props;

  useEffect(() => {
    if (!data) return;
    if (isEdit) {
      form.setFieldsValue({
        comment: data.comment,
        projectName: data.name,
        tags: data.tags.map((item) => item.name),
      });
    }
  }, [data, visible]);

  const onOk = async () => {
    form.validateFields().then(async (values) => {
      form.resetFields();

      if (isEdit) {
        await updateStrategyProject({ ...values, projectId: data?.id });
      } else {
        await createStrategyProject(values);
      }
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
          name="projectName"
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
          <Input
            placeholder="请输入项目名称"
            maxLength={15}
            disabled={isEdit}
          />
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
        <When condition={!isEdit}>
          <Form.Item name="templateId" label="研究模版">
            <Select placeholder="请选择研究模版">
              {templates.map((template) => (
                <Select.Option key={template.id}>
                  <Tag
                    icon={
                      <IconFont
                        type={
                          template.type === 0
                            ? "xitongshezhi"
                            : "tuanduikongjian"
                        }
                      />
                    }
                    color={template.type === 0 ? "green" : "blue"}
                  >
                    {template.type === 0 ? "系统" : "团队"}
                  </Tag>
                  {template.name}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
        </When>
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
