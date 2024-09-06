export const UUID = (len = 32) => {
  return "xxxxxxxxxxxx4xxxyxxxxxxxxxxxxxxx"
    .replace(/[xy]/g, function replace(c) {
      /* eslint-disable no-bitwise */
      const r = (Math.random() * 16) | 0;
      const v = c === "x" ? r : (r & 0x3) | 0x8;

      return v.toString(16);
    })
    .substring(0, len);
};

export const nanoid = (t = 21) => {
  let e = "";
  const r = crypto.getRandomValues(new Uint8Array(t));
  for (; t--; ) {
    const n = 63 & r[t];
    e +=
      n < 36
        ? n.toString(36)
        : n < 62
        ? (n - 26).toString(36).toUpperCase()
        : n < 63
        ? "_"
        : "-";
  }
  return e;
};

export default {};
