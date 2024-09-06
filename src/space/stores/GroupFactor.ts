import { IncreTrackingValue } from "../incre-tracking-modal/index";
import { defaultCacheConfig } from "./GroupStrategy";
/* eslint-disable no-return-await */
import { ImageInstance } from "@transquant/manage";
import { SimpleUser } from "@transquant/manage/types";
import { Label } from "@transquant/ui";
import { ajax, DataType, Nullable, resolveBlob } from "@transquant/utils";
import { message } from "antd";
import { observable } from "mobx";
import { IJobsLibSearch } from "../group/factor/incre-tracking/SearchHeader";
import { FactorResearchTabEnum } from "../group/factor/TabView";
import { IFactorLibSearch } from "../personal/factor-research/factor-lib/SearchHeader";
import {
  CodeTree,
  FactorBaseInfo,
  FactorYaml,
  FileList,
  GroupFactorLib,
  GroupIProjectSearch,
  GroupProject,
  GroupTeamItem,
  ITemplate,
  Job,
  Log,
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
}

interface Pagination {
  pageNum: number;
  pageSize: number;
}

interface PersonAuth {
  auth: number;
  userId: number;
}

export default class GroupFactorStore {
  @observable projects: Nullable<GroupProject> = null;

  @observable files: Nullable<FileList> = null;

  @observable factorLib: Nullable<GroupFactorLib> = null;

  // 查询时tag
  @observable tags: Label[] = [];

  @observable allTags: Label[] = [];

  @observable teamTags: Label[] = [];

  @observable templates: ITemplate[] = [];

  @observable userList: SimpleUser[] = [];

  @observable teamYamlPaths: string[] = [];

  @observable teamInstances: ImageInstance[] = [];

  @observable factorQuartzJobLoading: boolean = false;

  @observable factorBaseInfo: Nullable<FactorBaseInfo> = null;

  @observable groupFactorPerformance: string = "{}";

  @observable jsonData: any = null;

  // jsonData预览 loading
  @observable loading: boolean = false;

  @observable factorProjectListLoading: boolean = false;

  @observable factorLibLoading: boolean = false;

  @observable projectMarkdown: { desc: string; path: string; teamId?: number } =
    {
      desc: "",
      path: "",
    };

  @observable cacheLibConfig: Partial<IFactorLibSearch> = {};

  @observable cacheProjectConfig: Partial<GroupIProjectSearch> = {};

  @observable cacheJobsConfig: Partial<IJobsLibSearch> = defaultCacheConfig;

  @observable jobs: Job[] = [];

  @observable pagination: Partial<Pagination> = defaultConfig;

  @observable teams: GroupTeamItem[] = [];

  @observable codeTreeLoading: boolean = false;

  @observable codeTree: CodeTree[] = [];

  @observable factorTables: string = "";

  @observable logs: Log[] = [];

  @observable logsLoading: boolean = false;

  @observable logContent: string = "";

  @observable commandLogContent: string = "";

  @observable fileContent: string = "";

  @observable fileContentLoading: boolean = false;

  @observable factorYaml: Nullable<FactorYaml> = null;

  @observable selectedTeam: GroupTeamItem = {
    id: undefined,
    name: undefined,
  };

  @observable personalFiles: File[] = [];

  @observable currentJob: Nullable<DataType<Job>> = null;

  @observable activeTab: FactorResearchTabEnum =
    FactorResearchTabEnum.ProjectList;

  setActiveTab = (activeTab: FactorResearchTabEnum) => {
    this.activeTab = activeTab;
  };

  onGroupFactorTabChange = (key: string) => {
    const _team = { ...this.selectedTeam };
    this.reset();
    this.selectedTeam = _team;
    this.setActiveTab(key as FactorResearchTabEnum);
  };

  onCacheLibConfigChange = (config: Partial<IFactorLibSearch>) => {
    this.cacheLibConfig = config;
  };

  onCacheProjectConfig = (config: Partial<GroupIProjectSearch>) => {
    this.cacheProjectConfig = config;
  };

  onCacheJobsConfig = (config: Partial<IJobsLibSearch>) => {
    this.cacheJobsConfig = { ...defaultCacheConfig, ...config };
  };

  onPaginationChange = (config: Partial<Pagination>) => {
    this.pagination = { ...this.pagination, ...config };
  };

  onCurrentJobChange = (job: DataType<Job>) => {
    this.currentJob = job;
  };

  onFactorSelectedTeamChange = (team: GroupTeamItem) => {
    this.selectedTeam = team;
  };

  getTags = async () => {
    await ajax({
      url: `/tqlab/tag/getTags`,
      success: (data) => {
        this.allTags = data;
      },
    });
  };

  // 获取团队下用户列表
  getMemberListByTeam = async (teamId: number) => {
    await ajax({
      url: `/tquser/user/getMemberListByTeam`,
      params: { teamId },
      success: (data) => {
        this.userList = data;
      },
    });
  };

  getTeamTags = async () => {
    if (!this.selectedTeam.id) return;
    await ajax({
      url: `/tqlab/tag/getTeamTags`,
      params: { teamId: this.selectedTeam.id },
      success: (data) => {
        this.teamTags = data;
      },
    });
  };

  // 启动定时任务
  startQuartzJob = (quartzJobId: number) => {
    ajax({
      url: `/tqlab/quartzteamjob/startQuartzTeamJob`,
      params: { quartzJobId },
      success: () => {
        this.getFactorQuartzTeamJob(this.cacheJobsConfig);
        message.success("启动成功");
      },
    });
  };

  getQuartzTeamJobTags = async () => {
    if (!this.selectedTeam.id) return;
    await ajax({
      url: `/tqlab/quartzteamjob/getQuartzTeamJobTags`,
      params: { teamId: this.selectedTeam.id, type: 1 },
      success: (data) => {
        this.teamTags = data;
      },
    });
  };

  getTeamTagsByType = (resourceType: TagEnum) => {
    ajax({
      url: `/tqlab/tag/getTeamTagsByType`,
      params: { resourceType, teamId: this.selectedTeam.id },
      success: (data) => {
        this.tags = data;
      },
    });
  };

  getTeamFactorProject = () => {
    if (!this.selectedTeam.id) return;
    this.factorProjectListLoading = true;
    ajax({
      url: `/tqlab/teamProject/factor/getTeamFactorProject`,
      method: "post",
      data: {
        ...this.cacheProjectConfig,
        ...this.pagination,
        teamId: this.selectedTeam.id,
      },
      success: (res) => {
        this.projects = res;
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

  getTeamFactorProjectFileList = (projectId: number) => {
    ajax({
      url: `/tqlab/teamProject/factor/getTeamFactorProjectFileList`,
      params: { projectId },
      success: (data) => {
        this.files = data;
      },
    });
  };

  // 获取用户团队列表
  getAllTeamInfos = async (code?: string) => {
    const getCode = (active: FactorResearchTabEnum) => {
      if (
        active === FactorResearchTabEnum.ProjectList ||
        active === FactorResearchTabEnum.FactorLib
      ) {
        return "040101";
      }
    };
    await ajax({
      url: `/tquser/team/getAllTeamInfos`,
      params: { code: code || getCode(this.activeTab) },
      success: (data) => {
        this.teams = data;
        if (!this.selectedTeam.id) {
          this.selectedTeam = data.length ? data[0] : {};
          this.getFactorQuartzTeamJob(data[0]?.id);
        }
      },
    });
  };

  // 获取项目描述
  getTeamProjectDesc = (projectId: number) => {
    ajax({
      url: `/tqlab/teamProject/factor/getTeamProjectDesc`,
      params: { projectId },
      success: (data) => {
        this.projectMarkdown = data;
      },
    });
  };

  deleteTeamFactorProject = (projectId: number) => {
    ajax({
      url: `/tqlab/teamProject/factor/deleteTeamFactorProject`,
      method: "delete",
      params: { projectId },
      success: () => {
        this.getTeamFactorProject();
        message.success("删除成功");
      },
    });
  };

  // 下载即新建因子项目
  downloadTeamFactorProject = (data: {
    comment: string;
    projectName: string;
    tags: Label[];
    teamProjectId: number;
  }) => {
    ajax({
      url: `/tqlab/teamProject/factor/downloadTeamFactorProject`,
      method: "post",
      data: { ...data, teamId: this.selectedTeam.id },
      success: () => {
        message.success("新建成功");
        this.getTeamFactorProject();
      },
    });
  };

  // 更新因子项目
  updateTeamFactorProject = (data: {
    comment: string;
    projectId: number;
    tags: Label[];
    personalAuth: PersonAuth[] | undefined;
    authType: number;
  }) => {
    ajax({
      url: `/tqlab/teamProject/factor/updateTeamFactorProject`,
      method: "post",
      data: { ...data, teamId: this.selectedTeam.id },
      success: () => {
        message.success("更新成功");
        this.getTeamFactorProject();
      },
    });
  };

  // 获取因子库列表
  getTeamFactorResultList = () => {
    if (!this.selectedTeam.id) return;
    this.factorLibLoading = true;
    ajax({
      url: `/tqlab/teamProject/factor/getTeamFactorResultList`,
      method: "post",
      data: {
        ...this.cacheLibConfig,
        ...this.pagination,
        teamId: this.selectedTeam.id,
      },
      success: (data) => {
        this.factorLib = data;
      },
      effect: () => {
        this.factorLibLoading = false;
      },
    });
  };

  // 设置团队因子标签
  updateTeamFactorTags = (data: { id: number; tags: string[] }) => {
    ajax({
      url: `/tqlab/teamProject/factor/updateTeamFactorTags`,
      method: "post",
      data: { ...data, teamId: this.selectedTeam.id },
      success: () => {
        message.success("标签设置成功");
        this.getTeamFactorResultList();
      },
    });
  };

  // 获取因子json数据
  getTeamFactorJsonData = (teamFactorId: number) => {
    this.loading = true;
    ajax({
      url: `/tqlab/teamProject/factor/getTeamFactorJsonData`,
      params: { teamFactorId },
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

  // 获取个人空间文件列表
  getPersonalFolder = async (params: {
    type: 0 | 1;
    projectId: number;
    path?: string;
  }) => {
    await ajax({
      url: `/tqlab/workspace/getPersonalFolder`,
      params,
      success: (data) => {
        this.personalFiles = data;
      },
    });
  };

  getTeamYamlPath = async (projectId: number) => {
    await ajax({
      url: `/tqlab/quartzteamjob/getTeamYamlPath`,
      params: { projectId },
      success: (data) => {
        this.teamYamlPaths = data;
      },
    });
  };

  // 团队镜像列表
  getSwitchTeamImageInstances = async () => {
    return await ajax({
      url: `/tqlab/k8s/getSwitchTeamImageInstances`,
      params: { teamId: this.selectedTeam.id },
      success: (data) => {
        this.teamInstances = data;
      },
    });
  };

  getTeamFactorOrStrategyProj = async (
    projectType: 0 | 1 /** 0: 策略， 1: 因子 */
  ) => {
    return await ajax({
      url: `/tqlab/teamProject/factor/getTeamFactorOrStrategyProj`,
      params: { projectType, teamId: this.selectedTeam.id },
    });
  };

  // 增加定时任务（增量跟踪）
  addQuartzTeamJob = (data: Partial<IncreTrackingValue>) => {
    return ajax({
      url: `/tqlab/quartzteamjob/configQuartzTeamJob`,
      method: "post",
      data,
      success: () => {
        message.success(
          `您已经创建了【${data.jobName}】增量跟踪任务，建议您先试运行，然后再启动！`
        );
        this.getFactorQuartzTeamJob();
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

  // 获取因子增量跟踪列表
  getFactorQuartzTeamJob = (
    data?: Partial<IJobsLibSearch>,
    teamId?: number
  ) => {
    if (!teamId && !this.selectedTeam.id) return;
    this.factorQuartzJobLoading = true;
    ajax({
      url: `/tqlab/quartzteamjob/getFactorQuartzTeamJob`,
      method: "post",
      data: {
        ...this.cacheJobsConfig,
        ...data,
        teamId: teamId || this.selectedTeam.id,
      },
      success: (data) => {
        this.jobs = data;
      },
      effect: () => {
        this.factorQuartzJobLoading = false;
      },
    });
  };

  // 设置增量跟踪标签
  updateQuartzTeamJobTags = (data: { id: number; tags: string[] }) => {
    if (!this.selectedTeam.id) return;
    ajax({
      url: `/tqlab/quartzteamjob/updateQuartzTeamJobTags`,
      method: "post",
      data: { ...data, teamId: this.selectedTeam.id },
      success: () => {
        message.success("标签设置成功");
        this.getFactorQuartzTeamJob(this.cacheJobsConfig);
        this.getTeamTags();
      },
    });
  };

  // 增量跟踪结束任务
  endQuartzTeamJob = (quartzJobDetailId: number) => {
    ajax({
      url: `/tqlab/quartzteamjob/endQuartzTeamJob`,
      method: "post",
      data: { quartzJobDetailId },
      success: () => {
        message.success("结束成功");
        this.getFactorQuartzTeamJob(this.cacheJobsConfig);
      },
    });
  };

  // 删除增量跟踪任务
  deleteQuartzTeamJob = (quartzJobDetailId: number) => {
    ajax({
      url: `/tqlab/quartzteamjob/deleteQuartzTeamJob`,
      method: "delete",
      params: { quartzJobDetailId },
      success: () => {
        message.success("删除成功");
        this.getFactorQuartzTeamJob(this.cacheJobsConfig);
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

  // 下载团队zip到本地
  downloadTeamZip = async (projectId: number, name: string) => {
    await ajax({
      url: `/tqlab/teamProject/factor/downloadTeamZip`,
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

  getPerformanceJsonData = (id: number) => {
    ajax({
      url: `/tqlab/factor/getPerformanceJsonData`,
      params: { factorId: id },
      success: (data) => {
        this.groupFactorPerformance = data;
      },
    });
  };

  reset = () => {
    this.jsonData = null;
    this.cacheLibConfig = {};
    this.cacheProjectConfig = {};
    this.cacheJobsConfig = defaultCacheConfig;
    this.pagination = defaultConfig;
    this.activeTab = FactorResearchTabEnum.ProjectList;
    this.selectedTeam = {
      id: undefined,
      name: undefined,
    };
  };
}
