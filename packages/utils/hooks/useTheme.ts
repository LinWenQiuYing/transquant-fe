import { defaultTheme, THEME_CONFIG } from "@transquant/constants";
import { ThemeConfig } from "antd";
import { AliasToken } from "antd/es/theme/internal";
import { cloneDeep } from "lodash-es";
import { useState } from "react";
import { ls } from "../storage";
import { AnyObject } from "../type";

type ThemeToken = keyof Partial<AliasToken> | "lang";

export interface MutableTheme extends ThemeConfig {
  lang?: "zh" | "en";
  onThemeChange?: (path: ThemeToken, value: string | number) => void;
  onImportTheme?: (token: ThemeConfig["token"]) => void;
  onAbort?: (path: keyof Partial<AliasToken>) => void;
  onReset?: () => void;
}

export type UseTheme = (options?: { defaultTheme?: ThemeConfig }) => {
  theme: MutableTheme;
};

const useTheme: UseTheme = () => {
  const [theme, setTheme] = useState<Partial<MutableTheme>>({
    ...defaultTheme,
    lang: "zh",
  });

  const storage = (theme?: ThemeConfig) => {
    ls.setItem(THEME_CONFIG, theme || "");
  };

  const onThemeChange = (path: ThemeToken, value?: unknown) => {
    const newTheme = cloneDeep(theme);
    if (path === "lang") {
      newTheme.lang = value as MutableTheme["lang"];
    } else {
      (newTheme.token as AnyObject)[path as ThemeToken] = value;
    }

    setTheme(newTheme);
    storage(newTheme);
  };

  const onAbortTheme = (path: keyof Partial<AliasToken>) => {
    onThemeChange(path, defaultTheme.token?.[path]);
  };

  const onImportTheme = (token: ThemeConfig["token"]) => {
    const newTheme = cloneDeep(theme);
    newTheme.token = token;
    setTheme(newTheme);
    storage(newTheme);
  };

  const onReset = () => {
    setTheme(defaultTheme);
    storage();
  };

  return {
    theme: {
      ...theme,
      onReset,
      onThemeChange,
      onImportTheme,
      onAbort: onAbortTheme,
    },
  };
};

export default useTheme;
