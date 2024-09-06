import { Component, ReactNode } from "react";
import ReactDOM from "react-dom";

interface PortalProps {
  getContainer?: () => Element;
  children?: ReactNode;
}

class Portal extends Component<PortalProps> {
  container: Element | null | void = null;

  timer: NodeJS.Timeout | undefined;

  componentDidMount() {
    this.createContainer();

    this.timer = setTimeout(() => {
      // getContainer 返回ref时，子组件首先执行 componentDidMount,此时ref还未赋值
      if (!this.container) {
        this.createContainer();
      }
    });
  }

  componentWillUnmount() {
    clearTimeout(this.timer);
  }

  createContainer() {
    this.container = this.props.getContainer?.();
    this.forceUpdate();
  }

  render() {
    const { children } = this.props;
    if (this.container) {
      return ReactDOM.createPortal(children, this.container);
    }
    return null;
  }
}

export default Portal;
