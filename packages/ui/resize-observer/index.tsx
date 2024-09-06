import { invariant } from "@transquant/utils";
import React from "react";
import { findDOMNode } from "react-dom";
import ResizeObserver from "resize-observer-polyfill";

export interface ResizeProps {
  onResize?: (entry: ResizeObserverEntry[]) => void;
  children?: React.ReactNode;
}

class ResizeObserverComponent extends React.Component<ResizeProps> {
  resizeObserver: ResizeObserver | null | undefined;

  componentDidMount() {
    if (!React.isValidElement(this.props.children)) {
      invariant(false, "The children of ResizeObserver is invalid.");
    } else {
      this.createResizeObserver();
    }
  }

  componentDidUpdate() {
    if (!this.resizeObserver && findDOMNode(this)) {
      this.createResizeObserver();
    }
  }

  componentWillUnmount(): void {
    if (this.resizeObserver) {
      this.destroyResizeObserver();
    }
  }

  createResizeObserver = () => {
    this.resizeObserver = new ResizeObserver((entry) => {
      const { onResize } = this.props;
      onResize?.(entry);
    });
    this.resizeObserver.observe(findDOMNode(this) as Element);
  };

  destroyResizeObserver = () => {
    this.resizeObserver?.disconnect();
    this.resizeObserver = null;
  };

  render() {
    return this.props.children;
  }
}

export default ResizeObserverComponent;
