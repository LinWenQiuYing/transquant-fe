import { EnvStatus } from "@transquant/space/image/PersonalTable";

export interface Image {
  id: number;
  name: string;
  path: string;
  desc: string;
}

export interface Host {
  nodeName: string;
  preOccupyCpu: number;
  preOccupyGpu: number;
  preOccupyMem: number;
  totalCpu: number;
  totalGpu: number;
  totalMem: number;
  exceedLimit: boolean;
}

export type ImageInstance = {
  cpuCore: number;
  cpuCoreLimit: number;
  gpuCore: number;
  cpuMem: number;
  cpuMemLimit: number;
  gpuMem: number;
  solidDate: string;
  groupId: number;
  id: number;
  imageId: number;
  imageInstance: string;
  imageName: string;
  ip: string;
  isDefault: boolean;
  name: string;
  teamName: string;
  node: string;
  port: number;
  token: string;
  type: number;
  userId: number;
  envStatus: keyof typeof EnvStatus;
  imageType: 0 | 1 | 2; // jupyter | vscode | 异常
};
