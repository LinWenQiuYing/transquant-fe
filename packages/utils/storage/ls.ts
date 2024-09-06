const storagePrefix = "@transquant_";

export const ls = {
  getItem(key: string, dftVal?: any) {
    const item = localStorage.getItem(`${storagePrefix}${key}`);

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

    localStorage.setItem(`${storagePrefix}${key}`, val);
  },
  removeItem(key: string) {
    localStorage.removeItem(`${storagePrefix}${key}`);
  },
  removeAll() {
    localStorage.clear();
  },
};

export default ls;
