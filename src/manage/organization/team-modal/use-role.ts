import { ajax, Nullable } from "@transquant/utils";
import { useEffect, useMemo, useState } from "react";
import { Permission } from "../../types";

type Option = {
  type: "merge" | "split";
  current: number;
  startTeamId: number;
  otherTeamId?: number;
};

export type RoleType = {
  belongTeamName: string;
  desc: string;
  id: number;
  roleName: string;
};

const getRoleListByTeamIdList = async (ids: number[]) => {
  return await ajax<RoleType[]>({
    url: `/tquser/role/getRoleListByTeamIdList`,
    params: { teamIdStr: ids.join(",") },
  });
};

const getAllPermissions4Roles = async (roleId: number) => {
  return ajax<Permission>({
    url: `/tquser/menu/getAllPermissions4Roles`,
    params: { roleId },
  });
};

export default function useRole(options: Option) {
  const { startTeamId, otherTeamId, current, type } = options;
  const [roles, setRoles] = useState<RoleType[]>([]);
  const [selectedRoles, setSelectedRoles] = useState<RoleType[]>([]);
  const [selectedRowKeys, setSelectedRowKeys] = useState<number[]>([]);
  const [permissionVisible, setPermissionVisible] = useState(false);
  const [permission, setPermission] = useState<Nullable<Permission>>(null);

  useEffect(() => {
    if (current !== 1) return;

    (async () => {
      const res = await getRoleListByTeamIdList(
        otherTeamId ? [startTeamId, otherTeamId] : [startTeamId]
      );
      setRoles(res);
    })();
  }, [current]);

  const title = useMemo(() => {
    return type === "merge"
      ? "为合并后的新团队选择角色，该角色仍在原团队中保留"
      : "为拆分后的新团队选择角色，该角色仍在原团队中保留";
  }, [type]);

  const onChange = (roles: RoleType[]) => {
    setSelectedRoles(roles);
  };

  const onSelectedRowKeysChange = (keys: number[]) => {
    setSelectedRowKeys(keys);
  };

  const onPermissionVisibleChange = (visible: boolean) => {
    setPermissionVisible(visible);
  };

  const onViewClick = async (id: number) => {
    const permission = await getAllPermissions4Roles(id);
    setPermission(permission);

    onPermissionVisibleChange(true);
  };

  return {
    title,
    roles,
    onChange,
    selectedRoles,
    onSelectedRowKeysChange,
    selectedRowKeys,
    onViewClick,
    permissionVisible,
    permission,
    onPermissionVisibleChange,
  };
}
