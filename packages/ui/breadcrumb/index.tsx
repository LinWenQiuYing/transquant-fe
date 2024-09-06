import { clsPrefix } from "@transquant/constants";
import { Breadcrumb as AndBreadcrumb } from "antd";
import classNames from "classnames";
import { Else, If, Then } from "react-if";
import { Link } from "react-router-dom";
import "./index.less";

export type BreadcrumbItem = {
  name: string;
  path: string;
};

interface BreadcrumbProps {
  items: BreadcrumbItem[];
  className?: string;
}

export default function Breadcrumb(props: BreadcrumbProps) {
  const { items, className } = props;

  return (
    <AndBreadcrumb className={classNames(`${clsPrefix}-breadcrumb`, className)}>
      {items.map((item, index) => (
        <AndBreadcrumb.Item key={index}>
          <If condition={index === items.length - 1}>
            <Then>
              <span>{item.name}</span>
            </Then>
            <Else>
              <Link to={item.path}>{item.name}</Link>
            </Else>
          </If>
        </AndBreadcrumb.Item>
      ))}
    </AndBreadcrumb>
  );
}
