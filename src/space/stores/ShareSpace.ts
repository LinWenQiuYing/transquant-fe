import { EnvTemp } from "@transquant/manage/types/user";
import { message } from "antd";
import { UserItem } from "../types/factor";
/* eslint-disable no-return-await */
import { ajax, AnyObject, Nullable, Socket } from "@transquant/utils";
import { cloneDeep } from "lodash-es";
import { computed, observable, toJS } from "mobx";
import { ShareSpaceValue } from "../share-space/ShareModal";
import {
  Image,
  RunLog,
  ShareList,
  TeamItem,
  TemplateItem,
  UpdateEnvStatus,
  WSResultType,
} from "../types";

const MSG_DURATION_TIME = 5;

export default class ShareSpaceStore {
  @observable teams: TeamItem[] = [];

  @observable currentTeamId: number | undefined = undefined;

  @observable shareList: Nullable<ShareList> = null;

  @observable shareListLoading: boolean = false;

  @observable userList: UserItem[] = [];

  @observable imageList: Image[] = [];

  @observable templates: TemplateItem[] = [];

  @observable wsInstance: WebSocket | null = null;

  @observable conflictList: string[] = [];

  @observable hasUpdate: boolean = false;

  @observable envTemplates: EnvTemp[] = [];

  @observable gitlog: AnyObject[] = [];

  @observable logEnd: boolean | string = "true";

  @observable shareSpaceIntervalId: Nullable<NodeJS.Timeout> = null;

  // 代码回退loading
  @observable resetLoading: boolean = false;

  @observable jobLog: RunLog["data"] | null = null;

  @observable installVisible: boolean = false;

  @observable installToken: string = "";

  onInstallVisibleChange = (value: boolean) => {
    this.installVisible = value;
  };

  resetJobLog = () => {
    this.jobLog = null;
  };

  @computed
  get hasConflict() {
    return !!this.conflictList.length;
  }

  checkVSCode = async (envToken: string) => {
    return await ajax<boolean>({
      url: `/tqlab/k8s/checkVSCode`,
      params: { envToken },
    });
  };

  switchEnvEditor = (data: {
    editorType: 0 | 1;
    /** jupyter|vscode */ envToken: string;
  }) => {
    return ajax({
      url: `/tqlab/k8s/switchEnvEditor`,
      method: "post",
      data,
    });
  };

  onCurrentTeamIdChange = (id: number) => {
    this.currentTeamId = id;
  };

  // 获取用户团队列表
  getAllTeamInfos = async () => {
    return await ajax({
      url: `/tquser/team/getAllTeamInfos`,
      params: { code: "050101" },
      success: (data) => {
        this.teams = data;
      },
    });
  };

  // 获取协作空间列表
  getShareSpace = async (teamId: number) => {
    this.shareListLoading = true;
    await ajax({
      url: `/tqlab/share/getShareSpace`,
      params: { teamId },
      success: (data) => {
        this.shareList = data;
      },
      effect: () => {
        this.shareListLoading = false;
      },
    });
  };

  // 创建协作空间
  createShareSpace = async (data: Partial<ShareSpaceValue>) => {
    await ajax({
      url: `/tqlab/share/createShareSpace`,
      method: "post",
      data,
      success: () => {
        message.success("新建成功");
        this.getShareSpace(this.currentTeamId || -1);
      },
    });
  };

  // 编辑协作空间
  editShareSpace = async (
    data: Partial<ShareSpaceValue> & { shareId: number }
  ) => {
    await ajax({
      url: `/tqlab/share/editShareSpace`,
      method: "post",
      data,
      success: () => {
        message.success("编辑成功");
        this.getShareSpace(this.currentTeamId || -1);
      },
    });
  };

  // 删除协作空间
  deleteShareSpace = (shareId: number) => {
    ajax({
      url: `/tqlab/share/deleteShareSpace`,
      method: "delete",
      params: { shareId },
      success: () => {
        message.success("删除成功");
        this.getShareSpace(this.currentTeamId || -1);
      },
    });
  };

  // 获取团队下用户列表
  getMemberListByTeam = async (teamId: number) => {
    await ajax({
      url: `/tquser/user/getMemberListByTeam`,
      params: { teamId },
      success: (data) => {
        this.userList = data;
      },
    });
  };

  // 获取所有镜像列表
  getAllImageList = async () => {
    await ajax({
      url: `/tqlab/image/getAllImageList`,
      success: (data) => {
        this.imageList = data;
      },
    });
  };

  // 获取模版
  getFactorStrategySysTemplate = async (teamId: number) => {
    ajax({
      url: `/tqlab/template/getFactorStrategySysTemplate`,
      params: {
        teamId,
      },
      success: (data) => {
        this.templates = data;
      },
    });
  };

  // 启动共享环境实例
  launchShareEnvInstance = async (shareId: number) => {
    await ajax({
      url: `/tqlab/k8s/launchShareEnvInstance`,
      params: { shareId },
    });
  };

  updateEnvStatus = (share: UpdateEnvStatus["data"]) => {
    const cloneShareList = cloneDeep(toJS(this.shareList));
    const findItem = cloneShareList?.shareSpaceList.find(
      (item) => item.token === share.token
    );

    if (findItem) {
      findItem.status = share.status;
    }
    this.shareList = cloneShareList;
  };

  // websocket链接，脚本运行
  onWebsocketConnect = (token: string) => {
    const { host } = window.location;
    const { ws } = new Socket(
      `${host}/tqlab/ws/user?token=${encodeURIComponent(token || "")}`
    );

    this.shareSpaceIntervalId = setInterval(() => {
      const data = { message: "heartbeat" };
      if (ws.readyState === 1) {
        ws.send(JSON.stringify(data));
      }
    }, 30 * 1000);

    this.wsInstance = ws;

    ws.onmessage = (eventMessage) => {
      const wsResult = JSON.parse(eventMessage.data) as WSResultType;

      if (wsResult.type === "updateEnvStatus") {
        this.updateEnvStatus(wsResult.data);
        if (wsResult.data.status === 0) {
          // 未启动
          const currentChildWindow: Window | null = (
            window as any
          )._childWindow?.get(wsResult.data.token);
          currentChildWindow?.close();
          window._childWindow?.delete(wsResult.data.token);
        }
      }

      if (wsResult.type === "launchShareEnvInstance") {
        if (wsResult?.data?.installScripts?.length) {
          this.installVisible = true;
          this.installToken = wsResult?.data?.token;
        }
        if (wsResult?.data?.installScripts?.length) {
          this.installVisible = true;
        }
        const currentChildWindow = (window as any)._childWindow?.get(
          wsResult.data.token
        );

        if (currentChildWindow) {
          let url = "";
          if (wsResult?.imageType === 0) {
            url = `/tq/${wsResult.data.ip}/${wsResult.data.port}/?a=a&token=${wsResult.data.token}`;
          }
          if (wsResult?.imageType === 1) {
            url = `/tqcode/${wsResult.data.ip}/${wsResult.data.port}/?folder=/root/workspace`;
          }

          setTimeout(() => {
            currentChildWindow.postMessage({
              type: "launch",
              url,
              token: wsResult.data.token,
            });
          }, 1000);
        }
      }

      if (wsResult.type === "runLog") {
        this.logEnd = false;
        if (wsResult.data) {
          this.jobLog = {
            jobId: this.jobLog?.jobId || wsResult.data.jobId,
            log: `${this.jobLog?.log || ""}<br />${wsResult.data.log}`,
          };
        }
      }

      if (wsResult.type === "logEnd") {
        this.logEnd = true;
      }
    };
  };

  shutdownShareEnv = (token: string = "") => {
    ajax({
      url: `/tqlab/k8s/shutdownShareEnv`,
      method: "delete",
      params: { envToken: token },
    });
  };

  onWebsocketClose = (destroy: boolean, token?: string) => {
    if (this.wsInstance) {
      this.wsInstance.close();
      this.wsInstance = null;
    }
    if (destroy) {
      this.shutdownShareEnv(token);
    }
  };

  // 获取冲突列表
  getConflict = async (shareId: string) => {
    return await ajax({
      url: `/tqlab/share/getConflict`,
      params: { shareId },
      success: (data) => {
        this.conflictList = data;
      },
    });
  };

  // 更新代码
  updateCode = async (shareId: string) => {
    await ajax({
      url: `/tqlab/share/updateCode`,
      params: { shareId },
      success: (data) => {
        if (data.type === 0) {
          message.success("更新成功");
          this.getRemoteUpdate(shareId);
        } else {
          message.info(data.message, MSG_DURATION_TIME);
        }
      },
    });
  };

  // 推送代码
  pushCode = async (shareId: string) => {
    await ajax({
      url: `/tqlab/share/pushCode`,
      params: { shareId },
      success: (data) => {
        if (data.type === 0) {
          message.success("推送成功");
        } else {
          message.info(data.message, MSG_DURATION_TIME);
        }
      },
    });
  };

  // 提交代码
  commitCode = async (data: { remark: string; shareId: string }) => {
    await ajax({
      url: `/tqlab/share/commitCode`,
      method: "post",
      data,
      success: () => {
        message.success("提交成功");
      },
    });
  };

  // 标记冲突文件为解决
  markAsUnConflict = async (data: { filePath: string; shareId: string }) => {
    await ajax({
      url: `/tqlab/share/markAsUnConflict`,
      method: "post",
      data,
      success: () => {
        message.success(`${data.filePath}冲突解决成功`);
      },
    });
  };

  // 共享容器固化
  solidifyShareEnv = async (envToken: string) => {
    await ajax({
      url: `/tqlab/k8s/solidifyShareEnv`,
      params: { envToken },
    });
  };

  // 共享容器镜像升级
  upgradeShareEnv = async (data: {
    envToken: string;
    fromNotification: boolean;
    installedScriptIds: string[];
  }) => {
    await ajax({
      url: `/tqlab/k8s/upgradeShareEnv`,
      data,
    });
  };

  // 重启共享环境实例
  restartShareEnv = async (envToken: string) => {
    await ajax({
      url: `/tqlab/k8s/restartShareEnv`,
      params: { envToken },
    });
  };

  // 远程是否有更新
  getRemoteUpdate = async (shareId: string) => {
    await ajax({
      url: `/tqlab/share/getRemoteUpdate`,
      params: { shareId },
      success: (data) => {
        this.hasUpdate = Boolean(data);
      },
    });
  };

  // 获取日志
  getLog = async (shareId: string) => {
    await ajax({
      url: `/tqlab/share/getLog`,
      params: { shareId },
      success: (data) => {
        this.gitlog = data;
      },
    });
  };

  // 根据commitId回滚代码
  resetSoftCode = async (data: { commitId: string; shareId: string }) => {
    this.resetLoading = true;
    await ajax({
      url: `/tqlab/share/resetSoftCode`,
      method: "post",
      data,
      success: (data) => {
        message.info(data.message, MSG_DURATION_TIME);
      },
      effect: () => {
        this.resetLoading = false;
      },
    });
  };

  getEnvTemplates = () => {
    ajax({
      url: `/tqlab/sys/getEnvTemplates`,
      success: (data) => {
        this.envTemplates = data;
      },
    });
  };

  resetState = () => {
    this.currentTeamId = undefined;
    this.shareList = null;
  };
}
