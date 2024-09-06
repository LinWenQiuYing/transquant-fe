import { EditOutlined } from "@ant-design/icons";
import { THEME_CONFIG, USER_INFO } from "@transquant/constants";
import { GlobalConfigProvider, ThemeEditor } from "@transquant/ui";
import { ls, useTheme } from "@transquant/utils";
import { useMount } from "ahooks";
import { FloatButton } from "antd";
import "dayjs/locale/zh-cn";
import { useState } from "react";
import App from "./app";

export default function Main() {
  const { theme } = useTheme();
  const [themeVisible, setThemeVisible] = useState(false);

  const isAdmin = ls.getItem(USER_INFO)?.userInfo?.user?.username === "admin";
  const showFloatbutton = process.env.NODE_ENV === "development" || isAdmin;

  useMount(() => {
    const lsThemeToken = ls.getItem(THEME_CONFIG)?.token;

    if (lsThemeToken) {
      theme.onImportTheme?.(lsThemeToken);
    }
  });

  return (
    <GlobalConfigProvider theme={theme}>
      <App />
      {showFloatbutton && (
        <FloatButton
          icon={<EditOutlined />}
          shape="circle"
          badge={{ dot: true }}
          onClick={() => setThemeVisible(true)}
        />
      )}
      <ThemeEditor
        visible={themeVisible}
        onVisibleChange={(value) => {
          setThemeVisible(value);
        }}
        theme={theme}
      />
    </GlobalConfigProvider>
  );
}
