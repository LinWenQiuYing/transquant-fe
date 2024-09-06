import { ajax, Nullable, resolveBlob } from "@transquant/utils";
import { message } from "antd";
import { RcFile } from "antd/es/upload";
import { observable } from "mobx";
import {
  EditWorkflowTimeType,
  IProjectSearch,
  JobDefinitionProject,
  JobDefinitionSearch,
  JobInstanceProject,
  JobInstanceSearch,
  ProjectFormValueType,
  ProjectListItem,
  ProjectListProject,
  UserItem,
  WorkflowDefinitionProject,
  WorkflowDefinitionSearch,
  WorkflowInstanceProject,
  WorkflowInstanceSearch,
  WorkflowTimeProject,
} from "../types";

interface Pagination {
  pageNum: number;
  pageSize: number;
}

export const defaultConfig = {
  pageNum: 1,
  pageSize: 15,
};

export default class ProjectManageStore {
  // 以下是项目管理-列表页
  @observable projectList: Nullable<ProjectListProject> = null;

  @observable projectPagination: Partial<Pagination> = defaultConfig;

  @observable projectSearchConfig: Partial<IProjectSearch> = {};

  @observable projectListLoading: boolean = false;

  @observable projectInfo: Nullable<ProjectListItem> = null;

  @observable users: UserItem[] = [];

  @observable selectedKey: string = "preview";

  onProjectPaginationChange = (config: Partial<Pagination>) => {
    this.projectPagination = { ...this.projectPagination, ...config };
  };

  onProjectSearchConfig = (config: Partial<IProjectSearch>) => {
    this.projectSearchConfig = config;
  };

  onProjectInfo = (data: ProjectListItem) => {
    this.projectInfo = data;
  };

  onSelectedKeysChange = (data: string[]) => {
    const [item] = data;
    this.selectedKey = item;
  };

  getUsers = async () => {
    await ajax({
      url: `/tqdata/users/list`,
      success: (data) => {
        this.users = data;
      },
    });
  };

  getProjectList = (fromManage: boolean = false) => {
    this.projectListLoading = true;
    const url = fromManage ? `/tqdata/projects/admin` : `/tqdata/projects`;
    ajax({
      url,
      params: {
        pageNo: this.projectPagination.pageNum,
        pageSize: this.projectPagination.pageSize,
        searchVal: this.projectSearchConfig.searchVal
          ? this.projectSearchConfig.searchVal
          : "",
      },
      success: (res) => {
        this.projectList = {
          total: res.total,
          list: res.totalList.map((item: any, index: number) => {
            return {
              ...item,
              index: index + 1,
              jobNumber: item.defCount,
              ingNumber: item.instRunningCount,
              desc: item.description || "--",
            };
          }),
        };
      },
      effect: () => {
        this.projectListLoading = false;
      },
    });
  };

  createProject = async (formValues: ProjectFormValueType) => {
    await ajax({
      url: `/tqdata/projects/with-grant-users`,
      method: "post",
      params: {
        projectName: formValues.projectName,
        description: formValues.desc,
      },
      success: () => {
        this.getProjectList();
      },
    });
  };

  editProject = async (code: number, formValues: ProjectFormValueType) => {
    await ajax({
      url: `/tqdata/projects/${code}`,
      method: "put",
      params: {
        code,
        projectName: formValues.projectName,
        description: formValues.desc,
      },
      success: () => {
        this.getProjectList();
      },
    });
  };

  deleteProject = async (code: number) => {
    return await ajax({
      url: `/tqdata/projects/${code}`,
      method: "delete",
    });
  };

  // 以下是项目概览
  @observable flowStatusOptions = [
    { label: "全部状态", value: "" },
    { label: "提交成功", value: "SUBMITTED_SUCCESS" },
    { label: "正在执行", value: "RUNNING_EXECUTION" },
    { label: "准备暂停", value: "READY_PAUSE" },
    { label: "暂停", value: "PAUSE" },
    { label: "准备停止", value: "READY_STOP" },
    { label: "停止", value: "STOP" },
    { label: "失败", value: "FAILURE" },
    { label: "成功", value: "SUCCESS" },
    { label: "延时执行", value: "DELAY_EXECUTION" },
    { label: "串行等待", value: "SERIAL_WAIT" },
    { label: "准备锁定", value: "READY_BLOCK" },
    { label: "锁定", value: "BLOCK" },
    { label: "等待执行", value: "WAIT_TO_RUN" },
  ];

  @observable taskStatusOptions = [
    { label: "提交成功", value: "SUBMITTED_SUCCESS" },
    { label: "正在执行", value: "RUNNING_EXECUTION" },
    { label: "暂停", value: "PAUSE" },
    { label: "停止", value: "STOP" },
    { label: "失败", value: "FAILURE" },
    { label: "成功", value: "SUCCESS" },
    { label: "需要容错", value: "NEED_FAULT_TOLERANCE" },
    { label: "Kill", value: "KILL" },
    { label: "延时执行", value: "DELAY_EXECUTION" },
    { label: "强制成功", value: "FORCED_SUCCESS" },
    { label: "派发", value: "DISPATCH" },
  ];

  getDefineUserCount = async () => {
    return await ajax({
      url: `/tqdata/projects/analysis/define-user-count`,
      params: {
        projectCode: this.projectInfo?.code,
      },
    });
  };

  getProcessStateCount = async (startDate?: string, endDate?: string) => {
    return await ajax({
      url: `/tqdata/projects/analysis/process-state-count`,
      params: {
        projectCode: this.projectInfo?.code,
        startDate,
        endDate,
      },
    });
  };

  getTaskStateCount = async (startDate?: string, endDate?: string) => {
    return await ajax({
      url: `/tqdata/projects/analysis/task-state-count`,
      params: {
        projectCode: this.projectInfo?.code,
        startDate,
        endDate,
      },
    });
  };

  // 以下是工作流定义
  @observable workflowDefinition: Nullable<WorkflowDefinitionProject> = null;

  @observable workflowDefinitionLoading: boolean = false;

  @observable workflowDefinitionPagination: Partial<Pagination> = defaultConfig;

  @observable workflowDefinitionSearchConfig: WorkflowDefinitionSearch = {
    searchVal: "",
  };

  @observable timeList: string[] = [];

  resetTimeList = () => {
    this.timeList = [];
  };

  onWorkflowDefinitionPagination = (config: Partial<Pagination>) => {
    this.workflowDefinitionPagination = {
      ...this.workflowDefinitionPagination,
      ...config,
    };
  };

  onWorkflowDefinitionSearchConfig = (config: WorkflowDefinitionSearch) => {
    this.workflowDefinitionSearchConfig = config;
  };

  startProcessInstance = async (json: any) => {
    const formData = new FormData();
    formData.append("execType", json.execType);
    formData.append("executionOrder", json.executionOrder);
    formData.append(
      "expectedParallelismNumber",
      json.expectedParallelismNumber
    );
    formData.append("failureStrategy", json.failureStrategy);
    formData.append("processDefinitionCode", json.processDefinitionCode);
    formData.append("processInstancePriority", json.processInstancePriority);
    formData.append("runMode", json.runMode);
    formData.append("scheduleTime", json.scheduleTime);
    formData.append("startParams", json.startParams);
    formData.append("warningType", json.warningType);
    formData.append("warningGroupId", json.warningGroupId);
    formData.append("email", json.email);

    await ajax({
      url: `/tqdata/projects/${this.projectInfo?.code}/executors/start-process-instance`,
      method: "post",
      data: formData,
      success: () => {
        message.success("运行成功！");
        this.getWorkflowDefinition();
      },
    });
  };

  previewTime = async (schedule: string) => {
    const formData = new FormData();
    formData.append("schedule", schedule);

    await ajax({
      url: `/tqdata/projects/${this.projectInfo?.code}/schedules/preview`,
      method: "post",
      data: formData,
      success: (res: any) => {
        this.timeList = res;
      },
    });
  };

  operateWorkflowDefinitionTime = async (id: number, type: string) => {
    await ajax({
      url: `/tqdata/projects/${this.projectInfo?.code}/schedules/${id}/${type}`,
      method: "post",
      success: () => {
        this.getWorkflowDefinition();
      },
    });
  };

  grantProject = (data: { userIds: number[]; projectId: number }) => {
    return ajax({
      url: `/tqdata/users/grant-project-with-users`,
      method: "post",
      headers: {
        "Content-Type": "multipart/form-data;",
      },
      data: {
        projectId: data.projectId,
        userIds: data.userIds.join(","),
      },
      success: () => {
        message.success("操作成功");
      },
    });
  };

  getWorkflowDefinition = () => {
    this.workflowDefinitionLoading = true;
    ajax({
      url: `/tqdata/projects/${this.projectInfo?.code}/process-definition`,
      params: {
        ...this.workflowDefinitionSearchConfig,
        pageNo: this.workflowDefinitionPagination.pageNum,
        pageSize: this.workflowDefinitionPagination.pageSize,
      },
      success: (res) => {
        this.workflowDefinition = {
          total: res.total,
          list: res.totalList.map((item: any, index: number) => {
            return {
              ...item,
              index: index + 1,
              status: item.releaseState,
              desc: item.description,
              schedule: item.schedule,
              timeStatus: item.scheduleReleaseState,
            };
          }),
        };
      },
      effect: () => {
        this.workflowDefinitionLoading = false;
      },
    });
  };

  deleteWorkflowDefinition = async (code: number) => {
    return await ajax({
      url: `/tqdata/projects/${this.projectInfo?.code}/process-definition/${code}`,
      method: "delete",
    });
  };

  operateWorkflowDefinition = async (code: number, status: string) => {
    await ajax({
      url: `/tqdata/projects/${this.projectInfo?.code}/process-definition/${code}/release`,
      method: "post",
      params: {
        releaseState: status,
      },
      success: () => {
        this.getWorkflowDefinition();
      },
    });
  };

  getWorkflowDefinitionVersions = async (code: number, pageNo: number) => {
    return await ajax({
      url: `/tqdata/projects/${this.projectInfo?.code}/process-definition/${code}/versions`,
      params: {
        pageNo,
        pageSize: 10,
      },
    });
  };

  switchWorkflowDefinitionVersions = async (code: number, version: number) => {
    return await ajax({
      url: `/tqdata/projects/${this.projectInfo?.code}/process-definition/${code}/versions/${version}`,
    });
  };

  deleteWorkflowDefinitionVersions = async (code: number, version: number) => {
    return await ajax({
      url: `/tqdata/projects/${this.projectInfo?.code}/process-definition/${code}/versions/${version}`,
      method: "delete",
    });
  };

  // 以下是工作流实例
  @observable workflowInstance: Nullable<WorkflowInstanceProject> = null;

  @observable workflowInstanceLoading: boolean = false;

  @observable workflowInstancePagination: Partial<Pagination> = defaultConfig;

  @observable workflowInstanceSearchConfig: WorkflowInstanceSearch = {};

  @observable failureStrategy: Record<string, string> = {
    CONTINUE: "继续",
    END: "结束",
  };

  @observable commandType: Record<string, string> = {
    START_PROCESS: "启动工作流",
    START_CURRENT_TASK_PROCESS: "从当前节点开始执行",
    RECOVER_TOLERANCE_FAULT_PROCESS: "恢复被容错的工作流",
    RECOVER_SUSPENDED_PROCESS: "恢复运行流程",
    START_FAILURE_TASK_PROCESS: "从失败节点开始执行",
    COMPLEMENT_DATA: "补数",
    SCHEDULER: "调度执行",
    REPEAT_RUNNING: "重跑",
    PAUSE: "暂停",
    STOP: "停止",
    RECOVER_WAITING_THREAD: "恢复等待线程",
    RECOVER_SERIAL_WAIT: "串行恢复",
    EXECUTE_TASK: "执行指定任务",
    DYNAMIC_GENERATION: "动态生成",
  };

  @observable releaseState: Record<string, string> = {
    ONLINE: "上线",
    OFFLINE: "下线",
  };

  onWorkflowInstancePagination = (config: Partial<Pagination>) => {
    this.workflowInstancePagination = {
      ...this.workflowInstancePagination,
      ...config,
    };
  };

  onWorkflowInstanceSearchConfig = (config: WorkflowInstanceSearch) => {
    this.workflowInstanceSearchConfig = config;
  };

  getWorkflowInstance = () => {
    this.workflowInstanceLoading = true;
    ajax({
      url: `/tqdata/projects/${this.projectInfo?.code}/process-instances`,
      params: {
        ...this.workflowInstanceSearchConfig,
        pageNo: this.workflowInstancePagination.pageNum,
        pageSize: this.workflowInstancePagination.pageSize,
      },
      success: (res) => {
        this.workflowInstance = {
          total: res.total,
          list: res.totalList.map((item: any, index: number) => {
            return {
              ...item,
              index: index + 1,
              code: item.processDefinitionCode,
              status: item.state,
              runType: item.commandType,
              useTime: item.scheduleTime,
              runTime: item.duration,
              runs: item.runTimes,
            };
          }),
        };
      },
      effect: () => {
        this.workflowInstanceLoading = false;
      },
    });
  };

  importWorkflow = async (file: RcFile) => {
    return await ajax({
      url: `/tqdata/projects/${this.projectInfo?.code}/process-definition/import`,
      method: "post",
      data: { file },
      headers: {
        "Content-Type": "multipart/form-data;",
      },
      success: () => {
        message.success("导入成功");
        this.getWorkflowDefinition();
      },
    });
  };

  batchExport = async (codes: string[]) => {
    return await ajax({
      url: `/tqdata/projects/${this.projectInfo?.code}/process-definition/batch-export`,
      method: "post",
      data: { codes: codes.join(",") },
      headers: {
        "Content-Type": "multipart/form-data;",
      },
      success: (data) => {
        resolveBlob(JSON.stringify(data), "json", `workflow_${Date.now()}`);
        message.success("导出成功");
      },
    });
  };

  batchDelete = async (codes: string[]) => {
    return await ajax({
      url: `/tqdata/projects/${this.projectInfo?.code}/process-definition/batch-delete`,
      method: "post",
      data: { codes: codes.join(",") },
      headers: {
        "Content-Type": "multipart/form-data;",
      },
      success: () => {
        message.success("删除成功");
        this.getWorkflowDefinition();
      },
    });
  };

  getWorkFlowDefinitionList = async () => {
    return await ajax({
      url: `/tqdata/projects/${this.projectInfo?.code}/process-definition/query-process-definition-list`,
    });
  };

  handleOperate = async (id: number, executeType: string) => {
    const formData = new FormData();
    formData.append("processInstanceId", id);
    formData.append("executeType", executeType);

    await ajax({
      url: `/tqdata/projects/${this.projectInfo?.code}/executors/execute`,
      method: "post",
      data: formData,
      success: () => {
        message.success("操作成功！");
        this.getWorkflowInstance();
      },
    });
  };

  handleDelete = async (id: number) => {
    return await ajax({
      url: `/tqdata/projects/${this.projectInfo?.code}/process-instances/${id}`,
      method: "delete",
    });
  };

  // 以下是工作流定时
  @observable workflowTime: Nullable<WorkflowTimeProject> = null;

  @observable workflowTimeLoading: boolean = false;

  @observable workflowTimePagination: Partial<Pagination> = defaultConfig;

  @observable flowValue: number | undefined = undefined;

  onWorkflowTimePagination = (config: Partial<Pagination>) => {
    this.workflowTimePagination = {
      ...this.workflowTimePagination,
      ...config,
    };
  };

  onFlowValue = (value: number | undefined) => {
    this.flowValue = value;
  };

  getWorkflowTime = () => {
    this.workflowTimeLoading = true;
    ajax({
      url: `/tqdata/projects/${this.projectInfo?.code}/schedules`,
      params: {
        processDefinitionCode: this.flowValue,
        projectCode: this.projectInfo?.code,
        pageNo: this.workflowTimePagination.pageNum,
        pageSize: this.workflowTimePagination.pageSize,
      },
      success: (res) => {
        this.workflowTime = {
          total: res.total,
          list: res.totalList.map((item: any, index: number) => {
            return {
              ...item,
              index: index + 1,
              code: item.processDefinitionCode,
              status: item.releaseState,
              name: item.processDefinitionName,
              failStrategy: item.failureStrategy,
              priority: item.processInstancePriority,
            };
          }),
        };
      },
      effect: () => {
        this.workflowTimeLoading = false;
      },
    });
  };

  handleWorkflowCreateTimeRun = async (json: EditWorkflowTimeType) => {
    const formData = new FormData();
    formData.append("schedule", json.schedule);
    formData.append("warningType", json.warningType);
    formData.append("warningGroupId", json.warningGroupId);
    formData.append("failureStrategy", json.failureStrategy);
    formData.append("workerGroup", json.workerGroup);
    formData.append("tenantCode", json.tenantCode);
    formData.append("environmentCode", json.environmentCode);
    formData.append("processInstancePriority", json.processInstancePriority);
    formData.append("processDefinitionCode", json.processDefinitionCode);
    formData.append("email", json.email);
    await ajax({
      url: `/tqdata/projects/${this.projectInfo?.code}/schedules`,
      method: "post",
      data: formData,
      success: () => {
        message.success("修改成功！");
        this.getWorkflowTime();
      },
    });
  };

  handleWorkflowSetTimeRun = async (json: EditWorkflowTimeType) => {
    const formData = new FormData();
    formData.append("id", json.id);
    formData.append("schedule", json.schedule);
    formData.append("warningType", json.warningType);
    formData.append("warningGroupId", json.warningGroupId);
    formData.append("failureStrategy", json.failureStrategy);
    formData.append("workerGroup", json.workerGroup);
    formData.append("tenantCode", json.tenantCode);
    formData.append("environmentCode", json.environmentCode);
    formData.append("processInstancePriority", json.processInstancePriority);
    formData.append("email", json.email);

    await ajax({
      url: `/tqdata/projects/${this.projectInfo?.code}/schedules/${json.id}`,
      method: "put",
      data: formData,
      success: () => {
        message.success("修改成功！");
        this.getWorkflowTime();
      },
    });
  };

  onlineWorkflowTime = async (id: number) => {
    await ajax({
      url: `/tqdata/projects/${this.projectInfo?.code}/schedules/${id}/online`,
      method: "post",
      success: () => {
        message.success("上线成功！");
        this.getWorkflowTime();
      },
    });
  };

  offlineWorkflowTime = async (id: number) => {
    await ajax({
      url: `/tqdata/projects/${this.projectInfo?.code}/schedules/${id}/offline`,
      method: "post",
      success: () => {
        message.success("下线成功！");
        this.getWorkflowTime();
      },
    });
  };

  deleteWorkflowTime = async (id: number) => {
    return await ajax({
      url: `/tqdata/projects/${this.projectInfo?.code}/schedules/${id}`,
      method: "delete",
    });
  };

  // 以下是任务定义
  @observable jobDefinition: Nullable<JobDefinitionProject> = null;

  @observable jobDefinitionLoading: boolean = false;

  @observable jobDefinitionPagination: Partial<Pagination> = defaultConfig;

  @observable jobDefinitionSearchConfig: JobDefinitionSearch = {
    searchVal: "",
    jobType: undefined,
  };

  @observable workflowStatus: Record<string, string> = {
    ONLINE: "已上线",
    OFFLINE: "已下线",
  };

  @observable jobTypeOptionsMap = {
    JAVA: {
      alias: "JAVA",
    },
    SHELL: {
      alias: "SHELL",
    },
    SUB_PROCESS: {
      alias: "SUB_PROCESS",
    },
    DYNAMIC: {
      alias: "DYNAMIC",
    },
    PROCEDURE: {
      alias: "PROCEDURE",
    },
    SQL: {
      alias: "SQL",
    },
    SPARK: {
      alias: "SPARK",
    },
    FLINK: {
      alias: "FLINK",
    },
    MR: {
      alias: "MapReduce",
      helperLinkDisable: true,
    },
    PYTHON: {
      alias: "PYTHON",
    },
    DEPENDENT: {
      alias: "DEPENDENT",
    },
    HTTP: {
      alias: "HTTP",
    },
    DATAX: {
      alias: "DataX",
    },
    PIGEON: {
      alias: "PIGEON",
    },
    SQOOP: {
      alias: "SQOOP",
      helperLinkDisable: true,
    },
    CONDITIONS: {
      alias: "CONDITIONS",
    },
    DATA_QUALITY: {
      alias: "DATA_QUALITY",
      helperLinkDisable: true,
    },
    SWITCH: {
      alias: "SWITCH",
    },
    SEATUNNEL: {
      alias: "SeaTunnel",
      helperLinkDisable: true,
    },
    EMR: {
      alias: "AmazonEMR",
      helperLinkDisable: true,
    },
    ZEPPELIN: {
      alias: "ZEPPELIN",
      helperLinkDisable: true,
    },
    JUPYTER: {
      alias: "JUPYTER",
      helperLinkDisable: true,
    },
    K8S: {
      alias: "K8S",
      helperLinkDisable: true,
    },
    MLFLOW: {
      alias: "MLFLOW",
      helperLinkDisable: true,
    },
    OPENMLDB: {
      alias: "OPENMLDB",
      helperLinkDisable: true,
    },
    DVC: {
      alias: "DVC",
      helperLinkDisable: true,
    },
    DINKY: {
      alias: "DINKY",
      helperLinkDisable: true,
    },
    SAGEMAKER: {
      alias: "SageMaker",
      helperLinkDisable: true,
    },
    CHUNJUN: {
      alias: "CHUNJUN",
      helperLinkDisable: true,
    },
    FLINK_STREAM: {
      alias: "FLINK_STREAM",
      helperLinkDisable: true,
      taskExecuteType: "STREAM",
    },
    PYTORCH: {
      alias: "Pytorch",
      helperLinkDisable: true,
    },
    HIVECLI: {
      alias: "HIVECLI",
      helperLinkDisable: true,
    },
    DMS: {
      alias: "DMS",
      helperLinkDisable: true,
    },
    DATASYNC: {
      alias: "DATASYNC",
      helperLinkDisable: true,
    },
    KUBEFLOW: {
      alias: "KUBEFLOW",
      helperLinkDisable: true,
    },
    LINKIS: {
      alias: "LINKIS",
      helperLinkDisable: true,
    },
    DATA_FACTORY: {
      alias: "DATA_FACTORY",
      helperLinkDisable: true,
    },
    REMOTESHELL: {
      alias: "REMOTESHELL",
      helperLinkDisable: true,
    },
  };

  onJobDefinitionPagination = (config: Partial<Pagination>) => {
    this.jobDefinitionPagination = {
      ...this.jobDefinitionPagination,
      ...config,
    };
  };

  onJobDefinitionSearchConfig = (config: JobDefinitionSearch) => {
    this.jobDefinitionSearchConfig = config;
  };

  getJobDefinition = () => {
    this.jobDefinitionLoading = true;
    ajax({
      url: `/tqdata/projects/${this.projectInfo?.code}/task-definition`,
      params: {
        searchTaskName: this.jobDefinitionSearchConfig.searchVal,
        taskType: this.jobDefinitionSearchConfig.jobType,
        pageNo: this.jobDefinitionPagination.pageNum,
        pageSize: this.jobDefinitionPagination.pageSize,
      },
      success: (res) => {
        this.jobDefinition = {
          total: res.total,
          list: res.totalList.map((item: any, index: number) => {
            return {
              ...item,
              index: index + 1,
              jobName: item.taskName,
              jobCode: item.taskCode,
              workflowName: item.processDefinitionName,
              workflowCode: item.processDefinitionCode,
              workflowStatus: item.processReleaseState,
              jobType: item.taskType,
              version: item.taskVersion,
              upstreamTasks: item.upstreamTaskName,
              createTime: item.taskCreateTime,
              updateTime: item.taskUpdateTime,
            };
          }),
        };
      },
      effect: () => {
        this.jobDefinitionLoading = false;
      },
    });
  };

  getJobDefinitionVersions = async (code: number, pageNo: number) => {
    return await ajax({
      url: `/tqdata/projects/${this.projectInfo?.code}/task-definition/${code}/versions`,
      params: {
        pageNo,
        pageSize: 10,
      },
    });
  };

  switchJobDefinitionVersions = async (code: number, version: number) => {
    return await ajax({
      url: `/tqdata/projects/${this.projectInfo?.code}/task-definition/${code}/versions/${version}`,
    });
  };

  deleteJobDefinition = async (code: number) => {
    return await ajax({
      url: `/tqdata/projects/${this.projectInfo?.code}/task-definition/${code}`,
      method: "delete",
    });
  };

  deleteJobDefinitionVersions = async (code: number, version: number) => {
    return await ajax({
      url: `/tqdata/projects/${this.projectInfo?.code}/task-definition/${code}/versions/${version}`,
      method: "delete",
    });
  };

  // 以下是任务实例
  @observable jobInstance: Nullable<JobInstanceProject> = null;

  @observable jobInstanceLoading: boolean = false;

  @observable jobInstancePagination: Partial<Pagination> = defaultConfig;

  @observable jobInstanceSearchConfig: JobInstanceSearch = {
    searchVal: "",
    workflowInstance: "",
    status: undefined,
    startDate: undefined,
    endDate: undefined,
  };

  onJobInstancePagination = (config: Partial<Pagination>) => {
    this.jobInstancePagination = {
      ...this.jobInstancePagination,
      ...config,
    };
  };

  onJobInstanceSearchConfig = (config: JobInstanceSearch) => {
    this.jobInstanceSearchConfig = config;
  };

  getJobInstance = () => {
    this.jobInstanceLoading = true;
    ajax({
      url: `/tqdata/projects/${this.projectInfo?.code}/task-instances`,
      params: {
        searchVal: this.jobInstanceSearchConfig.searchVal,
        processInstanceName: this.jobInstanceSearchConfig.workflowInstance,
        startDate: this.jobInstanceSearchConfig.startDate,
        endDate: this.jobInstanceSearchConfig.endDate,
        stateType: this.jobInstanceSearchConfig.status,
        pageNo: this.jobInstancePagination.pageNum,
        pageSize: this.jobInstancePagination.pageSize,
      },
      success: (res) => {
        this.jobInstance = {
          total: res.total,
          list: res.totalList.map((item: any, index: number) => {
            return {
              ...item,
              index: index + 1,
              code: item.projectCode,
              jobName: item.name,
              workflowId: item.processInstanceId,
              workflowName: item.processInstanceName,
              excuteUser: item.executorName,
              nodeType: item.taskType,
              status: item.state,
              submitTime: item.firstSubmitTime,
              runTime: item.duration,
            };
          }),
        };
      },
      effect: () => {
        this.jobInstanceLoading = false;
      },
    });
  };

  checkLog = async (id: number) => {
    return await ajax({
      url: `/tqdata/log/detail`,
      params: {
        taskInstanceId: id,
        skipLineNum: 0,
        limit: 1000,
      },
    });
  };

  downloadLog = async (id: number) => {
    ajax({
      url: `/tqdata/log/download-log`,
      params: {
        taskInstanceId: id,
      },
      responseType: "blob",
      success: (data) => {
        resolveBlob(data, "txt", "任务日志");
      },
    });
  };

  handleForceSuccess = async (id: number) => {
    ajax({
      url: `/tqdata/projects/${this.projectInfo?.code}/task-instances/${id}/force-success`,
      method: "post",
      success: () => {
        this.getJobInstance();
      },
    });
  };
}
