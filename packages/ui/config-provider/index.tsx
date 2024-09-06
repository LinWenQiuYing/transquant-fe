import { defaultTheme } from "@transquant/constants";
import { MutableTheme, omit, useMergeProps } from "@transquant/utils";
import { createContext } from "react";
import Empty from "../empty";
import defaultLocale from "../locale/default";
import { Locale } from "../locale/interface";
import { ConfigProviderProps } from "./interface";

type ConfigProviderPropsWithLocaleRequired = ConfigProviderProps & {
  locale: Locale;
  theme: MutableTheme;
};

function renderEmpty(componentName?: string) {
  switch (componentName) {
    default:
      return <Empty />;
  }
}

const defaultProps: ConfigProviderPropsWithLocaleRequired = {
  locale: defaultLocale,
  theme: defaultTheme,
  renderEmpty,
};

export const ConfigContext =
  createContext<ConfigProviderPropsWithLocaleRequired>({
    ...defaultProps,
  });

function ConfigProvider(baseProps: ConfigProviderProps) {
  const props = useMergeProps<ConfigProviderProps>(
    baseProps,
    defaultProps
  ) as ConfigProviderPropsWithLocaleRequired;

  const { children } = props;

  const config = {
    ...omit(props, ["children"]),
  };

  return (
    <ConfigContext.Provider value={config}>{children}</ConfigContext.Provider>
  );
}

export default ConfigProvider;
