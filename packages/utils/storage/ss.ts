const storagePrefix = "@transquant_";

export const ss = {
  getItem(key: string, dftVal?: any) {
    const item = sessionStorage.getItem(`${storagePrefix}${key}`);

    try {
      if (item) {
        return JSON.parse(item);
      }
      return dftVal;
    } catch {
      return item;
    }
  },
  setItem(key: string, value: any) {
    const val = typeof value === "string" ? value : JSON.stringify(value);

    sessionStorage.setItem(`${storagePrefix}${key}`, val);
  },
  removeItem(key: string) {
    sessionStorage.removeItem(`${storagePrefix}${key}`);
  },
  removeAll() {
    sessionStorage.clear();
  },
};

export default ss;
