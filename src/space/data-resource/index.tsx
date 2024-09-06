import { useStores } from "@transquant/app/hooks";
import { BreadcrumbItem, ContentPanel, TitlePanel } from "@transquant/common";
import { clsPrefix, collapsedStyle, normalStyle } from "@transquant/constants";
import { Permission } from "@transquant/ui";
import { observer } from "mobx-react";
import ContentView from "./ContentView";
import { defaultRoutes } from "./helpers";
import "./index.less";
import LeftView from "./LeftView";

export default observer(function DataResource() {
  const { collapsed } = useStores().appStore;

  const getBreadcrumbItems = () => {
    const items: BreadcrumbItem[] = defaultRoutes;

    return items;
  };

  return (
    <Permission code="data">
      <ContentPanel
        className={`${clsPrefix}-data`}
        title={
          <TitlePanel
            items={getBreadcrumbItems()}
            style={collapsed ? collapsedStyle : normalStyle}
          />
        }
        portalCard={false}
        content={
          <div className={`${clsPrefix}-data-resource`}>
            <LeftView />
            <ContentView />
          </div>
        }
      />
    </Permission>
  );
});
