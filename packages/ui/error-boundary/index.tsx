import { Loadable } from "@transquant/utils";
import { ComponentType, PropsWithChildren } from "react";
import { ErrorBoundaryProps } from "./ErrorBoundary";

const ErrorBoundary = Loadable({
  loader: () =>
    import(/* webpackChunkName: "ui_error-boundary" */ "./ErrorBoundary"),
}) as ComponentType<PropsWithChildren<ErrorBoundaryProps>>;

export default ErrorBoundary;
