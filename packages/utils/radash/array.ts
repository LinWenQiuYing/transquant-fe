/* eslint-disable no-redeclare */
import { isArray, isFunction } from "../is";
import { isFlattenable } from "./is";

const { hasOwnProperty } = Object.prototype;

/**
 * Sorts an array of objects alphabetically by a property
 * @param array the array to sort
 * @param getter a callback function used to determine the property to use for sorting
 * @param dir optional argument to sort by descending or ascending
 * @returns return a new array with the objects sorted alphabetically
 */
export const alphabetical = <T>(
  array: readonly T[],
  getter: (item: T) => string,
  dir: "asc" | "desc" = "asc"
) => {
  if (!array) return [];

  const asc = (a: T, b: T) => getter(a).localeCompare(getter(b));
  const dsc = (a: T, b: T) => getter(b).localeCompare(getter(a));

  return array.slice().sort(dir === "desc" ? dsc : asc);
};

/**
 * Reduce a list of items down to one item
 * @param array an array of items
 * @param compareFn comparison condition
 * @returns useful for more complicated min/max
 */
export const boil = <T>(array: readonly T[], compareFn: (a: T, b: T) => T) => {
  if (!array || (array.length ?? 0) === 0) return null;
  return array.reduce(compareFn);
};

/**
 * Split a list into many lists of the given size
 * @param array
 * @param size
 * @returns
 */
export const cluster = <T>(array: readonly T[], size: number = 2): T[][] => {
  const clusterCount = Math.ceil(array.length / size);

  return new Array(clusterCount).fill(null).map((_: null, i: number) => {
    return array.slice(i * size, i * size + size);
  });
};

/**
 * Creates an object with counts of occurrences of items
 * @param list
 * @param identify
 * @returns
 */
export const counting = <T, I extends keyof any>(
  list: readonly T[],
  identify: (item: T) => I
): Record<I, number> => {
  if (!list) return {} as Record<I, number>;
  return list.reduce((acc, item) => {
    const key = identify(item);
    acc[key] = (acc[key] ?? 0) + 1;
    return acc;
  }, {} as Record<I, number>);
};

/**
 * Returns all items from the first list that do not exist in the second list
 * @param root
 * @param other
 * @param identity
 * @returns
 */
export const diff = <T>(
  root: readonly T[],
  other: readonly T[],
  identity: (item: T) => keyof any = (t: T) => t as unknown as keyof any
): T[] => {
  if (!root?.length && !other?.length) return [];
  if (!root?.length) return [...other];
  if (!other?.length) return [...root];
  const otherKeys = other.reduce((acc, item) => {
    acc[identity(item)] = true;
    return acc;
  }, {} as Record<keyof any, boolean>);
  return root.filter((item) => !otherKeys[identity(item)]);
};

/**
 * Get the first item in an array or a default value
 * @param list
 * @param defaultValue
 * @returns
 */
export const first = <T>(
  list: readonly T[],
  defaultValue: T | null | undefined = undefined
) => {
  return list?.length > 0 ? list[0] : defaultValue;
};

/**
 * Get the last item in an array or a default value
 * @param list
 * @param defaultValue
 * @returns
 */
export const last = <T>(
  list: readonly T[],
  defaultValue: T | null | undefined = undefined
) => {
  return list?.length > 0 ? list[list.length - 1] : defaultValue;
};

/**
 * Given an array of arrays, returns a single dimentional array with all items in it
 * @param lists
 * @returns
 */
export const flatten = <T>(
  lists: readonly T[],
  depth: number = Infinity
): T[] => {
  if (!lists.length) return [];

  return lists.reduce((acc, item) => {
    if (Array.isArray(item) && depth > 0 && isFlattenable(item)) {
      return [...acc, ...flatten(item, depth - 1)];
    }
    return [...acc, item];
  }, [] as T[]);
};

/**
 * Split an array into two array based on a true/false condition function
 * @param list
 * @param condition
 * @returns
 */
export const fork = <T>(
  list: readonly T[],
  condition: (item: T) => boolean
): [T[], T[]] => {
  if (!list) return [[], []];
  return list.reduce(
    (acc, item) => {
      const [a, b] = acc;
      if (condition(item)) {
        return [[...a, item], b];
      }
      return [a, [...b, item]];
    },
    [[], []] as [T[], T[]]
  );
};

/**
 * Sorts an array of items into groups
 * @param array
 * @param iteratee
 * @returns
 */
export const groupBy = <T, K extends keyof any>(
  array: readonly T[],
  iteratee: K | ((item: T) => K)
): Record<K, T[]> => {
  return array.reduce((result, value) => {
    const mapper = isFunction(iteratee) ? iteratee : () => iteratee;
    const key = mapper(value);
    if (hasOwnProperty.call(result, key)) {
      result[key].push(value);
    } else if (key === "__proto__") {
      Object.defineProperty(result, key, {
        configurable: true,
        enumerable: true,
        value,
        writable: true,
      });
    } else {
      result[key] = [value];
    }
    return result;
  }, {} as Record<K, T[]>);
};

/**
 * Given two arrays, returns true if any elements intersect
 * @param listA
 * @param listB
 * @param iteratee
 * @returns
 */
export const intersects = <T, K extends keyof any>(
  listA: readonly T[],
  listB: readonly T[],
  iteratee: (t: T) => K = (t: T) => t as unknown as K
) => {
  if (!listA || !listB) return false;
  const dictB = listB.reduce((result, value) => {
    result[iteratee(value)] = true;
    return result;
  }, {} as Record<keyof any, boolean>);
  return listA.some((value) => dictB[iteratee(value)]);
};

export function range<T = number>(length: number): Generator<T>;
export function range<T = number>(start: number, end?: number): Generator<T>;
export function range<T = number>(
  start: number,
  end?: number,
  value?: T | ((i: number) => T)
): Generator<T>;
export function range<T = number>(
  start: number,
  end?: number,
  value?: T | ((i: number) => T),
  step?: number
): Generator<T>;
/**
 * Create a range used for iterating
 * @param startOrLength
 * @param end
 * @param valueOrMapper
 * @param step
 */
export function* range<T = number>(
  startOrLength: number,
  end?: number,
  valueOrMapper: T | ((i: number) => T) = (i) => i as unknown as T,
  step: number = 1
): Generator<T> {
  const mapper = isFunction(valueOrMapper)
    ? valueOrMapper
    : () => valueOrMapper;
  const start = end ? startOrLength : 0;
  const final = end ?? startOrLength;
  for (let i = start; i <= final; i += step) {
    yield mapper(i);
    if (i + step > final) break;
  }
}

/**
 * Creates a list of given start, end, value, and step parameters
 * @param startOrLength
 * @param end
 * @param valueOrMapper
 * @param step
 * @returns
 */
export const list = <T = number>(
  startOrLength: number,
  end?: number,
  valueOrMapper?: T | ((i: number) => T),
  step?: number
): T[] => {
  return Array.from(range(startOrLength, end, valueOrMapper, step));
};

/**
 * Max gets the greatest value from a list
 * @param array
 */
export function max(array: readonly [number, ...number[]]): number;
export function max(array: readonly number[]): number | null;
export function max<T>(
  array: readonly T[],
  getter: (item: T) => number
): T | null;
export function max<T>(
  array: readonly T[],
  getter: (item: T) => number = (v: T) => v as unknown as number
) {
  return boil(array, (a, b) => (getter(a) > getter(b) ? a : b));
}

/**
 * Min gets the smallest value from a list
 * @param array
 */
export function min(array: readonly [number, ...number[]]): number;
export function min(array: readonly number[]): number | null;
export function min<T>(
  array: readonly T[],
  getter: (item: T) => number = (v: T) => v as unknown as number
): T | null {
  return boil(array, (a, b) => (getter(a) < getter(b) ? a : b));
}

/**
 * Given two lists of the same type, iterate the first list
 * and replace items matched by the matcher func in the first place
 * @param root
 * @param others
 * @param matcher
 * @returns
 */
export const merge = <T>(
  root: readonly T[],
  others: readonly T[],
  matcher: (item: T) => any
): T[] => {
  if (!root && !others) return [];
  if (!root) return [];
  if (!others) return [...root];
  if (!matcher) return [...root];
  return root.reduce((result, value) => {
    const matched = others.find((item) => matcher(value) === matcher(item));
    if (matched) {
      result.push(matched);
    } else {
      result.push(value);
    }
    return result;
  }, [] as T[]);
};

/**
 * Convert an array to a dictionary by mapping each item into a dictionary key & value
 * @param array
 * @param getKey
 * @param getValue
 * @returns
 */
export const objectify = <T, K extends keyof any, V = T>(
  array: readonly T[],
  getKey: (item: T) => K,
  getValue: (item: T) => V = (v: T) => v as unknown as V
) => {
  return array.reduce((result, item) => {
    result[getKey(item)] = getValue(item);
    return result;
  }, {} as Record<K, V>);
};

/**
 * Replace an item in an array by a matcher function condition,
 * If no items match the function condition, appends the new item to
 * the end of the list
 * @param list
 * @param newItem
 * @param matcher
 * @param append
 * @returns
 */
export const replace = <T>(
  list: readonly T[],
  newItem: T,
  matcher: (item: T, index: number) => boolean,
  append: boolean = false
): T[] => {
  if (!list && !newItem) return [];
  if (!newItem) return [...list];
  if (!list) return [newItem];
  const { length } = list;
  for (let index = 0; index < length; index++) {
    const item = list[index];
    if (matcher(item, index)) {
      return [
        ...list.slice(0, index),
        newItem,
        ...list.slice(index + 1, list.length),
      ];
    }
  }
  return append ? [...list, newItem] : [...list];
};

/**
 * @example
 * select([1, 2, 3, 4], x => x * x, x > 2) == [9, 16]
 */
export const select = <T, R>(
  list: readonly T[],
  mapper: (item: T, index: number) => R,
  condition: (item: T, index: number) => boolean
) => {
  if (!list) return [];
  return list.reduce((acc, item, index) => {
    if (!condition(item, index)) return acc;
    acc.push(mapper(item, index));
    return acc;
  }, [] as R[]);
};

export function sum<T extends number>(list: readonly T[]): number;
export function sum<T extends object>(
  list: readonly T[],
  fn: (item: T) => number
): number;
export function sum<T extends object | number>(
  list: readonly T[],
  fn?: (item: T) => number
) {
  return (list || []).reduce(
    (acc, item) => acc + (fn ? fn(item) : (item as number)),
    0
  );
}

/**
 * Given a list of items returns a new list with only unique items
 * @param list
 * @param getter
 * @returns
 */
export const unique = <T, K extends keyof any>(
  list: readonly T[],
  getter: (item: T) => K = (v) => v as unknown as K
) => {
  const valueMap = list.reduce((acc, item) => {
    const key = getter(item);
    if (acc[key]) return acc;
    acc[key] = item;
    return acc;
  }, {} as Record<K, T>);

  return Object.values(valueMap);
};

/**
 * @example
 * zipToObject(['a', 'b'], [1, 2])  // {a: 1, b: 2}
 * zipToObject(['a', 'b'], (k, i) => k + i) // {a: 'a0', b: 'b0'}
 * zipToObject(['a', 'b'], 1) // {a: 1, b: 1}
 */
export function zipToObject<K extends keyof any, V>(
  keys: K[],
  values: V | V[] | ((key: K, idx: number) => V)
): Record<K, V> {
  if (!keys || !keys.length) return {} as Record<K, V>;

  const getter = isFunction(values)
    ? values
    : isArray(values)
    ? (key: K, index: number) => values[index]
    : () => values;

  return keys.reduce((acc, item, index) => {
    acc[item] = getter(item, index);
    return acc;
  }, {} as Record<K, V>);
}

/**
 * @example
 * zip(['a', 'b'], [1, 2], [true, false]) // [['a', 1, true], ['b', 2, false]]
 */
export function zip<T extends any[]>(
  ...lists: T[]
): { [K in keyof T]: T[K] }[] {
  if (!lists || !lists.length) return [];
  return new Array(Math.max(...lists.map(({ length }) => length)))
    .fill([])
    .map((_, index) => lists.map((list) => list[index])) as {
    [K in keyof T]: T[K];
  }[];
}

export default {};
