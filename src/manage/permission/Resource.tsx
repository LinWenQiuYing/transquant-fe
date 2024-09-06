import { List, Radio, RadioGroupProps } from "antd";
import { forwardRef, Key, useMemo } from "react";
import { DataPermissionItem, GuardianPermission } from "../types";
import ResourceForData from "./ResourceForData";

export interface ResourceProps {
  selectedKeys: Key[];
  permissions: DataPermissionItem[];
  onChange: RadioGroupProps["onChange"];
  checkedValue: string[];
  readonly: boolean;
  selectedGuardianPermissions: GuardianPermission[];
}

export const PERMISSION: Record<number, string> = {
  "0": "全部数据权限",
  "1": "本团队及以下数据权限",
  "2": "本团队数据权限",
  "3": "仅本人数据权限",
  "-1": "无权限",
};

export default forwardRef(function Resource(props: ResourceProps, ref) {
  const { permissions, onChange, checkedValue, readonly, selectedKeys } = props;

  const isDataResource = useMemo(() => {
    if (!selectedKeys) return false;
    // id 17 is dataresource
    return selectedKeys[0] === 17;
  }, [selectedKeys]);

  const getOptions = (permission: DataPermissionItem) => {
    const options = Object.keys(PERMISSION).map((item) => ({
      label: PERMISSION[+item as keyof typeof PERMISSION],
      value: `${permission.id}_${+item}`,
      disabled:
        readonly ||
        !permission.available.includes(+item as unknown as 0 | 1 | 2 | 3),
    }));

    return options;
  };

  const getValue = (permission: DataPermissionItem) => {
    const [value] = checkedValue.filter((item) =>
      item.startsWith(`${permission.id}`)
    );
    return value;
  };

  return (
    <div>
      <div className="flex justify-between mb-2">
        <span className="flex text-sm font-bold float-start">
          <div className="bg-red-600 w-1 h-4 relative mr-1 top-[2px]" />
          数据权限
        </span>
      </div>
      {isDataResource ? (
        <ResourceForData {...props} ref={ref} />
      ) : (
        <List
          dataSource={permissions}
          bordered
          size="small"
          renderItem={(item) => (
            <List.Item>
              <div
                title={item.name}
                className="w-24 mr-4 overflow-hidden min-w-24 text-ellipsis text-nowrap"
              >
                {item.name}
              </div>

              <Radio.Group
                onChange={onChange}
                options={getOptions(item)}
                value={getValue(item)}
                className="grid grid-cols-5 gap-y-2"
              />
            </List.Item>
          )}
        />
      )}
    </div>
  );
});
