import { Nullable } from "@transquant/utils";

export type Category = 0 | 1 | 2 | 3; // 0:逐层审批,1:无需审批,2:全部通过,3:任一人通过

export interface PublishItem {
  auditors: string;
  category: Category;
  commitTime: string;
  id: number;
  order: string;
  projectName: string; // 0:因子,1:策略
  projectType: number;
  reason: string;
  status: number; // 0:审核中，1:审核通过，2:审核拒绝
  targetTeamName: string;
}

export interface Audit {
  auditStatus: number; // 审批状态：1已通过，2未通过，99审核中
  category: number;
  commitTime: string;
  id: number;
  order: string;
  projectName: string;
  projectType: number;
  publisher: string;
  reason: string;
  status: number;
  targetTeamName: string;
}

export interface Publish {
  total: number;
  list: PublishItem[];
}

export type TeamItem = {
  id: number;
  name: string;
};

export type Publisher = TeamItem;

export type Auditor = TeamItem;

export type MarkdownFileItem = TeamItem;

export type LogEvent = 0 | 1 | 2 | 3; // 0 提交， 1 通过， 2 驳回， 3 权限修改

export type LogItem = {
  comment: string;
  event: LogEvent;
  id: number;
  logTime: string;
  realName: string;
};

export type PersonalAuthItem = {
  auth: 0 | 1; // 0 全体成员， 1 指定人员
  realName: string;
  userId: number;
};

export type ApprovalStatus = 0 | 1 | 2; // 0 审核中， 1 已通过， 2 未通过

export type AuditorStatus = 1 | 2 | 99 | 100; // 1已通过，2未通过，99审核中，100待审核

export type AuditorBlock = {
  auditor: string;
  auditorStatus: AuditorStatus;
  auditTime: string;
};

export interface ApprovalInfo {
  auditorBlock: AuditorBlock[];
  authType: 0 | 1; // 0 全体成员， 1 指定人员
  canOperate: boolean;
  category: number;
  code: string;
  auditTime: string;
  auditor: string;
  order: string;
  id: number;
  logs: LogItem[];
  personalAuth: PersonalAuthItem[];
  projectName: string;
  publishTime: string;
  publisher: string;
  reason: string;
  status: ApprovalStatus;
  tags: Nullable<string[]>;
  targetTeam: string;
  targetTeamId: number;
  type: 0 | 1; // 0 因子， 1 策略
}
