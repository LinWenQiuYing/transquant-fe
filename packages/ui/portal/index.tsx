/* eslint-disable no-return-assign */
import { Component, ReactNode } from "react";
import Portal from "./Portal";

interface PortalWrapperProps {
  getContainer?: () => Element;
  forceRender?: boolean;
  visible?: boolean;
  children?: ReactNode;
}

class PortalWrapper extends Component<PortalWrapperProps> {
  static displayName = "Portal";

  static defaultProps = {
    getContainer: () => document.body,
  };

  instance: Portal | null | undefined;

  componentWillUnmount() {
    this.instance = null;
  }

  render() {
    const { forceRender, visible } = this.props;

    return forceRender || visible || this.instance ? (
      <Portal ref={(ref) => (this.instance = ref)} {...this.props} />
    ) : null;
  }
}

export default PortalWrapper;
