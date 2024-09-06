/**
 * 文件大小 字节转换单位
 * @param size
 * @returns {string|*}
 */

export const formatBytes = (bytes: number, decimals: number = 2) => {
  if (bytes === 0) return "0 B";

  const k = 1024;
  const sizes = ["B", "KB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"];

  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return `${parseFloat((bytes / k ** i).toFixed(decimals))} ${sizes[i]}`;
};

export default formatBytes;
