import { HomeOutlined } from "@ant-design/icons";
import { clsPrefix, paths } from "@transquant/constants";
import { useStores as useSpaceStores } from "@transquant/space/hooks";
import { IconFont } from "@transquant/ui";
import { useMount } from "ahooks";
import { Menu, MenuProps } from "antd";
import { observer } from "mobx-react-lite";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { MenuType, useMenu, useStores } from "../../../hooks";
import "./index.less";

export enum ResearchModule {
  Home = "home", // 首页
  ResearchEnv = "researchEnv", // 研究环境
  PersonalSpace = "personalSpace", // 个人空间
  Factor = "factor", // 因子研究
  Strategy = "strategy", // 策略研究
  FactorIncre = "personFactorIncre", // 因子增量跟踪
  StrategyIncre = "personStrategyIncre", // 策略增量跟踪
  ThirdParty = "thirdParty", // 第三方模块
  GroupSpace = "groupSpace", // 团队空间
  GroupStrategy = "groupStrategy", // 团队空间 策略研究
  GroupFactor = "groupFactor", // 团队空间 因子研究
  GroupStrategyIncre = "groupStrategyIncre", // 团队空间 策略增量跟踪
  GroupFactorIncre = "groupFactorIncre", // 团队空间 因子增量跟踪
  ShareSpace = "shareSpace",
  DataResource = "dataResource", // 数据资源
  ResearchResource = "researchResource", // 研究资源
  PublicFactor = "publicFactor", // 公共因子
  Scheduler = "scheduler",
}

const rootMenuKeys = [
  ResearchModule.PersonalSpace,
  ResearchModule.GroupSpace,
  ResearchModule.ResearchResource,
];

const items: MenuType[] = [
  {
    label: "首页",
    key: ResearchModule.Home,
    icon: <HomeOutlined />,
    code: "teamHome",
  },
  {
    label: "研究环境",
    key: ResearchModule.ResearchEnv,
    icon: <IconFont type="huanjingyanjiu" />,
    code: "env",
  },
  {
    label: "个人空间",
    key: ResearchModule.PersonalSpace,
    icon: <IconFont type="gerenkongjian" />,
    children: [
      {
        label: "因子研究",
        key: ResearchModule.Factor,
        code: "factor",
      },
      {
        label: "策略研究",
        key: ResearchModule.Strategy,
        code: "strategy",
      },
      {
        label: "因子增量跟踪",
        key: ResearchModule.FactorIncre,
        code: "privateFactorIncre",
      },
      {
        label: "策略增量跟踪",
        key: ResearchModule.StrategyIncre,
        code: "privateStrategyIncre",
      },
      {
        label: "第三方模块",
        key: ResearchModule.ThirdParty,
        code: "third",
      },
    ],
  },
  {
    label: "团队空间",
    key: ResearchModule.GroupSpace,
    icon: <IconFont type="tuanduikongjian" />,
    children: [
      {
        label: "因子研究",
        key: ResearchModule.GroupFactor,
        code: "groupFactor",
      },
      {
        label: "策略研究",
        key: ResearchModule.GroupStrategy,
        code: "groupStrategy",
      },
      {
        label: "因子增量跟踪",
        key: ResearchModule.GroupFactorIncre,
        code: "teamFactorIncre",
      },
      {
        label: "策略增量跟踪",
        key: ResearchModule.GroupStrategyIncre,
        code: "teamStrategyIncre",
      },
    ],
  },
  {
    label: "协作空间",
    key: ResearchModule.ShareSpace,
    icon: <IconFont type="gongxiangkongjian" />,
    code: "shareSpace",
  },
  {
    label: "数据资源",
    key: ResearchModule.DataResource,
    icon: <IconFont type="shujuziyuan" />,
    code: "data",
  },
  {
    label: "研究资源",
    key: ResearchModule.ResearchResource,
    icon: <IconFont type="ziyuan" />,
    children: [
      {
        label: "公共因子",
        key: ResearchModule.PublicFactor,
        code: "publicFactor",
      },
    ],
  },
  // process.env.NODE_ENV === "development" && {
  //   label: "调度中心",
  //   key: ResearchModule.Scheduler,
  //   icon: <IconFont type="ziyuan" />,
  // },
];

const routeMap = {
  [ResearchModule.Home]: paths.home,
  [ResearchModule.ResearchEnv]: paths.env,
  [ResearchModule.Factor]: paths.factor,
  [ResearchModule.Strategy]: paths.strategy,
  [ResearchModule.FactorIncre]: paths.factorIncre,
  [ResearchModule.StrategyIncre]: paths.strategyIncre,
  [ResearchModule.ThirdParty]: paths.third,
  [ResearchModule.DataResource]: paths.data,
  [ResearchModule.GroupFactor]: paths.groupFactor,
  [ResearchModule.GroupStrategy]: paths.groupStrategy,
  [ResearchModule.GroupFactorIncre]: paths.groupFactorIncre,
  [ResearchModule.GroupStrategyIncre]: paths.groupStrategyIncre,
  [ResearchModule.ShareSpace]: paths.share,
  [ResearchModule.PublicFactor]: paths.publicFactor,
  [ResearchModule.Scheduler]: paths.scheduler_create,
};

export default observer(function ResearchMenu() {
  const { appStore } = useStores();
  const { activeMenu, onLeftMenuSelect } = appStore;
  const { getPersonalImageInstances, enterIntoPrivateEnv, onHasEnvChange } =
    useSpaceStores().imageStore;
  const navigate = useNavigate();
  const [openKeys, setOpenKeys] = useState<string[]>([]);
  const menus = useMenu(items);

  useMount(() => {
    navigate(paths.home);
    onLeftMenuSelect(ResearchModule.Home);
  });

  const onOpenChange: MenuProps["onOpenChange"] = (keys) => {
    const latestOpenKey = keys.find((key) => openKeys.indexOf(key) === -1);

    if (
      latestOpenKey &&
      rootMenuKeys.indexOf(latestOpenKey as ResearchModule) === -1
    ) {
      setOpenKeys(keys);
    } else {
      setOpenKeys(latestOpenKey ? [latestOpenKey] : []);
    }
  };

  const onMenuSelect = async ({ key }: { key: string }) => {
    if (!key) return;

    if (key === ResearchModule.ResearchEnv) {
      const images = await getPersonalImageInstances();

      if (images?.length) {
        enterIntoPrivateEnv();
      }
      onHasEnvChange(!!images?.length);
    }

    onLeftMenuSelect(key as ResearchModule);
    navigate(routeMap[key as keyof typeof routeMap]);
  };

  return (
    <Menu
      mode="inline"
      openKeys={openKeys}
      onOpenChange={onOpenChange}
      onSelect={onMenuSelect}
      style={{ height: "calc(100vh - 340px)" }}
      className={`${clsPrefix}-left-sider-menu`}
      selectedKeys={[activeMenu]}
      items={menus}
    />
  );
});
