import { ajax } from "@transquant/utils";
import React, { PropsWithChildren } from "react";
import { useStores } from "../../person/hooks";
import useHeartBeat from "./use-heartbeat";

interface AdminPermissionProps {
  checkToken?: boolean;
}

/** Todo 后续权限功能开发 */
type UserResource = {};

const initialValue: UserResource | null = null;
const context = React.createContext(initialValue);
const AdminProvider = context.Provider;

export default function AdminPermission(
  props: PropsWithChildren<AdminPermissionProps>
) {
  const { checkToken = true } = props;
  const { onUnReadedNumberChange } = useStores().messageStore;

  const callback = () => {
    ajax({
      url: `/tquser/user/userSessionHeartBeat`,
      success: (data) => {
        onUnReadedNumberChange(data);
      },
    });
  };

  useHeartBeat({
    checkToken,
    callback,
  });

  return <AdminProvider value={null}>{props.children}</AdminProvider>;
}
