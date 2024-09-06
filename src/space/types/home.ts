import { Nullable } from "@transquant/utils";
import { AnyObject } from "../../../packages/utils/type";

export type TodoItem = {
  id: number;
  content: string;
  title: string;
};

export type PersonalOverview = {
  auditFactorSum: number;
  auditStrategySum: number;
  factorSum: number;
  strategySum: number;
};

export type TeamOverview = {
  factorAddYest: number;
  factorSum: number;
  strategyAddYest: number;
  strategySum: number;
  userLoginYest: number;
  userSum: number;
};

export type LineItem = {
  horizon: string;
  vertical: number;
};

export type PersonalFactorLine = {
  auditFactorSumList: LineItem[];
  factorSumList: LineItem[];
};

export type PersonalStrategyLine = {
  auditStrategySumList: LineItem[];
  strategySumList: LineItem[];
};

export type TagItem = {
  tagName: string;
  tagSum: number;
};

export type TeamLine = {
  teamLineChartList: Nullable<LineItem[]>;
  teamName: string;
};

export type TeamPie = {
  id: number;
  ratio: number;
  sum: number;
  teamName: string;
};

export type TeamMetricOrder = {
  id: 0;
  metric: 0;
  name: string;
  publisher: string;
  teamId: 0;
} & AnyObject;

export default {};
