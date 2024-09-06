import { useStores } from "@transquant/app/hooks";
import { BreadcrumbItem, ContentPanel, TitlePanel } from "@transquant/common";
import { collapsedStyle, normalStyle, paths } from "@transquant/constants";
import { useStores as usePersonalStores } from "@transquant/person/hooks";
import { ApprovalInfo } from "@transquant/person/types";
import { Permission } from "@transquant/ui";
import { Nullable } from "@transquant/utils";
import { observer } from "mobx-react";
import { Outlet, useParams } from "react-router-dom";
import ApprovalView from "./ApprovalView";
import { defaultRoutes } from "./helpers";
import "./index.less";

export default observer(function LogManage() {
  const { collapsed } = useStores().appStore;
  const { approvalInfo } = usePersonalStores().publishStore;
  const params = useParams();

  const getBreadcrumbItems = (approvalInfo: Nullable<ApprovalInfo>) => {
    let items: BreadcrumbItem[] = defaultRoutes;

    if ("id" in params) {
      const path = `${paths.approval}/${params.id}`;
      items = items.filter((item) => item.title !== path);
      items.push({
        title: approvalInfo?.code,
        path,
      });
    } else {
      items.splice(1);
    }

    return items;
  };

  const render = () => {
    if (Reflect.ownKeys(params).includes("id")) {
      return <Outlet />;
    }

    return <ApprovalView />;
  };

  return (
    <Permission code="approval">
      <ContentPanel
        title={
          <TitlePanel
            items={getBreadcrumbItems(approvalInfo)}
            style={collapsed ? collapsedStyle : normalStyle}
          />
        }
        portalCard={false}
        cardTitle="审计日志"
        content={render()}
      />
    </Permission>
  );
});
