import { Label } from "@transquant/ui";

export interface GroupProjectItem {
  id: number;
  name: string;
  tags: Label[];
  publisher: string;
  code: string;
  comment: string;
  folderTime: string;
  path: string;
  owner: string;
  ownerIdList: number[];
  rights: number; // 权限设置
  auth: number; // 是否有下载权限: 1有 0没有
}

export interface GroupTeamItem {
  id: number | undefined;
  name: string | undefined;
}

export interface AuthItem {
  key: number;
  auth: number | null;
  name: string;
  userId: number;
}

export interface GroupIProjectSearch {
  name: string;
  tags: number[];
  comments: string;
  columnOrderBy: string;
  orderBy: number;
  pageNum: number;
  pageSize: number;
  teamId: number;
  publisher: string;
  code: string;
  folderTimeStart: string;
  folderTimeEnd: string;
}

export interface GroupProject {
  total: number;
  list: GroupProjectItem[];
}

export interface GroupFactorLibItem {
  annFactorReturn: string;
  className: string;
  ic: number;
  id: number;
  ir: number;
  name: string;
  publisher: string;
  code: string;
  projectName: string;
  srcUpdateTime: string;
  tags: Label[];
  timeRange: string;
  triggerTime: string;
  performanceFlag: 0 | 1;
}

export interface GroupFactorLib {
  total: number;
  list: GroupFactorLibItem[];
}
