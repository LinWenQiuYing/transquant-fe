import { Dayjs } from "dayjs";
/* eslint-disable camelcase */
import { Label } from "@transquant/ui";

export interface ProjectItem {
  id: number;
  comment: string;
  folderTime: string;
  tags: Label[];
  name: string;
  path: string;
  canSubmit: boolean;
}

export interface Project {
  total: number;
  list: ProjectItem[];
}

export interface FileItem {
  name: string;
  type: number; // 0 文件夹，1 文件
}

export interface FileList {
  teamId: number;
  basePath: string;
  projectFileList: FileItem[];
}

export interface ITemplate {
  id: number;
  name: string;
  type: number; // 0 系统 1 团队
}

export interface FactorLibItem {
  annFactorReturn: string;
  className: string;
  performanceFlag: 0 | 1;
  ic: number;
  id: number;
  ir: number;
  name: string;
  projectName: string;
  srcUpdateTime: string;
  tags: Label[];
  timeRange: string;
  triggerTime: string;
}

export interface FactorLib {
  total: number;
  list: FactorLibItem[];
}

export type Job = {
  className: string;
  createTime: string;
  id: number;
  jobKey: string;
  jobName: string;
  quartzJobId: number;
  lastSuccessTime: string;
  name: string;
  runStatus: number; // 0 运行中， 1 已停止 ，2 已结束
  scheduleFrequency: number;
  scheduleTime: string;
  startTime: string;
  tags: Label[];
  endTime?: string;
  analysisFlag?: 0 | 1; // 0 no tab 1 has tab
  performanceFlag: 0 | 1;
  warningMail: string;
};

export interface JobList {
  total: number;
  list: Job[];
}

export interface FactorBaseInfo {
  projectName: string;
  className: string;
  name: string;
  srcUpdateTime: string;
  tags: Label[];
}

export interface TeamItem {
  id: number;
  name: string;
}

export interface File {
  name: string;
  path: string;
  type: "file" | "directory";
}

export interface MapFile extends File {
  pId: number | string;
  id: string | number;
  value: string;
  title: string;
  isLeaf?: boolean;
}

export interface UserItem {
  id: number;
  realName: string;
}

export interface FactorResultItem {
  annFactorReturn: number;
  className: string;
  ic: number;
  id: number;
  ir: number;
  name: string;
  projectName: string;
  srcUpdateTime: string;
  tags: Label[];
  timeRange: string;
  triggerTime: string;
}

export interface GroupItem {
  name: string;
  id: string;
}

export type StrategyKPI = {
  accum_gain: number;
  accum_ret: number;
  max_dd: number;
  sharpe: number;
  total_equity: number;
};

export type StrategyPnl = {
  daily_pnl: number;
  datetime: string;
};

export type StrategyReturn = {
  accum_ret: number;
  datetime: string;
};

export type Position = {
  code: string;
  datetime: string;
  fees: number;
  flag: string;
  net_equity: number;
  net_pos: number;
  occ_margin: number;
  pnl: number;
  settle: number;
};

export type Account = {
  cash: number;
  datetime: string;
  declare_fees: number;
  euqity: number;
  fees: number;
  holding_mv: number;
  margin: number;
  pnl: number;
  type: string;
};

export type IOrder = {
  buy_sell: string;
  code: string;
  datetime: string;
  fee: number;
  open_close: string;
  price: number;
  trade_date: string;
  volume: number;
};

export type Order = {
  total: number;
  datas: IOrder[];
};

export type CodeTree = {
  fileType: string;
  name: string;
  path: string;
  showPath: string;
  children: CodeTree[];
};

export type Log = {
  endTime: string;
  id: number;
  name: string;
  startTime: string;
  status: number; // 0 运行中，1 成功， 2 失败
  type: number; // 0 回测项目，1 因子项目
};

export type Calculate = {
  argsList: string | null;
  className: string;
  factorName: string;
  filePathName: string;
};

export type FactorEvaluator = {
  argsList: string | null;
  classEvaluatorName: string;
  evaluatorName: string;
  filePathName: string;
};

export type FactorMatrix = {
  codes: string;
  mode: string;
  saveSignal: 0 | 1;
  span: string[] | Dayjs[];
  tableName: string;
  universe: string;
};

export type FactorYaml = {
  calculateList: Calculate[];
  factorEvaluator: FactorEvaluator | null;
  matrix: FactorMatrix;
};
