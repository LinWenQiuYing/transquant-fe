import { ajax, Nullable } from "@transquant/utils";
import { message } from "antd";
import { observable } from "mobx";
import {
  EnvironmentFormValueType,
  EnvironmentListProject,
  EnvProjectSearch,
} from "../types";

interface Pagination {
  pageNum: number;
  pageSize: number;
}

export const defaultConfig = {
  pageNum: 1,
  pageSize: 15,
};

export default class EnvironmentManageStore {
  // 以下是源中心
  @observable environmentList: Nullable<EnvironmentListProject> = null;

  @observable environmentPagination: Partial<Pagination> = defaultConfig;

  @observable environmentListLoading: boolean = false;

  @observable environmentSearchConfig: Partial<EnvProjectSearch> = {};

  onEnvironmentSearchConfig = (config: Partial<EnvProjectSearch>) => {
    this.environmentSearchConfig = config;
  };

  onEnvironmentPaginationChange = (config: Partial<Pagination>) => {
    this.environmentPagination = { ...this.environmentPagination, ...config };
  };

  getEnvironmentList = () => {
    this.environmentListLoading = true;
    ajax({
      url: `/tqdata/environment/list-paging`,
      params: {
        pageNo: this.environmentPagination.pageNum,
        pageSize: this.environmentPagination.pageSize,
        searchVal: this.environmentSearchConfig.searchVal
          ? this.environmentSearchConfig.searchVal
          : "",
      },
      success: (res) => {
        this.environmentList = {
          total: res.total,
          list: res.totalList.map((item: any, index: number) => {
            return {
              ...item,
              index: index + 1,
              params: item.config,
              desc: item.description,
            };
          }),
        };
      },
      effect: () => {
        this.environmentListLoading = false;
      },
    });
  };

  createEnvironment = async (formValue: EnvironmentFormValueType) => {
    const formData = new FormData();
    formData.append("name", formValue.name);
    formData.append("config", formValue.params);
    formData.append("description", formValue.desc);

    await ajax({
      url: `/tqdata/environment/create`,
      method: "post",
      data: formData,
      success: () => {
        this.getEnvironmentList();
      },
    });
  };

  editEnvironment = async (
    code: number,
    formValue: EnvironmentFormValueType
  ) => {
    const formData = new FormData();
    formData.append("code", code);
    formData.append("name", formValue.name);
    formData.append("config", formValue.params);
    formData.append("description", formValue.desc);

    await ajax({
      url: `/tqdata/environment/update`,
      method: "post",
      data: formData,
      success: () => {
        this.getEnvironmentList();
      },
    });
  };

  deleteEnvironment = (code: number) => {
    ajax({
      url: `/tqdata/environment/delete`,
      method: "post",
      params: {
        environmentCode: code,
      },
      success: () => {
        this.getEnvironmentList();
        message.success("删除成功");
      },
    });
  };
}
