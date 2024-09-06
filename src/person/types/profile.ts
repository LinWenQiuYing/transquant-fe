export interface EnvVos {
  envIP: string;
  envName: string;
  imageName: string;
  sshPort: number;
  sshUser: string;
  sshProxyIp: string;
  sshProxyPort: number;
  envId: number;
}

export interface PersonalInfo {
  id: number;
  email: string;
  envVOS: EnvVos[];
  name: string;
  phone: string;
  realName: string;
}

export interface IUser {
  createTime: string;
  email: string;
  id: number;
  password: string;
  realName: string;
  status: number;
  telephone: string;
  updateTime: string;
  username: string;
}

export interface TeamVO {
  description: string;
  id: number;
  name: string;
  password: string;
  spaceName: string;
  teamDbName: string;
}

export interface UserTeamVos {
  teamVO: TeamVO;
  types: number[];
}

export interface UserInfo {
  expireTime: number;
  menuCodes: string[];
  token: string;
  url: string;
  user: IUser;
  userTeamVOS: UserTeamVos;
}

export interface IUserInfo {
  code: number;
  userInfo: UserInfo;
}

export type LogItem = {
  id: number;
  current: number; // 0 默认， 1 当前
  solidifyPath: string;
  time: string;
  type: number; // 0 手动固化 1 自动固化 2 自动压缩
};

export default {};
