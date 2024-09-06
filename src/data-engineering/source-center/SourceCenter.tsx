import { useStores } from "@transquant/app/hooks";
import { BreadcrumbItem, ContentPanel, TitlePanel } from "@transquant/common";
import { collapsedStyle, normalStyle } from "@transquant/constants";
import { observer } from "mobx-react";
import { defaultRoutes } from "./helpers";
import SourceList from "./source-list";

export default observer(function SourceCenter({
  readonly = true,
}: {
  readonly: boolean;
}) {
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
      portalCard={false}
      content={<SourceList readonly={readonly} />}
    />
  );
});
