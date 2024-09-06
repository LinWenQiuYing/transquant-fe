export type NodeItem = {
  name?: string;
  cpu使用: string;
  环境个数: string;
  环境个数超过限额: string;
  cpu预占比例: string;
  cpu预占比例超过限额: string;
  内存预占比例: string;
  内存预占比例超过限额: string;
  GPU预占比例: string;
  GPU预占比例超过限额: string;
  cpu使用率: string;
  内存使用: string;
  内存使用率: string;
  已用磁盘: string;
  磁盘使用率: string;
  网络上传速率: string;
  网络下载速率: string;
};

export type Node = {
  [key: string]: NodeItem;
};

export type Environment = {
  cpuCoreLimit: number;
  cpuRequest: number;
  envType: number;
  gpuMem: number;
  gpuCore: number;
  id: number;
  cpuMemLimit: number;
  memRequest: number;
  name: string;
  node: string;
  teamId: number;
  teamName: string;
  token: string;
  userId: number;
  userName: string;
};

export type Host = {
  key: string;
  value: string;
};

export type NodeConfig = {
  cpuLimit: number;
  envLimit: number;
  gpuLimit: number;
  memLimit: number;
  nodeName: string;
  dataIndex?: keyof NodeConfig;
};

export type UnifiedConfig = {
  cpuLimit: number;
  envLimit: number;
  gpuLimit: number;
  memLimit: number;
};

export type QuotaData = {
  enable: true;
  mails: string[];
  nodeConfig: NodeConfig[];
  notifyUserIds: number[];
  type: number;
  unifiedConfig: UnifiedConfig;
};

export default {};
