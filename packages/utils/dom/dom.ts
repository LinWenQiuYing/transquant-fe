import { NOOP } from "@transquant/constants";

export const isServerRendering = (function () {
  try {
    return !(typeof window !== "undefined" && document !== undefined);
  } catch (e) {
    return true;
  }
})();

export const on = (function () {
  if (isServerRendering) {
    return NOOP;
  }
  return function (
    element: any,
    event: string,
    handler: EventListener | EventListenerObject | Function,
    options?: boolean | AddEventListenerOptions
  ) {
    element?.addEventListener(event, handler, options || false);
  };
})();

export const off = (function () {
  if (isServerRendering) {
    return NOOP;
  }
  return function (
    element: any,
    event: string,
    handler: EventListener | EventListenerObject | Function,
    options?: boolean | AddEventListenerOptions
  ) {
    element?.removeEventListener(event, handler, options || false);
  };
})();

export const contains = (root: HTMLElement, ele: Node | null) => {
  if (!root) {
    return false;
  }
  if (root.contains) {
    return root.contains(ele);
  }
  let node = ele;
  while (node) {
    if (node === root) {
      return true;
    }
    node = node.parentNode;
  }
  return false;
};

export const isScrollElement = (element: HTMLElement) => {
  const clientHeight =
    element === document.documentElement
      ? element.clientHeight
      : element.offsetHeight;
  const clientWidth =
    element === document.documentElement
      ? element.clientWidth
      : element.offsetWidth;

  return (
    element.scrollHeight > clientHeight || element.scrollWidth > clientWidth
  );
};

export default {};
