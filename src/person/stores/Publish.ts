/* eslint-disable no-return-await */
import {
  FactorResultItem,
  StrategyLibItem,
  UserItem,
} from "@transquant/space/types";
import { Label } from "@transquant/ui";
import { ajax, Nullable } from "@transquant/utils";
import { message } from "antd";
import { observable } from "mobx";
import { IPublishSearch } from "../publish/application-record/SearchHeader";
import { IApprovedValue } from "../publish/record-view/ApprovedModal";
import { RecordTab } from "../publish/TabView";
import {
  ApprovalInfo,
  Audit,
  Auditor,
  MarkdownFileItem,
  Publish,
  Publisher,
  TeamItem,
} from "../types";

interface Pagination {
  pageNum: number;
  pageSize: number;
}

export const defaultConfig = {
  pageNum: 1,
  pageSize: 15,
};

export default class PublishStore {
  @observable publish: Nullable<Publish> = null;

  @observable publishLoading: boolean = false;

  @observable audit: Audit[] = [];

  @observable auditLoading: boolean = false;

  @observable pagination: Partial<Pagination> = defaultConfig;

  @observable cacheApplicationConfig: Partial<IPublishSearch> = {};

  @observable cacheApproveConfig: Partial<IPublishSearch> = {};

  @observable teams: TeamItem[] = [];

  @observable publisherList: Publisher[] = [];

  @observable auditorList: Auditor[] = [];

  @observable auditorListForAudit: Auditor[] = [];

  @observable allTeamTags: Label[] = [];

  @observable allTags: Label[] = [];

  @observable markdownFileList: MarkdownFileItem[] = [];

  @observable markdownValue: string = "";

  @observable factorResultList: FactorResultItem[] = [];

  @observable factorResultListLoading: boolean = false;

  @observable strategyResultList: StrategyLibItem[] = [];

  @observable strategyResultListLoading: boolean = false;

  @observable approvalInfo: Nullable<ApprovalInfo> = null;

  @observable jsonData: any = null;

  @observable jsonDataLoading: boolean = false;

  @observable userList: UserItem[] = [];

  @observable activeTab: RecordTab = RecordTab.Application;

  onActiveTabChange = (activeTab: RecordTab) => {
    this.activeTab = activeTab;
  };

  onPaginationChange = (config: Partial<Pagination>) => {
    this.pagination = { ...this.pagination, ...config };
  };

  onCacheApplicationConfigChange = (config: Partial<IPublishSearch>) => {
    this.cacheApplicationConfig = config;
  };

  onCacheApproveConfigChange = (config: Partial<IPublishSearch>) => {
    this.cacheApproveConfig = config;
  };

  getMyPublishList = async (data: Partial<IPublishSearch>) => {
    this.publishLoading = true;
    await ajax({
      url: "/tqlab/process/getMyPublishList",
      method: "post",
      data: { ...this.cacheApplicationConfig, ...data },
      success: (data) => {
        this.publish = data;
      },
      effect: () => {
        this.publishLoading = false;
      },
    });
  };

  getMyAuditList = async (data: Partial<IPublishSearch>) => {
    this.auditLoading = true;
    await ajax({
      url: "/tqlab/process/getMyAuditList",
      method: "post",
      data: { ...this.cacheApproveConfig, ...data },
      success: (data) => {
        this.audit = data;
      },
      effect: () => {
        this.auditLoading = false;
      },
    });
  };

  // 获取用户团队列表
  getAllTeamInfos = async (code?: string) => {
    await ajax({
      url: `/tquser/team/getAllTeamInfos`,
      params: { code },
      success: (data) => {
        this.teams = data;
      },
    });
  };

  getTeamList4MyAudit = async () => {
    await ajax({
      url: `/tqlab/process/getTeamList4MyAudit`,
      success: (data) => {
        this.teams = data;
      },
    });
  };

  getTeamList4MyPublish = async () => {
    await ajax({
      url: `/tqlab/process/getTeamList4MyPublish`,
      success: (data) => {
        this.teams = data;
      },
    });
  };

  // 获取发布人列表(个人中心发布管理)
  getPublisherList4MyAudit = async () => {
    await ajax({
      url: `/tqlab/process/getPublisherList4MyAudit`,
      success: (data) => {
        this.publisherList = data;
      },
    });
  };

  // 获取审核人列表（个人中心发布管理）
  getAuditorList4MyPublish = async () => {
    await ajax({
      url: `/tqlab/process/getAuditorList4MyPublish`,
      success: (data) => {
        this.auditorList = data;
      },
    });
  };

  // 获取审核人列表（个人中心发布管理审核界面）
  getAuditorList4MyAudit = async () => {
    await ajax({
      url: `/tqlab/process/getAuditorList4MyAudit`,
      success: (data) => {
        this.auditorListForAudit = data;
      },
    });
  };

  // 获取发布人列表(管理中心审计日志)
  getPublisherList = async () => {
    await ajax({
      url: `/tqlab/process/getPublisherList`,
      success: (data) => {
        this.publisherList = data;
      },
    });
  };

  // 获取审核人列表（管理中心审计日志）
  getAuditorList = async () => {
    await ajax({
      url: `/tqlab/process/getAuditorList`,
      success: (data) => {
        this.auditorList = data;
      },
    });
  };

  // 获取审核详情
  getApprovalDetail = async (processInstanceId?: string) => {
    return await ajax({
      url: `/tqlab/process/getApprovalDetail`,
      params: { processInstanceId },
      success: (data) => {
        this.approvalInfo = data;
      },
    });
  };

  // 部署流程实例至个人空间
  deployIntoPersonalSpace = async (data: {
    comment: string;
    personalProjectName: string;
    processInstanceId: number;
    tags: string[];
  }) => {
    await ajax({
      url: `/tqlab/process/deployIntoPersonalSpace`,
      method: "post",
      data,
      success: () => {
        message.success("文件保存成功");
      },
    });
  };

  getTags = async () => {
    await ajax({
      url: `/tqlab/tag/getTags`,
      success: (data) => {
        this.allTags = data;
      },
    });
  };

  getTeamTags = async (teamId?: number) => {
    await ajax({
      url: `/tqlab/tag/getTeamTags`,
      params: { teamId },
      success: (data) => {
        this.allTeamTags = data;
      },
    });
  };

  getMDFileList = (processInstanceId?: string) => {
    ajax({
      url: `/tqlab/process/getMDFileList`,
      params: { processInstanceId },
      success: (data) => {
        this.markdownFileList = data;
        if (data.length) {
          this.getMDFile(data[0]?.id);
        }
      },
    });
  };

  getMDFile = (processInstanceMDId: number) => {
    ajax({
      url: `/tqlab/process/getMDFile`,
      params: { processInstanceMDId },
      success: (data) => {
        this.markdownValue = data;
      },
    });
  };

  // 根据实例ID获取因子库列表
  getFactorResultListByProcessInstanceId = (processInstanceId?: string) => {
    this.factorResultListLoading = true;
    ajax({
      url: `/tqlab/process/getFactorResultListByProcessInstanceId`,
      params: { processInstanceId },
      success: (data) => {
        this.factorResultList = data;
      },
      effect: () => {
        this.factorResultListLoading = false;
      },
    });
  };

  // 根据实例ID获取因子JSON
  getFactorResultJSON = (id?: string) => {
    this.jsonDataLoading = true;
    ajax({
      url: `/tqlab/process/getFactorResultJSON`,
      params: { id },
      success: (data) => {
        this.jsonData = JSON.parse(data);
      },
      effect: () => {
        this.jsonDataLoading = false;
      },
    });
  };

  // 根据实例ID获取策略库库列表
  getStrategyResultListByProjectId = (processInstanceId?: string) => {
    this.strategyResultListLoading = true;
    ajax({
      url: `/tqlab/process/getStrategyResultListByProjectId`,
      params: { processInstanceId },
      success: (data) => {
        this.strategyResultList = data;
      },
      effect: () => {
        this.strategyResultListLoading = false;
      },
    });
  };

  // 根据实例ID获取因子JSON
  getStrategyResultJSON = (id?: string) => {
    this.jsonDataLoading = true;
    ajax({
      url: `/tqlab/process/getStrategyResultJSON`,
      params: { id },
      success: (data) => {
        this.jsonData = JSON.parse(data);
      },
      effect: () => {
        this.jsonDataLoading = false;
      },
    });
  };

  // 审核驳回
  rejectApproval = async (data: {
    comment: string;
    processInstanceId: string | number;
  }) => {
    await ajax({
      url: `/tqlab/process/rejectApproval`,
      method: "post",
      data,
      success: () => {
        message.success("驳回成功");
        this.getApprovalDetail(data.processInstanceId as string);
      },
    });
  };

  // 审核通过
  passApproval = async (data: Partial<IApprovedValue>) => {
    await ajax({
      url: `/tqlab/process/passApproval`,
      method: "post",
      data,
      success: () => {
        message.success("审核通过");
        this.getApprovalDetail(data.processInstanceId);
      },
    });
  };

  // 获取团队下的用户列表
  getUserListByTeam = async (teamId?: number) => {
    await ajax({
      url: `/tquser/user/getUserListByTeam`,
      params: { teamId },
      success: (data) => {
        this.userList = data;
      },
    });
  };

  onJsonDataReset = () => {
    this.jsonData = null;
  };

  resetCache = () => {
    this.cacheApplicationConfig = {};
    this.cacheApproveConfig = {};
    this.pagination = defaultConfig;
    this.activeTab = RecordTab.Application;
  };
}
