/* eslint-disable camelcase */
export type TaskType =
  | "SHELL"
  | "SUB_PROCESS"
  | "DYNAMIC"
  | "PROCEDURE"
  | "SQL"
  | "SPARK"
  | "FLINK"
  | "MR"
  | "PYTHON"
  | "DEPENDENT"
  | "HTTP"
  | "DATAX"
  | "PIGEON"
  | "SQOOP"
  | "CONDITIONS"
  | "DATA_QUALITY"
  | "SWITCH"
  | "SEATUNNEL"
  | "EMR"
  | "ZEPPELIN"
  | "K8S"
  | "JUPYTER"
  | "MLFLOW"
  | "OPENMLDB"
  | "DVC"
  | "JAVA"
  | "DINKY"
  | "SAGEMAKER"
  | "CHUNJUN"
  | "FLINK_STREAM"
  | "PYTORCH"
  | "HIVECLI"
  | "DMS"
  | "DATASYNC"
  | "KUBEFLOW"
  | "LINKIS"
  | "DATA_FACTORY"
  | "REMOTESHELL";

export type SourceType = "MYSQL" | "HDFS" | "HIVE";
export type ModelType = "import" | "export";

export type RelationType = "AND" | "OR";

export type ITaskType = TaskType;

export type IDataBase =
  | "MYSQL"
  | "POSTGRESQL"
  | "HIVE"
  | "SPARK"
  | "CLICKHOUSE"
  | "ORACLE"
  | "SQLSERVER"
  | "DB2"
  | "VERTICA"
  | "PRESTO"
  | "REDSHIFT"
  | "ATHENA"
  | "TRINO"
  | "AZURESQL"
  | "STARROCKS"
  | "DAMENG"
  | "OCEANBASE"
  | "SSH"
  | "DATABEND"
  | "SNOWFLAKE"
  | "HANA"
  | "DORIS"
  | "KYUUBI"
  | "ZEPPELIN"
  | "SAGEMAKER";

export interface Dragged {
  x: number;
  y: number;
  type: TaskType;
}

export interface Coordinate {
  x: number;
  y: number;
}

export interface ProcessDefinition {
  id: number;
  code: number;
  name: string;
  version: number;
  releaseState: string;
  projectCode: number;
  description: string;
  globalParams: string;
  globalParamList: any[];
  globalParamMap: any;
  createTime: string;
  updateTime: string;
  flag: string;
  userId: number;
  userName?: any;
  projectName?: any;
  locations: string;
  scheduleReleaseState?: any;
  timeout: number;
  tenantId: number;
  tenantCode: string;
  executionType: string;
  modifyBy?: any;
  warningGroupId: number;
}

export interface Connect {
  id?: number;
  name: string;
  processDefinitionVersion?: number;
  projectCode?: number;
  processDefinitionCode?: number;
  preTaskCode: number;
  preTaskVersion: number;
  postTaskCode: number;
  postTaskVersion: number;
  conditionType: string;
  conditionParams: any;
  createTime?: string;
  updateTime?: string;
}

export interface Location {
  taskCode: number;
  x: number;
  y: number;
}

export interface TaskDefinition {
  id: number;
  code: number;
  name: string;
  version: number;
  description: string;
  projectCode: any;
  userId: number;
  taskType: TaskType;
  taskParams: any;
  taskParamList: any[];
  taskParamMap: any;
  flag: string;
  taskPriority: string;
  userName: any;
  projectName?: any;
  workerGroup: string;
  environmentCode: number;
  failRetryTimes: number;
  failRetryInterval: number;
  timeoutFlag: "OPEN" | "CLOSE";
  timeoutNotifyStrategy: string;
  timeout: number;
  delayTime: number;
  resourceIds: string;
  createTime: string;
  updateTime: string;
  modifyBy: any;
  dependence: string;
}

export interface WorkflowDefinition {
  processDefinition: ProcessDefinition;
  processTaskRelationList: Connect[];
  taskDefinitionList: TaskDefinition[];
}

export type NodeData = {
  code: number;
  taskType: TaskType;
  name: string;
} & Partial<TaskDefinition>;

export interface EditWorkflowDefinition {
  processDefinition: ProcessDefinition;
  processTaskRelationList: Connect[];
  taskDefinitionList: NodeData[];
}

export interface IWorkflowTaskInstance {
  id: number;
  taskCode: number;
  taskType: string;
}

/*
 * resourceName: resource full name
 * res: resource file name
 */
export interface ISourceItem {
  id?: number;
  resourceName: string;
  res?: string;
}

export type TaskExecuteType = "STREAM" | "BATCH";

export interface ILocalParam {
  prop: string;
  direct?: string;
  type?: string;
  value?: string;
}

export interface IDependentItem {
  depTaskCode?: number;
  status?: "SUCCESS" | "FAILURE";
  projectCode?: number;
  definitionCode?: number;
  cycle?: "month" | "week" | "day" | "hour";
  dateValue?: string;
  dependentType?: "DEPENDENT_ON_WORKFLOW" | "DEPENDENT_ON_TASK";
  parameterPassing?: boolean;
}

export interface IDependTask {
  condition?: string;
  nextNode?: number;
  relation?: RelationType;
  dependItemList?: IDependentItem[];
}

export interface ISwitchResult {
  dependTaskList?: IDependTask[];
  nextNode?: number;
}

export interface IDependentParameters {
  checkInterval?: number;
  failurePolicy?: "DEPENDENT_FAILURE_FAILURE" | "DEPENDENT_FAILURE_WAITING";
  failureWaitingTime?: number;
  relation?: RelationType;
  dependTaskList?: IDependTask[];
}

export interface IRuleParameters {
  check_type?: string;
  comparison_execute_sql?: string;
  comparison_name?: string;
  comparison_type?: number;
  failure_strategy?: string;
  operator?: string;
  src_connector_type?: number;
  src_datasource_id?: number;
  src_database?: string;
  src_table?: string;
  field_length?: number;
  begin_time?: string;
  deadline?: string;
  datetime_format?: string;
  target_filter?: string;
  regexp_pattern?: string;
  enum_list?: string;
  src_filter?: string;
  src_field?: string;
  statistics_execute_sql?: string;
  statistics_name?: string;
  target_connector_type?: number;
  target_datasource_id?: number;
  target_database?: string;
  target_table?: string;
  threshold?: string;
  mapping_columns?: string;
}

export interface ISparkParameters {
  deployMode?: string;
  driverCores?: number;
  driverMemory?: string;
  executorCores?: number;
  executorMemory?: string;
  numExecutors?: number;
  others?: string;
  yarnQueue?: string;
  sqlExecutionType?: string;
}

export interface ISqoopTargetParams {
  hiveDatabase?: string;
  hiveTable?: string;
  createHiveTable?: boolean;
  dropDelimiter?: boolean;
  hiveOverWrite?: boolean;
  hiveTargetDir?: string;
  replaceDelimiter?: string;
  hivePartitionKey?: string;
  hivePartitionValue?: string;
  targetPath?: string;
  deleteTargetDir?: boolean;
  compressionCodec?: string;
  fileType?: string;
  fieldsTerminated?: string;
  linesTerminated?: string;
  targetType?: string;
  targetDatasource?: string;
  targetTable?: string;
  targetColumns?: string;
  isUpdate?: string;
  targetUpdateKey?: string;
  targetUpdateMode?: string;
}
export interface ISqoopSourceParams {
  srcTable?: string;
  srcColumnType?: "1" | "0";
  srcColumns?: string;
  srcQuerySql?: string;
  srcQueryType?: "1" | "0";
  srcType?: string;
  srcDatasource?: string;
  mapColumnHive?: ILocalParam[];
  mapColumnJava?: ILocalParam[];
  exportDir?: string;
  hiveDatabase?: string;
  hiveTable?: string;
  hivePartitionKey?: string;
  hivePartitionValue?: string;
}

export interface ILabel {
  label: string;
  value: string;
}

export interface IMatchExpression {
  key: string;
  operator: string;
  values: string;
}

export interface ISqoopTargetData {
  targetHiveDatabase?: string;
  targetHiveTable?: string;
  targetHiveCreateTable?: boolean;
  targetHiveDropDelimiter?: boolean;
  targetHiveOverWrite?: boolean;
  targetHiveTargetDir?: string;
  targetHiveReplaceDelimiter?: string;
  targetHivePartitionKey?: string;
  targetHivePartitionValue?: string;
  targetHdfsTargetPath?: string;
  targetHdfsDeleteTargetDir?: boolean;
  targetHdfsCompressionCodec?: string;
  targetHdfsFileType?: string;
  targetHdfsFieldsTerminated?: string;
  targetHdfsLinesTerminated?: string;
  targetMysqlType?: string;
  targetMysqlDatasource?: string;
  targetMysqlTable?: string;
  targetMysqlColumns?: string;
  targetMysqlFieldsTerminated?: string;
  targetMysqlLinesTerminated?: string;
  targetMysqlIsUpdate?: string;
  targetMysqlTargetUpdateKey?: string;
  targetMysqlUpdateMode?: string;
}

export interface ISqoopSourceData {
  srcQueryType?: "1" | "0";
  srcTable?: string;
  srcColumnType?: "1" | "0";
  srcColumns?: string;
  sourceMysqlSrcQuerySql?: string;
  sourceMysqlType?: string;
  sourceMysqlDatasource?: string;
  mapColumnHive?: ILocalParam[];
  mapColumnJava?: ILocalParam[];
  sourceHdfsExportDir?: string;
  sourceHiveDatabase?: string;
  sourceHiveTable?: string;
  sourceHivePartitionKey?: string;
  sourceHivePartitionValue?: string;
}

export interface ITaskParams {
  resourceList?: ISourceItem[];
  mainJar?: ISourceItem;
  localParams?: ILocalParam[];
  runType?: string;
  jvmArgs?: string;
  isModulePath?: boolean;
  rawScript?: string;
  initScript?: string;
  programType?: string;
  flinkVersion?: string;
  jobManagerMemory?: string;
  taskManagerMemory?: string;
  slot?: number;
  taskManager?: number;
  parallelism?: number;
  mainClass?: string;
  deployMode?: string;
  appName?: string;
  driverCores?: number;
  driverMemory?: string;
  numExecutors?: number;
  executorMemory?: string;
  executorCores?: number;
  mainArgs?: string;
  others?: string;
  httpMethod?: string;
  httpBody?: string;
  httpCheckCondition?: string;
  httpParams?: [];
  url?: string;
  condition?: string;
  connectTimeout?: number;
  socketTimeout?: number;
  type?: string;
  datasource?: string;
  sql?: string;
  sqlType?: string;
  sendEmail?: boolean;
  displayRows?: number;
  title?: string;
  groupId?: string;
  preStatements?: string[];
  postStatements?: string[];
  method?: string;
  jobType?: "CUSTOM" | "TEMPLATE";
  customShell?: string;
  jobName?: string;
  hadoopCustomParams?: ILocalParam[];
  sqoopAdvancedParams?: ILocalParam[];
  concurrency?: number;
  splitBy?: string;
  modelType?: ModelType;
  sourceType?: SourceType;
  targetType?: SourceType;
  targetParams?: string;
  sourceParams?: string;
  queue?: string;
  master?: string;
  masterUrl?: string;
  switchResult?: ISwitchResult;
  dependTaskList?: IDependTask[];
  nextNode?: number;
  dependence?: IDependentParameters;
  customConfig?: number;
  json?: string;
  dsType?: string;
  dataSource?: number;
  dtType?: string;
  dataTarget?: number;
  targetTable?: string;
  jobSpeedByte?: number;
  jobSpeedRecord?: number;
  xms?: number;
  xmx?: number;
  sparkParameters?: ISparkParameters;
  ruleId?: number;
  ruleInputParameter?: IRuleParameters;
  jobFlowDefineJson?: string;
  stepsDefineJson?: string;
  zeppelinNoteId?: string;
  zeppelinParagraphId?: string;
  zeppelinRestEndpoint?: string;
  restEndpoint?: string;
  zeppelinUsername?: string;
  username?: string;
  zeppelinPassword?: string;
  password?: string;
  zeppelinProductionNoteDirectory?: string;
  productionNoteDirectory?: string;
  hiveCliOptions?: string;
  hiveSqlScript?: string;
  hiveCliTaskExecutionType?: string;
  sqlExecutionType?: string;
  noteId?: string;
  paragraphId?: string;
  condaEnvName?: string;
  inputNotePath?: string;
  outputNotePath?: string;
  parameters?: string;
  kernel?: string;
  engine?: string;
  startupScript?: string;
  executionTimeout?: string;
  startTimeout?: string;
  processDefinitionCode?: number;
  conditionResult?: {
    successNode?: number[];
    failedNode?: number[];
  };
  udfs?: string;
  connParams?: string;
  targetJobName?: string;
  cluster?: string;
  namespace?: string;
  clusterNamespace?: string;
  minCpuCores?: string;
  minMemorySpace?: string;
  image?: string;
  imagePullPolicy?: string;
  pullSecret?: string;
  command?: string;
  args?: string;
  customizedLabels?: ILabel[];
  nodeSelectors?: IMatchExpression[];
  algorithm?: string;
  params?: string;
  searchParams?: string;
  dataPath?: string;
  experimentName?: string;
  modelName?: string;
  mlflowTrackingUri?: string;
  mlflowJobType?: string;
  automlTool?: string;
  registerModel?: boolean;
  mlflowTaskType?: string;
  mlflowProjectRepository?: string;
  mlflowProjectVersion?: string;
  deployType?: string;
  deployPort?: string;
  deployModelKey?: string;
  cpuLimit?: string;
  memoryLimit?: string;
  zk?: string;
  zkPath?: string;
  executeMode?: string;
  useCustom?: boolean;
  runMode?: string;
  dvcTaskType?: string;
  dvcRepository?: string;
  dvcVersion?: string;
  dvcDataLocation?: string;
  dvcMessage?: string;
  dvcLoadSaveDataPath?: string;
  dvcStoreUrl?: string;
  address?: string;
  taskId?: string;
  online?: boolean;
  sagemakerRequestJson?: string;
  script?: string;
  scriptParams?: string;
  pythonPath?: string;
  isCreateEnvironment?: string;
  pythonCommand?: string;
  pythonEnvTool?: string;
  requirements?: string;
  condaPythonVersion?: string;
  isRestartTask?: boolean;
  isJsonFormat?: boolean;
  jsonData?: string;
  migrationType?: string;
  replicationTaskIdentifier?: string;
  sourceEndpointArn?: string;
  targetEndpointArn?: string;
  replicationInstanceArn?: string;
  tableMappings?: string;
  replicationTaskArn?: string;
  jsonFormat?: boolean;
  destinationLocationArn?: string;
  sourceLocationArn?: string;
  name?: string;
  cloudWatchLogGroupArn?: string;
  yamlContent?: string;
  paramScript?: ILocalParam[];
  factoryName?: string;
  resourceGroupName?: string;
  pipelineName?: string;
  maxNumOfSubWorkflowInstances?: number;
  degreeOfParallelism?: number;
  filterCondition?: string;
  listParameters?: Array<any>;
  yarnQueue?: string;
  awsRegion?: string;
  kubeConfig?: string;
}

export interface INodeData
  extends Omit<
      ITaskParams,
      | "resourceList"
      | "mainJar"
      | "targetParams"
      | "sourceParams"
      | "dependence"
      | "sparkParameters"
      | "conditionResult"
      | "udfs"
      | "customConfig"
    >,
    ISqoopTargetData,
    ISqoopSourceData,
    IDependentParameters,
    Omit<IRuleParameters, "mapping_columns"> {
  id?: string;
  taskType?: ITaskType;
  processName?: number;
  delayTime?: number;
  description?: string;
  environmentCode?: number | null;
  failRetryInterval?: number;
  failRetryTimes?: number;
  cpuQuota?: number;
  memoryMax?: number;
  flag?: "YES" | "NO";
  isCache?: boolean;
  taskGroupId?: number;
  taskGroupPriority?: number;
  taskPriority?: string;
  timeout?: number;
  timeoutFlag?: boolean;
  timeoutNotifyStrategy?: string[];
  workerGroup?: string;
  code?: number;
  name?: string;
  preTasks?: number[];
  preTaskOptions?: [];
  postTaskOptions?: [];
  resourceList?: string[];
  mainJar?: string;
  timeoutSetting?: boolean;
  isCustomTask?: boolean;
  method?: string;
  resourceFiles?: { id: number; fullName: string }[] | null;
  relation?: RelationType;
  definition?: object;
  successBranch?: number;
  failedBranch?: number;
  udfs?: string[];
  customConfig?: boolean;
  mapping_columns?: object[];
  taskExecuteType?: TaskExecuteType;
}

export interface ITaskData
  extends Omit<
    INodeData,
    "isCache" | "timeoutFlag" | "taskPriority" | "timeoutNotifyStrategy"
  > {
  name?: string;
  taskPriority?: string;
  isCache?: "YES" | "NO";
  timeoutFlag?: "OPEN" | "CLOSE";
  timeoutNotifyStrategy?: string | [];
  taskParams?: ITaskParams;
}

export interface GlobalParam {
  key: string;
  direct: string;
  value: string;
}

export interface SaveForm {
  name: string;
  description: string;
  executionType: string;
  timeoutFlag: boolean;
  timeout: number;
  globalParams: GlobalParam[];
  release: boolean;
  sync: boolean;
}

export default {};
