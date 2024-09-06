export type Nullable<T> = T | null;

export type DataType<T> = T & { key: number | string };

export type LiteralUnion<T extends string> = T | (string & {});

export type AnyObject = Record<PropertyKey, any>;

export type First<T extends any[]> = T extends [infer U, ...any[]] ? U : never;

export * from "./Overwrite";
