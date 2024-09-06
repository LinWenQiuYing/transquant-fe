import { ajax, Nullable } from "@transquant/utils";
import { observable } from "mobx";
import { IApprovalSearch } from "../approval/SearchHeader";
import { Approval } from "../types";

interface Pagination {
  pageNum: number;
  pageSize: number;
}

export const defaultConfig = {
  pageNum: 1,
  pageSize: 15,
};

export default class ApprovalStore {
  @observable approvalList: Nullable<Approval> = null;

  @observable pagination: Partial<Pagination> = defaultConfig;

  @observable approvalListLoading: boolean = false;

  @observable cacheApproveConfig: Partial<IApprovalSearch> = {};

  onPaginationChange = (config: Partial<Pagination>) => {
    this.pagination = { ...this.pagination, ...config };
  };

  onCacheApproveConfigChange = (config: Partial<IApprovalSearch>) => {
    this.cacheApproveConfig = config;
  };

  // 获取审核人列表
  getTeamApprovalList = async (data: Partial<IApprovalSearch>) => {
    this.approvalListLoading = true;
    await ajax({
      url: `/tqlab/process/getTeamApprovalList`,
      method: "post",
      data: { ...this.cacheApproveConfig, ...data },
      success: (data) => {
        this.approvalList = data;
      },
      effect: () => {
        this.approvalListLoading = false;
      },
    });
  };

  reset = () => {
    this.cacheApproveConfig = {};
  };
}
