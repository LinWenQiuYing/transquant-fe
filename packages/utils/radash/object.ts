import { isArray, isObject } from "../is";
import { objectify } from "./array";
import { isPrimitive } from "./is";
import { toInt } from "./number";

export const clone = <T>(obj: T): T => {
  if (isPrimitive(obj)) return obj;

  if (typeof obj === "function") return obj.bind({});

  const newObj = new ((obj as object).constructor as { new (): T })();

  Object.getOwnPropertyNames(obj).forEach((prop) => {
    (newObj as any)[prop] = (obj as any)[prop];
  });

  return newObj;
};

export const set = <T extends object, K>(
  initial: T,
  path: string,
  value: K
): T => {
  if (!initial) return {} as T;
  if (!path || value === undefined) return initial;
  const segments = path.split(/[.[\]]/g).filter((x) => !!x.trim());
  const _set = (node: any) => {
    if (segments.length > 1) {
      const key = segments.shift() as string;
      const nextIsNum = toInt(segments[0], null) !== null;
      node[key] = node[key] === undefined ? (nextIsNum ? [] : {}) : node[key];
      _set(node[key]);
    } else {
      node[segments[0]] = value;
    }
  };
  const cloned = clone(initial);
  _set(cloned);
  return cloned;
};

export const construct = <T extends object>(obj: T): object => {
  if (!obj) return {};
  return Object.keys(obj).reduce((acc, path) => {
    return set(acc, path, (obj as any)[path]);
  }, {});
};

export const keys = <T extends object>(value: T): string[] => {
  if (!value) return [];
  const getKeys = (nested: any, paths: string[]): string[] => {
    if (isObject(nested)) {
      return Object.entries(nested).flatMap(([k, v]) =>
        getKeys(v, [...paths, k])
      );
    }
    if (isArray(nested)) {
      return nested.flatMap((item, i) => getKeys(item, [...paths, `${i}`]));
    }

    return [paths.join(".")];
  };
  return getKeys(value, []);
};

export const get = <T = unknown>(
  value: any,
  path: string,
  defaultValue?: T
): T => {
  const segments = path.split(/[.[\]]/g).filter((x) => !!x.trim());
  let current = value;
  for (const key of segments) {
    if (current === null || current === undefined) return defaultValue as T;
    current = current[key];
  }
  if (current === undefined) return defaultValue as T;
  return current;
};

export const crush = <T extends object>(value: T): object => {
  if (!value) return {};
  return objectify(
    keys(value),
    (k) => k,
    (k) => get(value, k)
  );
};

export default {};
