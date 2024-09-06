import { unique } from "@transquant/utils";
import { useUnmount } from "ahooks";
import { RadioGroupProps } from "antd";
import { Key, useEffect, useMemo, useState } from "react";
import { Permission, SelectedDataPermission } from "../types";

type Options = {
  data: Permission["dataPermissionMap"];
  backfill: SelectedDataPermission[];
  selectedKeys: Key[];
  checkedKeys: Key[];
};

export default function useResourceState(options: Options) {
  const { data, selectedKeys, backfill, checkedKeys } = options;
  const [checkedValue, setCheckedValue] = useState<string[]>([]);

  useEffect(() => {
    if (!backfill) return;
    const back = backfill.map((item) => `${item.id}_${item.type}`);
    setCheckedValue(() => unique([...back]) as string[]);
  }, [backfill]);

  const dataPermissions =
    useMemo(() => {
      const [key] = selectedKeys;
      return data[key as number];
    }, [selectedKeys]) || [];

  const onCheckboxChange: RadioGroupProps["onChange"] = (e) => {
    const [id] = e.target.value.split("_");
    const filterCheckedValue = checkedValue.filter(
      (item) => !item.startsWith(`${id}`)
    );
    setCheckedValue(
      () => unique([...filterCheckedValue, e.target.value]) as string[]
    );
  };

  const readonly = useMemo(() => {
    return !checkedKeys.includes(selectedKeys[0]);
  }, [selectedKeys, checkedKeys]);

  const reset = () => setCheckedValue([]);

  useUnmount(() => {
    reset();
  });

  return {
    dataPermissions,
    onResourceCheckboxChange: onCheckboxChange,
    resourceCheckedValue: checkedValue,
    resourceReadonly: readonly,
  };
}
