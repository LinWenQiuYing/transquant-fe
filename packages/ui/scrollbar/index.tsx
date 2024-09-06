import { clsPrefix } from "@transquant/constants";
import { useBoolean } from "ahooks";
import classNames from "classnames";
import React from "react";
import Scrollbar, { ScrollbarProps, Scrollbars } from "react-custom-scrollbars";
import "./index.less";

export type _Scrollbars = Scrollbars;

type ScrollbarRef =
  | ((instance: Scrollbars | null) => void)
  | React.MutableRefObject<Scrollbars | null>
  | null;

interface ScrollbarNewProps extends ScrollbarProps {
  onYReachEnd?: () => void;
  onScrollDown?: () => void;
}

const ScrollbarNew = React.forwardRef(
  (props: ScrollbarNewProps, ref: ScrollbarRef) => {
    const { className = "", onYReachEnd, onScrollDown, ...restProps } = props;
    const [isActive, { setTrue, setFalse }] = useBoolean(false);
    const clsNameStr = classNames(
      `${clsPrefix}-scrollbar ${className}`.trim(),
      {
        active: isActive,
      }
    );

    const onScroll = (e: any) => {
      const { scrollTop, scrollHeight, clientHeight } = e.target;
      // 滚动到底部
      if (scrollHeight - clientHeight - scrollTop === 0) {
        if (onYReachEnd) {
          onYReachEnd();
        }
      }
    };

    const onWheel = (e: any) => {
      // 向下滚动
      if (e.nativeEvent.deltaY > 0) {
        if (onScrollDown) {
          onScrollDown();
        }
      }
    };

    return (
      <Scrollbar
        ref={ref}
        autoHide
        universal
        onScroll={onScroll}
        onWheel={onWheel}
        hideTracksWhenNotNeeded
        className={clsNameStr}
        onMouseEnter={setTrue}
        onMouseLeave={setFalse}
        autoHideTimeout={0}
        {...restProps}
      />
    );
  }
);

export default ScrollbarNew;
