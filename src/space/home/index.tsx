import { useStores } from "@transquant/app/hooks";
import { BreadcrumbItem, ContentPanel, TitlePanel } from "@transquant/common";
import { collapsedStyle, normalStyle, USER_INFO } from "@transquant/constants";
import NoPermissionPage from "@transquant/ui/permission/NoPermissionPage";
import { ls } from "@transquant/utils";
import { useUnmount } from "ahooks";
import { observer } from "mobx-react";
import { useStores as useSpaceStore } from "../hooks";
import { defaultRoutes } from "./helpers";
import "./index.less";
import Panel from "./Panel";
import TabView from "./TabView";

export default observer(() => {
  const { collapsed } = useStores().appStore;
  const { reset } = useSpaceStore().homeStore;

  const getBreadcrumbItems = () => {
    const items: BreadcrumbItem[] = defaultRoutes;

    return items;
  };

  const userInfo = ls.getItem(USER_INFO);
  const isAdmin = userInfo?.userInfo?.user?.username === "admin";

  useUnmount(() => {
    reset();
  });

  return (
    <>
      {isAdmin ? (
        <NoPermissionPage />
      ) : (
        <ContentPanel
          className="h-full overflow-hidden"
          title={
            <TitlePanel
              items={getBreadcrumbItems()}
              style={collapsed ? collapsedStyle : normalStyle}
            />
          }
          portalCard={false}
          content={
            <div className="flex justify-between p-5 overflow-hidden">
              <TabView />
              <Panel />
            </div>
          }
        />
      )}
    </>
  );
});
