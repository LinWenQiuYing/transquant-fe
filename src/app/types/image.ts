export type ImageInstance = {
  cpuCore: number;
  cpuCoreLimit: number;
  cpuMem: number;
  cpuMemLimit: number;
  node: string;
  gpuCore: number;
  id: number;
  imageId: number;
  imageInstance: string;
  imageName: string;
  name: string;
  isDefault: boolean;
  ip: string;
  type: 0 | 1;
  port: number;
  token: string;
  envStatus: number;
};

export type ImageType = ImageInstance & {
  ip: string;
  port: number;
  key: string;
};
