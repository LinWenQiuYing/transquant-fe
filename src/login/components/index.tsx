import { AdminPermission } from "@transquant/common";
import { antdClsPrefix } from "@transquant/constants";
import { GlobalConfigProvider } from "@transquant/ui";
import { ConfigProvider } from "antd";
import zhCN from "antd/lib/locale/zh_CN";
import "./index.less";
import LoginView from "./Login";

export default function Login() {
  return (
    <GlobalConfigProvider>
      <ConfigProvider prefixCls={antdClsPrefix} locale={zhCN}>
        <AdminPermission checkToken={false}>
          <LoginView />
        </AdminPermission>
      </ConfigProvider>
    </GlobalConfigProvider>
  );
}
