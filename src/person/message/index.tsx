import { useStores } from "@transquant/app/hooks";
import { BreadcrumbItem, ContentPanel, TitlePanel } from "@transquant/common";
import { clsPrefix, collapsedStyle, normalStyle } from "@transquant/constants";
import { observer } from "mobx-react";
import { defaultRoutes } from "./helpers";
import "./index.less";
import MessageList from "./MessageList";

export default observer(function MessageManage() {
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
      cardTitle="消息列表"
      className={`${clsPrefix}-message`}
      content={<MessageList />}
    />
  );
});
