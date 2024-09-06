import { useMemo } from "react";

export default function useMergeProps<PropsType>(
  baseProps: PropsType,
  defaultProps: PropsType
): PropsType {
  const props = useMemo(() => {
    const mProps = { ...baseProps };

    for (const propName in defaultProps) {
      if (mProps[propName] === undefined) {
        mProps[propName] = defaultProps[propName];
      }
    }

    return mProps;
  }, [baseProps, defaultProps]);

  return props;
}
