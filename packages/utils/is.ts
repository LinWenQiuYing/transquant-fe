const opt = Object.prototype.toString;

export function isString(obj: any): obj is string {
  return opt.call(obj) === "[object String]";
}

export function isObject(obj: any): obj is Record<keyof any, any> {
  return opt.call(obj) === "[object Object]";
}

export function isArray(obj: any): obj is any[] {
  return opt.call(obj) === "[object Array]";
}

export function isNumber(obj: any): obj is number {
  // eslint-disable-next-line no-self-compare
  return opt.call(obj) === "[object Number]" && obj === obj;
}

export function isRegExp(obj: any) {
  return opt.call(obj) === "[object RegExp]";
}

export function isFile(obj: any): obj is File {
  return opt.call(obj) === "[object File]";
}

export function isBlob(obj: any): obj is Blob {
  return opt.call(obj) === "[object Blob]";
}

export function isSymbol(obj: any): obj is symbol {
  return !!obj && obj.constructor === Symbol;
}

export function isUndefined(obj: any): obj is undefined {
  return obj === undefined;
}

export function isNull(obj: any): obj is null {
  return obj === null;
}

export function isNullOrUndefined(obj: any): boolean {
  return isUndefined(obj) || isNull(obj);
}

export function isFunction(obj: any): obj is (...args: any[]) => any {
  return typeof obj === "function";
}

export function isEmptyObject(obj: any): boolean {
  return isObject(obj) && Object.keys(obj).length === 0;
}

export function isWindow(el: any): el is Window {
  return el !== null && el !== undefined && el === window;
}

export const isBrower = !!(
  typeof window !== "undefined" &&
  window.document &&
  window.document.createElement
);

function isHex(color: string) {
  return /^#[a-fA-F0-9]{3}$|#[a-fA-F0-9]{6}$/.test(color);
}

function isRgb(color: string) {
  return /^rgb\((\s*\d+\s*,?){3}\)$/.test(color);
}

function isRgba(color: string) {
  return /^rgba\((\s*\d+\s*,\s*){3}\s*\d(\.\d+)?\s*\)$/.test(color);
}

export function isColor(color: any): boolean {
  return isHex(color) || isRgb(color) || isRgba(color);
}

export default {};
