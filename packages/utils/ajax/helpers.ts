import { message } from "antd";
import { Callback } from ".";
import { isArray } from "../is";

export const getUrl = (url: string) => "/".concat(url.replace(/^\/|\/$/g, ""));

export const handleBlob = (
  blobData: Blob,
  resolveHandler?: Callback | string,
  effect?: Callback
) => {
  if (isArray(blobData)) {
    resolveHandler(blobData);
    return;
  }
  // 成功
  if (
    blobData.type === "application/octet-stream" ||
    blobData.type === "application/vnd.ms-excel"
  ) {
    if (typeof resolveHandler === "function") {
      resolveHandler(blobData);
    }
    effect?.(true);
    return Promise.resolve(blobData);
  }

  // 失败
  if (blobData?.type === "application/json") {
    const render = new FileReader();
    render.readAsText(blobData, "utf-8");
    // eslint-disable-next-line func-names
    render.onload = function () {
      const result = JSON.parse(render.result as string);

      if (result.code === 1) {
        message.error(result.message);

        effect?.(false);
        return Promise.reject(result.data);
      }
    };
  }
};

export const postMessageToChildWindow = () => {
  if (!window._childWindow) return;
  const windows = window._childWindow?.values();

  for (const win of windows) {
    win?.postMessage({ type: "expired" });
  }
};

export default {};
