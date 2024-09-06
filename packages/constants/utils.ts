import { PUBLICURL } from "./env";

export const getAssetsPath = (path: string) => {
  const _path = path.indexOf("/") === 0 ? path : `/${path}`;

  return `${PUBLICURL}${_path}`;
};

export const AssetsJs = getAssetsPath("/js");

export default {};
