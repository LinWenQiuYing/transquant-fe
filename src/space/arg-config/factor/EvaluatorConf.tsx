import { QuestionCircleOutlined } from "@ant-design/icons";
import { FactorEvaluator } from "@transquant/space/types";
import { Form, Input, Radio, Tooltip } from "antd";
import { forwardRef, useEffect, useImperativeHandle, useState } from "react";

type IEvaluatorConf = FactorEvaluator;

interface EvaluatorConfProps {
  propData?: FactorEvaluator | null;
}

export default forwardRef(function EvaluatorConf(
  props: EvaluatorConfProps,
  ref
) {
  const { propData } = props;

  const [form] = Form.useForm();
  const [formValues] = useState<Partial<IEvaluatorConf>>();
  const [evaluator, setEvaluator] = useState(0);

  useEffect(() => {
    setEvaluator(propData === null ? 0 : 1);
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
    <div>
      <div className="mb-4">
        <span className="mr-2">评价组件配置：</span>
        <Radio.Group
          value={evaluator}
          onChange={(e) => setEvaluator(e.target.value)}
        >
          <Radio value={1}>评价</Radio>
          <Radio value={0}>不评价</Radio>
        </Radio.Group>
        <Tooltip title="若不评价则只做因子计算，不对因子进行评价">
          <QuestionCircleOutlined className="-ml-2 text-gray-400 cursor-pointer " />
        </Tooltip>
      </div>
      {evaluator ? (
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
      ) : null}
    </div>
  );
});
