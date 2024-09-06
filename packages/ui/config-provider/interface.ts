import { ThemeConfig } from "antd";
import { ReactNode } from "react";
import { Locale } from "../locale/interface";

export interface ConfigProviderProps {
  locale?: Locale;
  theme?: ThemeConfig;
  renderEmpty?: (componentName?: string) => ReactNode;
  children?: ReactNode;
}

export default {};
