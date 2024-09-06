export type File = {
  index: number;
  alias: string;
  createTime: string;
  directory: boolean;
  fileName: string;
  fullName: string;
  id: number;
  pfullName: string;
  size: number;
  type: string;
  updateTime: string;
  userId: number;
  userName: string;
};

export type FileInfo = {
  total: number;
  list: File[];
};

export default {};
