import { ajax } from "@transquant/utils";
import { DataType } from "./ChartView";

export type CodeType = {
  code: string;
  type: string;
};

/** 获取资产代码-策略 */
export const getCode = async (strategyId: number) => {
  return await ajax<CodeType[]>({
    url: `/tqlab/strategy/getCode`,
    params: { strategyId },
  });
};

/** 获取资产代码-增量 */
export const getQuartzCode = async (quartzDetailId: number) => {
  return await ajax<CodeType[]>({
    url: `/tqlab/quartzjob/getCode`,
    params: { quartzDetailId },
  });
};

/** 获取行情和交易历史数据-策略 */
export const getTradeAnalysis = async (data: {
  code: string;
  id: number;
  type: string;
}) => {
  return await ajax<DataType>({
    url: `/tqlab/strategy/getTradeAnalysis`,
    method: "post",
    data: { ...data, strategyId: data.id },
  });
};

/** 获取行情和交易历史数据-增量 */
export const getQuartzTradeAnalysis = async (data: {
  code: string;
  id: number;
  type: string;
}) => {
  return await ajax<DataType>({
    url: `/tqlab/quartzjob/getTradeAnalysis`,
    method: "post",
    data: { ...data, quartzDetailId: data.id },
  });
};

export default {};
