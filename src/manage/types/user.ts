import { UserStatus } from "../user/UserTable";

export type Role = {
  name: string;
  id: number;
};

export interface UserItem {
  createTime: string;
  email: string | null;
  canDel: boolean;
  id: number;
  teams: string[];
  realName: string;
  status: UserStatus;
  telephone: string | null;
  username: string;
  updateTime: string;
}

export interface UserPermission {
  db: string;
  permissions: string[];
  table: string;
}

export type PageMenuItem = {
  name: string;
  code: string;
  children: PageMenuItem[];
};

export type EnvTemp = {
  cpuLimit: number;
  gpuNum: number;
  id: number;
  memLimit: number;
  name: string;
};

export type ShareEnv = {
  count: number;
  cpuCoreLimit: number;
  cpuMemLimit: number;
  gpuCore: number;
  id: number;
  memberList: string[];
  name: string;
  teamName: string;
};
