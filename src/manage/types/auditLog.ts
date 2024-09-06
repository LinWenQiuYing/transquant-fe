export interface AuditLogItem {
  createTime: string;
  event: string;
  eventDesc: string;
  id: number;
  ipAddress: string;
  realName: string;
  status: number;
  userName: string;
}

export interface AuditLog {
  list: AuditLogItem[];
  total: 0;
}
