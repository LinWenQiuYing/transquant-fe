export interface SourceListItem {
  id: number;
  index: number;
  name: string;
  person: string;
  type: string;
  params: string;
  desc: string;
  createTime: string;
  updateTime: string;
  ip?: string;
  port?: string;
  user?: string;
  psw?: string;
  dataBase?: string;
  jdbcParams?: string;
}

export interface SourceListProject {
  total: number;
  list: SourceListItem[];
}

export type UserItem = {
  id: 71;
  userName: string;
};

export interface IProjectSearch {
  searchVal: string | null | undefined;
}

export interface SourceFormValueType {
  dataSource: string | undefined;
  sourceName: string;
  desc: string | undefined;
  ip: string;
  port: string;
  user: string;
  psw: string | undefined;
  dataBase: string;
  jdbcParams: string | undefined;
}

export default {};
