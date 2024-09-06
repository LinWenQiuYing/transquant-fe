import { PersonalModule } from "@transquant/app/components/left/menu/PersonMenu";
import { ResearchModule } from "@transquant/app/components/left/menu/ResearchMenu";
import { AdminPermission } from "@transquant/common";
import { antdClsPrefix, USER_TOKEN } from "@transquant/constants";
import { strategy } from "@transquant/person/message/event";
import { RecordTab } from "@transquant/person/publish/TabView";
import stores from "@transquant/person/stores";
import { Message } from "@transquant/person/types";
import { ConfigContext } from "@transquant/ui";
import { ls } from "@transquant/utils";
import { getToken } from "@transquant/utils/ajax";
import { useMount } from "ahooks";
import { Button, ConfigProvider, notification, Space } from "antd";
import enUS from "antd/locale/en_US";
import zhCN from "antd/locale/zh_CN";
import "dayjs/locale/zh-cn";
import { observer } from "mobx-react";
import { useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FactorResearchTabEnum } from "../../space/group/factor/TabView";
import { StrategyResearchTabEnum } from "../../space/group/strategy/TabView";
import { useStores as useSpaceStore } from "../../space/hooks";
import { useStores } from "../hooks";
import TransChaos from "./TransChaos";
import TransMatrix from "./TransMatrix";

const microApps = {
  TransMatrix: <TransMatrix />,
  TransChaos: <TransChaos />,
};

const notificationMessage = {
  0: "设为审核人员",
  1: "发布拒绝",
  2: "发布通过",
  4: "增量跟踪",
  5: "增量跟踪",
  6: "增量跟踪",
  7: "增量跟踪",
  10: "协作空间",
  11: "推送代码",
};

export default observer(function App() {
  const { activeApp, onActiveMenuChange, onLeftMenuSelect } =
    useStores().appStore;
  const { getUnReadedNumber, getCurrentMessage, updateNotificationRead, ws } =
    stores.messageStore;
  const { getUserInfo } = stores.profileStore;
  const navigate = useNavigate();
  const { onActiveTabChange } = stores.publishStore;
  const { theme } = useContext(ConfigContext);
  const { onStrategyTabChange } = useSpaceStore().strategyResearchStore;
  const { onFactorTabChange } = useSpaceStore().factorResearchStore;
  const {
    onGroupFactorTabChange,
    getFactorQuartzTeamJob,
    onFactorSelectedTeamChange,
  } = useSpaceStore().groupFactorStore;
  const {
    onGroupStrategyTabChange,
    getStrategyQuartzTeamJob,
    onStrategySelectedTeamChange,
  } = useSpaceStore().groupStrategyStore;

  const btn = (
    <Space>
      <Button type="link" size="small">
        查看
      </Button>
    </Space>
  );

  const onClick = (item: Message) => {
    updateNotificationRead(item.id);
    const event = strategy(item);
    if (!event) return;
    event.handler((event) => {
      onActiveMenuChange(event.menu);
      setTimeout(() => {
        onLeftMenuSelect(PersonalModule.PublishManage);
        navigate(event.path);
        if (event.type === 3) {
          onActiveTabChange(RecordTab.Approve);
        }

        if (event.type === 4) {
          onLeftMenuSelect(ResearchModule.Strategy);
          onStrategyTabChange(StrategyResearchTabEnum.IncreTracking);
        }

        if (event.type === 5) {
          onLeftMenuSelect(ResearchModule.GroupStrategy);
          onStrategySelectedTeamChange({ id: +item.data, name: "" });
          onGroupStrategyTabChange(StrategyResearchTabEnum.IncreTracking);
          getStrategyQuartzTeamJob({}, parseInt(item.data));
        }

        if (event.type === 6) {
          onLeftMenuSelect(ResearchModule.Factor);
          onFactorTabChange(FactorResearchTabEnum.IncreTracking);
        }

        if (event.type === 7) {
          onLeftMenuSelect(ResearchModule.GroupFactor);
          onFactorSelectedTeamChange({ id: +item.data, name: "" });
          onGroupFactorTabChange(FactorResearchTabEnum.IncreTracking);
          getFactorQuartzTeamJob({}, parseInt(item.data));
        }
      });
    });
  };

  const onMessage = (event: any) => {
    notification.info({
      key: event.id,
      description: event.message,
      duration: 3,
      btn: strategy(event) ? btn : null,
      message:
        notificationMessage[event.event as keyof typeof notificationMessage],
      onClick: () => {
        return onClick(event);
      },
    });
  };

  useMount(() => {
    getUserInfo();
    getUnReadedNumber();
  });

  useEffect(() => {
    const url = "/tquser/ws/notification";
    const ssToken = ls.getItem(USER_TOKEN);
    const newToken = getToken(ssToken, url);
    getCurrentMessage(newToken, onMessage);

    return () => {
      ws?.close();
    };
  }, []);

  return (
    <ConfigProvider
      prefixCls={antdClsPrefix}
      theme={theme}
      locale={theme.lang === "zh" ? zhCN : enUS}
    >
      <AdminPermission>
        {microApps[activeApp as "TransMatrix" | "TransChaos"]}
      </AdminPermission>
    </ConfigProvider>
  );
});
