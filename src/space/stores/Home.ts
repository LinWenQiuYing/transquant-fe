import { computed, observable } from "mobx";
/* eslint-disable no-return-await */
import { ajax, Nullable } from "@transquant/utils";
import { TimeType } from "../home/team/TitleView";
import {
  LineItem,
  PersonalFactorLine,
  PersonalOverview,
  PersonalStrategyLine,
  TagItem,
  TeamItem,
  TeamLine,
  TeamMetricOrder,
  TeamOverview,
  TeamPie,
  TodoItem,
} from "../types";

export default class HomeStore {
  @observable todoList: TodoItem[] = [];

  @observable tradeDates: string[] = [];

  @observable allTeams: TeamItem[] = [];

  @observable teamSearchValue: string = "";

  @observable personalFactorLine: Nullable<PersonalFactorLine> = null;

  @observable personalStrategyLine: Nullable<PersonalStrategyLine> = null;

  @observable personalFactorTag: TagItem[] = [];

  @observable personalStrategyTag: TagItem[] = [];

  @observable personalOverview: Nullable<PersonalOverview> = null;

  @observable teamOverview: Nullable<TeamOverview> = null;

  @observable selectedTeamIds: string[] | undefined = undefined;

  @observable factorIndex: string | undefined = "ic";

  @observable strategyIndex: string | undefined = "ann_strategy_return";

  @observable userSumList: TeamLine[] = [];

  @observable activeRatioSumList: {
    teamActiveLineChartList: Nullable<LineItem[]>;
    teamName: string;
  }[] = [];

  @observable facotrSumList: TeamLine[] = [];

  @observable strategySumList: TeamLine[] = [];

  @observable factorPieChart: TeamPie[] = [];

  @observable strategyPieChart: TeamPie[] = [];

  @observable teamFactorMetricOrder: TeamMetricOrder[] = [];

  @observable teamStrategyMetricOrder: TeamMetricOrder[] = [];

  @observable timeType: TimeType = TimeType.THREE_MONTH;

  onFactorIndexChange = (value: string) => {
    this.factorIndex = value;
  };

  onStrategyIndexChange = (value: string) => {
    this.strategyIndex = value;
  };

  onTeamSelect = (_ids: string[]) => {
    const ids = _ids.slice(0, 30);
    this.factorIndex = "ic";
    this.strategyIndex = "ann_strategy_return";
    this.selectedTeamIds = ids;
    this.getTeamLineChart({ teamIdList: ids, timeType: this.timeType });
    this.getTeamPieChart({ teamIdList: ids });
    this.getTeamFactorMetricOrder({ teamIdList: ids, metricName: "ic" });
    this.getTeamStrategyMetricOrder({
      teamIdList: ids,
      metricName: "ann_strategy_return",
    });
    this.getTeamOverview(ids);
  };

  onTimeTypeChange = (type: TimeType) => {
    this.timeType = type;
    this.getTeamLineChart({
      teamIdList: this.selectedTeamIds || [],
      timeType: type,
    });
  };

  onTeamSearch = (value: string) => {
    this.teamSearchValue = value;
  };

  @computed
  get filterAllTeams() {
    return this.allTeams.filter((item) => {
      return item.name.includes(this.teamSearchValue);
    });
  }

  getToDoList = () => {
    ajax({
      url: `/tqlab/homepage/getToDoList`,
      success: (data) => {
        this.todoList = data;
      },
    });
  };

  getTradeDate = () => {
    ajax({
      url: `/tqlab/homepage/getTradeDate`,
      success: (data) => {
        this.tradeDates = data;
      },
    });
  };

  getPersonalOverview = async () => {
    await ajax({
      url: `/tqlab/homepage/personalOverview`,
      success: (data) => {
        this.personalOverview = data;
      },
    });
  };

  getTeamOverview = async (teamIdList: (string | number)[]) => {
    await ajax({
      url: `/tqlab/homepage/teamOverview`,
      method: "post",
      data: { teamIdList },
      success: (data) => {
        this.teamOverview = data;
      },
    });
  };

  getAllTeamList = async () => {
    return await ajax({
      url: `/tquser/team/getAllTeamList`,
      success: (data) => {
        this.allTeams = data;
      },
    });
  };

  // 获取个人因子、策略折线图
  getPersonLineChart = async () => {
    await ajax({
      url: `/tqlab/homepage/getPersonLineChart`,
      success: (data) => {
        this.personalFactorLine = data.factorLineChart || [];
        this.personalStrategyLine = data.strategyLineChart || [];
      },
    });
  };

  // 获取个人因子、策略标签统计
  getPersonTagCount = async () => {
    await ajax({
      url: `/tqlab/homepage/getPersonTagCount`,
      success: (data) => {
        this.personalFactorTag = data.factorTagCountList || [];
        this.personalStrategyTag = data.strategyTagCountList || [];
      },
    });
  };

  // 获取团队人员总数、活跃比例、团队因子数、团队策略数折线图的数据
  getTeamLineChart = async (data: {
    teamIdList: (number | string)[];
    timeType: TimeType;
  }) => {
    await ajax({
      url: `/tqlab/homepage/getTeamLineChart`,
      method: "post",
      data,
      success: (data) => {
        this.userSumList = data.userSumList || [];
        this.activeRatioSumList = data.activeRatioSumList || [];
        this.facotrSumList = data.factorSumList || [];
        this.strategySumList = data.strategySumList || [];
      },
    });
  };

  // 获取团队策略、因子饼状图
  getTeamPieChart = async (data: { teamIdList: (number | string)[] }) => {
    await ajax({
      url: `/tqlab/homepage/teamPieChart`,
      method: "post",
      data,
      success: (data) => {
        this.factorPieChart = data.factorPieChart || [];
        this.strategyPieChart = data.strategyPieChart || [];
      },
    });
  };

  // 获取团队因子指标排名
  getTeamFactorMetricOrder = async (data: {
    metricName?: string;
    teamIdList?: string[];
  }) => {
    await ajax({
      url: `/tqlab/homepage/teamFactorMetricOrder`,
      method: "post",
      data,
      success: (data) => {
        const _data = data?.map((item: TeamMetricOrder, index: number) => ({
          ...item,
          index: index + 1,
          teamName: this.allTeams.find((team) => team.id === item.teamId)?.name,
        }));

        this.teamFactorMetricOrder = _data;
      },
    });
  };

  // 获取团队策略指标排名
  getTeamStrategyMetricOrder = async (data: {
    metricName?: string;
    teamIdList?: (string | number)[];
  }) => {
    await ajax({
      url: `/tqlab/homepage/teamStrategyMetricOrder`,
      method: "post",
      data,
      success: (data) => {
        const _data = data?.map((item: TeamMetricOrder, index: number) => ({
          ...item,
          index: index + 1,
          teamName: this.allTeams.find((team) => team.id === item.teamId)?.name,
        }));
        this.teamStrategyMetricOrder = _data;
      },
    });
  };

  reset = () => {
    this.teamOverview = null;
    this.personalOverview = null;
    this.allTeams = [];
  };
}
