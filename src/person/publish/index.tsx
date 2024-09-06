import { useStores } from "@transquant/app/hooks";
import { BreadcrumbItem, ContentPanel, TitlePanel } from "@transquant/common";
import {
  clsPrefix,
  collapsedStyle,
  normalStyle,
  paths,
} from "@transquant/constants";
import { Nullable } from "@transquant/utils";
import { observer } from "mobx-react";
import { Outlet, useParams } from "react-router-dom";
import { useStores as usePublishStores } from "../hooks";
import { ApprovalInfo } from "../types";
import { defaultRoutes } from "./helpers";
import "./index.less";
import TabView from "./TabView";

export default observer(function PublishManage() {
  const { collapsed } = useStores().appStore;
  const { approvalInfo } = usePublishStores().publishStore;
  const params = useParams();

  const getBreadcrumbItems = (approvalInfo: Nullable<ApprovalInfo>) => {
    let items: BreadcrumbItem[] = defaultRoutes;

    if ("id" in params) {
      const path = `${paths.factor}/${params.id}`;
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

    return <TabView />;
  };

  return (
    <ContentPanel
      className={`${clsPrefix}-person-publish`}
      title={
        <TitlePanel
          items={getBreadcrumbItems(approvalInfo)}
          style={collapsed ? collapsedStyle : normalStyle}
        />
      }
      portalCard={!Reflect.ownKeys(params).includes("id")}
      content={render()}
    />
  );
});
