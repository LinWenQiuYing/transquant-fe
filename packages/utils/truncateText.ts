/**
 * truncateText('ALongText', 4) => 'ALon...'
 * @param {number} limit
 * @param {string} text
 * Each Chinese character is equal to two chars
 */
const truncateText = (text: string, n: number) => {
  const exp = /[\u4E00-\u9FA5]/;
  let res = "";
  let len = text.length;
  const chinese = text.match(new RegExp(exp, "g"));
  if (chinese) {
    len += chinese.length;
  }
  if (len > n) {
    let i = 0;
    let acc = 0;
    // eslint-disable-next-line no-constant-condition
    while (true) {
      const char = text[i];
      if (exp.test(char)) {
        acc += 2;
      } else {
        acc++;
      }
      if (acc > n) break;
      res += char;
      i++;
    }
    res += "...";
  } else {
    res = text;
  }
  return res;
};

export default truncateText;
