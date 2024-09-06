import { PersonalModule } from "@transquant/app";
import { ManageCenterModule } from "@transquant/app/components/left/menu/ManageMenu";
import { ResearchModule } from "@transquant/app/components/left/menu/ResearchMenu";
import { paths } from "@transquant/constants";
import { RecordTab } from "@transquant/person/publish/TabView";
import { Message } from "@transquant/person/types";
import { find } from "lodash-es";
import { ModuleType } from "../../app/components/left/NavMenu";
import { StrategyResearchTabEnum } from "../../space/group/strategy/TabView";
import { FactorResearchTabEnum } from "../../space/personal/factor-research/TabView";

type Handler<T> = (item: T) => void;

type EventItem = {
  type: number;
  menu: ModuleType;
  leftMenu: string;
  path: string;
  activeTab?: string | any;
  handler: Handler<(item: EventItem) => void>;
};

export function strategy(item: Message) {
  const eventMap: EventItem[] = [
    {
      type: 1, // 发布拒绝
      menu: "personal",
      leftMenu: PersonalModule.PublishManage,
      path: `${paths.publish}/application/${item.data}`,
      activeTab: RecordTab.Approve,
      handler(callback) {
        const _event = find(eventMap, (event) => event.type === item.event);
        if (!_event) return;

        callback(_event);
      },
    },
    {
      type: 2, // 发布通过
      menu: "personal",
      leftMenu: PersonalModule.PublishManage,
      path: `${paths.publish}/application/${item.data}`,
      activeTab: RecordTab.Approve,
      handler(callback) {
        const _event = find(eventMap, (event) => event.type === item.event);
        if (!_event) return;

        callback(_event);
      },
    },
    {
      type: 3, // 通知审核
      menu: "personal",
      leftMenu: PersonalModule.PublishManage,
      path: `${paths.publish}/approve/${item.data}`,
      activeTab: RecordTab.Approve,
      handler(callback) {
        const _event = find(eventMap, (event) => event.type === item.event);
        if (!_event) return;

        callback(_event);
      },
    },
    {
      type: 4, // 个人策略任务通知
      menu: "research",
      leftMenu: ResearchModule.Strategy,
      path: `${paths.strategy}`,
      activeTab: StrategyResearchTabEnum.IncreTracking,
      handler(callback) {
        const _event = find(eventMap, (event) => event.type === item.event);
        if (!_event) return;

        callback(_event);
      },
    },
    {
      type: 5, // 团队策略任务通知
      menu: "research",
      leftMenu: ResearchModule.GroupStrategy,
      path: `${paths.groupStrategy}`,
      activeTab: StrategyResearchTabEnum.IncreTracking,
      handler(callback) {
        const _event = find(eventMap, (event) => event.type === item.event);
        if (!_event) return;

        callback(_event);
      },
    },
    {
      type: 6, // 个人因子任务通知
      menu: "research",
      leftMenu: ResearchModule.Factor,
      path: `${paths.factor}`,
      activeTab: FactorResearchTabEnum.IncreTracking,
      handler(callback) {
        const _event = find(eventMap, (event) => event.type === item.event);
        if (!_event) return;

        callback(_event);
      },
    },
    {
      type: 7, // 个人策略任务通知
      menu: "research",
      leftMenu: ResearchModule.GroupFactor,
      path: `${paths.groupFactor}`,
      activeTab: FactorResearchTabEnum.IncreTracking,
      handler(callback) {
        const _event = find(eventMap, (event) => event.type === item.event);
        if (!_event) return;

        callback(_event);
      },
    },
    {
      type: 10, // 新建协作空间
      menu: "research",
      leftMenu: ResearchModule.ShareSpace,
      path: `${paths.share}`,
      handler(callback) {
        const _event = find(eventMap, (event) => event.type === item.event);
        if (!_event) return;

        callback(_event);
      },
    },
    {
      type: 11, // 推送代码
      menu: "research",
      leftMenu: ResearchModule.ShareSpace,
      path: `${paths.share}`,
      handler(callback) {
        const _event = find(eventMap, (event) => event.type === item.event);
        if (!_event) return;

        callback(_event);
      },
    },
    {
      type: 17,
      menu: "manage",
      leftMenu: ManageCenterModule.EnvManage,
      path: `${paths.environment}`,
      handler(callback) {
        const _event = find(eventMap, (event) => event.type === item.event);
        if (!_event) return;

        callback(_event);
      },
    },
  ];

  return eventMap.find((event) => event.type === item.event);
}

export default {};
