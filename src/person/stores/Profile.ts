import { USER_INFO } from "@transquant/constants";
import { ajax, ls, Nullable } from "@transquant/utils";
import { message } from "antd";
import { observable } from "mobx";
import { EnvVos, IUserInfo, LogItem } from "../types";

export default class ProfileStore {
  @observable envList: EnvVos[] = [];

  @observable userInfo: Nullable<IUserInfo> = null;

  @observable logList: LogItem[] = [];

  @observable rollbacking: boolean = false;

  getEnvInfo = () => {
    ajax({
      url: `/tqlab/k8s/getEnvInfo`,
      success: (data) => {
        this.envList = data;
      },
    });
  };

  changePassword = (data: { oldPassword: string; newPassword: string }) => {
    return ajax({
      url: `/tquser/user/changePassword`,
      method: "POST",
      data,
      success: () => {
        message.success("密码修改成功");
      },
    });
  };

  getUserInfo = () => {
    ajax({
      url: `/tquser/user/getUserInfo`,
      success: (data) => {
        this.userInfo = data;
        ls.setItem(USER_INFO, data);
      },
    });
  };

  updateUser = (data: { id: number; name?: string; telephone?: string }) => {
    return ajax({
      url: `tquser/user/updateUser`,
      method: "POST",
      data,
      success: () => {
        message.success("更新成功");
        this.getUserInfo();
      },
      error: (error) => {
        message.error(error);
      },
    });
  };

  updateMyUserInfo = (data: { name?: string; telephone?: string }) => {
    return ajax({
      url: `tquser/user/updateMyUserInfo`,
      method: "POST",
      data,
      success: () => {
        message.success("更新成功");
        this.getUserInfo();
      },
      error: (error) => {
        message.error(error);
      },
    });
  };

  // 环境固化
  solidifyJupyterEnv = (envId: number) => {
    return ajax({
      url: `/tqlab/k8s/solidifyJupyterEnv`,
      params: { envId },
      success: () => {
        message.success("环境固化成功");
      },
    });
  };

  solidifyTeamJupyterEnv = (envId: number) => {
    return ajax({
      url: `/tqlab/k8s/solidifyTeamJupyterEnv`,
      params: { envId },
      success: () => {
        message.success("团队环境固化成功");
      },
    });
  };

  // 环境升级
  upgradeJupyterEnv = (data: {
    envToken: string;
    fromNotification: boolean;
    installedScriptIds: string[];
  }) => {
    return ajax({
      url: `/tqlab/k8s/upgradeJupyterEnv`,
      method: "post",
      data,
      success: () => {
        message.success("环境升级成功");
      },
    });
  };

  upgradeTeamJupyterEnv = (data: {
    envToken: string;
    fromNotification: boolean;
    installedScriptIds: string[];
  }) => {
    return ajax({
      url: `/tqlab/k8s/upgradeTeamJupyterEnv`,
      method: "post",
      data,
      success: () => {
        message.success("团队环境升级成功");
      },
    });
  };

  // 环境重启
  restartPrivateEnv = (envId: number) => {
    return ajax({
      url: `/tqlab/k8s/restartPrivateEnv`,
      params: { envId },
      success: () => {
        message.success("环境重启成功");
      },
    });
  };

  // 获取固化日志
  getEnvHistory = (envId: number) => {
    return ajax<LogItem[]>({
      url: `/tqlab/env/getEnvHistory`,
      params: { envId },
      success: (data) => {
        this.logList = data;
      },
    });
  };

  // 环境回滚
  envRollback = (envHistoryId: number, envId: number) => {
    this.rollbacking = true;
    return ajax({
      url: `/tqlab/env/envRollback`,
      params: { envHistoryId },
      success: () => {
        message.success("回滚成功");
        setTimeout(() => {
          this.getEnvInfo();
        }, 1000 * 5);
        this.getEnvHistory(envId);
      },
      effect: () => {
        this.rollbacking = false;
      },
    });
  };
}
