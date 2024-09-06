const spreadableSymbol = Symbol.isConcatSpreadable;

const { toString } = Object.prototype;

export function getTag(value: unknown) {
  if (value == null) {
    return value === undefined ? "[object Undefined]" : "[object Null]";
  }
  return toString.call(value);
}

export function isObjectLike(value: unknown) {
  return typeof value === "object" && value !== null;
}

export function isArguments(value: unknown) {
  return isObjectLike(value) && getTag(value) === "[object Arguments]";
}

export function isFlattenable(value: unknown) {
  return (
    Array.isArray(value) ||
    isArguments(value) ||
    !!(value && (<any>value)[spreadableSymbol])
  );
}

export const isPrimitive = (value: any): boolean => {
  return (
    value === undefined ||
    value === null ||
    (typeof value !== "object" && typeof value !== "function")
  );
};

export default {};
