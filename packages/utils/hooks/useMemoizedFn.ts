import { useMemo, useRef } from "react";

type noop = (this: any, ...args: any[]) => any;

type PickFunction<T extends noop> = (
  this: ThisParameterType<T>,
  ...args: Parameters<T>
) => ReturnType<T>;

function useMemoizedFn<T extends noop>(fn: T) {
  // 保证持有最新fn的引用
  const fnRef = useRef<T>(fn);
  fnRef.current = useMemo(() => fn, [fn]);

  // 外壳函数引用不会变化，内部持有最新函数的引用，保证调用准确性
  const memoizedFn = useRef<PickFunction<T>>();
  if (!memoizedFn.current) {
    memoizedFn.current = function (this, ...args) {
      return fnRef.current.apply(this, args);
    };
  }

  return memoizedFn.current as T;
}

export default useMemoizedFn;
