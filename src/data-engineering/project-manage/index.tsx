import { useStores as appStores } from "@transquant/app/hooks";
import { BreadcrumbItem, ContentPanel, TitlePanel } from "@transquant/common";
import { collapsedStyle, normalStyle, paths } from "@transquant/constants";
import { Permission } from "@transquant/ui";
import { observer } from "mobx-react";
import { Outlet, useParams } from "react-router-dom";
import { useStores } from "../hooks";
import { defaultRoutes } from "./helpers";
import ProjectList from "./project-list";

export default observer(function ProjectManage() {
  const { collapsed } = appStores().appStore;
  const { projectInfo } = useStores().projectManageStore;
  const params = useParams();

  const getBreadcrumbItems = () => {
    let items: BreadcrumbItem[] = defaultRoutes;

    if ("id" in params) {
      const path = `${paths.projectManage}/${params.id}`;
      items = items.filter((item) => item.title !== path);
      items.push({
        title: projectInfo?.name,
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

    return <ProjectList />;
  };

  return (
    <Permission code="etl_project">
      <ContentPanel
        title={
          <TitlePanel
            items={getBreadcrumbItems()}
            style={collapsed ? collapsedStyle : normalStyle}
          />
        }
        portalCard={false}
        content={render()}
      />
    </Permission>
  );
});
