import { useStores as useAppStore } from "@transquant/app/hooks";
import { BreadcrumbItem, ContentPanel, TitlePanel } from "@transquant/common";
import { clsPrefix, collapsedStyle, normalStyle } from "@transquant/constants";
import { Permission } from "@transquant/ui";
import { observer } from "mobx-react";
import ContentView from "./components";
import GroupList from "./GroupList";
import GroupPanel from "./GroupPanel";
import { defaultRoutes } from "./helpers";

export default observer(function OrganizationManage() {
  const { collapsed } = useAppStore().appStore;
  // const { groups } = useStores().organizationStore;

  const getBreadcrumbItems = () => {
    const items: BreadcrumbItem[] = defaultRoutes;

    return items;
  };

  return (
    <Permission code="organization">
      <div className={`${clsPrefix}-organization`}>
        <ContentPanel
          title={
            <TitlePanel
              items={getBreadcrumbItems()}
              style={collapsed ? collapsedStyle : normalStyle}
            />
          }
          portalCard={false}
          content={
            <div className="flex h-full p-5">
              <div className="min-w-[320px] w-[320px] h-full mr-4">
                <GroupList />
              </div>
              <div className="flex flex-col flex-1 gap-4 overflow-hidden">
                <GroupPanel />
                <ContentView />
              </div>
            </div>
          }
        />
      </div>
    </Permission>
  );
});
