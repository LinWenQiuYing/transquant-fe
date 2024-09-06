import * as React from "react";

// https://reactjs.org/docs/code-splitting.html#named-exports
// named imports for React.lazy: https://github.com/facebook/react/issues/14603#issuecomment-726551598
export default function lazyImport<
  T extends React.ComponentType<any>,
  I extends { [K2 in K]: T },
  K extends keyof I
>(factory: () => Promise<I>, name: K): I {
  return Object.create({
    [name]: React.lazy(() =>
      factory().then((module) => ({ default: module[name] }))
    ),
  });
}

// Usage
// const { Home } = lazyImport(() => import("./Home"), "Home");
