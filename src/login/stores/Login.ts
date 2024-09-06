import { ROLE_PERMISSION, USER_INFO, USER_TOKEN } from "@transquant/constants";
import { UserInfo } from "@transquant/person/types";
import { ajax, ls } from "@transquant/utils";
import { message } from "antd";
import md5 from "md5";
import { observable } from "mobx";
import { LoginInfo } from "../types";

export default class LoginStore {
  @observable userInfo: UserInfo | null = null;

  getToken = (token?: string) => {
    return ajax({
      url: "tquser/user/check",
      params: { token },
      success: (data) => {
        if (typeof data === "string") {
          ls.setItem(USER_TOKEN, data);
        }
      },
      error: () => {
        message.error("token异常");
      },
    });
  };

  login = async (userLoginInfo: LoginInfo) => {
    const { username, password, verifyCode, remember } = userLoginInfo;

    return await ajax({
      url: "tquser/user/login",
      data: {
        username,
        verifyCode,
        remember,
        password: md5(`${password}tq${verifyCode.toLocaleLowerCase()}`),
      },
      method: "POST",
      success: (userInfo) => {
        this.userInfo = userInfo.userInfo;
        ls.setItem(USER_INFO, userInfo);
      },
      error: () => {
        message.error("TOKEN错误，请刷新重试");
      },
    });
  };

  // 查询当前用户的角色和页面信息
  getRoleAndInterfaceElement = () => {
    return ajax({
      url: `/tqlab/user/getRoleAndInterfaceElement`,
      success: (data) => {
        ls.setItem(ROLE_PERMISSION, data);
      },
    });
  };

  changePassword = (data: { oldPassword: string; newPassword: string }) => {
    return ajax({
      url: `/tqlab/user/changePassword`,
      method: "POST",
      data,
      success: () => {
        message.success("密码修改成功");
      },
    });
  };
}
