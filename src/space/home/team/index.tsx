import { useMount } from "ahooks";
import { observer } from "mobx-react";
import { useStores } from "../../hooks";
import { TeamItem } from "../../types";
import FactorView from "./factor";
import "./index.less";
import Statistic from "./Statistic";
import StrategyView from "./strategy";
import TitleView, { TimeType } from "./TitleView";
import UserView from "./UserView";

export default observer(function Team() {
  const {
    getTeamOverview,
    getAllTeamList,
    teamOverview,
    getTeamLineChart,
    getTeamPieChart,
    onTeamSelect,
    getTeamFactorMetricOrder,
    getTeamStrategyMetricOrder,
  } = useStores().homeStore;

  useMount(async () => {
    const teams = await getAllTeamList();

    const allTeamIds =
      teams?.map((team: TeamItem) => team.id)?.slice(0, 30) || [];

    onTeamSelect(allTeamIds);

    await Promise.all([
      getTeamOverview(allTeamIds),
      getTeamLineChart({
        teamIdList: allTeamIds,
        timeType: TimeType.THREE_MONTH,
      }),
      getTeamFactorMetricOrder({ teamIdList: allTeamIds, metricName: "ic" }),
      getTeamStrategyMetricOrder({
        teamIdList: allTeamIds,
        metricName: "ann_strategy_return",
      }),
      getTeamPieChart({ teamIdList: allTeamIds }),
    ]);
  });

  return (
    <div>
      <TitleView />
      {teamOverview && <Statistic data={teamOverview} />}
      <UserView />
      <FactorView />
      <StrategyView />
    </div>
  );
});
