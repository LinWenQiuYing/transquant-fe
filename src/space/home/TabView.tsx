import { clsPrefix, USER_INFO } from "@transquant/constants";
import { ls } from "@transquant/utils";
import { Card, Tabs, TabsProps } from "antd";
import { observer } from "mobx-react";
import Personal from "./personal";
import Team from "./team";

enum HomeTabEnum {
  Team = "team",
  Personal = "personal",
}

const items: TabsProps["items"] = [
  {
    key: HomeTabEnum.Team,
    label: "团队",
    children: <Team />,
  },
  {
    key: HomeTabEnum.Personal,
    label: "个人",
    children: <Personal />,
  },
];

export default observer(function TabView() {
  const userInfo = ls.getItem(USER_INFO)?.userInfo;
  const hasTeamHome = userInfo?.menuCodes.includes("teamHome");

  const tabItems = items.slice(hasTeamHome ? 0 : 1);

  return (
    <Card className={`flex flex-1 ${clsPrefix}-home-tab`}>
      <Tabs items={tabItems} destroyInactiveTabPane />
    </Card>
  );
});
