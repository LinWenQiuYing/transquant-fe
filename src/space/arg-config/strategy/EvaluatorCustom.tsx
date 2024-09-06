import { QuestionCircleOutlined } from "@ant-design/icons";
import { CustomEvaluator } from "@transquant/space/types";
import { Form, Input, Tooltip } from "antd";
import { forwardRef, useEffect, useImperativeHandle, useState } from "react";

type IEvaluatorConf = CustomEvaluator;

interface EvaluatorConfProps {
  propData?: CustomEvaluator | null;
}

export default forwardRef(function EvaluatorCustom(
  props: EvaluatorConfProps,
  ref
) {
  const { propData } = props;

  const [form] = Form.useForm();
  const [formValues] = useState<Partial<IEvaluatorConf>>();

  useEffect(() => {
    form.setFieldsValue(propData);
  }, [propData]);

  const validateFields = async () => {
    const values = await form.validateFields();
    return values;
  };

  useImperativeHandle(ref, () => ({
    validateFields,
  }));

  return (
    <Form
      form={form}
      layout="vertical"
      preserve={false}
      initialValues={formValues}
    >
      <div className="columns-2">
        <Form.Item
          name="evaluatorName"
          label="评价名称"
          rules={[
            {
              required: true,
              message: "请输入评价名称",
            },
          ]}
        >
          <Input placeholder="请输入评价名称" />
        </Form.Item>
        <Form.Item
          name="filePathName"
          label="评价文件名称"
          rules={[
            {
              required: true,
              message: "请输入评价文件的相对路径",
            },
          ]}
        >
          <Input placeholder="请输入评价文件的相对路径" />
        </Form.Item>
      </div>
      <div className="columns-2">
        <Form.Item
          name="classEvaluatorName"
          label="类名"
          rules={[
            {
              required: true,
              message: "请输入类名",
            },
          ]}
        >
          <Input placeholder="请输入类名" />
        </Form.Item>
        <Form.Item
          name="argsList"
          label={
            <div>
              评价参数
              <Tooltip title="请按顺序输入参数，以英文逗号空格分隔">
                <QuestionCircleOutlined className="ml-2 text-gray-400" />
              </Tooltip>
            </div>
          }
        >
          <Input placeholder="请按顺序输入评价参数" />
        </Form.Item>
      </div>
    </Form>
  );
});
