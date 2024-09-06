/* eslint-disable camelcase */

import { Label } from "@transquant/ui";

export interface ITable {
  isFactor: boolean;
  labels: Label[];
  tableName: string;
  canDelTable: boolean;
}

export interface Idb {
  dbName: string;
  canCreateTable: boolean;
  tableInfos: ITable[];
}

export interface TreeData {
  commonDB: Idb[];
  personalDB: Idb[];
  teamDB: Idb[];
}

export interface TableStructure {
  col_name: string;
  comment: string;
  data_type: string;
  default_value: string;
  not_null: string;
  unique: string;
}

export interface TableInfo {
  canDownload: boolean;
  canUpload: boolean;
  comment: string;
  userComment: string;
  dbName: string;
  ddl: string;
  filterTypes: number[];
  tableName: string;
  labels: Label[];
  canDelTable: boolean;
  tableStructures: TableStructure[];
}

export interface DataExampleInfo {
  columns: string[];
  datas: Record<string, unknown>[];
}

export type UploadHistoryItem = {
  fileName: string;
  id: number;
  realName: string;
  status: number;
  updateTime: string;
};

export default {};
