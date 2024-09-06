import { useStores } from "@transquant/app/hooks";
import { BreadcrumbItem, ContentPanel, TitlePanel } from "@transquant/common";
import {
  clsPrefix,
  collapsedStyle,
  normalStyle,
  paths,
} from "@transquant/constants";
import { Permission } from "@transquant/ui";
import { Nullable } from "@transquant/utils";
import { observer } from "mobx-react";
import { Outlet, useParams } from "react-router-dom";
import { useStores as useSpaceStores } from "../../hooks";
import { FactorBaseInfo } from "../../types";
import { defaultRoutes } from "./helpers";
import "./index.less";
import TabView from "./TabView";

export default observer(function FactorResearch() {
  const { collapsed } = useStores().appStore;
  const { factorBaseInfo } = useSpaceStores().factorResearchStore;
  const params = useParams();

  const getBreadcrumbItems = (factorBaseInfo: Nullable<FactorBaseInfo>) => {
    let items: BreadcrumbItem[] = defaultRoutes;

    if ("id" in params) {
      const path = `${paths.factor}/${params.id}`;
      items = items.filter((item) => item.title !== path);
      items.push({
        title: factorBaseInfo?.name,
        path,
      });
    } else {
      items.splice(1);
    }

    return items;
  };

  const render = () => {
    if (
      Reflect.ownKeys(params).includes("id") ||
      Reflect.ownKeys(params).includes("increid")
    ) {
      return <Outlet />;
    }

    return <TabView />;
  };

  return (
    <Permission code="factor">
      <ContentPanel
        className={`${clsPrefix}-factor-research`}
        title={
          <TitlePanel
            items={getBreadcrumbItems(factorBaseInfo)}
            style={collapsed ? collapsedStyle : normalStyle}
          />
        }
        portalCard={!Reflect.ownKeys(params).includes("id")}
        content={render()}
      />
    </Permission>
  );
});
