// innerHTML操作前，对特殊字符编码转义,或者使用安全的dom api (innerText)替换innerHtml
function htmlEncode(iStr: string) {
  let sStr = iStr;
  sStr = sStr.replace(/&/g, "&amp;");
  sStr = sStr.replace(/>/g, "&gt;");
  sStr = sStr.replace(/</g, "&lt;");
  sStr = sStr.replace(/"/g, "&quot;");
  sStr = sStr.replace(/'/g, "&#39;");
  return sStr;
}

export default htmlEncode;
