import { Role } from "./user";

export type Group = {
  contacter: string;
  contacterInfo: string;
  creatTime: string;
  description: string;
  id: number;
  name: string;
  teamDBName: string;
  teamSpaceName: string;
  children: Group[];
};

export interface MemberItem {
  id: number;
  realName: string;
  roles: Role[];
  editable: boolean;
  createTime: string;
  status: number; // NORMAL(0, "正常"), DELETE(1, "删除"), DISABLE(2, "停用"), CHANGE_PWD(3, "挂起");
}

export interface MemberTable {
  list: MemberItem[];
  total: number;
}

export interface SimpleUser {
  id: number;
  realName: string;
}

export interface MenuItem extends Role {}

export interface IRoleItem {
  id: number;
  description: string;
  name: string;
  menus: MenuItem[];
}

export interface RoleTable {
  list: IRoleItem[];
  total: number;
}

export type TemplateType = 0 | 1 | 2; // 0回测 1 因子 2 项目

export type Template = {
  createTime: string;
  filePath: string;
  groupId: number;
  id: number;
  name: string;
  type: TemplateType;
};

export type ShareItem = {
  canOpen: number; // 0 false 1 true
  cpuCoreLimit: number;
  cpuCoreRequest: number;
  cpuMemLimit: number;
  cpuMemRequest: number;
  createTime: string;
  gpuCore: number;
  id: number;
  status: number; //  0:未启动，1:启动中，2:固化中，3:升级中，4:销毁中, 5:重启中，6:运行中
  imageId: number;
  name: string;
  remark: string;
  templateId: number;
  userList: SimpleUser[];
  token: string;
};

export type ShareList = {
  shareSpaceList: ShareItem[];
};

export type Image = {
  id: number;
  name: string;
  path: string;
  desc: string;
};

export type TemplateItem = {
  createTime: string;
  filePath: string;
  id: number;
  name: string;
  teamId: number;
  type: 0;
};

export type Examine = {
  auditors: string[];
  auditorsId: number[];
  category: 0 | 1 | 2 | 3; // 0:逐层审批,1:无需审批,2:全部通过,3:任一人通过
  id: number;
  process: string;
  publishers: string[];
  publishersId: number[];
};

export type ProcessLog = {
  auditors: string[];
  category: number;
  date: string;
  operator: string;
  publishers: string[];
};

export type BtnPermissionItem = {
  id: number;
  name: string;
  code: string;
};

export type DataPermissionItem = {
  available: (0 | 1 | 2 | 3)[];
} & BtnPermissionItem;

export type MenuPermissionItem = {
  children: MenuPermissionItem[];
} & BtnPermissionItem;

export type SelectedDataPermission = {
  id: number;
  type: number;
};

export type GuardianPermission = {
  db: string;
  permissions: string[];
  table?: string | null;
};

export type Permission = {
  btnPermissionMap: Record<number, BtnPermissionItem[]>;
  dataPermissionMap: Record<number, DataPermissionItem[]>;
  menuPermissions: MenuPermissionItem[];
  selectedBtnPermissions: number[];
  selectedDataPermissions: SelectedDataPermission[];
  selectedMenuPermissions: number[];
  selectedGuardianPermissions: GuardianPermission[];
};

export type Team = {
  id: number;
  name: string;
};

export default {};
