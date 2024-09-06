import { defaultCacheConfig } from "./GroupStrategy";
/* eslint-disable no-return-await */
import { Label } from "@transquant/ui";
import { ajax, DataType, Nullable, resolveBlob } from "@transquant/utils";
import { message } from "antd";
import { observable } from "mobx";
import { IFactorLibSearch } from "../personal/factor-research/factor-lib/SearchHeader";
import { IProjectSearch } from "../personal/factor-research/project-list/SearchHeader";

import { ImageInstance } from "@transquant/manage";
import { IncreTrackingValue } from "../incre-tracking-modal";
import { IJobsLibSearch } from "../personal/factor-incre/incre-tracking/SearchHeader";
import { FactorResearchTabEnum } from "../personal/factor-research/TabView";
import {
  CodeTree,
  FactorBaseInfo,
  FactorLib,
  FactorResultItem,
  FactorYaml,
  FileList,
  ITemplate,
  Job,
  Log,
  Project,
} from "../types";

export const defaultConfig = {
  pageNum: 1,
  pageSize: 15,
};

export enum TagEnum {
  BACKTEST_PROJECT = 0,
  FACTOR_PROJECT = 1,
  BACKTEST = 2,
  FACTOR = 3,
  INCRETRACKING = 5,
}

interface Pagination {
  pageNum: number;
  pageSize: number;
}

export default class FactorResearchStore {
  @observable projects: Nullable<Project> = null;

  @observable files: Nullable<FileList> = null;

  @observable factorLib: Nullable<FactorLib> = null;

  @observable jobs: Job[] = [];

  @observable codeTree: CodeTree[] = [];

  @observable codeTreeLoading: boolean = false;

  @observable logs: Log[] = [];

  @observable logsLoading: boolean = false;

  @observable logContent: string = "";

  @observable commandLogContent: string = "";

  @observable fileContent: string = "";

  @observable fileContentLoading: boolean = false;

  @observable factorYaml: Nullable<FactorYaml> = null;

  // 查询时tag
  @observable tags: Label[] = [];

  // 新建下拉时tag
  @observable allTags: Label[] = [];

  @observable yamlPaths: string[] = [];

  @observable imageInstances: ImageInstance[] = [];

  @observable templates: ITemplate[] = [];

  @observable factorBaseInfo: Nullable<FactorBaseInfo> = null;

  @observable jsonData: any = null;

  // jsonData预览 loading
  @observable loading: boolean = false;

  @observable factorTables: string = "";

  @observable factorProjectListLoading: boolean = false;

  @observable factorLibLoading: boolean = false;

  @observable factorQuartzJobLoading: boolean = false;

  @observable factorPerformance: string = "{}";

  @observable projectMarkdown: { desc: string; path: string } = {
    desc: "",
    path: "",
  };

  @observable cacheLibConfig: Partial<IFactorLibSearch> = {};

  @observable cacheProjectConfig: Partial<IProjectSearch> = {};

  @observable cacheJobsConfig: Partial<IJobsLibSearch> = {
    pageNum: 1,
    pageSize: 15,
  };

  @observable pagination: Partial<Pagination> = defaultConfig;

  @observable factorResultList: FactorResultItem[] = [];

  @observable currentJob: Nullable<DataType<Job>> = null;

  @observable activeTab: FactorResearchTabEnum =
    FactorResearchTabEnum.ProjectList;

  setActiveTab = (activeTab: FactorResearchTabEnum) => {
    this.activeTab = activeTab;
  };

  onFactorTabChange = (key: string) => {
    this.resetCache();
    this.setActiveTab(key as FactorResearchTabEnum);
  };

  onCurrentJobChange = (job: DataType<Job>) => {
    this.currentJob = job;
  };

  onCacheLibConfigChange = (config: Partial<IFactorLibSearch>) => {
    this.cacheLibConfig = config;
  };

  onCacheProjectConfig = (config: Partial<IProjectSearch>) => {
    this.cacheProjectConfig = config;
  };

  onCacheJobsConfig = (config: Partial<IJobsLibSearch>) => {
    this.cacheJobsConfig = config;
  };

  onPaginationChange = (config: Partial<Pagination>) => {
    this.pagination = { ...this.pagination, ...config };
  };

  getTags = async () => {
    await ajax({
      url: `/tqlab/tag/getTags`,
      success: (data) => {
        this.allTags = data;
      },
    });
  };

  getYamlPath = async (projectId: number) => {
    await ajax({
      url: `/tqlab/quartzjob/getYamlPath`,
      params: { projectId },
      success: (data) => {
        this.yamlPaths = data;
      },
    });
  };

  getPrivateEnvList = async () => {
    await ajax({
      url: `/tqlab/k8s/getPrivateEnvList`,
      success: (data) => {
        this.imageInstances = data;
      },
    });
  };

  getFactorOrStrategyProj = async (
    projectType: 0 | 1 /** 0: 策略， 1: 因子 */
  ) => {
    return await ajax({
      url: `/tqlab/factor/getFactorOrStrategyProj`,
      params: { projectType },
    });
  };

  getTagsByType = (resourceType: TagEnum) => {
    ajax({
      url: `/tqlab/tag/getTagsByType`,
      params: { resourceType },
      success: (data) => {
        this.tags = data;
      },
    });
  };

  getQuartzJobTags = (type: number) => {
    ajax({
      url: `/tqlab/quartzjob/getQuartzJobTags`,
      params: { type },
      success: (data) => {
        this.tags = data;
      },
    });
  };

  getFactorProject = (data: Partial<IProjectSearch>) => {
    this.factorProjectListLoading = true;
    ajax({
      url: `/tqlab/factor/getFactorProject`,
      method: "post",
      data: { ...this.cacheProjectConfig, ...data },
      success: (data) => {
        this.projects = data;
      },
      effect: () => {
        this.factorProjectListLoading = false;
      },
    });
  };

  getFactorTemplate = async () => {
    await ajax({
      url: `/tqlab/template/getFactorTemplate`,
      success: (data) => {
        this.templates = data;
      },
    });
  };

  getFactorProjectFileList = (projectId: number) => {
    ajax({
      url: `/tqlab/factor/getFactorProjectFileList`,
      params: { projectId },
      success: (data) => {
        this.files = data;
      },
    });
  };

  // 获取项目描述
  getProjectDesc = (projectId: number) => {
    ajax({
      url: `/tqlab/factor/getProjectDesc`,
      params: { projectId },
      success: (data) => {
        this.projectMarkdown = data;
      },
    });
  };

  deleteFactorProject = (projectId: number) => {
    ajax({
      url: `/tqlab/factor/deleteFactorProject`,
      method: "delete",
      params: { projectId },
      success: () => {
        this.getFactorProject(defaultConfig);
        message.success("删除成功");
      },
    });
  };

  // 新建因子项目
  createFactorProject = (data: {
    comment: string;
    projectName: string;
    tags: Label[];
    templateId: number;
  }) => {
    ajax({
      url: `/tqlab/factor/createFactorProject`,
      method: "post",
      data,
      success: () => {
        message.success("新建成功");
        this.getFactorProject(defaultConfig);
      },
    });
  };

  // 更新因子项目
  updateFactorProject = (data: {
    comment: string;
    projectId: number;
    tags: Label[];
  }) => {
    ajax({
      url: `/tqlab/factor/updateFactorProject`,
      method: "post",
      data,
      success: () => {
        message.success("更新成功");
        this.getFactorProject(defaultConfig);
      },
    });
  };

  // 获取因子库列表
  getFactorResultList = (data: Partial<IFactorLibSearch>) => {
    this.factorLibLoading = true;
    ajax({
      url: `/tqlab/factor/getFactorResultList`,
      method: "post",
      data: { ...this.cacheLibConfig, ...data },
      success: (data) => {
        this.factorLib = data;
      },
      effect: () => {
        this.factorLibLoading = false;
      },
    });
  };

  // 获取因子增量跟踪列表
  getFactorQuartzJob = (data?: Partial<IJobsLibSearch>) => {
    this.factorQuartzJobLoading = true;
    ajax({
      url: `/tqlab/quartzjob/getFactorQuartzJob`,
      method: "post",
      data: { ...this.cacheJobsConfig, ...data },
      success: (data) => {
        this.jobs = data;
      },
      effect: () => {
        this.factorQuartzJobLoading = false;
      },
    });
  };

  // 设置因子标签
  updateFactorTags = (data: { id: number; tags: string[] }) => {
    ajax({
      url: `/tqlab/factor/updateFactorTags`,
      method: "post",
      data,
      success: () => {
        message.success("标签设置成功");
        this.getFactorResultList({ pageNum: 1, pageSize: 15 });
        this.getTagsByType(TagEnum.FACTOR);
      },
    });
  };

  // 设置增量跟踪标签
  updateQuartzJobTags = (data: { id: number; tags: string[] }) => {
    ajax({
      url: `/tqlab/quartzjob/updateQuartzJobTags`,
      method: "post",
      data,
      success: () => {
        message.success("标签设置成功");
        this.getFactorQuartzJob(this.cacheJobsConfig);
        this.getTagsByType(TagEnum.INCRETRACKING);
      },
    });
  };

  // 启动定时任务
  startQuartzJob = (quartzJobId: number) => {
    ajax({
      url: `/tqlab/quartzjob/startQuartzJob`,
      params: { quartzJobId },
      success: () => {
        this.getFactorQuartzJob(this.cacheJobsConfig);
        message.success("启动成功");
      },
    });
  };

  // 增量跟踪结束任务
  endQuartzJob = (quartzJobDetailId: number) => {
    ajax({
      url: `/tqlab/quartzjob/endQuartzJob`,
      method: "post",
      data: { quartzJobDetailId },
      success: () => {
        message.success("结束成功");
        this.getFactorQuartzJob(this.cacheJobsConfig);
      },
    });
  };

  // 删除增量跟踪任务
  deleteQuartzJob = (quartzJobDetailId: number) => {
    ajax({
      url: `/tqlab/quartzjob/deleteQuartzJob`,
      method: "delete",
      params: { quartzJobDetailId },
      success: () => {
        message.success("删除成功");
        this.getFactorQuartzJob(this.cacheJobsConfig);
      },
    });
  };

  // 获取因子json数据
  getFactorJsonData = (factorId: number) => {
    this.loading = true;
    ajax({
      url: `/tqlab/factor/getFactorJsonData`,
      params: { factorId },
      success: (res) => {
        const { datas, ...factorBaseInfo } = res;

        this.factorBaseInfo = factorBaseInfo;
        this.jsonData = JSON.parse(datas);
      },
      effect: () => {
        this.loading = false;
      },
    });
  };

  // 根据项目获取因子库列表
  getFactorResultListByProjectId = async (projectId: number) => {
    await ajax({
      url: `/tqlab/factor/getFactorResultListByProjectId`,
      params: { projectId },
      success: (data) => {
        this.factorResultList = data;
      },
    });
  };

  // 增加定时任务（增量跟踪）
  addQuartzJob = (data: Partial<IncreTrackingValue>) => {
    return ajax({
      url: `/tqlab/quartzjob/configQuartzJob`,
      method: "post",
      data,
      success: () => {
        message.success(
          `您已经创建了【${data.jobName}】增量跟踪任务，建议您先试运行，然后再启动！`
        );
        this.onFactorTabChange(FactorResearchTabEnum.IncreTracking);
      },
    });
  };

  // 获取代码文件列表
  getCodeTree = () => {
    this.codeTreeLoading = true;
    ajax({
      url: `/tqlab/quartzjob/getCodeTree`,
      params: { jobKey: this.currentJob?.jobKey },
      success: (data) => {
        this.codeTree = data;
      },
      effect: () => {
        this.codeTreeLoading = false;
      },
    });
  };

  // 获取日志列表
  getQuartzLog = () => {
    this.logsLoading = true;
    ajax({
      url: `/tqlab/quartzjob/getQuartzLog`,
      params: { jobKey: this.currentJob?.jobKey },
      success: (data) => {
        this.logs = data;
      },
      effect: () => {
        this.logsLoading = false;
      },
    });
  };

  // 获取文件内容
  getFileContent = (filePath: string) => {
    this.fileContentLoading = true;
    ajax({
      url: `/tqlab/quartzjob/getFileContent`,
      params: { filePath },
      success: (data) => {
        this.fileContent = data;
      },
      effect: () => {
        this.fileContentLoading = false;
      },
    });
  };

  // 获取日志文本
  getQuartzLogContent = async (logId: number) => {
    await ajax({
      url: `/tqlab/quartzjob/getQuartzLogContent`,
      params: { logId },
      success: (data) => {
        this.logContent = data;
      },
    });
  };

  // 获取执行日志文本
  getQuartzCommandLogContent = async (logId: number) => {
    await ajax({
      url: `/tqlab/quartzjob/getQuartzCommandLogContent`,
      params: { logId },
      success: (data) => {
        this.commandLogContent = data;
      },
    });
  };

  // 获取因子任务的存表信息
  getSaveTablesForFactorJob = async () => {
    await ajax({
      url: `/tqlab/quartzjob/getSaveTablesForFactorJob`,
      params: { jobKey: this.currentJob?.jobKey },
      success: (data) => {
        this.factorTables = data;
      },
    });
  };

  // 下载zip到本地
  downloadZip = (projectId: number, name: string) => {
    ajax({
      url: `/tqlab/factor/downloadZip`,
      params: { projectId },
      responseType: "blob",
      headers: {
        "Content-Type": "application/vnd.ms-excel;chartset=utf-8",
      },
      success: (data) => {
        resolveBlob(data, "zip", name);
      },
    });
  };

  getPerformanceJsonData = (id: number) => {
    ajax({
      url: `/tqlab/factor/getPerformanceJsonData`,
      params: { factorId: id },
      success: (data) => {
        this.factorPerformance = data;
      },
    });
  };

  // 获取解析的yaml文件数据
  getFactorYamlData = (projectId: number) => {
    ajax({
      url: `/tqlab/factor/getFactorYamlData`,
      params: { projectId },
      success: (data) => {
        this.factorYaml = data;
      },
    });
  };

  updateFactorYamlData = (data: Partial<FactorYaml>, projectId: number) => {
    return ajax({
      url: `/tqlab/factor/updateFactorYamlData`,
      method: "post",
      data: { ...data, projectId },
      success: () => {
        message.success("更新成功");
      },
    });
  };

  resetCache = () => {
    this.cacheLibConfig = {};
    this.cacheProjectConfig = {};
    this.cacheJobsConfig = defaultCacheConfig;
    this.pagination = defaultConfig;
    this.activeTab = FactorResearchTabEnum.ProjectList;
    this.jsonData = null;
  };
}
