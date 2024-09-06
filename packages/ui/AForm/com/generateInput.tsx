import { Input, InputProps } from "antd";
import { ComOptions } from "../utils";

export function generateInput<T>(config: ComOptions<T>) {
  const { props } = config;

  return <Input {...(props as InputProps)} />;
}

export default {};
