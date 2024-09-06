import { useStores as useAppStore } from "@transquant/app/hooks";
import { ContentPanel } from "@transquant/common";
import { collapsedStyle, normalStyle } from "@transquant/constants";
import { Permission } from "@transquant/ui";
import { observer } from "mobx-react";
import { defaultRoutes } from "./helpers";
import "./index.less";
import UserGroupList from "./UserGroupList";
import UserGroupMember from "./UserGroupMember";
import UserGroupPanel from "./UserGroupPanel";

const { Title } = ContentPanel;

export default observer(function UserGroup() {
  const { collapsed } = useAppStore().appStore;
  return (
    <Permission code="group">
      <div>
        <ContentPanel
          title={
            <Title
              items={defaultRoutes}
              style={collapsed ? collapsedStyle : normalStyle}
            />
          }
          portalCard={false}
          content={
            <div className="flex h-full p-5">
              <div className="w-[320px] h-full mr-4">
                <UserGroupList />
              </div>
              <div className="flex flex-col flex-1 gap-4">
                <UserGroupPanel />
                <UserGroupMember />
              </div>
            </div>
          }
        />
      </div>
    </Permission>
  );
});
