import { Label } from "@transquant/ui";

export interface GroupStrategyLibItem {
  publisher: string;
  code: string;
  alpha: number;
  analysisFlag: 0 | 1; // 0 无tab页  1 有tab页
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
  performanceFlag: 0 | 1;
}

export interface GroupStrategyLib {
  total: number;
  list: GroupStrategyLibItem[];
}
