import { InputNumber, InputNumberProps } from "antd";
import { ComOptions } from "../utils";

export function generateInputNumber<T>(config: ComOptions<T>) {
  const { props } = config;

  return <InputNumber {...(props as InputNumberProps)} className="w-full" />;
}

export default {};
