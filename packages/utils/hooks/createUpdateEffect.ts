import { useEffect, useLayoutEffect, useRef } from "react";

type EffectHookType = typeof useEffect | typeof useLayoutEffect;

type CreateUpdateEffect = (hook: EffectHookType) => EffectHookType;

const createUpdateEffect: CreateUpdateEffect = (hook) => (effect, deps) => {
  const isMounted = useRef(false);

  // for react-refresh
  hook(
    () => () => {
      isMounted.current = true;
    },
    []
  );

  hook(() => {
    if (!isMounted.current) {
      isMounted.current = true;
    } else {
      return effect();
    }
  }, deps);
};

export default createUpdateEffect;
