import { USER_INFO } from "@transquant/constants";
import { ls } from "@transquant/utils";
import React from "react";
import "./index.less";
import NoPermissionPage from "./NoPermissionPage";
import { PermissionType } from "./type";

type BasePermission = {
  code: PermissionType;
  children?: React.ReactNode;
};

type DisablePermission = {
  disabled?: boolean; // 节点元素是否禁用
} & BasePermission;

type HiddenPermission = {
  hidden?: boolean; // 节点元素的隐藏/显示
} & BasePermission;

type PermissionProps = DisablePermission & HiddenPermission;

export function getAccess(name?: PermissionType) {
  if (!name) return false;
  const userInfo = ls.getItem(USER_INFO)?.userInfo;
  const access = userInfo?.menuCodes.includes(name);
  return access;
}

export default function Permission(props: PermissionProps) {
  const { code, hidden, disabled, children } = props;

  const userInfo = ls.getItem(USER_INFO)?.userInfo;
  const access = userInfo?.menuCodes.includes(code);

  let el = children;

  const renderChildren = (child: React.ReactNode): React.ReactNode => {
    if (React.isValidElement(child)) {
      // 递归渲染子节点,并添加 disabled 属性
      return React.cloneElement(
        child as React.ReactElement<{ disabled: boolean }>,
        {
          disabled:
            !access || (child.props as { disabled?: boolean })?.disabled,
        },
        React.Children.map(child.props?.children, renderChildren)
      );
    }
    // 如果 child 是一个数组
    if (Array.isArray(child)) {
      // 递归渲染每个子节点,并添加 disabled 属性
      return child.map(renderChildren);
    }
    // 其他情况直接返回 child
    return child;
  };

  if (disabled) {
    el = React.Children.map(children, renderChildren);
  }

  if (hidden) {
    el = access ? el : null;
  }

  if (!disabled && !hidden) {
    el = access ? el : <NoPermissionPage />;
  }

  return <>{el}</>;
}

export * from "./type";
