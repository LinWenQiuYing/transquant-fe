/**
 * 左侧边栏展开宽度
 */
export const LEFT_SIDER_WIDTH = 160;

/**
 * 左侧边栏收缩宽度
 */
export const LEFT_SIDER_COLLAPSED_WIDTH = 50;

/**
 * 顶部栏高度
 */
export const TOP_HEADER_HEIGHT = 50;

export const normalStyle: React.CSSProperties = {
  transform: "translateX(0px)",
  transition: "all 0.3s",
};

export const collapsedStyle: React.CSSProperties = {
  transform: "translateX(40px)",
  transition: "all 0.3s",
};

export default {};
