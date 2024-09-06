import { MutableTheme } from "@transquant/utils";
import { theme } from "antd";

const { token } = theme.defaultConfig;

/**
 * 量化平台类前缀
 */
export const clsPrefix = "trans-quant";

/**
 * antd类前缀
 */
export const antdClsPrefix = "trans-quant-antd";

/**
 * 主题
 */
export enum Theme {
  Light = "light",
  Dark = "dark",
}

export const defaultTheme: MutableTheme = {
  token: {
    /** 主题色 */
    colorPrimary: "#E31430",
    /** 基础文本色 */
    colorTextBase: "#000000e0",
    /** 基础背景色 */
    colorBgBase: token.colorBgBase,
    /** 成功色 */
    colorSuccess: token.colorSuccess,
    /** 警戒色 */
    colorWarning: token.colorWarning,
    /** 错误色 */
    colorError: token.colorError,
    /** 链接色 */
    colorLink: token.blue,
    /** 文字大小 */
    fontSize: token.fontSize,
    /** 尺寸步长 */
    sizeStep: token.sizeStep,
    /** 圆角 */
    borderRadius: token.borderRadius,
  },
};

/**
 * 初始用户默认密码
 */
export const OLD_PASSWORD = "66666666";

/**
 * 分页设置
 */
export const pageConfig = {
  size: "small",
  current: 1,
  pageSize: 10,
  defaultPageSize: 10,
  showSizeChanger: true,
  pageSizeOptions: ["3", "5", "10", "20", "50", "100"],
  showTotal: (total: number, range: [number, number]) =>
    `第 ${range[0]}-${range[1]} 条/总共 ${total} 条`,
};

export const NOOP = () => {};

export * from "./env";
export * from "./layout";
export * from "./reg";
export * from "./route";
export * from "./service";
export * from "./storage";
export * from "./utils";
