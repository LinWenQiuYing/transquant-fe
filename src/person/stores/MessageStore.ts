import { ajax, Nullable, Socket } from "@transquant/utils";
import { message } from "antd";
import { observable } from "mobx";
import { Message, MessageList, MessageSearchConfig } from "../types";

interface Pagination {
  pageNum: number;
  pageSize: number;
}

const defaultConfig = {
  pageNum: 1,
  pageSize: 15,
};

export default class MessageStore {
  @observable tableLoading: boolean = false;

  @observable config: Partial<MessageSearchConfig> = {};

  @observable listLoading: boolean = false;

  @observable allMessages: Nullable<MessageList> = null;

  @observable UnReadedMessages: Message[] = [];

  @observable UnReadedNumber: number | null = null;

  @observable pagination: Partial<Pagination> = defaultConfig;

  @observable ws: WebSocket | undefined = undefined;

  onConfigChange = (data: Partial<MessageSearchConfig>) => {
    this.config = data;
  };

  onUnReadedNumberChange = (number: number) => {
    this.UnReadedNumber = number;
  };

  onPaginationChange = (config: Partial<Pagination>) => {
    this.pagination = { ...this.pagination, ...config };
  };

  getAllMessages = () => {
    this.tableLoading = true;
    ajax({
      url: `/tquser/notification/getNotificationList`,
      method: "post",
      data: {
        ...this.config,
        ...this.pagination,
      },
      success: (data) => {
        this.allMessages = data;
      },
      effect: () => {
        this.tableLoading = false;
      },
    });
  };

  getUnReadedMessages = () => {
    this.listLoading = true;
    ajax({
      url: `/tquser/notification/unreadNotification`,
      success: (data) => {
        this.UnReadedMessages = data.notificationList;
      },
      effect: () => {
        this.listLoading = false;
      },
    });
  };

  readAll = () => {
    ajax({
      url: `/tquser/notification/notificationAllRead`,
      success: () => {
        this.getUnReadedMessages();
        this.getUnReadedNumber();
        message.success("全部已读成功！");
      },
    });
  };

  updateNotificationRead = (id: number) => {
    ajax({
      url: `/tquser/notification/updateNotificationRead`,
      params: { id },
      success: () => {
        this.getUnReadedMessages();
        this.getUnReadedNumber();
      },
    });
  };

  getUnReadedNumber = () => {
    ajax({
      url: `/tquser/user/userSessionHeartBeat`,
      success: (data) => {
        this.UnReadedNumber = data;
      },
    });
  };

  getCurrentMessage = (
    token: string | undefined,
    onMessage: (data: any) => void
  ) => {
    const { host } = window.location;
    this.ws?.close();
    const target = `${host}/tquser/ws/notification?token=${encodeURIComponent(
      token || ""
    )}`;
    const { ws, getReconnectCurrent, setReconnectCurrent } = new Socket(target);
    this.ws = ws;

    ws.onmessage = (event: any) => {
      onMessage(JSON.parse(event.data));
    };

    ws.onclose = () => {
      if (Socket.isReonnect) {
        // 立即重连
        const timer = setInterval(() => {
          if (this.ws || Socket.reconnectCount < getReconnectCurrent()) {
            clearInterval(timer);
          } else {
            // 继续重连
            this.getCurrentMessage(token, onMessage);
            setReconnectCurrent();
          }
        }, Socket.reconnectInterval);
      }
    };
  };
}
