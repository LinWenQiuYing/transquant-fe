import { ajax, Nullable } from "@transquant/utils";
import { message } from "antd";
import { observable } from "mobx";
import {
  IProjectSearch,
  SourceFormValueType,
  SourceListProject,
  UserItem,
} from "../types";

interface Pagination {
  pageNum: number;
  pageSize: number;
}

export const defaultConfig = {
  pageNum: 1,
  pageSize: 15,
};

export default class SourceCenterStore {
  // 以下是源中心
  @observable sourceList: Nullable<SourceListProject> = null;

  @observable sourcePagination: Partial<Pagination> = defaultConfig;

  @observable sourceListLoading: boolean = false;

  @observable sourceSearchConfig: Partial<IProjectSearch> = {};

  @observable users: UserItem[] = [];

  @observable sourceOptions = [
    { label: "DOLPHINDB", value: "DOLPHINDB" },
    { label: "postgresql", value: "postgresql" },
    { label: "clickhouse", value: "clickhouse" },
    { label: "TIMELYRE", value: "INCEPTOR" },
  ];

  onSourceSearchConfig = (config: Partial<IProjectSearch>) => {
    this.sourceSearchConfig = config;
  };

  onSourcePaginationChange = (config: Partial<Pagination>) => {
    this.sourcePagination = { ...this.sourcePagination, ...config };
  };

  getSourceList = (readonly: boolean) => {
    this.sourceListLoading = true;
    const url = readonly ? `/tqdata/datasources` : `/tqdata/datasources/admin`;
    ajax({
      url,
      params: {
        pageNo: this.sourcePagination.pageNum,
        pageSize: this.sourcePagination.pageSize,
        searchVal: this.sourceSearchConfig.searchVal
          ? this.sourceSearchConfig.searchVal
          : "",
      },
      success: (res) => {
        this.sourceList = {
          total: res.total,
          list: res.totalList.map((item: any, index: number) => {
            return {
              ...item,
              index: index + 1,
              person: item.userName,
              params: item.connectionParams,
              desc: item.note,
            };
          }),
        };
      },
      effect: () => {
        this.sourceListLoading = false;
      },
    });
  };

  createSource = async (formValues: SourceFormValueType) => {
    return await ajax({
      url: `/tqdata/datasources`,
      method: "post",
      data: {
        type: formValues.dataSource,
        label: formValues.dataSource,
        name: formValues.sourceName,
        note: formValues.desc,
        host: formValues.ip,
        port: formValues.port,
        userName: formValues.user,
        password: formValues.psw,
        database: formValues.dataBase,
        other: formValues.jdbcParams ? JSON.parse(formValues.jdbcParams) : null,
      },
    });
  };

  editSource = async (id: number, formValues: SourceFormValueType) => {
    const url = `/tqdata/datasources/${id}`;
    return await ajax({
      url,
      method: "put",
      data: {
        type: formValues.dataSource,
        label: formValues.dataSource,
        name: formValues.sourceName,
        note: formValues.desc,
        host: formValues.ip,
        port: formValues.port,
        userName: formValues.user,
        password: formValues.psw ? formValues.psw : undefined,
        database: formValues.dataBase,
        other: formValues.jdbcParams ? JSON.parse(formValues.jdbcParams) : null,
      },
    });
  };

  checkName = async (name: string) => {
    return await ajax({
      url: `/tqdata/datasources/verify-name`,
      params: {
        name,
      },
    });
  };

  getSourceDetail = async (id: number, readonly: boolean) => {
    const url = readonly
      ? `/tqdata/datasources/${id}`
      : `/tqdata/datasources/admin/${id}`;
    return await ajax({
      url,
    });
  };

  getUsers = async () => {
    await ajax({
      url: `/tqdata/users/list`,
      success: (data) => {
        this.users = data;
      },
    });
  };

  testConnect = async (formValues: SourceFormValueType) => {
    return await ajax({
      url: `/tqdata/datasources/connect`,
      method: "post",
      data: {
        type: formValues.dataSource,
        label: formValues.dataSource,
        name: formValues.sourceName,
        note: formValues.desc,
        host: formValues.ip,
        port: formValues.port,
        userName: formValues.user,
        password: formValues.psw,
        database: formValues.dataBase,
        other: formValues.jdbcParams ? JSON.parse(formValues.jdbcParams) : null,
      },
    });
  };

  deleteSource = (id: number) => {
    ajax({
      url: `/tqdata/datasources/${id}`,
      method: "delete",
      success: () => {
        this.getSourceList(false);
        message.success("删除成功");
      },
    });
  };

  grantDatasource = (data: { userIds: number[]; datasourceId: number }) => {
    return ajax({
      url: `/tqdata/users/grant-datasource-4-users`,
      method: "post",
      headers: {
        "Content-Type": "multipart/form-data;",
      },
      data: {
        datasourceId: data.datasourceId,
        userIds: data.userIds.join(","),
      },
      success: () => {
        message.success("操作成功");
      },
    });
  };
}
