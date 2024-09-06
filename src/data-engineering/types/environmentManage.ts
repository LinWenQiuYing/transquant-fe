export interface EnvironmentListItem {
  id: number;
  index: number;
  code: number;
  name: string;
  params: string;
  desc: string;
  createTime: string;
  updateTime: string;
}

export interface EnvironmentListProject {
  total: number;
  list: EnvironmentListItem[];
}

export interface EnvProjectSearch {
  searchVal: string | null | undefined;
}

export interface EnvironmentFormValueType {
  name: string;
  params: string;
  desc: string;
}

export default {};
