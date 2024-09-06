import { QuestionCircleOutlined } from "@ant-design/icons";
import { DatePicker, Input, InputNumber, Select, Tooltip } from "antd";
import { StrategyMatrix } from "src/space/types";

/** Matrix-Start */
const selectOpts = {
  configEnum: [
    {
      value: 0,
      label: "统一配置费率",
    },
    {
      value: 1,
      label: "配置买入费率",
    },
    {
      value: 2,
      label: "配置卖出费率",
    },
    {
      value: 3,
      label: "配置买入、卖出费率",
    },
  ],
  declarationFee: [
    {
      value: 0,
      label: "否",
    },
    {
      value: 1,
      label: "是",
    },
  ],
  backend: [
    {
      value: "ipython",
      label: "ipython-在IDE中显示",
    },
    {
      value: "tqclient",
      label: "tqclient-在详情页中显示",
    },
  ],
  marketName: [
    {
      value: "stock",
      label: "股票",
    },
    {
      value: "future",
      label: "期货",
    },
  ],
  marketMatcher: [
    {
      value: "daily",
      label: "daily",
    },
    {
      value: "bar",
      label: "bar",
    },
    {
      value: "tick",
      label: "tick",
    },
    {
      value: "order",
      label: "order",
    },
  ],
  marketAccountForStock: [
    {
      value: "detail",
      label: "根据市场属性进行验资验券",
    },
    {
      value: "base",
      label: "不做验资验券",
    },
    {
      value: "detail_t0",
      label: "在detail的基础上支持股票t0交易",
    },
  ],
  marketAccountForFuture: [
    {
      value: "detail",
      label: "根据市场属性进行验资验券",
    },
    {
      value: "base",
      label: "不做验资验券",
    },
  ],
  prefProfile: [
    {
      value: 0,
      label: "否",
    },
    {
      value: 1,
      label: "是",
    },
  ],
  analysisFlag: [
    {
      value: 0,
      label: "否",
    },
    {
      value: 1,
      label: "是",
    },
  ],
};

export const getFormConf = (
  formValues: Partial<StrategyMatrix>,
  database: string[],
  tables: string[]
) => ({
  span: {
    name: "span",
    label: "回测时间段",
    rules: [
      {
        required: true,
        message: "请选择回测时间段",
      },
    ],
    children: <DatePicker.RangePicker className="w-full" />,
  },
  codes: {
    name: "codes",
    label: (
      <div>
        标的池
        <Tooltip title="支持输入*(表示所有标的)/代码标的/pickle文件的相对路径">
          <QuestionCircleOutlined className="ml-2 text-gray-400 cursor-pointer" />
        </Tooltip>
      </div>
    ),
    rules: [
      {
        required: true,
        message: "请输入*/标的代码/pickle文件相对路径",
      },
    ],
    children: <Input placeholder="请输入*/标的代码/pickle文件相对路径" />,
  },
  universe: {
    name: "universe",
    label: (
      <div>
        动态标的池
        <Tooltip title="需要订阅相应的行业、板块或者指数成分股的表；当标的池为“*”时，该项必须配置">
          <QuestionCircleOutlined className="ml-2 text-gray-400 cursor-pointer" />
        </Tooltip>
      </div>
    ),
    rules: [
      {
        required: formValues.codes === "*",
        message: "仅支持输入小写字母，数字，下划线，英文逗号",
        pattern: /^[a-z0-9,_]+$/,
      },
    ],
    children: <Input placeholder="请按顺序输入数据库名，数据表名、列名" />,
  },
  iniCash: {
    name: "iniCash",
    label: "初始资金",
    rules: [
      {
        required: true,
        message: "请输入初始资金",
      },
    ],
    children: <InputNumber placeholder="请输入初始资金" className="w-full" />,
  },
  configEnum: {
    name: "configEnum",
    label: (
      <div>
        配置交易费率
        <Tooltip title="若选择配置买入费率/卖出费率，费率不生效">
          <QuestionCircleOutlined className="ml-2 text-gray-400 cursor-pointer" />
        </Tooltip>
      </div>
    ),
    children: (
      <Select placeholder="请配置交易费率" options={selectOpts.configEnum} />
    ),
  },
  feeRate: {
    name: "feeRate",
    label: (
      <div>
        费率
        <Tooltip title="支持输入auto / 大于0的数字，auto代表以交易所费率进行处理">
          <QuestionCircleOutlined className="ml-2 text-gray-400 cursor-pointer" />
        </Tooltip>
      </div>
    ),
    children: <Input placeholder="请输入费率" />,
  },
  buyFee: {
    name: "buyFee",
    label: "买入费率",
    children: (
      <InputNumber
        disabled={formValues.configEnum === 2}
        placeholder="请输入买入费率"
        className="w-full"
      />
    ),
  },
  sellFee: {
    name: "sellFee",
    label: "卖出费率",
    children: (
      <InputNumber
        disabled={formValues.configEnum === 1}
        placeholder="请输入卖出费率"
        className="w-full"
      />
    ),
  },
  stampTax: {
    name: "stampTax",
    label: "印花税",
    children: <InputNumber className="w-full" placeholder="请输入印花税" />,
  },
  declarationFee: {
    name: "declarationFee",
    label: (
      <div>
        是否计算申报费
        <Tooltip title="仅适用于期货，当回测标的为其他标的时不会产生申报费">
          <QuestionCircleOutlined className="ml-2 text-gray-400 cursor-pointer" />
        </Tooltip>
      </div>
    ),
    children: (
      <Select
        placeholder="请选择是否计算申报费"
        options={selectOpts.declarationFee}
      />
    ),
  },
  marginRate: {
    name: "marginRate",
    label: (
      <div>
        期货保证金率
        <Tooltip title="支持输入auto/大于0小于等于1的数字，auto代表以交易所保证金进行处理">
          <QuestionCircleOutlined className="ml-2 text-gray-400 cursor-pointer" />
        </Tooltip>
      </div>
    ),
    children: <Input placeholder="请输入期货保证金率" />,
  },
  latency: {
    name: "latency",
    label: "交易延迟（ms）",
    children: (
      <InputNumber
        className="w-full"
        placeholder="请输入交易延迟，仅支持整数"
      />
    ),
  },
  backend: {
    name: "backend",
    label: "评价展示输出方式",
    children: (
      <Select
        placeholder="请选择评价展示输出方式"
        options={selectOpts.backend}
      />
    ),
  },
  marketName: {
    name: "marketName",
    label: "市场",
    rules: [
      {
        required: true,
        message: "请选择市场",
      },
    ],
    children: (
      <Select options={selectOpts.marketName} placeholder="请选择市场" />
    ),
  },
  marketDB: {
    name: "marketDB",
    label: "行情数据",
    rules: [
      {
        required: true,
        message: "请选择数据库",
      },
    ],
    children: (
      <Select
        options={database.map((item) => ({ value: item, label: item }))}
        placeholder="请选择数据库"
      />
    ),
  },
  marketTable: {
    name: "marketTable",
    label: <div className="-ml-3 text-white bg-white">行情数据（表）</div>,
    rules: [
      {
        required: true,
        message: "请选择数据表",
      },
    ],
    children: (
      <Select
        options={tables.map((item) => ({ value: item, label: item }))}
        placeholder="请选择数据表"
      />
    ),
  },
  marketMatcher: {
    name: "marketMatcher",
    label: "订单撮合模式",
    rules: [
      {
        required: true,
        message: "请选择订单撮合模式",
      },
    ],
    children: (
      <Select
        options={selectOpts.marketMatcher}
        placeholder="请选择订单撮合模式"
      />
    ),
  },
  marketAccount: {
    name: "marketAccount",
    label: "账户模式",
    rules: [
      {
        required: true,
        message: "请选择账户模式",
      },
    ],
    children: (
      <Select
        options={
          formValues.marketName === "stock"
            ? selectOpts.marketAccountForStock
            : selectOpts.marketAccountForFuture
        }
        placeholder="请选择账户模式"
      />
    ),
  },
  prefProfile: {
    name: "prefProfile",
    label: "是否进行性能分析",
    rules: [
      {
        required: true,
        message: "请选择是否进行性能分析",
      },
    ],
    children: (
      <Select
        options={selectOpts.prefProfile}
        placeholder="请选择是否进行性能分析"
      />
    ),
  },
  analysisFlag: {
    name: "analysisFlag",
    label: "是否进行交易分析",
    rules: [
      {
        required: true,
        message: "请选择是否进行交易分析",
      },
    ],
    children: (
      <Select
        options={selectOpts.analysisFlag}
        placeholder="请选择是否进行交易分析"
      />
    ),
  },
});

/** Matrix-End */

/** Evaluator-Start */
export const _return = ["net_ret", "excess_ret"];
export const risk = [
  "max_drawdown",
  "max_drawdown_duration",
  "alpha",
  "beta",
  "skewness",
  "kurtosis",
  "annual_volatility",
];
export const indicator = [
  "sharpe",
  "sortino",
  "calmar",
  "ir",
  "risk_reward",
  "win_rate",
];
export const robustness = ["prob_1m", "prob_3m", "prob_6m", "prob_12m"];
export const nearterm = [
  "perf_last_1m",
  "perf_last_3m",
  "perf_last_6m",
  "perf_last_12m",
];
export const perfAnalysis = ["sector", "code"];
export const turnover = ["strategy", "sector"];

export const evaluatorSelectOpts = {
  returnList: [
    {
      value: "net_ret",
      label: "策略收益",
    },
    {
      value: "excess_ret",
      label: "策略超额收益",
    },
  ],
  riskList: [
    {
      value: "max_drawdown",
      label: "最大回撤",
    },
    {
      value: "max_drawdown_duration",
      label: "最大回撤持续期",
    },
    {
      value: "alpha",
      label: "alpha",
    },
    {
      value: "beta",
      label: "beta",
    },
    {
      value: "skewness",
      label: "偏度",
    },
    {
      value: "kurtosis",
      label: "偏度",
    },
    {
      value: "annual_volatility",
      label: "年化波动率",
    },
  ],
  indicatorList: [
    {
      value: "sharpe",
      label: "夏普",
    },
    {
      value: "sortino",
      label: "索提诺比率",
    },
    {
      value: "calmar",
      label: "卡玛比率",
    },
    {
      value: "ir",
      label: "信息比率",
    },
    {
      value: "risk_reward",
      label: "盈亏比",
    },
    {
      value: "win_rate",
      label: "胜率",
    },
  ],
  robustnessList: [
    {
      value: "prob_1m",
      label: "持有1个月盈利概率",
    },
    {
      value: "prob_3m",
      label: "持有3个月盈利概率",
    },
    {
      value: "prob_6m",
      label: "持有6个月盈利概率",
    },
    {
      value: "prob_12m",
      label: "持有12个月盈利概率",
    },
  ],
  neartermList: [
    {
      value: "perf_last_1m",
      label: "近1个月收益",
    },
    {
      value: "perf_last_3m",
      label: "近3个月收益",
    },
    {
      value: "perf_last_6m",
      label: "近6个月收益",
    },
    {
      value: "perf_last_12m",
      label: "近12个月收益",
    },
  ],
  perfAnalysisList: [
    {
      value: "sector",
      label: "行业绩效分析",
    },
    {
      value: "code",
      label: "标的绩效分析",
    },
  ],
  turnoverList: [
    {
      value: "strategy",
      label: "策略换手率",
    },
    {
      value: "sector",
      label: "行业换手率",
    },
  ],
};

export const getEvaluatorFormConf = () => ({
  returnList: {
    name: "returnList",
    label: "收益指标",
    children: (
      <Select
        options={evaluatorSelectOpts.returnList}
        mode="multiple"
        placeholder="请选择收益指标"
      />
    ),
  },
  riskList: {
    name: "riskList",
    label: "风险指标",
    children: (
      <Select
        options={evaluatorSelectOpts.riskList}
        mode="multiple"
        placeholder="请选择风险指标"
      />
    ),
  },
  indicatorList: {
    name: "indicatorList",
    label: "收益风险指标",
    children: (
      <Select
        options={evaluatorSelectOpts.indicatorList}
        mode="multiple"
        placeholder="请选择收益风险指标"
      />
    ),
  },
  robustnessList: {
    name: "robustnessList",
    label: "策略稳定性",
    children: (
      <Select
        options={evaluatorSelectOpts.robustnessList}
        mode="multiple"
        placeholder="请选择策略稳定性"
      />
    ),
  },
  nearTermList: {
    name: "nearTermList",
    label: "近端表现",
    children: (
      <Select
        options={evaluatorSelectOpts.neartermList}
        mode="multiple"
        placeholder="请选择近端表现"
      />
    ),
  },
  perfAnalysisList: {
    name: "perfAnalysisList",
    label: "绩效分析",
    children: (
      <Select
        options={evaluatorSelectOpts.perfAnalysisList}
        mode="multiple"
        placeholder="请选择绩效分析"
      />
    ),
  },
  turnoverList: {
    name: "turnoverList",
    label: "换手率",
    children: (
      <Select
        options={evaluatorSelectOpts.turnoverList}
        mode="multiple"
        placeholder="请选择换手率"
      />
    ),
  },
});
/** Evaluator-End */
export default {};
