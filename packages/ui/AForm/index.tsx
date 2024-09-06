import { First, isArray, isFunction } from "@transquant/utils";
import {
  Form,
  FormProps,
  InputNumberProps,
  InputProps,
  RadioGroupProps,
  SelectProps,
} from "antd";
import { useForm } from "antd/es/form/Form";
import { FormItemProps } from "antd/lib";
import { useEffect, useState } from "react";
import { getCom } from "./utils";

export type ComType = "custom" | "input" | "radio" | "input-number" | "select";

export type IOption = {
  label: string;
  value: string | number | null | undefined | boolean;
  [key: string]: any;
};

export type IProps =
  | InputProps
  | RadioGroupProps
  | InputNumberProps
  | SelectProps;

export type JsonItem<T> = {
  type: ComType;
  props?: IProps;
  validateFn?: (values: Partial<T>) => boolean | undefined;
  options?: IOption[];
  children?: React.ReactNode;
};

export type Json<T> = JsonItem<T> & FormItemProps;

export interface AFormProps<T> {
  config: FormProps<T>;
  form: First<ReturnType<typeof useForm<T>>>;
  json: (Json<T> | Json<T>[])[];
}

export default function AForm<T extends any = any>(props: AFormProps<T>) {
  const { form, config, json } = props;
  const [formValues, setFormValues] = useState<Partial<T>>(
    (config.initialValues || {}) as Partial<T>
  );

  useEffect(() => {
    setFormValues(config.initialValues as Partial<T>);
    form.setFieldsValue(config.initialValues as any);
  }, [config.initialValues]);

  const onValuesChange = (value: any) => {
    const values = { ...formValues, ...value };

    setFormValues(values);
    form.setFieldsValue(values);
  };

  const renderItem = (item: Json<T>) => {
    const validate = isFunction(item.validateFn) ? item.validateFn : () => true;

    if (!validate(formValues)) return null;

    if (item.type === "custom") {
      return <div key={item.name}>{item.children}</div>;
    }

    return (
      <Form.Item
        name={item.name}
        label={item.label}
        tooltip={item.tooltip}
        key={item.name}
      >
        {getCom({ ...item, formValues })}
      </Form.Item>
    );
  };

  return (
    <Form
      form={form}
      {...config}
      initialValues={config.initialValues as FormProps["initialValues"]}
      onValuesChange={onValuesChange}
    >
      {json.map((item, index) => {
        if (isArray(item)) {
          const columns = item.length;
          return (
            <div className={`columns-${columns} mb-0 `} key={index}>
              {item.map(renderItem)}
            </div>
          );
        }

        return renderItem(item);
      })}
    </Form>
  );
}
