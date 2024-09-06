import { Checkbox } from "antd";
import { CheckboxGroupProps } from "antd/es/checkbox";
import { useMemo } from "react";
import { BtnPermissionItem } from "../types";

interface ActionProps {
  permissions: BtnPermissionItem[];
  onChange: CheckboxGroupProps["onChange"];
  checkedValue: number[];
  readonly: boolean;
}

export default function Action(props: ActionProps) {
  const { permissions, onChange, checkedValue, readonly } = props;

  const options = useMemo(() => {
    const checkboxOptions = permissions.map(({ name, id }) => ({
      label: name,
      value: id,
      disabled: readonly,
    }));

    return checkboxOptions;
  }, [permissions, readonly]);

  return (
    <div>
      <div className="flex justify-between mb-2">
        <span className="flex text-sm font-bold float-start">
          <div className="bg-red-600 w-1 h-4 relative mr-1 top-[2px]" />
          操作权限
        </span>
      </div>
      <Checkbox.Group
        onChange={onChange}
        options={options}
        value={checkedValue}
        className="grid grid-cols-4 gap-y-2"
      />
    </div>
  );
}
