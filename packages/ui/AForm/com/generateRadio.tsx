import { Radio, RadioGroupProps } from "antd";
import { ComOptions } from "../utils";

export function generateRadio<T>(config: ComOptions<T>) {
  const { props, options } = config;

  return (
    <Radio.Group {...(props as RadioGroupProps)}>
      {options?.map((opt) => (
        <Radio key={opt.value} value={opt.value}>
          {opt.label}
        </Radio>
      ))}
    </Radio.Group>
  );
}

export default {};
