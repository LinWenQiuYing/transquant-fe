export interface ProjectFormValueType {
  projectName: string;
  desc: string | undefined;
}

export interface ProjectListItem {
  id: number;
  code: number;
  index: number;
  name: string;
  jobNumber: number;
  ingNumber: number;
  desc: string;
  createTime: string;
  updateTime: string;
}

export interface ProjectListProject {
  total: number;
  list: ProjectListItem[];
}

export interface ViewItemType {
  number: number;
  status: string;
}

export interface BarDataType {
  count: number;
  userList: ViewItemType[];
}

export interface PieDataType {
  total: number;
  data: ViewItemType[];
}

export interface WorkflowInstanceItem {
  id: number;
  index: number;
  code: number;
  name: string;
  status: string;
  runType: string;
  useTime: string;
  startTime: string;
  endTime: string;
  runTime: string;
  runs: string;
}

export interface WorkflowInstanceProject {
  total: number;
  list: WorkflowInstanceItem[];
}

export interface WorkflowInstanceSearch {
  processDefineCode?: number;
  searchVal?: string;
  executorName?: string;
  stateType?: string;
  host?: string;
  startDate?: string;
  endDate?: string;
  otherParamsJson?: string;
}

export interface WorkflowTimeItem {
  id: number;
  index: number;
  code: number;
  name: string;
  startTime: string;
  endTime: string;
  crontab: string;
  failStrategy: string;
  priority: string;
  status: string;
  createTime: string;
  updateTime: string;
  warningType: string;
  warningGroupId: number;
  workerGroup: string;
  tenantCode: string;
  environmentCode: number;
}

export interface EditWorkflowTimeType {
  id: number;
  schedule: string;
  failureStrategy: string;
  warningType: string;
  email: string;
  processInstancePriority: string;
  warningGroupId: number;
  workerGroup: string;
  tenantCode: string;
  environmentCode: number | string;
  processDefinitionCode?: number;
}

export interface WorkflowTimeProject {
  total: number;
  list: WorkflowTimeItem[];
}

export interface JobDefinitionItem {
  id: number;
  index: number;
  jobName: string;
  jobCode: number;
  workflowName: string;
  workflowCode: number;
  workflowStatus: string;
  jobType: string;
  version: number;
  upstreamTasks: string;
  createTime: string;
  updateTime: string;
}
export interface JobDefinitionProject {
  total: number;
  list: JobDefinitionItem[];
}

export interface JobDefinitionSearch {
  searchVal: string;
  jobType: string | undefined;
}

export interface JobInstanceItem {
  id: number;
  code: number;
  index: number;
  jobName: string;
  workflowId: number;
  workflowName: string;
  excuteUser: string;
  nodeType: string;
  status: string;
  submitTime: string;
  startTime: string;
  endTime: string;
  runTime: string;
  host: string;
}
export interface JobInstanceProject {
  total: number;
  list: JobInstanceItem[];
}

export interface JobInstanceSearch {
  searchVal: string;
  workflowInstance: string;
  status: string | undefined;
  startDate: string | undefined;
  endDate: string | undefined;
}

export interface WorkflowDefinitionItem {
  id: number;
  code: number;
  index: number;
  name: string;
  status: string;
  schedule: any;
  timeStatus: string;
  createTime: string;
  updateTime: string;
  desc: string;
  version: number;
}
export interface WorkflowDefinitionProject {
  total: number;
  list: WorkflowDefinitionItem[];
}

export interface WorkflowDefinitionSearch {
  searchVal: string;
}

export default {};
