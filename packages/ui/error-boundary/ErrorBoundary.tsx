import { invariant } from "@transquant/utils";
import React, { isValidElement, PureComponent, ReactNode } from "react";
import IconFont from "../icon-font";

interface FallbackProps {
  error: Error;
  resetErrorBoundary: (...args: unknown[]) => void;
}

declare function Fallback(props: FallbackProps): ReactNode;

export interface ErrorBoundaryProps {
  fallback?: ReactNode | typeof Fallback;
  onReset?: (...args: unknown[]) => void;
  onError?: (error: Error, info: { componentStack: string }) => void;
}

interface ErrorBoundaryState {
  error: Error | null;
}

const initialState: ErrorBoundaryState = { error: null };

export default class ErrorBoundary extends PureComponent<
  React.PropsWithChildren<ErrorBoundaryProps>,
  ErrorBoundaryState
> {
  constructor(props: ErrorBoundaryProps) {
    super(props);

    this.state = initialState;
  }

  static getDerivedStateFromError(error: Error) {
    return { error };
  }

  componentDidCatch(error: Error, info: React.ErrorInfo) {
    this.props.onError?.(error, info);
  }

  reset() {
    this.setState(initialState);
  }

  resetErrorBoundary = (...args: unknown[]) => {
    this.props.onReset?.(...args);
    this.reset();
  };

  renderDefaultErrorUI = () => (
    <>
      <IconFont type="404" style={{ fontSize: 300 }} />
      <pre style={{ color: " #ea3323" }}>{this.state.error?.message}</pre>
    </>
  );

  render() {
    const { children } = this.props;
    const { error } = this.state;

    if (error !== null) {
      const { fallback = this.renderDefaultErrorUI() } = this.props;
      const props = {
        error,
        resetErrorBoundary: this.resetErrorBoundary,
      };

      if (isValidElement(fallback)) {
        return (
          <div className="flex flex-col items-center justify-center w-full h-full">
            {fallback}
          </div>
        );
      }
      if (typeof fallback === "function" && isValidElement(fallback(props))) {
        return fallback(props);
      }

      invariant(false, "A valid React element(or null) must be returned.");
    }

    return children;
  }
}
