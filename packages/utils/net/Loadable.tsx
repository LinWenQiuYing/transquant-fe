import React, {
  ComponentType,
  forwardRef,
  ForwardRefRenderFunction,
  Suspense,
} from "react";
import { AnyObject } from "../type";

export type LoaderType<T extends AnyObject = any> = () => Promise<{
  default: React.ComponentType<T>;
}>;

export interface LoadableComponentProps {
  loader: LoaderType;
  loading?: React.ReactNode;
}

function Loadable(opts: LoadableComponentProps): ComponentType<any> {
  const { loader, loading = null } = opts;

  const Com = React.lazy(loader);

  const LoadableComponent: ForwardRefRenderFunction<unknown, any> = (
    props,
    ref
  ) => (
    <Suspense fallback={loading}>
      <Com {...props} ref={ref} />
    </Suspense>
  );

  return forwardRef(LoadableComponent);
}

export default Loadable;
