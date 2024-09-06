import { InstallScript } from "./image";

type UserItem = {
  id: number;
  realName: string;
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
  userList: UserItem[];
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

export type EnvInstance = {
  ip: string;
  port: number;
  token: string;
  installScripts?: InstallScript[];
};

export type UpdateEnvStatus = {
  type: "updateEnvStatus";
  userId: number;
  data: {
    status: number;
    token: string;
  };
};

export type LaunchShareEnvInstance = {
  type: "launchShareEnvInstance";
  userId: number;
  data: EnvInstance;
  imageType: 0 | 1 | 2;
};

export type RunLog = {
  type: "runLog" | "logEnd";
  userId: number;
  data: {
    jobId: number;
    log: string;
  };
};

export type WSResultType = UpdateEnvStatus | LaunchShareEnvInstance | RunLog;

export default {};
