import getProtocol from "../getProtocol";

export type SocketType = WebSocket & {
  unmount?: () => void;
};

export default class Socket {
  ws: SocketType;

  static isReonnect: boolean = true; // 是否可以重连

  static reconnectCount: number = 3; // 重连次数

  private reconnectCurrent: number = 0; // 已发起重连次数

  static reconnectInterval: number = 3000; // 重连频率

  constructor(path: string) {
    const protocol = getProtocol();
    const prefix = protocol === "http" ? "ws" : "wss";

    this.ws = new WebSocket(`${prefix}://${path}`);
  }

  setReconnectCurrent() {
    this.reconnectCurrent++;
  }

  getReconnectCurrent() {
    return this.reconnectCurrent;
  }
}
