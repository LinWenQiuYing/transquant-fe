import { USER_TOKEN } from "@transquant/constants";
import { ImageInstance } from "@transquant/manage";
import { ajax, ls, Nullable, Socket, UUID } from "@transquant/utils";
import { getToken } from "@transquant/utils/ajax";
import { SocketType } from "@transquant/utils/net/socket";
import { message } from "antd";
import { cloneDeep } from "lodash-es";
import { observable, toJS } from "mobx";
import { InstallScript } from "../types";

export default class ImageStore {
  @observable personalInstances: ImageInstance[] = [];

  @observable teamInstances: ImageInstance[] = [];

  @observable imageInstance: ImageInstance | null = null;

  @observable iframePath: string = "";

  // loading相关
  @observable personalImageLoading: boolean = false;

  @observable teamImageLoading: boolean = false;

  @observable wsInstance: Nullable<WebSocket> = null;

  @observable envPreview: { strategyId?: number; visible?: boolean } = {};

  @observable privateInstance: Nullable<SocketType> = null;

  @observable hasEnv: boolean = true;

  @observable envIntervalId: Nullable<NodeJS.Timeout> = null;

  @observable intervalId: Nullable<NodeJS.Timeout> = null;

  @observable installScripts: InstallScript[] = [];

  @observable installLoading: boolean = false;

  @observable scriptContent: string = "";

  @observable installVisible: boolean = false;

  @observable installToken: string = "";

  @observable installType: string = "personal";

  onInstallVisibleChange = (value: boolean) => {
    this.installVisible = value;
  };

  checkVSCode = async (envToken: string) => {
    return await ajax<boolean>({
      url: `/tqlab/k8s/checkVSCode`,
      params: { envToken },
    });
  };

  switchEnvEditor = ({
    editorType,
    envToken,
  }: {
    editorType: 0 | 1;
    /** jupyter|vscode */ envToken: string;
  }) => {
    ajax({
      url: `/tqlab/k8s/switchEnvEditor`,
      method: "post",
      data: { editorType, envToken },
      success: (data: ImageInstance) => {
        this.imageInstance = { ...this.imageInstance, ...data };
        // if (data.imageType === 0) {
        //   this.onIframePathChange(
        //     `/tq/${data.ip}/${data.port}/?a=a&token=${data.token}`
        //   );
        // }
        // if (data.imageType === 1) {
        //   this.onIframePathChange(`/tqcode/${data.ip}/${data.port}/`);
        // }

        if (data.imageType === 2) {
          message.info("编辑器切换异常");
        }
        message.success(
          `已成功切换为${editorType === 0 ? "jupyter" : "vscode"}编辑器`
        );
      },
    });
  };

  onHasEnvChange = (value: boolean) => {
    this.hasEnv = value;
  };

  onEnvPreviewVisibleChange = (value: boolean) => {
    this.envPreview = { ...this.envPreview, visible: value };
  };

  updateEnvStatus = (
    env: {
      ip: string;
      port: number;
      token: string;
      filePath?: string;
      status?: number;
    },
    type: string = "person"
  ) => {
    const instances =
      type === "person" ? this.personalInstances : this.teamInstances;
    const cloneInstances = cloneDeep(toJS(instances));
    const findItem = cloneInstances?.find((item) => item.token === env.token);

    if (findItem) {
      findItem.envStatus = env.status as any;
    }

    if (type === "person") {
      this.personalInstances = cloneInstances;
    }

    if (type === "team") {
      this.teamInstances = cloneInstances;
    }
  };

  onPrivateWebSocketConnect = (token: string) => {
    const { host } = window.location;
    const { ws, getReconnectCurrent, setReconnectCurrent } = new Socket(
      `${host}/tqlab/ws/private?token=${encodeURIComponent(token || "")}`
    );
    this.privateInstance = ws;

    this.envIntervalId = setInterval(() => {
      const data = { message: "heartbeat" };
      if (ws.readyState === 1) {
        ws.send(JSON.stringify(data));
      }
    }, 30 * 1000);

    ws.onmessage = (eventMessage) => {
      const wsResult = JSON.parse(eventMessage.data) as {
        data: {
          ip: string;
          port: number;
          token: string;
          filePath?: string;
          status?: number;
          installScripts?: InstallScript[];
        };
        imageType: number;
        type: string;
        userId: number;
      };

      // updateTeamEnvStatus
      if (wsResult.type === "updateEnvStatus") {
        this.updateEnvStatus(wsResult.data, "person");
      }

      if (wsResult.type === "updateTeamEnvStatus") {
        this.updateEnvStatus(wsResult.data, "team");
      }

      // launchTeamEnvInstance
      if (
        wsResult.type === "launchPrivateEnvInstance" ||
        wsResult.type === "launchTeamEnvInstance"
      ) {
        if (wsResult?.data?.installScripts?.length) {
          this.installVisible = true;
          this.installToken = wsResult?.data?.token;
          this.installScripts = wsResult?.data?.installScripts || [];
          this.installType =
            wsResult.type === "launchPrivateEnvInstance" ? "personal" : "team";
        }
        const raw = ls.getItem(USER_TOKEN);
        const vscodeUrl = "/tqlab/page/vscode";
        const token = getToken(raw, vscodeUrl);
        const filePath = wsResult?.data?.filePath || "";
        let path = "";

        // jupyter
        if (wsResult?.imageType === 0) {
          path = `/tq/${wsResult.data.ip}/${wsResult.data.port}/?a=a&token=${wsResult.data.token}`;

          if (filePath) {
            path = `${path}&file-browser-path=${
              wsResult.data.filePath
            }&uuid=${UUID()}`;
          }
        } else if (wsResult?.imageType === 1) {
          // vscode
          const prePath = `${vscodeUrl}?envToken=${
            wsResult.data.token
          }&token=${encodeURIComponent(token)}&folder=/root/workspace`;

          if (filePath) {
            const payload = `[["openFile","vscode-remote:///root/workspace/${filePath}"]]`;
            path = `${prePath}&payload=${encodeURIComponent(payload)}`;
          } else {
            path = prePath;
          }
        } else if (wsResult?.imageType === 2) {
          message.info("编辑器切换异常");
        }

        this.setImageInstance({
          ...(this.imageInstance as ImageInstance),
          ip: wsResult.data.ip,
          port: wsResult.data.port,
          token: wsResult.data.token,
          imageType: wsResult.imageType as 0 | 1 | 2,
        });

        this.onIframePathChange(path);
      }
    };

    ws.onclose = () => {
      if (Socket.isReonnect) {
        // 立即重连
        const timer = setInterval(() => {
          if (!this.privateInstance) return;
          if (
            this.privateInstance ||
            Socket.reconnectCount < getReconnectCurrent()
          ) {
            clearInterval(timer);
          } else {
            // 继续重连
            this.onPrivateWebSocketConnect(token);
            setReconnectCurrent();
          }
        }, Socket.reconnectInterval);
      }
    };
  };

  onPrivateWebSocketClose = () => {
    if (this.privateInstance) {
      this.privateInstance.close();
      this.privateInstance.unmount?.();
      this.privateInstance = null;
    }
  };

  // env websocket
  onEnvWebSocketConnect = (token: string, envToken: string) => {
    if (this.wsInstance) {
      this.wsInstance.close();
    }
    const { host } = window.location;
    const { ws } = new Socket(
      `${host}/tqlab/ws/analysis?token=${encodeURIComponent(
        token
      )}&envToken=${encodeURIComponent(envToken)}`
    );

    this.intervalId = setInterval(() => {
      const data = { message: "heartbeat" };
      if (ws.readyState === 1) {
        ws.send(JSON.stringify(data));
      }
    }, 30 * 1000);

    this.wsInstance = ws;

    ws.onmessage = (eventMessage) => {
      const { strategyId } = JSON.parse(eventMessage.data);

      this.envPreview = { ...this.envPreview, strategyId, visible: true };
    };
  };

  onEnvWebSocketClose = () => {
    if (this.wsInstance) {
      this.wsInstance.close();
      this.wsInstance = null;
    }
  };

  // 个人镜像列表
  getPersonalImageInstances = () => {
    this.personalImageLoading = true;

    return ajax({
      url: `/tqlab/k8s/getPrivateEnvList`,
      success: (data) => {
        this.personalInstances = data;
      },
      effect: () => {
        this.personalImageLoading = false;
      },
    });
  };

  // 团队镜像列表
  getSwitchTeamImageInstances = async () => {
    this.teamImageLoading = true;
    return await ajax({
      url: `/tqlab/k8s/getSwitchTeamImageInstances`,
      success: (data) => {
        this.teamInstances = data;
      },
      effect: () => {
        this.teamImageLoading = false;
      },
    });
  };

  // 配置时获取团队镜像实例列表
  getConfigTeamImageInstance = (teamId: number) => {
    return ajax({
      url: `/tqlab/k8s/getConfigTeamImageInstance`,
      params: { teamId },
    });
  };

  // 获取默认团队镜像
  getDefaultTeamImageInstance = async () => {
    if (!this.teamInstances || !this.teamInstances.length) {
      this.teamInstances = await ajax({
        url: `/tqlab/k8s/getSwitchTeamImageInstances`,
      });
      return this.teamInstances && this.teamInstances.length
        ? this.teamInstances[0]
        : {};
    }
    return this.teamInstances[0];
  };

  onIframePathChange = (path: string) => {
    this.iframePath = path;
  };

  setImageInstance = (instance: ImageInstance | null) => {
    this.imageInstance = instance;
  };

  onImageChange = (instance: ImageInstance, isDirectional: boolean = false) => {
    const url = "/tqlab/ws/analysis";
    const ssToken = ls.getItem(USER_TOKEN);
    const userToken = getToken(ssToken, url);
    this.onEnvWebSocketConnect(userToken, instance.token);
    const path = `/tq/${instance.ip}/${instance.port}/`;

    // 正则判断是否为其他页面跳转过来并打开文件（打开文件跳转时）
    if (isDirectional) {
      this.onIframePathChange(`${this.iframePath}`);
    } else {
      // 首次加载
      this.onIframePathChange(`${path}?a=a&token=${instance.token}`);
    }

    this.setImageInstance(instance);
  };

  // 获取默认镜像
  getDefaultImageInstance = async () => {
    const data = await ajax({
      url: `/tqlab/k8s/getDefaultImageInstance`,
    });
    return data;
  };

  // 设置默认镜像
  setDefaultImageInstance = (envId: number) => {
    ajax({
      url: `/tqlab/k8s/setDefaultImageInstance`,
      params: { envId },
      success: () => {
        const currentImage = this.personalInstances.find(
          (item) => item.id === envId
        );

        if (currentImage) {
          this.setImageInstance(currentImage);
          const url = "/tqlab/ws/analysis";
          const ssToken = ls.getItem(USER_TOKEN);
          const userToken = getToken(ssToken, url);
          this.onEnvWebSocketConnect(userToken, currentImage.token);
          this.getPersonalImageInstances();
          message.success("默认镜像设置成功");
        }
      },
    });
  };

  // 打开用户环境
  launchPrivateEnv = (envId: number) => {
    ajax({
      url: `/tqlab/k8s/launchPrivateEnv`,
      params: { envId },
    });
  };

  // 打开团队环境
  launchTeamEnv = (envId: number) => {
    ajax({
      url: `/tqlab/k8s/launchTeamEnv`,
      params: { envId },
    });
  };

  // 进入或跳转到用户环境
  enterIntoPrivateEnv = (filePath?: string) => {
    ajax({
      url: `/tqlab/k8s/enterIntoPrivateEnv`,
      params: { filePath },
    });
  };

  // 进入或跳转到团队环境
  enterIntoTeamEnv = (teamId: number, filePath?: string) => {
    ajax({
      url: `/tqlab/k8s/enterIntoTeamEnv`,
      params: { filePath, teamId },
    });
  };

  // 关闭用户环境
  shutdownPrivateEnv = async (envId: number, isSolidify: number) => {
    return await ajax({
      url: `/tqlab/k8s/shutdownPrivateEnv`,
      method: "delete",
      params: { envId, isSolidify },
      success: () => {
        message.success("操作成功");
      },
    });
  };

  // 关闭团队环境
  shutdownTeamEnv = async (envId: number, isSolidify: number) => {
    return await ajax({
      url: `/tqlab/k8s/shutdownTeamEnv`,
      method: "delete",
      params: { envId, isSolidify },
      success: () => {
        message.success("操作成功");
      },
    });
  };

  getInstallScripts4Env = async (envToken: string) => {
    this.installLoading = true;
    return await ajax({
      url: `/tqlab/install/getInstallScripts4Env`,
      params: { envToken },
      success: (data) => {
        this.installScripts = data;
      },
      effect: () => {
        this.installLoading = false;
      },
    });
  };

  getInstallScriptContent = (fileName: string) => {
    return ajax({
      url: `/tqlab/install/getInstallScriptContent`,
      params: { fileName },
      success: (data) => {
        this.scriptContent = data;
      },
    });
  };

  reset = () => {
    this.personalInstances = [];
    this.teamInstances = [];
  };
}
