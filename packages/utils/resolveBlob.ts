import { UUID } from "./uuid";
/**
 * 解析blob相应内容并下载(针对小文件下载，先下载到浏览器内容在下载至本地，非流式下载(a标签实现))
 * @param {*} res blob响应内容
 */

export default function resolveBlob(
  response: any,
  type: string = "zip",
  name: string = "",
  ignoreType: boolean = false
) {
  const blob =
    type === "json"
      ? new Blob([response], { type: "text/json" })
      : new Blob([response]);
  const url = window.URL.createObjectURL(blob);
  const link = document.createElement("a");

  link.href = url;
  const downloadName = ignoreType
    ? name || UUID()
    : `${name || UUID()}.${type}`;
  link.setAttribute("download", downloadName);
  document.body.appendChild(link);
  link.click();

  // 下载完成移除元素
  document.body.removeChild(link);
  // 释放掉blob对象
  window.URL.revokeObjectURL(url);
}
