import { useMount } from "ahooks";
import { observer } from "mobx-react";
import { useStores } from "../../hooks";
import FactorView from "./FactorView";
import "./index.less";
import Statistic from "./Statistic";
import StrategyView from "./StrategyView";

export default observer(function Personal() {
  const {
    getPersonalOverview,
    personalOverview,
    getPersonLineChart,
    personalFactorLine,
    personalFactorTag,
    personalStrategyLine,
    getPersonTagCount,
    personalStrategyTag,
  } = useStores().homeStore;

  useMount(async () => {
    await getPersonalOverview();
    await getPersonLineChart();
    await getPersonTagCount();
  });

  return (
    <div className="flex flex-col flex-1">
      {personalOverview && <Statistic data={personalOverview} />}
      {personalFactorLine && (
        <FactorView
          personalFactorLine={personalFactorLine}
          personalFactorTag={personalFactorTag}
        />
      )}
      {personalStrategyLine && (
        <StrategyView
          personalStrategyLine={personalStrategyLine}
          personalStrategyTag={personalStrategyTag}
        />
      )}
    </div>
  );
});
