export function chain<T extends unknown[], R>(
  ...func: [(...args: T) => R, ...((...args: R[]) => any)[]]
) {
  return (...args: T) => {
    return func.slice(1).reduce((acc, fn) => fn(acc), func[0](...args));
  };
}

export function memoize<T extends unknown[], R>(
  func: (...args: T) => R,
  options: {
    key?: (...args: T) => string;
    ttl?: number;
  }
) {
  const cache = {} as Record<string, { exp: number | null; value: R }>;
  const { key, ttl } = options;
  return function callWithMemo(...args: any): R {
    const _key = key ? key(...args) : JSON.stringify({ args });
    const existing = cache[_key];
    if (existing) {
      if (!existing.exp) return existing.value;
      if (new Date().getTime() < existing.exp) {
        return existing.value;
      }
    }
    const value = func(...args);
    cache[_key] = {
      exp: ttl ? new Date().getTime() + ttl : null,
      value,
    };
    return value;
  };
}

export default {};
