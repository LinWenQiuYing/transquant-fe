import { useStores } from "@transquant/app/hooks";
import { BreadcrumbItem, ContentPanel, TitlePanel } from "@transquant/common";
import { clsPrefix, collapsedStyle, normalStyle } from "@transquant/constants";
import { observer } from "mobx-react";
import { defaultRoutes } from "./helpers";
import "./index.less";
import LabelView from "./LabelView";

export default observer(function Profile() {
  const { collapsed } = useStores().appStore;

  const getBreadcrumbItems = () => {
    const items: BreadcrumbItem[] = defaultRoutes;

    return items;
  };

  return (
    <ContentPanel
      title={
        <TitlePanel
          items={getBreadcrumbItems()}
          style={collapsed ? collapsedStyle : normalStyle}
        />
      }
      className={`${clsPrefix}-person-label`}
      portalCard={false}
      content={<LabelView />}
    />
  );
});
