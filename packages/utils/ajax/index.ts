import { EXPIRED_CODE, INIT_CODE, paths } from "@transquant/constants";
import { message } from "antd";
import axios, { AxiosRequestConfig, AxiosResponse } from "axios";
import { getUrl, handleBlob, postMessageToChildWindow } from "./helpers";
import "./interceptors";

export type Callback<T> = (data: T) => void | string | Promise<void>;

type Error<T> = Callback<T>;
type Success<T> = Callback<T>;

export type ResData<T = any> = {
  /**
   * 成功状态码: 0
   * 失败状态码: 其他
   */
  code: number;
  message?: string;
  data: T;
  type?: string;
};

export interface AjaxRequestConfig<T> extends AxiosRequestConfig {
  /**
   * 请求成功后，显示的自定义成功信息，常用于操作成功后的提示
   */
  success?: string | Success<T>;
  /**
   * 请求失败
   * boolean: 是否显示后端返回的错误信息
   * string: 显示自定义的错误信息
   * Function: 自行控制错误
   */
  error?: boolean | string | Error<T>;
  /**
   * 副作用函数，在请求成功后失败时执行，可用于清除状态，如loading
   */
  effect?: (success: boolean) => void;
  /**
   * 用于处理后端抛错，前端组件内部未处理数据，导致页面报错问题
   */
  compatibleData?: any;
}

export default function ajax<T = any>(
  config: AjaxRequestConfig<T>
): Promise<T> {
  const {
    url,
    data,
    success,
    headers = {},
    error = true,
    effect = () => {},
    compatibleData,
    proxy = {
      host: window.location.host,
      port: Number(window.location.port),
    },
    ...axiosConfig
  } = config;

  // 当请求数据为FormData类型时，自动设置Content-Type为multipart/form-data
  if (data instanceof FormData) {
    headers["Content-Type"] = "multipart/form-data";
  }

  const req = axios({
    url: url && getUrl(url),
    data,
    headers,
    proxy,
    ...axiosConfig,
  });

  return req
    .then((res: AxiosResponse<ResData<T> | Blob>) => {
      const { data: resData, code } = res.data as ResData;

      // 处理下载二进制流
      handleBlob(res.data as Blob, success, effect);

      // 成功 code===0
      if (code === 0) {
        effect(true);

        if (typeof success === "function") {
          // 之前某些接口不规范，做的兼容处理
          // success(resData || res.data);
          success(resData);
        } else if (typeof success === "string") {
          message.success(success);
        }

        // data存在，但值为false
        if (resData === false) {
          return Promise.resolve(resData);
        }

        return Promise.resolve(resData);
      }

      // 发生错误
      if (code === 1) {
        return Promise.reject(res.data);
      }

      if (code === 2) {
        effect(true);
        message.info((res.data as { message: string }).message);
        if (compatibleData !== undefined) {
          return Promise.resolve(compatibleData);
        }
      }

      // token过期,重新登录
      if (code === EXPIRED_CODE) {
        postMessageToChildWindow();

        if (location.href.includes("/login")) {
          return;
        }
        message.error("该账户的登录凭证已过期", 2000);
        // 路由定向至登录页
        window.location.href = `${paths.login}`;
      }

      if (code === INIT_CODE) {
        return Promise.resolve(res.data);
      }
    })
    .catch((e) => {
      effect(false);

      // 不展示重复请求error message
      if (e.message === "canceled") {
        return Promise.reject(e);
      }

      if (error === true) {
        message.error(e.message);
      } else if (typeof error === "string") {
        message.error(error);
      } else if (typeof error === "function") {
        error(e.message);
      }

      if (compatibleData !== undefined) {
        return Promise.resolve(compatibleData);
      }

      return Promise.reject(e);
    });
}

export * from "./interceptors";
