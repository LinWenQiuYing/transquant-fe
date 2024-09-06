import { clsPrefix } from "@transquant/constants";
import { Scrollbar } from "@transquant/ui";
import { cls } from "@transquant/utils";
import { Card } from "antd";
import { observer } from "mobx-react";
import React from "react";
import { When } from "react-if";
import "./index.less";

interface ContentPanelProps {
  title?: React.ReactNode;
  content?: React.ReactNode;
  extra?: React.ReactNode;
  cardTitle?: string;
  className?: string;
  style?: React.CSSProperties;
  portalCard?: boolean; // content 是否渲染在card内部
}

export default observer(function ContentPanel(props: ContentPanelProps) {
  const {
    title,
    content,
    extra,
    cardTitle,
    className,
    style,
    portalCard = true,
  } = props;
  return (
    <div className={cls(`${clsPrefix}-content-panel`, className)} style={style}>
      {title}
      <When condition={content !== undefined}>
        {portalCard ? (
          <Card
            className={`${clsPrefix}-content-panel-card`}
            title={cardTitle}
            extra={extra}
          >
            {content}
          </Card>
        ) : (
          <Scrollbar style={{ height: "calc(100vh - 54px)" }}>
            {content}
          </Scrollbar>
        )}
      </When>
    </div>
  );
});
