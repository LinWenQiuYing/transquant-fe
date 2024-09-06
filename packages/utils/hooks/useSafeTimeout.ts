import { useCallback, useEffect, useRef } from "react";

type SetTimeout = (
  handler: TimerHandler,
  timeout?: number,
  ...args: unknown[]
) => number;
type ClearTimeout = (id: number) => void;
type SafeTimeout = {
  safeSetTimeout: SetTimeout;
  safeClearTimeout: ClearTimeout;
};

export default function useSafeTimeout(): SafeTimeout {
  const timers = useRef<Set<number>>(new Set<number>());

  const safeSetTimeout = useCallback<SetTimeout>(
    (handler, timeout, ...args) => {
      const id = window.setTimeout(handler, timeout, ...args);
      timers.current.add(id);
      return id;
    },
    []
  );

  const safeClearTimeout = useCallback<ClearTimeout>((id) => {
    clearTimeout(id);
    timers.current.delete(id);
  }, []);

  useEffect(() => {
    return () => {
      for (const id of timers.current) {
        clearTimeout(id);
      }
    };
  }, []);

  return { safeSetTimeout, safeClearTimeout };
}
