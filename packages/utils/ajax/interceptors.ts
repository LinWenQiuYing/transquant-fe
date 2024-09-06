import { SKEY, USER_TOKEN } from "@transquant/constants";
import axios, { AxiosResponse, InternalAxiosRequestConfig } from "axios";
import { ResData } from ".";
import { encrypt, ls } from "..";

// 加密token
export const getToken = (token: string, url?: string) => {
  return encrypt(
    JSON.stringify({
      token,
      url,
    }),
    SKEY
  );
};

axios.interceptors.request.use(
  function onFullFilled(requestConfig: InternalAxiosRequestConfig) {
    const ssToken = ls.getItem(USER_TOKEN);
    requestConfig.headers.token = getToken(ssToken, requestConfig.url);

    return requestConfig;
  },
  function onRejected(requestError: any) {
    return Promise.reject(requestError);
  }
);

axios.interceptors.response.use(
  function onFullFilled(response: AxiosResponse<ResData>) {
    return Promise.resolve(response);
  },
  function onRejected(responseError) {
    return Promise.reject(responseError);
  }
);

export default {};
