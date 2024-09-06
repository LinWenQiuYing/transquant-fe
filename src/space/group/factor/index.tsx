import { useStores } from "@transquant/app/hooks";
import { BreadcrumbItem, ContentPanel, TitlePanel } from "@transquant/common";
import {
  clsPrefix,
  collapsedStyle,
  normalStyle,
  paths,
} from "@transquant/constants";
import { Permission } from "@transquant/ui";
import { observer } from "mobx-react";
import { Outlet, useParams } from "react-router-dom";
import { useStores as useSpaceStores } from "../../hooks";
import { defaultRoutes } from "./helpers";
import "./index.less";
import TabView from "./TabView";

export default observer(function GroupFactor() {
  const { collapsed } = useStores().appStore;
  const { factorBaseInfo } = useSpaceStores().groupFactorStore;
  const params = useParams();

  const getBreadcrumbItems = () => {
    let items: BreadcrumbItem[] = defaultRoutes;

    if ("id" in params) {
      const path = `${paths.groupFactor}/${params.id}`;
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
    <Permission code="groupFactor">
      <ContentPanel
        className={`${clsPrefix}-factor-group`}
        title={
          <TitlePanel
            items={getBreadcrumbItems()}
            style={collapsed ? collapsedStyle : normalStyle}
          />
        }
        portalCard={!Reflect.ownKeys(params).includes("id")}
        content={render()}
      />
    </Permission>
  );
});
