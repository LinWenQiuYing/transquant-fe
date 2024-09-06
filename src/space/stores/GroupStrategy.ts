import { ImageInstance } from "@transquant/manage";
import { SimpleUser } from "@transquant/manage/types";
import { StrategyYaml } from "@transquant/space/types";
import { Label } from "@transquant/ui";
import { ajax, DataType, Nullable, resolveBlob } from "@transquant/utils";
import { message } from "antd";
import dayjs from "dayjs";
import { observable } from "mobx";
import { IncreOrderSearch } from "../group/strategy-incre/incre-tracking-view/Order";
import { IJobsLibSearch } from "../group/strategy-incre/incre-tracking/SearchHeader";
import { StrategyResearchTabEnum } from "../group/strategy/TabView";
import { IncreTrackingValue } from "../incre-tracking-modal/index";
import { IProjectSearch } from "../personal/strategy-research/project-list/SearchHeader";
import { IStrategyLibSearch } from "../personal/strategy-research/strategy-lib/SearchHeader";
import { IAccountSearch } from "../personal/strategy-research/strategy-view/Account";
import { IPositionSearch } from "../personal/strategy-research/strategy-view/Position";
import {
  FileList,
  GroupProject,
  GroupStrategyLib,
  GroupTeamItem,
  ITemplate,
} from "../types";
import {
  Account,
  CodeTree,
  Job,
  Log,
  Order,
  Position,
  StrategyKPI,
  StrategyPnl,
  StrategyReturn,
} from "../types/factor";
import {
  AccountTable,
  OrderTable,
  PositionTable,
  StrategyBaseInfo,
  StrategyJob,
} from "../types/strategy";
import { TagEnum } from "./FactorResearch";

export const defaultConfig = {
  pageNum: 1,
  pageSize: 15,
};

export const defaultCacheConfig = {
  pageNum: 1,
  pageSize: 15,
};

interface Pagination {
  pageNum: number;
  pageSize: number;
}

interface PersonAuth {
  auth: number;
  userId: number;
}

const defaultStrategyViewPositionSearchValue = {
  date: dayjs().format("YYYY-MM-DD"),
};

const defaultStrategyViewAccountSearchValue = {
  timeRangeType: 0,
};

const defaultStrategyViewOrderSearchValue = {
  timeRangeType: 0,
};

export default class GroupStrategyStore {
  @observable projects: Nullable<GroupProject> = null;

  @observable templates: ITemplate[] = [];

  @observable strategyViewPositionSearchValue: Partial<IPositionSearch> =
    defaultStrategyViewPositionSearchValue;

  @observable strategyViewAccountSearchValue: Partial<IAccountSearch> =
    defaultStrategyViewAccountSearchValue;

  @observable strategyViewOrderSearchValue: Partial<IncreOrderSearch> =
    defaultStrategyViewOrderSearchValue;

  @observable strategyLib: Nullable<GroupStrategyLib> = null;

  // 详情数据预览
  @observable loading: boolean = false;

  @observable strategyProjectListLoading: boolean = false;

  @observable strategyLibLoading: boolean = false;

  // 查询时tag
  @observable tags: Label[] = [];

  @observable allTags: Label[] = [];

  @observable teamTags: Label[] = [];

  @observable files: Nullable<FileList> = null;

  @observable strategyBaseInfo: Nullable<StrategyBaseInfo> = null;

  @observable currentJob: Nullable<DataType<Job>> = null;

  @observable jsonData: any = null;

  @observable codeTreeLoading: boolean = false;

  @observable codeTree: CodeTree[] = [];

  @observable logs: Log[] = [];

  @observable logsLoading: boolean = false;

  @observable logContent: string = "";

  @observable commandLogContent: string = "";

  @observable fileContent: string = "";

  @observable fileContentLoading: boolean = false;

  @observable projectMarkdown: { desc: string; path: string; teamId?: number } =
    {
      desc: "",
      path: "",
    };

  @observable cacheLibConfig: Partial<IStrategyLibSearch> = {};

  @observable cacheProjectConfig: Partial<IProjectSearch> = {};

  @observable cacheJobsConfig: Partial<IJobsLibSearch> = defaultCacheConfig;

  @observable pagination: Partial<Pagination> = defaultConfig;

  @observable teams: GroupTeamItem[] = [];

  @observable positions: Position[] = [];

  @observable positionsLoading: boolean = false;

  @observable accounts: Account[] = [];

  @observable accountsLoading: boolean = false;

  @observable orders: Nullable<Order> = null;

  @observable ordersLoading: boolean = false;

  @observable cacheOrderConfig: Partial<IncreOrderSearch> = {
    timeRangeType: 0,
  };

  @observable selectedTeam: GroupTeamItem = {
    id: undefined,
    name: undefined,
  };

  @observable positionTable: PositionTable[] = [];

  @observable positionTableLoading: boolean = false;

  @observable accountTable: AccountTable[] = [];

  @observable accountTableLoading: boolean = false;

  @observable jobs: StrategyJob[] = [];

  @observable strategyQuartzJobLoading: boolean = false;

  @observable orderTable: Nullable<OrderTable> = null;

  @observable orderTableLoading: boolean = false;

  @observable teamYamlPaths: string[] = [];

  @observable teamInstances: ImageInstance[] = [];

  @observable strategyKPI: Nullable<StrategyKPI> = null;

  @observable strategyReturnList: StrategyReturn[] = [];

  @observable strategyReturnListLoading: boolean = true;

  @observable strategyPnlList: StrategyPnl[] = [];

  @observable strategyPnlListLoading: boolean = true;

  @observable positionLoading: boolean = false;

  @observable accountLoading: boolean = false;

  @observable orderLoading: boolean = false;

  @observable groupStrategyPerformance: string = "{}";

  @observable strategyYaml: Nullable<StrategyYaml> = null;

  @observable activeTab: StrategyResearchTabEnum =
    StrategyResearchTabEnum.ProjectList;

  @observable userList: SimpleUser[] = [];

  onStrategyViewPositionSearchValueChange = (
    value: Partial<IPositionSearch>
  ) => {
    this.strategyViewPositionSearchValue = value;
  };

  onStrategyViewAccountSearchValueChange = (value: Partial<IAccountSearch>) => {
    this.strategyViewAccountSearchValue = value;
  };

  onStrategyOrderSearchValueChange = (value: Partial<IncreOrderSearch>) => {
    this.strategyViewOrderSearchValue = value;
  };

  setActiveTab = (activeTab: StrategyResearchTabEnum) => {
    this.activeTab = activeTab;
  };

  onGroupStrategyTabChange = (key: string) => {
    const _team = this.selectedTeam;
    this.resetCache();
    this.selectedTeam = _team;
    this.setActiveTab(key as StrategyResearchTabEnum);
    if (key === "increTracking") {
      this.getStrategyQuartzTeamJob(this.cacheJobsConfig);
    }
  };

  onCurrentJobChange = (job: DataType<Job>) => {
    this.currentJob = job;
  };

  onCacheJobsConfig = (config: Partial<IJobsLibSearch>) => {
    this.cacheJobsConfig = { ...defaultCacheConfig, ...config };
  };

  onCacheLibConfigChange = (config: Partial<IStrategyLibSearch>) => {
    this.cacheLibConfig = config;
  };

  onCacheProjectConfig = (config: Partial<IProjectSearch>) => {
    this.cacheProjectConfig = config;
  };

  onPaginationChange = (config: Partial<Pagination>) => {
    this.pagination = { ...this.pagination, ...config };
  };

  onCacheOrderConfig = (config: Partial<IncreOrderSearch>) => {
    this.cacheOrderConfig = config;
  };

  onStrategySelectedTeamChange = (team: GroupTeamItem) => {
    this.selectedTeam = team;
  };

  exportJobPositionDetail = () => {
    this.positionLoading = true;
    ajax({
      url: `/tqlab/quartzjob/exportPositionDetail`,
      method: "post",
      data: {
        ...this.strategyViewPositionSearchValue,
        jobKey: this.currentJob?.jobKey,
        className: this.currentJob?.className,
        strategyName: this.currentJob?.name,
      },
      responseType: "blob",
      success: (data) => {
        const { projectName, className, name } = this.strategyBaseInfo || {};
        resolveBlob(
          data,
          "csv",
          `${projectName}_${className}_${name}_持仓详情`
        );
      },
      effect: () => {
        this.positionLoading = false;
      },
    });
  };

  exportJobAccountDetail = () => {
    this.accountLoading = true;
    ajax({
      url: `/tqlab/quartzjob/exportAccountDetail`,
      method: "post",
      data: {
        ...this.strategyViewAccountSearchValue,
        jobKey: this.currentJob?.jobKey,
        className: this.currentJob?.className,
        strategyName: this.currentJob?.name,
      },
      responseType: "blob",
      success: (data) => {
        const { projectName, className, name } = this.strategyBaseInfo || {};
        resolveBlob(
          data,
          "csv",
          `${projectName}_${className}_${name}_账户详情`
        );
      },
      effect: () => {
        this.accountLoading = false;
      },
    });
  };

  // 启动定时任务
  startQuartzJob = (quartzJobId: number) => {
    ajax({
      url: `/tqlab/quartzteamjob/startQuartzTeamJob`,
      params: { quartzJobId },
      success: () => {
        this.getStrategyQuartzTeamJob(this.cacheJobsConfig);
        message.success("启动成功");
      },
    });
  };

  exportJobOrderDetail = () => {
    this.orderLoading = true;
    ajax({
      url: `/tqlab/quartzjob/exportOrderDetail`,
      method: "post",
      data: {
        ...this.strategyViewOrderSearchValue,
        jobKey: this.currentJob?.jobKey,
        className: this.currentJob?.className,
        strategyName: this.currentJob?.name,
      },
      responseType: "blob",
      success: (data) => {
        const { projectName, className, name } = this.strategyBaseInfo || {};
        resolveBlob(
          data,
          "csv",
          `${projectName}_${className}_${name}_订单详情`
        );
      },
      effect: () => {
        this.orderLoading = false;
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

  getTeamTagsByType = (resourceType: TagEnum) => {
    ajax({
      url: `/tqlab/tag/getTeamTagsByType`,
      params: { resourceType, teamId: this.selectedTeam.id },
      success: (data) => {
        this.tags = data;
      },
    });
  };

  getQuartzTeamJobTags = async () => {
    if (!this.selectedTeam.id) return;
    await ajax({
      url: `/tqlab/quartzteamjob/getQuartzTeamJobTags`,
      params: { teamId: this.selectedTeam.id, type: 0 },
      success: (data) => {
        this.teamTags = data;
      },
    });
  };

  getTeamStrategyProject = () => {
    if (!this.selectedTeam.id) return;
    this.strategyProjectListLoading = true;
    ajax({
      url: `/tqlab/teamProject/strategy/getTeamStrategyProject`,
      method: "post",
      data: {
        ...this.cacheProjectConfig,
        ...this.pagination,
        teamId: this.selectedTeam.id,
      },
      success: (data) => {
        this.projects = data;
      },
      effect: () => {
        this.strategyProjectListLoading = false;
      },
    });
  };

  getStrategyTemplate = async () => {
    await ajax({
      url: `/tqlab/template/getStrategyTemplate`,
      success: (data) => {
        this.templates = data;
      },
    });
  };

  getTeamStrategyProjectFileList = (projectId: number) => {
    ajax({
      url: `/tqlab/teamProject/strategy/getTeamStrategyProjectFileList`,
      params: { projectId },
      success: (data) => {
        this.files = data;
      },
    });
  };

  // 获取用户团队列表
  getAllTeamInfos = async (code?: string) => {
    const getCode = (active: StrategyResearchTabEnum) => {
      if (
        active === StrategyResearchTabEnum.ProjectList ||
        active === StrategyResearchTabEnum.StategyLib
      ) {
        return "040201";
      }
    };
    await ajax({
      url: `/tquser/team/getAllTeamInfos`,
      params: { code: code || getCode(this.activeTab) },
      success: (data) => {
        this.teams = data;
        if (!this.selectedTeam.id) {
          this.selectedTeam = data.length ? data[0] : {};
          this.getStrategyQuartzTeamJob(data[0]?.id);
        }
      },
    });
  };

  // 获取项目描述
  getTeamProjectDesc = (projectId: number) => {
    ajax({
      url: `/tqlab/teamProject/strategy/getTeamProjectDesc`,
      params: { projectId },
      success: (data) => {
        this.projectMarkdown = data;
      },
    });
  };

  deleteTeamStrategyProject = (projectId: number) => {
    ajax({
      url: `/tqlab/teamProject/strategy/deleteTeamStrategyProject`,
      method: "delete",
      params: { projectId },
      success: () => {
        this.getTeamStrategyProject();
        message.success("删除成功");
      },
    });
  };

  // 下载即新建因子项目
  downloadTeamStrategyProject = (data: {
    comment: string;
    projectName: string;
    tags: Label[];
    teamProjectId: number;
  }) => {
    ajax({
      url: `/tqlab/teamProject/strategy/downloadTeamStrategyProject`,
      method: "post",
      data: { ...data, teamId: this.selectedTeam.id },
      success: () => {
        message.success("新建成功");
        this.getTeamStrategyProject();
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

  // 更新策略项目
  updateTeamStrategyProject = (data: {
    comment: string;
    projectId: number;
    tags: Label[];
    personalAuth: PersonAuth[];
    authType: number;
  }) => {
    ajax({
      url: `/tqlab/teamProject/strategy/updateTeamStrategyProject`,
      method: "post",
      data: { ...data, teamId: this.selectedTeam.id },
      success: () => {
        message.success("更新成功");
        this.getTeamStrategyProject();
      },
    });
  };

  // 获取因子库列表
  getTeamStrategyResultList = (data?: any) => {
    if (!this.selectedTeam.id) return;
    this.strategyLibLoading = true;
    ajax({
      url: `/tqlab/teamProject/strategy/getTeamStrategyResultList`,
      method: "post",
      data: {
        ...this.cacheLibConfig,
        ...this.pagination,
        teamId: this.selectedTeam.id,
        ...data,
      },
      success: (data) => {
        this.strategyLib = data;
      },
      effect: () => {
        this.strategyLibLoading = false;
      },
    });
  };

  // 设置因子标签
  updateTeamStrategyTags = (data: { id: number; tags: string[] }) => {
    ajax({
      url: `/tqlab/teamProject/strategy/updateTeamStrategyTags`,
      method: "post",
      data: { ...data, teamId: this.selectedTeam.id },
      success: () => {
        message.success("标签设置成功");
        this.getTeamStrategyResultList();
      },
    });
  };

  // 获取策略json数据
  getTeamStrategyJsonData = (teamFactorId: number) => {
    this.loading = true;
    ajax({
      url: `/tqlab/teamProject/strategy/getTeamStrategyJsonData`,
      params: { teamFactorId },
      success: (res) => {
        const { datas, ...strategyBaseInfo } = res;

        this.strategyBaseInfo = strategyBaseInfo;
        this.jsonData = JSON.parse(datas);
      },
      effect: () => {
        this.loading = false;
      },
    });
  };

  // 获取持仓详情
  getTeamPositionDetail = (
    data: Partial<{
      code: string;
      date: string;
      flag: string;
      strategyId: number;
    }>
  ) => {
    this.positionTableLoading = true;
    ajax({
      url: `/tqlab/strategy/getPositionDetail`,
      method: "post",
      data: { ...this.cacheLibConfig, ...data },
      success: (data) => {
        this.positionTable = data;
      },
      effect: () => {
        this.positionTableLoading = false;
      },
    });
  };

  // 获取持仓详情
  getTeamAccountDetail = (
    data: Partial<{
      date: string;
      type: string;
      startTime: string;
      endTime: string;
      timeRangeType: number;
      strategyId: number;
    }>
  ) => {
    this.accountTableLoading = true;
    ajax({
      url: `/tqlab/strategy/getAccountDetail`,
      method: "post",
      data: { ...this.cacheLibConfig, ...data },
      success: (data) => {
        this.accountTable = data;
      },
      effect: () => {
        this.accountTableLoading = false;
      },
    });
  };

  // 获取账户详情
  getTeamOrderDetail = (
    data: Partial<IncreOrderSearch & { strategyId: number }>
  ) => {
    this.orderTableLoading = true;
    ajax({
      url: `/tqlab/strategy/getOrderDetail`,
      method: "post",
      data: { ...this.cacheOrderConfig, ...data },
      success: (data) => {
        this.orderTable = data;
      },
      effect: () => {
        this.orderTableLoading = false;
      },
    });
  };

  // 获取策略增量跟踪列表
  getStrategyQuartzTeamJob = (
    data?: Partial<IJobsLibSearch>,
    teamId?: number
  ) => {
    if (!teamId && !this.selectedTeam.id) return;
    this.strategyQuartzJobLoading = true;
    ajax({
      url: `/tqlab/quartzteamjob/getStrategyQuartzTeamJob`,
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
        this.strategyQuartzJobLoading = false;
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
        this.onGroupStrategyTabChange(StrategyResearchTabEnum.IncreTracking);
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
        this.getStrategyQuartzTeamJob(this.cacheJobsConfig);
        this.getTeamTags();
      },
    });
  };

  // 增量跟踪重新运行
  rerunQuartzTeamJob = (quartzJobDetailId: number) => {
    ajax({
      url: `/tqlab/quartzteamjob/rerunQuartzTeamJob`,
      method: "post",
      data: { quartzJobDetailId },
      success: () => {
        message.success("重新运行成功");
        this.getStrategyQuartzTeamJob(this.cacheJobsConfig);
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
        this.getStrategyQuartzTeamJob(this.cacheJobsConfig);
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
        this.getStrategyQuartzTeamJob(this.cacheJobsConfig);
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

  // 查询持仓详情
  getPositionList = (data?: {
    code?: string;
    date?: string;
    flag?: string;
  }) => {
    this.positionsLoading = true;
    ajax({
      url: `/tqlab/quartzjob/getPositionDetail`,
      method: "post",
      data: {
        className: this.currentJob?.className,
        strategyName: this.currentJob?.name,
        jobKey: this.currentJob?.jobKey,
        ...data,
      },
      success: (data) => {
        this.positions = data;
      },
      effect: () => {
        this.positionsLoading = false;
      },
    });
  };

  // 查询账户详情
  getAccountList = (
    data?: Partial<{
      date: string;
      type: string;
      startTime: string;
      endTime: string;
      timeRangeType: number;
    }>
  ) => {
    this.accountsLoading = true;
    ajax({
      url: `/tqlab/quartzjob/getAccountDetail`,
      method: "post",
      data: {
        className: this.currentJob?.className,
        strategyName: this.currentJob?.name,
        jobKey: this.currentJob?.jobKey,
        ...data,
      },
      success: (data) => {
        this.accounts = data;
      },
      effect: () => {
        this.accountsLoading = false;
      },
    });
  };

  // 获取收益详情-KPI
  getStrategyReturnKPI = () => {
    ajax({
      url: `/tqlab/quartzjob/getStrategyReturnKPI`,
      params: {
        jobKey: this.currentJob?.jobKey,
        strategyName: this.currentJob?.name,
        className: this.currentJob?.className,
      },
      success: (data) => {
        this.strategyKPI = data;
      },
    });
  };

  // 获取收益详情-累计收益率
  getStrategyReturnList = () => {
    this.strategyReturnListLoading = true;
    ajax({
      url: `/tqlab/quartzjob/getStrategyReturnList`,
      params: {
        jobKey: this.currentJob?.jobKey,
        strategyName: this.currentJob?.name,
        className: this.currentJob?.className,
      },
      success: (data) => {
        this.strategyReturnList = data;
      },
      effect: () => {
        this.strategyReturnListLoading = false;
      },
    });
  };

  // 获取收益详情-每日损益
  getDailyPnlList = () => {
    this.strategyPnlListLoading = true;
    ajax({
      url: `/tqlab/quartzjob/getDailyPnlList`,
      params: {
        jobKey: this.currentJob?.jobKey,
        strategyName: this.currentJob?.name,
        className: this.currentJob?.className,
      },
      success: (data) => {
        this.strategyPnlList = data;
      },
      effect: () => {
        this.strategyPnlListLoading = false;
      },
    });
  };

  // 查询订单详情
  getOrdersList = (data?: Partial<IncreOrderSearch>) => {
    this.ordersLoading = true;
    ajax({
      url: `/tqlab/quartzjob/getStrategyTradeHistory`,
      method: "post",
      data: {
        className: this.currentJob?.className,
        strategyName: this.currentJob?.name,
        jobKey: this.currentJob?.jobKey,
        ...this.cacheOrderConfig,
        ...data,
      },
      success: (data) => {
        this.orders = data;
      },
      effect: () => {
        this.ordersLoading = false;
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

  exportPositionDetail = (strategyId: number) => {
    this.positionLoading = true;
    ajax({
      url: `/tqlab/strategy/exportPositionDetail`,
      method: "post",
      data: { ...this.strategyViewPositionSearchValue, strategyId },
      responseType: "blob",
      success: (data) => {
        const { projectName, className, name } = this.strategyBaseInfo || {};
        resolveBlob(
          data,
          "csv",
          `${projectName}_${className}_${name}_持仓详情`
        );
      },
      effect: () => {
        this.positionLoading = false;
      },
    });
  };

  exportAccountDetail = (strategyId: number) => {
    this.accountLoading = true;
    ajax({
      url: `/tqlab/strategy/exportAccountDetail`,
      method: "post",
      data: { ...this.strategyViewAccountSearchValue, strategyId },
      responseType: "blob",
      success: (data) => {
        const { projectName, className, name } = this.strategyBaseInfo || {};
        resolveBlob(
          data,
          "csv",
          `${projectName}_${className}_${name}_账户详情`
        );
      },
      effect: () => {
        this.accountLoading = false;
      },
    });
  };

  exportOrderDetail = (strategyId: number) => {
    this.orderLoading = true;
    ajax({
      url: `/tqlab/strategy/exportOrderDetail`,
      method: "post",
      data: { ...this.strategyViewOrderSearchValue, strategyId },
      responseType: "blob",
      success: (data) => {
        const { projectName, className, name } = this.strategyBaseInfo || {};
        resolveBlob(
          data,
          "csv",
          `${projectName}_${className}_${name}_订单详情`
        );
      },
      effect: () => {
        this.orderLoading = false;
      },
    });
  };

  getStrategyPerfJsonData = (id: number) => {
    ajax({
      url: `/tqlab/strategy/getStrategyPerfJsonData`,
      params: { strategyId: id },
      success: (data) => {
        this.groupStrategyPerformance = data;
      },
    });
  };

  // 获取解析的yaml文件数据
  getStrategyYamlData = (id: number) => {
    ajax({
      url: `/tqlab/strategy/getStrategyYamlData`,
      params: { projectId: id },
      success: (data) => {
        this.strategyYaml = data;
      },
    });
  };

  updateStrategyYamlData = (data: Partial<StrategyYaml>, id: number) => {
    return ajax({
      url: `/tqlab/strategy/updateStrategyYamlData`,
      method: "post",
      data: { ...data, projectId: id },
      success: () => {
        message.success("配置成功");
      },
    });
  };

  resetCache = () => {
    this.jsonData = null;
    this.cacheLibConfig = {};
    this.cacheProjectConfig = {};
    this.strategyViewAccountSearchValue = defaultStrategyViewAccountSearchValue;
    this.strategyViewPositionSearchValue =
      defaultStrategyViewPositionSearchValue;
    this.strategyViewOrderSearchValue = defaultStrategyViewOrderSearchValue;
    this.cacheJobsConfig = defaultCacheConfig;
    this.pagination = defaultConfig;
    this.activeTab = StrategyResearchTabEnum.ProjectList;
    this.selectedTeam = { id: undefined, name: undefined };
  };
}
