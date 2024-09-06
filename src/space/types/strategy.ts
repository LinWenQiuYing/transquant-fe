import { Label } from "@transquant/ui";
import { Dayjs } from "dayjs";

export interface StrategyLibItem {
  alpha: number;
  annBenchmarkReturn: number;
  annStrategyReturn: number;
  benchmark: string;
  beta: number;
  className: string;
  id: number;
  maxDrawdown: number;
  name: string;
  projectName: string;
  sharpRatio: number;
  sortinoRatio: number;
  srcUpdateTime: string;
  tags: Label[];
  timeRange: string;
  triggerTime: string;
  volatility: number;
  analysisFlag: 0 | 1; // 0 无tab页  1 有tab页
  performanceFlag: 0 | 1; // 0 无， 1 有
}

export interface StrategyLib {
  total: number;
  list: StrategyLibItem[];
}

export interface StrategyBaseInfo {
  projectName: string;
  className: string;
  name: string;
  srcUpdateTime: string;
  tags: Label[];
}

export interface PositionTable {
  averagePrice: number;
  close: number;
  contract: string;
  cumsumProfit: number;
  date: string;
  fees: number;
  holdingMarketValue: number;
  id: number;
  longShort: string;
  margin: number;
  name: string;
  position: number;
}

export interface AccountTable {
  cash: number;
  date: string;
  equity: number;
  fees: number;
  holdingMarketValue: number;
  id: number;
  margin: number;
  type: string;
}

export interface OrderItem {
  buySell: string;
  contract: string;
  datetime: string;
  exchange: string;
  fees: number;
  id: number;
  name: string;
  openClose: string;
  price: number;
  volume: number;
}

export interface OrderTable {
  total: number;
  datas: OrderItem[];
}

export interface StrategyJob {
  className: string;
  createTime: string;
  id: number;
  jobKey: string;
  jobName: string;
  lastSuccessTime: string;
  name: string;
  runStatus: 0; // 0 运行中， 1 已停止 ，2 已结束
  scheduleFrequency: 0;
  scheduleTime: string;
  startTime: string;
  tags: Label[];
  totalEquity: number;
  yieldRate: number;
}

export type SignalAnalysis = {
  dataCol: string;
  strategyName: string;
};

export type StrategyMatrix = {
  analysisFlag: number;
  backend: string;
  buyFee: number;
  codes: string;
  declarationFee: number;
  feeRate: string;
  iniCash: number;
  latency: number;
  configEnum: number;
  marginRate: string;
  marketAccount: string;
  marketDB: string;
  marketName: string;
  marketTable: string;
  marketMatcher: string;
  mode: string;
  prefProfile: number;
  sellFee: number;
  signalAnalysisList: SignalAnalysis[] | undefined;
  span: string[] | Dayjs[];
  stampTax: number;
  universe: string;
};

export type CalculateForStrategy = {
  argsList: string | null;
  className: string;
  strategyName: string;
  filePathName: string;
};

export type CustomEvaluator = {
  argsList: string;
  classEvaluatorName: string;
  evaluatorName: string;
  filePathName: string;
};

export type BenchData = {
  name: string;
  param: string;
};

export type sectorData = {
  name: string;
  param: string;
};

export type DefaultEvaluator = {
  benchDataList: BenchData[];
  indicatorList: string[];
  nearTermList: string[];
  perfAnalysisList: string[];
  returnList: string[];
  riskList: string[];
  robustnessList: string[];
  sectorDataList: sectorData[];
  turnoverList: string[];
};

export type StrategyYaml = {
  matrix: Partial<StrategyMatrix>;
  calculateList: CalculateForStrategy[];
  evaluatorFlag: number;
  customEvaluator: CustomEvaluator;
  defaultEvaluator: DefaultEvaluator;
};
