import { useStores } from "@transquant/app/hooks";
import { BreadcrumbItem, ContentPanel, TitlePanel } from "@transquant/common";
import { collapsedStyle, normalStyle } from "@transquant/constants";
import { Permission } from "@transquant/ui";
import { observer } from "mobx-react";
import EnvironmentList from "./environment-list";
import { defaultRoutes } from "./helpers";

export default observer(function EnvironmentManage() {
  const { collapsed } = useStores().appStore;

  const getBreadcrumbItems = () => {
    const items: BreadcrumbItem[] = defaultRoutes;

    return items;
  };

  return (
    <Permission code="etl_env">
      <ContentPanel
        title={
          <TitlePanel
            items={getBreadcrumbItems()}
            style={collapsed ? collapsedStyle : normalStyle}
          />
        }
        portalCard={false}
        content={<EnvironmentList />}
      />
    </Permission>
  );
});
