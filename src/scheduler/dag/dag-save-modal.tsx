import { DeleteOutlined, PlusOutlined } from "@ant-design/icons";
import {
  Form,
  Input,
  InputNumber,
  Modal,
  Select,
  Switch,
  Typography,
} from "antd";
import { cloneDeep } from "lodash-es";
import { observer } from "mobx-react";
import { forwardRef, useEffect, useImperativeHandle, useState } from "react";
import { WorkflowDefinition } from "./types";

interface SQLProps {
  visible: boolean;
  definition?: WorkflowDefinition;
  onSubmit: (value: any) => void;
  onCancel: (value: boolean) => void;
}

const executionTypes = [
  { value: "PARALLEL", label: "并行" },
  { value: "SERIAL_WAIT", label: "串行等待" },
  {
    value: "SERIAL_DISCARD",
    label: "串行抛弃",
  },
  {
    value: "SERIAL_PRIORITY",
    label: "串行优先",
  },
];

const DIRECT_LIST = [
  { value: "IN", label: "IN" },
  { value: "OUT", label: "OUT" },
];

const defaultFormValues = {
  name: "",
  description: "",
  timeoutFlag: false,
  timeout: undefined,
  globalParams: [],
  release: false,
};

export default observer(
  forwardRef(function SQL(props: SQLProps, ref) {
    const { definition, visible, onSubmit, onCancel } = props;
    const [form] = Form.useForm();

    const [formValues, setFormValues] = useState(defaultFormValues);

    useEffect(() => {
      if (!definition) return;
      const process = props.definition?.processDefinition;
      if (process) {
        const values = {
          name: process.name,
          description: process.description,
          executionType: process.executionType || "PARALLEL",
          timeoutFlag: process.timeout && process.timeout > 0,
          timeout: process.timeout,
          globalParams: process.globalParamList.map((param) => ({
            key: param.prop,
            value: param.value,
            direct: param.direct,
          })),
        } as any;
        setFormValues(values);
        form.setFieldsValue(values);
      }
    }, [definition]);

    const onFormValueChange = async (value: any) => {
      setFormValues({ ...formValues, ...value });
    };

    const validate = async () => {
      const values = await form.validateFields();
      return values;
    };

    useImperativeHandle(ref, () => ({
      validate,
    }));

    const onOk = async () => {
      const values = await form.validateFields();

      onSubmit({ ...values, globalParams: formValues.globalParams });
    };

    return (
      <Modal
        open={visible}
        closable={false}
        onOk={onOk}
        onCancel={() => onCancel(false)}
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
            label="工作流名称"
            required
            rules={[
              {
                required: true,
                message: "请输入工作流名称",
              },
            ]}
          >
            <Input
              placeholder="请输入工作流名称"
              maxLength={50}
              showCount
              allowClear
            />
          </Form.Item>
          <Form.Item name="description" label="描述">
            <Input.TextArea placeholder="请输入描述" />
          </Form.Item>

          <Form.Item className="columns-2">
            <Form.Item
              name="timeoutFlag"
              label="超时失败"
              valuePropName="checked"
            >
              <Switch />
            </Form.Item>
            <Form.Item
              name="timeout"
              label="超时时长"
              className={`${
                formValues.timeoutFlag ? "opacity-1" : "opacity-0"
              }`}
            >
              <InputNumber placeholder="请输入时长" className="w-full" />
            </Form.Item>
          </Form.Item>
          <Form.Item name="executionType" label="执行策略">
            <Select placeholder="请选择执行策略" options={executionTypes} />
          </Form.Item>
          <Form.Item label="全局参数">
            {formValues.globalParams?.map(
              (
                item: {
                  key: string;
                  direct: string;
                  value: string;
                },
                index
              ) => (
                <div key={index} className="relative w-11/12 mb-2 columns-3">
                  <div>
                    <Input
                      placeholder="键"
                      value={item.key}
                      onChange={(e) => {
                        const globalParams = cloneDeep(formValues.globalParams);
                        const curGlobalParam = globalParams[index] as any;
                        curGlobalParam.key = e.target.value;
                        onFormValueChange({ globalParams });
                      }}
                    />
                  </div>
                  <div>
                    <Select
                      options={DIRECT_LIST}
                      value={item.direct}
                      onChange={(value) => {
                        const globalParams = cloneDeep(formValues.globalParams);
                        const curGlobalParam = globalParams[index] as any;
                        curGlobalParam.direct = value;
                        onFormValueChange({ globalParams });
                      }}
                    />
                  </div>

                  <div>
                    <Input
                      placeholder="值"
                      value={item.value}
                      onChange={(e) => {
                        const globalParams = cloneDeep(formValues.globalParams);
                        const curGlobalParam = globalParams[index] as any;
                        curGlobalParam.value = e.target.value;
                        onFormValueChange({ globalParams });
                      }}
                    />
                  </div>
                  <Typography.Link
                    onClick={() => {
                      const globalParams = cloneDeep(formValues.globalParams);
                      globalParams.splice(index, 1);

                      onFormValueChange({ globalParams });
                    }}
                    className="absolute w-6 h-6 text-center rounded-full -right-8 top-1 hover:bg-red-200"
                  >
                    <DeleteOutlined />
                  </Typography.Link>
                </div>
              )
            )}
            <Typography.Link
              className="block w-8 h-8 p-1 text-center text-red-600 bg-red-200 rounded-full"
              onClick={() => {
                onFormValueChange({
                  globalParams: [
                    ...(formValues?.globalParams || []),
                    {
                      key: "",
                      direct: "IN",
                      value: "",
                    },
                  ],
                });
              }}
            >
              <PlusOutlined />
            </Typography.Link>
          </Form.Item>
          {/* <Form.Item name="release" valuePropName="checked">
            <Checkbox>是否上线工作流定义</Checkbox>
          </Form.Item> */}
        </Form>
      </Modal>
    );
  })
);
