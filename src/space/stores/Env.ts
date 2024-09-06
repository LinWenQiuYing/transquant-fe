import { ajax, Nullable, Socket } from "@transquant/utils";
import { observable } from "mobx";

export type PreviewItem = {
  type: 0 | 1;
  resultId: number;
  visible: boolean;
};

export default class EnvStore {
  @observable wsInstance: WebSocket | null = null;

  @observable previewItem: Nullable<PreviewItem> = null;

  onPreviewItemVisibleChange = (value: boolean) => {
    this.previewItem = { ...this.previewItem!, visible: value };
  };

  getWorkspaceBranchName = () => {
    return ajax({
      url: `/tqlab/getWorkspaceBranchName`,
    });
  };

  switchMaster = (branchName: string) => {
    return ajax({
      url: `/tqlab/runtime/switchMaster`,
      params: { branchName },
    });
  };

  // websocket链接，脚本运行
  onWebsocketConnect = (token: string) => {
    const { host } = window.location;
    const { ws } = new Socket(`${host}/tqlab/ws?token=${token}`);

    this.wsInstance = ws;

    ws.onopen = () => {
      const params = {
        command: "StartReceiveMessage",
        param: "",
      };
      ws.send(JSON.stringify(params));
    };

    ws.onmessage = (eventMessage) => {
      const data = JSON.parse(eventMessage.data);

      const { type, resultId } = data;

      this.previewItem = { type, resultId, visible: true };
    };
  };

  onWebsocketClose = () => {
    if (this.wsInstance) {
      this.wsInstance.close();
    }
  };
}
