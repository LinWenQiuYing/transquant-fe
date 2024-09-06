import type { KeyboardEvent, KeyboardEventHandler } from "react";
import { useCallback } from "react";
import { ArrowDown, ArrowLeft, ArrowRight, ArrowUp, Enter } from "../keycode";

type CallBackEventType =
  | "onPressEnter"
  | "onArrowUp"
  | "onArrowRight"
  | "onArrowDown"
  | "onArrowLeft";

interface KeyboardEventProps {
  onKeyDwon?: KeyboardEventHandler;
}

export default function useKeyboardEvent(props?: KeyboardEventProps) {
  const getEventListeners = useCallback(
    (callbacks: {
      [key in CallBackEventType]?: (e: KeyboardEvent<Element>) => void;
    }) => {
      return {
        onKeyDown: (e: KeyboardEvent<Element>) => {
          const keyCode = e.keyCode || e.which;

          switch (keyCode) {
            case Enter.code:
              callbacks.onPressEnter?.(e);
              break;
            case ArrowUp.code:
              callbacks.onArrowUp?.(e);
              break;
            case ArrowRight.code:
              callbacks.onArrowRight?.(e);
              break;
            case ArrowDown.code:
              callbacks.onArrowDown?.(e);
              break;
            case ArrowLeft.code:
              callbacks.onArrowLeft?.(e);
              break;
            default:
              break;
          }

          props?.onKeyDwon?.(e);
        },
      };
    },
    []
  );

  return getEventListeners;
}

// example
// const getKeyboardEvents = useKeyboardEvent({ onKeyDown: props.onKeyDown });

// <img
//   {...getKeyboardEvents({
//     onPressEnter: onImgClick,
//   })}
// />
