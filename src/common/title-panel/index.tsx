import { clsPrefix } from "@transquant/constants";
import { Breadcrumb } from "antd";
import { Link } from "react-router-dom";
import "./index.less";

export type BreadcrumbItem = {
  path?: string;
  title?: string;
};

interface TitlePanelProps {
  items: BreadcrumbItem[];
  style?: React.CSSProperties;
}

export default function TitlePanel(props: TitlePanelProps) {
  const { items, style } = props;

  return (
    <Breadcrumb
      className={`${clsPrefix}-title-panel`}
      items={items}
      style={style}
      itemRender={(route, params, routes) => {
        const last =
          routes.findIndex((item) => item.title === route.title) ===
          routes.length - 1;

        return last ? (
          <span>{route.title}</span>
        ) : (
          <Link to={route.path!}>{route.title}</Link>
        );
      }}
    />
  );
}
