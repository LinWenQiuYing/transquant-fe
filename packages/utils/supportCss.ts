import { isUndefined } from "./is";

const supportCss = (key: string, value: string) => {
  if (typeof window !== "undefined" && window.CSS && window.CSS.supports) {
    if (!isUndefined(value)) {
      return window.CSS.supports(key, value);
    }

    return window.CSS.supports(key);
  }

  if (typeof document !== "undefined" && document.createElement) {
    const elem = document.createElement("div");
    elem.setAttribute("style", `${key}:${value}`);

    return typeof elem.style[key as keyof typeof elem.style] !== "undefined";
  }

  return false;
};

// supportCss("display", "-webkit-box");
// supportCss("-webkit-line-clamp", "2");

export default supportCss;
