import { Label } from "@transquant/ui";
import { ajax, DataType, Nullable, resolveBlob } from "@transquant/utils";
import { message } from "antd";
import dayjs from "dayjs";
import { observable } from "mobx";
import { IncreTrackingValue } from "../incre-tracking-modal";
import { IncreOrderSearch } from "../personal/strategy-incre/incre-tracking-view/Order";
import { IJobsLibSearch } from "../personal/strategy-incre/incre-tracking/SearchHeader";
import { IProjectSearch } from "../personal/strategy-research/project-list/SearchHeader";
import { IStrategyLibSearch } from "../personal/strategy-research/strategy-lib/SearchHeader";
import { IAccountSearch } from "../personal/strategy-research/strategy-view/Account";
import { IPositionSearch } from "../personal/strategy-research/strategy-view/Position";
import { StrategyResearchTabEnum } from "../personal/strategy-research/TabView";
import {
  Account,
  CodeTree,
  FileList,
  ITemplate,
  Job,
  Log,
  Order,
  Position,
  Project,
  StrategyKPI,
  StrategyPnl,
  StrategyReturn,
} from "../types";
import {
  AccountTable,
  OrderTable,
  PositionTable,
  StrategyBaseInfo,
  StrategyJob,
  StrategyLib,
  StrategyLibItem,
  StrategyYaml,
} from "../types/strategy";
import { TagEnum } from "./FactorResearch";

export const defaultConfig = {
  pageNum: 1,
  pageSize: 15,
};

interface Pagination {
  pageNum: number;
  pageSize: number;
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

export default class StrategyResearchStore {
  @observable projects: Nullable<Project> = null;

  @observable templates: ITemplate[] = [];

  @observable strategyLib: Nullable<StrategyLib> = null;

  // 详情数据预览
  @observable loading: boolean = false;

  @observable strategyProjectListLoading: boolean = false;

  @observable strategyLibLoading: boolean = false;

  @observable strategyViewPositionSearchValue: Partial<IPositionSearch> =
    defaultStrategyViewPositionSearchValue;

  @observable strategyViewAccountSearchValue: Partial<IAccountSearch> =
    defaultStrategyViewAccountSearchValue;

  @observable strategyViewOrderSearchValue: Partial<IncreOrderSearch> =
    defaultStrategyViewOrderSearchValue;

  // 查询时tag
  @observable tags: Label[] = [];

  // 新建下拉时tag
  @observable allTags: Label[] = [];

  @observable files: Nullable<FileList> = null;

  @observable strategyBaseInfo: Nullable<StrategyBaseInfo> = null;

  @observable jsonData: any = null;

  @observable projectMarkdown: { desc: string; path: string } = {
    desc: "",
    path: "",
  };

  @observable jobs: StrategyJob[] = [];

  @observable strategyQuartzJobLoading: boolean = false;

  @observable cacheJobsConfig: Partial<IJobsLibSearch> = {
    pageNum: 1,
    pageSize: 15,
  };

  @observable cacheLibConfig: Partial<IStrategyLibSearch> = {};

  @observable cacheProjectConfig: Partial<IProjectSearch> = {};

  @observable cacheOrderConfig: Partial<IncreOrderSearch> = {
    timeRangeType: 0,
  };

  @observable pagination: Partial<Pagination> = defaultConfig;

  @observable strategyResultList: StrategyLibItem[] = [];

  @observable positionTable: PositionTable[] = [];

  @observable positionTableLoading: boolean = false;

  @observable accountTable: AccountTable[] = [];

  @observable accountTableLoading: boolean = false;

  @observable orderTable: Nullable<OrderTable> = null;

  @observable orderTableLoading: boolean = false;

  @observable currentJob: Nullable<DataType<Job>> = null;

  @observable strategyKPI: Nullable<StrategyKPI> = null;

  @observable strategyReturnList: StrategyReturn[] = [];

  @observable strategyPnlList: StrategyPnl[] = [];

  @observable positions: Position[] = [];

  @observable positionsLoading: boolean = false;

  @observable accounts: Account[] = [];

  @observable accountsLoading: boolean = false;

  @observable orders: Nullable<Order> = null;

  @observable ordersLoading: boolean = false;

  @observable codeTree: CodeTree[] = [];

  @observable codeTreeLoading: boolean = false;

  @observable fileContent: string = "";

  @observable fileContentLoading: boolean = false;

  @observable logs: Log[] = [];

  @observable logsLoading: boolean = false;

  @observable logContent: string = "";

  @observable commandLogContent: string = "";

  @observable positionLoading: boolean = false;

  @observable accountLoading: boolean = false;

  @observable strategyPerformance: string = "{}";

  @observable orderLoading: boolean = false;

  @observable strategyYaml: Nullable<StrategyYaml> = null;

  @observable activeTab: StrategyResearchTabEnum =
    StrategyResearchTabEnum.ProjectList;

  setActiveTab = (activeTab: StrategyResearchTabEnum) => {
    this.activeTab = activeTab;
  };

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

  onStrategyTabChange = (key: string) => {
    this.resetCache();
    this.setActiveTab(key as StrategyResearchTabEnum);
  };

  onCurrentJobChange = (job: DataType<Job>) => {
    this.currentJob = job;
  };

  onCacheJobsConfig = (config: Partial<IJobsLibSearch>) => {
    this.cacheJobsConfig = config;
  };

  onCacheLibConfigChange = (config: Partial<IStrategyLibSearch>) => {
    this.cacheLibConfig = config;
  };

  onCacheProjectConfig = (config: Partial<IProjectSearch>) => {
    this.cacheProjectConfig = config;
  };

  onCacheOrderConfig = (config: Partial<IncreOrderSearch>) => {
    this.cacheOrderConfig = config;
  };

  onPaginationChange = (config: Partial<Pagination>) => {
    const _pagination = { ...this.pagination, ...config };

    this.pagination = _pagination;
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
        const { jobName, className, name } = this.currentJob || {};
        resolveBlob(data, "csv", `${jobName}_${className}_${name}_持仓详情`);
      },
      effect: () => {
        this.positionLoading = false;
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
        this.getStrategyQuartzJob();
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
        const { jobName, className, name } = this.currentJob || {};
        resolveBlob(data, "csv", `${jobName}_${className}_${name}_账户详情`);
      },
      effect: () => {
        this.accountLoading = false;
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
        const { jobName, className, name } = this.currentJob || {};
        resolveBlob(data, "csv", `${jobName}_${className}_${name}_订单详情`);
      },
      effect: () => {
        this.orderLoading = false;
      },
    });
  };

  getStrategyProject = (data: Partial<IProjectSearch>) => {
    this.strategyProjectListLoading = true;
    ajax({
      url: `/tqlab/strategy/getStrategyProject`,
      method: "post",
      data: { ...this.cacheProjectConfig, ...data },
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

  getTags = async () => {
    await ajax({
      url: `/tqlab/tag/getTags`,
      success: (data) => {
        this.allTags = data;
      },
    });
  };

  // 新建策略项目
  createStrategyProject = (data: {
    comment: string;
    projectName: string;
    tags: Label[];
    templateId: number;
  }) => {
    ajax({
      url: `/tqlab/strategy/createStrategyProject`,
      method: "post",
      data,
      success: () => {
        message.success("新建成功");
        this.getStrategyProject(defaultConfig);
      },
    });
  };

  // 更新策略项目
  updateStrategyProject = (data: {
    comment: string;
    projectId: number;
    tags: Label[];
  }) => {
    ajax({
      url: `/tqlab/strategy/updateStrategyProject`,
      method: "post",
      data,
      success: () => {
        message.success("更新成功");
        this.getStrategyProject(defaultConfig);
      },
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

  getStrategyProjectFileList = (projectId: number) => {
    ajax({
      url: `/tqlab/strategy/getStrategyProjectFileList`,
      params: { projectId },
      success: (data) => {
        this.files = data;
      },
    });
  };

  // 获取项目描述
  getProjectDesc = (projectId: number) => {
    ajax({
      url: `/tqlab/strategy/getProjectDesc`,
      params: { projectId },
      success: (data) => {
        this.projectMarkdown = data;
      },
    });
  };

  deleteStrategyProject = (projectId: number) => {
    ajax({
      url: `/tqlab/strategy/deleteStrategyProject`,
      method: "delete",
      params: { projectId },
      success: () => {
        this.getStrategyProject(defaultConfig);
        message.success("删除成功");
      },
    });
  };

  // 获取因子库列表
  getStrategyResultList = (data: Partial<IStrategyLibSearch>) => {
    this.strategyLibLoading = true;
    ajax({
      url: `/tqlab/strategy/getStrategyResultList`,
      method: "post",
      data: { ...this.cacheLibConfig, ...data },
      success: (data) => {
        this.strategyLib = data;
      },
      effect: () => {
        this.strategyLibLoading = false;
      },
    });
  };

  // 设置策略标签
  updateFactorTags = (data: { id: number; tags: string[] }) => {
    ajax({
      url: `/tqlab/strategy/updateStrategyTags`,
      method: "post",
      data,
      success: () => {
        message.success("标签设置成功");
        this.getStrategyResultList({ pageNum: 1, pageSize: 15 });
        this.getTagsByType(TagEnum.BACKTEST);
      },
    });
  };

  // 获取策略json数据
  getStrategyJsonData = (strategyId: number) => {
    this.loading = true;
    ajax({
      url: `/tqlab/strategy/getStrategyJsonData`,
      params: { strategyId },
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
  getPositionDetail = (
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
  getAccountDetail = (
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
  getOrderDetail = (
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

  // 根据项目获取因子库列表
  getStrategyResultListByProjectId = async (projectId: number) => {
    await ajax({
      url: `/tqlab/strategy/getStrategyResultListByProjectId`,
      params: { projectId },
      success: (data) => {
        this.strategyResultList = data;
      },
    });
  };

  // 获取策略增量跟踪列表
  getStrategyQuartzJob = (data?: Partial<IJobsLibSearch>) => {
    this.strategyQuartzJobLoading = true;
    ajax({
      url: `/tqlab/quartzjob/getStrategyQuartzJob`,
      method: "post",
      data: { ...this.cacheJobsConfig, ...data },
      success: (data) => {
        this.jobs = data;
      },
      effect: () => {
        this.strategyQuartzJobLoading = false;
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
        this.getStrategyQuartzJob(this.cacheJobsConfig);
        this.getTagsByType(TagEnum.INCRETRACKING);
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
        message.success("结束任务成功");
        this.getStrategyQuartzJob(this.cacheJobsConfig);
      },
    });
  };

  // 启动定时任务
  startQuartzJob = (quartzJobId: number) => {
    ajax({
      url: `/tqlab/quartzjob/startQuartzJob`,
      params: { quartzJobId },
      success: () => {
        this.getStrategyQuartzJob(this.cacheJobsConfig);
        message.success("启动成功");
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
        this.getStrategyQuartzJob(this.cacheJobsConfig);
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
    });
  };

  // 获取收益详情-每日损益
  getDailyPnlList = () => {
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
        this.strategyPerformance = data;
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
    this.cacheLibConfig = {};
    this.cacheProjectConfig = {};
    this.cacheJobsConfig = {};
    this.strategyViewAccountSearchValue = defaultStrategyViewAccountSearchValue;
    this.strategyViewPositionSearchValue =
      defaultStrategyViewPositionSearchValue;
    this.strategyViewOrderSearchValue = defaultStrategyViewOrderSearchValue;
    this.pagination = defaultConfig;
    this.activeTab = StrategyResearchTabEnum.ProjectList;
    this.jsonData = null;
  };
}
