import { ajax, Nullable, resolveBlob } from "@transquant/utils";
import { observable } from "mobx";
import { AuditLog } from "../types/auditLog";

type RangeTime = {
  startTime?: string;
  endTime?: string;
};

export default class AuditLogStore {
  @observable auditLog: Nullable<AuditLog> = null;

  @observable loading: boolean = true;

  @observable rangeTime: Nullable<RangeTime> = null;

  onRangeTimeChange = (data: RangeTime) => {
    this.rangeTime = data;
  };

  getAuditLog = ({
    pageIndex,
    pageSize,
    startTime,
    endTime,
  }: {
    pageIndex: number;
    pageSize: number;
    startTime?: string;
    endTime?: string;
  }) => {
    ajax({
      url: `/tquser/audit/getAuditLog`,
      params: {
        pageIndex,
        pageSize,
        startTime: startTime || this.rangeTime?.startTime,
        endTime: endTime || this.rangeTime?.endTime,
      },
      success: (data) => {
        this.auditLog = data;
      },
      effect: () => {
        this.loading = false;
      },
    });
  };

  exportAuditLog = (params?: { startTime?: string; endTime?: string }) => {
    ajax({
      url: `/tquser/audit/exportAuditLog`,
      params,
      responseType: "blob",
      headers: {
        "Content-Type": "application/vnd.ms-excel;chartset=utf-8",
      },
      success: (data) => {
        resolveBlob(data, "xls", "审计日志");
      },
    });
  };
}
