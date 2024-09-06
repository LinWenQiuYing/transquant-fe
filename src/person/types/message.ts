export interface Message {
  createTime: string;
  event: number;
  id: number;
  message: string;
  type: number;
  data: string;
}

export interface MessageList {
  total: number;
  list: Message[];
}

export interface MessageSearchConfig {
  notifyContent: string;
  notifyStartDate: string;
  notifyEndDate: string;
}

export default {};
