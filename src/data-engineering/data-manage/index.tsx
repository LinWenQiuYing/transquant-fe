import { useStores as appStores } from "@transquant/app/hooks";
import { ContentPanel, TitlePanel } from "@transquant/common";
import { collapsedStyle, normalStyle } from "@transquant/constants";
import { Permission } from "@transquant/ui";
import { observer } from "mobx-react";
import FileView from "./FileView";
import { defaultRoutes } from "./helpers";

export default observer(function DataManage() {
  const { collapsed } = appStores().appStore;

  return (
    <Permission code="etl_project">
      <ContentPanel
        title={
          <TitlePanel
            items={defaultRoutes}
            style={collapsed ? collapsedStyle : normalStyle}
          />
        }
        portalCard={false}
        content={<FileView />}
      />
    </Permission>
  );
});
