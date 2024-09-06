import { Empty, Modal } from "antd";
import React, { useRef } from "react";
import { GuardianPermission, Permission as PermissionType } from "../types";
import Action from "./Action";
import LeftSide from "./LeftSide";
import Resource from "./Resource";
import { GROUP_DATABASE_ID, PUBLIC_DATABASE_ID } from "./ResourceForData";
import useActionState from "./use-action-state";
import useResourceState from "./use-resource-state";
import useTreeState from "./use-tree-state";

export type ResultValue = {
  selectedBtnPermissions: number[];
  selectedMenuPermissions: number[];
  selectedDataPermissions: string[];
  selectedGuardianPermissions?: GuardianPermission[];
};

interface PermissionProps {
  permission: PermissionType;
  visible: boolean;
  onVisibleChange: (value: boolean) => void;
  onOk?: (data: ResultValue) => void;
  readonly?: boolean;
}

export default function Permission(props: PermissionProps) {
  const { visible, onVisibleChange, permission, onOk: onPropOk } = props;

  const {
    treeData,
    onSearch,
    onExpand,
    onCheck,
    onSelect,
    expandedKeys,
    selectedKeys,
    checkedKeys,
    autoExpandParent,
  } = useTreeState({
    data: permission?.menuPermissions || [],
    backfill: permission?.selectedMenuPermissions || [],
  });
  const { btnPermissions, onCheckboxChange, checkedValue, readonly } =
    useActionState({
      data: permission?.btnPermissionMap,
      backfill: permission?.selectedBtnPermissions || [],
      selectedKeys,
      checkedKeys,
    });
  const {
    dataPermissions,
    onResourceCheckboxChange,
    resourceCheckedValue,
    resourceReadonly,
  } = useResourceState({
    data: permission?.dataPermissionMap,
    backfill: permission?.selectedDataPermissions || [],
    selectedKeys,
    checkedKeys,
  });

  const onCancel = () => onVisibleChange(false);

  const getSelectedBtnPermissions = () => {
    const allSelectedMenuBtns = checkedKeys.reduce((acc, cur) => {
      const keys =
        permission.btnPermissionMap[cur as number]?.map((item) => item.id) ||
        [];
      acc.push(...keys);
      return acc;
    }, [] as number[]);

    const selectedBtnPermissions = checkedValue.filter((item) =>
      allSelectedMenuBtns.includes(item)
    );

    return selectedBtnPermissions;
  };

  const getSelectedDataPermissions = () => {
    const allSelectedMenuRadios = checkedKeys.reduce((acc, cur) => {
      permission.dataPermissionMap[cur as number]?.forEach((item) => {
        item.available.forEach((avail) => acc.push(`${item.id}_${avail}`));
      });
      return acc;
    }, [] as string[]);
    const selectedDataPermissions = resourceCheckedValue
      .filter((item) => allSelectedMenuRadios.includes(item))
      .filter((item) => !item.includes("-1"));

    return selectedDataPermissions;
  };

  const selectedGuardianPermissionsRef = useRef<{
    selectedPermissions: GuardianPermission[];
  }>(null);

  const getSelectedGuardianPermissions = (
    guardianPermission: GuardianPermission[],
    dataPermission: string[]
  ): GuardianPermission[] => {
    let permissions: GuardianPermission[] = [...guardianPermission];
    const hasPublicDataBase =
      dataPermission.findIndex((item) =>
        item.startsWith(`${PUBLIC_DATABASE_ID}`)
      ) !== -1;
    const hasGroupDataBase =
      dataPermission.findIndex((item) =>
        item.startsWith(`${GROUP_DATABASE_ID}`)
      ) !== -1;

    // 公共资源选择无权限时，只保留团队空间下的数据库、表
    if (!hasPublicDataBase) {
      const res = permissions.filter((item) => item.db.endsWith("_public"));
      permissions = [...res];
    }

    // 团队空间选择无权限时，只保留公共资源下的数据库、表
    if (!hasGroupDataBase) {
      const res = permissions.filter((item) => !item.db.endsWith("_public"));
      permissions = [...res];
    }

    return permissions;
  };

  const onOk = () => {
    const selectedBtnPermissions = getSelectedBtnPermissions();
    const selectedDataPermissions = getSelectedDataPermissions();
    const selectedGuardianPermissions = getSelectedGuardianPermissions(
      selectedGuardianPermissionsRef.current?.selectedPermissions || [],
      selectedDataPermissions
    );
    onPropOk?.({
      selectedBtnPermissions,
      selectedDataPermissions,
      selectedMenuPermissions: checkedKeys as number[],
      selectedGuardianPermissions,
    });
  };

  return (
    <Modal
      title="权限配置"
      open={visible}
      onCancel={onCancel}
      onOk={onOk}
      width={1360}
      destroyOnClose
      footer={(originNode: React.ReactNode) => {
        return props.readonly ? null : originNode;
      }}
    >
      <div className="flex gap-x-6">
        <div className="p-2 border border-gray-200 border-solid rounded-md w-60 min-w-60 min-h-[600px] h-[600px] overflow-auto">
          <LeftSide
            treeData={treeData}
            onSearch={onSearch}
            onExpand={onExpand}
            onCheck={onCheck}
            onSelect={onSelect}
            expandedKeys={expandedKeys}
            selectedKeys={selectedKeys}
            checkedKeys={checkedKeys}
            autoExpandParent={autoExpandParent}
          />
        </div>
        {selectedKeys.length ? (
          <div className="flex flex-col w-full gap-y-6">
            <Action
              permissions={btnPermissions}
              checkedValue={checkedValue}
              onChange={onCheckboxChange}
              readonly={readonly}
            />
            <Resource
              selectedKeys={selectedKeys}
              permissions={dataPermissions}
              checkedValue={resourceCheckedValue}
              onChange={onResourceCheckboxChange}
              readonly={resourceReadonly}
              ref={selectedGuardianPermissionsRef}
              selectedGuardianPermissions={
                permission.selectedGuardianPermissions
              }
            />
          </div>
        ) : (
          <Empty description="请先选择菜单" className="m-auto" />
        )}
      </div>
    </Modal>
  );
}
