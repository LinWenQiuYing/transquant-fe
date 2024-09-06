import { ajax, diff } from "@transquant/utils";
import { useEffect, useMemo, useState } from "react";

type Option = {
  type: "merge" | "split";
  current: number;
  selectedRoles: RoleType[];
  startTeamId: number;
  otherTeamId?: number;
};

export type RoleType = {
  belongTeamName: string;
  desc: string;
  id: number;
  roleName: string;
};

export type MemberType = {
  id: number;
  belongTeamName: string;
  realName: string;
  userName: string;
};

const getMergeMemberByTeamId = async (ids: number[]) => {
  return await ajax<MemberType[]>({
    url: `/tquser/user/getMergeMemberByTeamId`,
    params: { teamIdStr: ids.join(",") },
  });
};

export default function useMember(options: Option) {
  const { selectedRoles, type, current, startTeamId, otherTeamId } = options;
  const [selectedRowKeys, setSelectedRowKeys] = useState<number[]>([]);
  const [members, setMembers] = useState<MemberType[]>([]);
  const [userRoleMap, setUserRoleMap] = useState(new Map());

  useEffect(() => {
    if (current !== 2) return;
    (async () => {
      const members = await getMergeMemberByTeamId(
        otherTeamId ? [startTeamId, otherTeamId] : [startTeamId]
      );
      setMembers(members);
    })();
  }, [current]);

  const title = useMemo(() => {
    return type === "merge"
      ? "为合并后的新团队选择成员并配置角色，原团队成员不变"
      : "为拆分后的新团队选择成员并配置角色，原团队成员不变";
  }, [type]);

  const onSelectedRowKeysChange = (keys: number[]) => {
    setUserRoleMap((prev) => {
      const newMap = new Map(prev);
      keys.forEach((key) => {
        newMap.set(key, newMap.get(key) || null);
      });
      return newMap;
    });
    setSelectedRowKeys(keys);
  };

  const onSelectChange = (userId: number) => (roleId: number) => {
    setUserRoleMap((prev) => {
      const newMap = new Map(prev);
      newMap.set(userId, roleId);
      return newMap;
    });
  };

  const getUserRoleMap = () => {
    const excludeKeys = diff([...userRoleMap.keys()], selectedRowKeys);

    const newMap = new Map(userRoleMap);
    excludeKeys.forEach((key) => {
      newMap.delete(key);
    });
    return Object.fromEntries(newMap);
  };

  return {
    title,
    members,
    selectedRoles,
    onSelectedRowKeysChange,
    selectedRowKeys,
    onSelectChange,
    getUserRoleMap,
  };
}
