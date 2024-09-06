import { unique } from "@transquant/utils";
import { useUnmount } from "ahooks";
import { CheckboxGroupProps } from "antd/es/checkbox";
import { Key, useEffect, useMemo, useState } from "react";
import { Permission } from "../types";

type Options = {
  data: Permission["btnPermissionMap"];
  backfill: number[];
  selectedKeys: Key[];
  checkedKeys: Key[];
};

export default function useActionState(options: Options) {
  const { data, selectedKeys, backfill, checkedKeys } = options;
  const [checkedValue, setCheckedValue] = useState<number[]>([]);

  useEffect(() => {
    if (!backfill) return;
    setCheckedValue(backfill);
  }, [backfill]);

  const btnPermissions =
    useMemo(() => {
      const [key] = selectedKeys;
      return data[key as number];
    }, [selectedKeys]) || [];

  const onCheckboxChange: CheckboxGroupProps["onChange"] = (value) => {
    const selectedMenuBtns = data[selectedKeys[0] as number].map(
      (item) => item.id
    );

    const filterCheckedValue = checkedValue.filter(
      (item) => !selectedMenuBtns.includes(item)
    );

    setCheckedValue(
      () => unique([...filterCheckedValue, ...value]) as number[]
    );
  };

  const readonly = useMemo(() => {
    return !checkedKeys.includes(selectedKeys[0]);
  }, [selectedKeys, checkedKeys]);

  const reset = () => {
    setCheckedValue([]);
  };

  useUnmount(() => {
    reset();
  });

  return { btnPermissions, onCheckboxChange, checkedValue, readonly };
}
