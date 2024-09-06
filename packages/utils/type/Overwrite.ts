/**
 * Overwrite<T, U>
 * 从 U 中的同名属性的类型覆盖 T 中的同名属性类型
 */
type Intersection<T extends object, U extends object> = Pick<
  T,
  Extract<keyof T, keyof U> & Extract<keyof U, keyof T>
>;

type Diff<T extends object, U extends object> = Pick<
  T,
  Exclude<keyof T, keyof U>
>;

export type Overwrite<
  T extends object,
  U extends object,
  I = Diff<T, U> & Intersection<U, T>
> = Pick<I, keyof I>;

/**
 * example
 * Eg: {key1: string, other: boolean}
 */
// type A = { key1: number; other: boolean };
// type B = { key1: string };
// type Eg = Overwrite<A, B>;
