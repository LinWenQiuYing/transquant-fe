import { Template } from "./organization";

export interface TransmatrixItem {
  createDate: string;
  fileLength: number;
  fileName: string;
}

export interface TemplateItem extends Template {}

export type PipItem = {
  id: number;
  name: string;
  time: string;
  url: string;
};

export type EnvTemplate = {
  cpuLimit: number;
  gpuNum: number;
  id: string | number;
  memLimit: number;
  name: string;
};

export type Script = {
  comment: string;
  fileName: string;
  id: number;
  imageName: string;
  uploadTime: string;
  version: string;
};

export type InstallFile = {
  id: number;
  fileName: string;
  size: number;
  uploadTime: string;
};

export type InstallEvent = {
  executeTime: string;
  installedCount: number;
  notInstalledCount: number;
  totalCount: number;
  version: string;
};
