import { useStores } from "@transquant/app/hooks";
import { BreadcrumbItem, ContentPanel, TitlePanel } from "@transquant/common";
import { clsPrefix, collapsedStyle, normalStyle } from "@transquant/constants";
import { Permission } from "@transquant/ui";
import { useMount, useUnmount } from "ahooks";
import { Select, SelectProps, Tabs, TabsProps } from "antd";
import { observer } from "mobx-react";
import { useState } from "react";
import { useStores as useSpaceStores } from "../hooks";
import { defaultRoutes } from "./helpers";
import "./index.less";
import InstalledModule from "./InstalledModule";

enum FactorResearchTabEnum {
  InstalledModule = "installedModule",
}

const items: TabsProps["items"] = [
  {
    key: FactorResearchTabEnum.InstalledModule,
    label: "已安装python模块",
    children: <InstalledModule />,
  },
];

export default observer(function TabView() {
  const { collapsed } = useStores().appStore;
  const { getJupyterLabEnv, labEnvList, getPythonModule, reset } =
    useSpaceStores().thirdPartyStore;
  const [activeTab, setActiveTab] = useState(
    FactorResearchTabEnum.InstalledModule
  );

  useMount(() => {
    getJupyterLabEnv();
  });

  useUnmount(() => {
    reset();
  });

  const onChange = (key: string) => {
    setActiveTab(key as FactorResearchTabEnum);
  };

  const getBreadcrumbItems = () => {
    const items: BreadcrumbItem[] = defaultRoutes;

    return items;
  };

  const onLabChange: SelectProps["onChange"] = (value) => {
    getPythonModule({ envToken: value });
  };

  const extraEl = (
    <Select
      onChange={onLabChange}
      style={{ width: "200px" }}
      placeholder="请选择镜像环境"
    >
      {labEnvList.map((item) => (
        <Select.Option key={item.id} value={item.token}>
          {item.name}
        </Select.Option>
      ))}
    </Select>
  );

  return (
    <Permission code="third">
      <ContentPanel
        className={`${clsPrefix}-third-party`}
        title={
          <TitlePanel
            items={getBreadcrumbItems()}
            style={collapsed ? collapsedStyle : normalStyle}
          />
        }
        content={
          <Tabs
            items={items}
            onChange={onChange}
            activeKey={activeTab}
            tabBarExtraContent={extraEl}
          />
        }
      />
    </Permission>
  );
});
