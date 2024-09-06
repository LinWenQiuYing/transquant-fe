import querystring from "querystring";

export default function getUrlParams() {
  const search = window.location.search.replace(/^\?/, "");
  const hashParams =
    window.location.hash.indexOf("?") >= 0
      ? window.location.hash.split("?")[1]
      : "";

  return {
    ...querystring.parse(hashParams), // 兼容 hash路由传参的方式
    ...querystring.parse(search),
  };
}
