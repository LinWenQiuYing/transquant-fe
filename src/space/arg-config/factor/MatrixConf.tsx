import { QuestionCircleOutlined } from "@ant-design/icons";
import { FactorMatrix } from "@transquant/space/types";
import { DatePicker, Form, Input, Select, Tooltip } from "antd";
import dayjs, { Dayjs } from "dayjs";
import { toJS } from "mobx";
import { forwardRef, useEffect, useImperativeHandle, useState } from "react";

type IMatrixConf = FactorMatrix;

interface MatrixConfProps {
  propData?: IMatrixConf;
}

const defaultFormValues: IMatrixConf = {
  codes: "",
  mode: "",
  saveSignal: 0,
  span: [],
  tableName: "",
  universe: "",
};

const dateFormat = "YYYY-MM-DD";

export default forwardRef(function MatrixConf(props: MatrixConfProps, ref) {
  const { propData } = props;
  const [form] = Form.useForm();
  const baseProps: Partial<IMatrixConf> = {
    ...toJS(propData),
    span: propData?.span
      ? [
          dayjs(propData?.span[0], dateFormat),
          dayjs(propData?.span[1], dateFormat),
        ]
      : undefined,
  };
  const mergeProps = { ...defaultFormValues, ...baseProps };
  const [formValues, setFormValues] =
    useState<Partial<IMatrixConf>>(mergeProps);

  const validateFields = async () => {
    const values = await form.validateFields();
    const span = values.span.map((item: Dayjs) =>
      dayjs(item).format(dateFormat)
    );
    return {
      ...values,
      span,
    };
  };

  useEffect(() => {
    setFormValues(mergeProps);
    form.setFieldsValue(mergeProps);
  }, [propData]);

  useImperativeHandle(ref, () => ({
    validateFields,
  }));

  const onFormValueChange = (value: any) => {
    setFormValues({ ...formValues, ...value });
  };

  return (
    <Form
      form={form}
      layout="vertical"
      preserve={false}
      initialValues={formValues}
      onValuesChange={onFormValueChange}
    >
      <div className="columns-2">
        <Form.Item
          name="span"
          label="回测时间段"
          rules={[
            {
              required: true,
              message: "请选择回测时间段",
            },
          ]}
        >
          <DatePicker.RangePicker className="w-full" />
        </Form.Item>
        <Form.Item
          name="codes"
          label={
            <div>
              标的池
              <Tooltip title="支持输入*(表示所有标的)/代码标的/pickle文件的相对路径">
                <QuestionCircleOutlined className="ml-2 text-gray-400 cursor-pointer" />
              </Tooltip>
            </div>
          }
          rules={[
            {
              required: true,
              message: "请输入*/标的代码/pickle文件相对路径",
            },
          ]}
        >
          <Input placeholder="请输入*/标的代码/pickle文件相对路径" />
        </Form.Item>
      </div>
      <div className="columns-2">
        <Form.Item
          name="universe"
          rules={[
            {
              required: formValues.codes === "*",
              message: "仅支持输入小写字母，数字，下划线，英文逗号",
              pattern: /^[a-z0-9,_]+$/,
            },
          ]}
          label={
            <div>
              动态标的池
              <Tooltip title="需要订阅相应的行业、板块或者指数成分股的表；当标的池为“*”时，该项必须配置">
                <QuestionCircleOutlined className="ml-2 text-gray-400 cursor-pointer" />
              </Tooltip>
            </div>
          }
        >
          <Input placeholder="请按顺序输入数据库名，数据表名、列名" />
        </Form.Item>
        <Form.Item name="saveSignal" label="是否保存因子数据">
          <Select
            placeholder="请选择是否保存因子数据"
            options={[
              {
                label: "不保存",
                value: 0,
              },
              {
                label: "保存",
                value: 1,
              },
            ]}
          />
        </Form.Item>
      </div>
      {formValues.saveSignal ? (
        <div className="columns-2">
          <Form.Item
            name="tableName"
            label="数据表名称"
            rules={[
              {
                required: true,
                message: "请输入保存因子数据的表名称",
              },
            ]}
          >
            <Input placeholder="请输入保存因子数据的表名称" />
          </Form.Item>
          <Form.Item className="opacity-0" />
        </div>
      ) : null}
    </Form>
  );
});
