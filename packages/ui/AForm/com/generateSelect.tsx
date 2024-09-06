import { Select, SelectProps } from "antd";
import { ComOptions } from "../utils";

export function generateSelect<T>(config: ComOptions<T>) {
  const { props, options } = config;

  return (
    <Select
      {...(props as SelectProps)}
      options={options as SelectProps["options"]}
    />
  );
}

export default {};
