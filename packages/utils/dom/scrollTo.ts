import { isWindow, raf } from "..";
import { easeInOutCubic } from "./easings";
import getScroll from "./getScroll";

interface ScrollToOptions {
  getContainer?: () => HTMLElement | Window | Document;
  callback?: () => void;
  duration?: number;
}

export default function scrollTo(y: number, options: ScrollToOptions = {}) {
  const { getContainer = () => window, callback, duration = 450 } = options;
  const container = getContainer();
  const scrollTop = getScroll(container, true);
  const startTime = Date.now();

  const frameFunc = () => {
    const timestamp = Date.now();
    const time = timestamp - startTime;
    const nextScrollTop = easeInOutCubic(
      time > duration ? duration : time,
      scrollTop,
      y,
      duration
    );

    if (isWindow(container)) {
      container.scrollTo(window.pageXOffset, nextScrollTop);
    } else if (
      container instanceof Document ||
      container.constructor.name === "HTMLDocument"
    ) {
      (container as Document).documentElement.scrollTop = nextScrollTop;
    } else {
      (container as HTMLElement).scrollTop = nextScrollTop;
    }

    if (time < duration) {
      raf(frameFunc);
    } else if (typeof callback === "function") {
      callback();
    }
  };

  raf(frameFunc);
}
