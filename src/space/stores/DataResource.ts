import { Label } from "@transquant/ui";
import { ajax, Nullable, resolveBlob } from "@transquant/utils";
import { message } from "antd";
import { RcFile } from "antd/es/upload";
import { observable } from "mobx";
import { DataType } from "../data-resource/ImportTable";
import {
  DataExampleInfo,
  TableInfo,
  TreeData,
  UploadHistoryItem,
} from "../types/dataResource";

export default class DataResourceStore {
  @observable treeData: Nullable<TreeData> = null;

  @observable tableInfo: Nullable<TableInfo> = null;

  @observable dataExamples: Nullable<DataExampleInfo> = null;

  @observable uploadHistoryList: UploadHistoryItem[] = [];

  @observable uploadHistoryListLoading: boolean = false;

  @observable checkInfo: Nullable<{
    success: boolean;
    message: string;
  }> = null;

  @observable checkLoading: boolean = false;

  @observable downloading: boolean = false;

  @observable tableHeaders: string[] = [];

  @observable personalTags: Label[] = [];

  resetCheckInfo = () => {
    this.checkInfo = null;
  };

  // 获取个人库timelyre库表结构
  getDBTableInfoByUser = (data?: { name: string; labels: string[] }) => {
    return ajax({
      url: `/tqlab/dataresource/getDBTableInfoByUser`,
      method: "POST",
      data,
      success: (data) => {
        this.treeData = data;
      },
    });
  };

  // 获取timeLyre表详情
  getTableDetailInfo = async (data: { dbName: string; tableName: string }) => {
    await ajax({
      url: `/tqlab/dataresource/getTableDetailInfo`,
      method: "POST",
      data,
      success: (data) => {
        this.tableInfo = data;
      },
    });
  };

  // 修改timelyre表结构
  updateTimelyreTableLabel = (data: {
    dbName: string;
    labels: string[];
    tableName: string;
  }) => {
    ajax({
      url: `/tqlab/tag/updateTimelyreTableTag`,
      method: "POST",
      data,
      success: () => {
        message.success("设置成功");

        this.getTableDetailInfo({
          dbName: data.dbName,
          tableName: data.tableName,
        });
      },
    });
  };

  // 获取预览资源
  getPreviewData = (data: { dbName: string; tableName: string }) => {
    ajax({
      url: `/tqlab/dataresource/getPreviewData`,
      method: "POST",
      data,
      success: (data) => {
        this.dataExamples = data;
      },
    });
  };

  // 设置表的备注
  setUserComment = async (data: {
    comment: string;
    dbName: string;
    tableName: string;
  }) => {
    await ajax({
      url: `/tqlab/dataresource/setUserComment`,
      method: "post",
      data,
      success: async () => {
        message.success("设置成功");

        await this.getTableDetailInfo({
          dbName: data.dbName,
          tableName: data.tableName,
        });
      },
    });
  };

  // 获取上传历史
  getUploadHistory = async (data: { dbName: string; tableName: string }) => {
    this.uploadHistoryListLoading = true;
    await ajax({
      url: `/tqlab/dataresource/getUploadHistory`,
      method: "post",
      data,
      success: (data) => {
        this.uploadHistoryList = data;
      },
      effect: () => {
        this.uploadHistoryListLoading = false;
      },
    });
  };

  // 下载导入模版
  downloadTableTemplate = (params: { dbName: string; tableName: string }) => {
    ajax({
      url: `/tqlab/dataresource/downloadTableTemplate`,
      params,
      responseType: "blob",
      headers: {
        "Content-Type": "application/vnd.ms-excel;chartset=utf-8",
      },
      success: (data) => {
        resolveBlob(data, "xlsx", "示例模版");
      },
    });
  };

  // 上传数据文件
  uploadDataFile = ({
    file,
    dbName,
    tableName,
  }: {
    file: RcFile;
    dbName: string;
    tableName: string;
  }) => {
    const formData = new FormData();
    formData.append("file", file as RcFile);
    formData.append("dbName", dbName);
    formData.append("tableName", tableName);

    return ajax({
      url: "/tqlab/dataresource/uploadDataFile",
      method: "post",
      data: formData,
      success: () => {
        this.getUploadHistory({ dbName, tableName });
      },
    });
  };

  // 下载数据
  downloadDataFile = (params: {
    code?: string;
    dbName: string;
    endTime?: string;
    startTime?: string;
    tableName: string;
  }) => {
    this.downloading = true;
    ajax({
      url: `/tqlab/dataresource/downloadDataFile`,
      params,
      responseType: "blob",
      headers: {
        "Content-Type": "application/vnd.ms-excel;chartset=utf-8",
      },
      success: (data) => {
        resolveBlob(data, "csv", `${params.dbName}.${params.tableName}`);
      },
      effect: () => {
        this.downloading = false;
      },
    });
  };

  downloadDataFileCount = (data: {
    code?: string;
    dbName: string;
    endTime?: string;
    startTime?: string;
    tableName: string;
  }) => {
    this.checkLoading = true;
    ajax({
      url: `/tqlab/dataresource/downloadDataFileCount`,
      method: "post",
      data,
      success: (data) => {
        this.checkInfo = data;
      },
      effect: () => {
        this.checkLoading = false;
      },
    });
  };

  // 解析表头导入文件
  parseTableFile = (file: RcFile) => {
    const formData = new FormData();
    formData.append("file", file);
    return ajax({
      url: `/tqlab/dataresource/parseTableFile`,
      method: "post",
      data: formData,
      success: (data) => {
        this.tableHeaders = data;
      },
    });
  };

  resetTableHeaders = () => {
    this.tableHeaders = [];
  };

  getPersonalTags = async () => {
    await ajax({
      url: `/tqlab/tag/getTags`,
      success: (data) => {
        this.personalTags = data;
      },
    });
  };

  createTable = (data: {
    columnParams: DataType[];
    tableComment: string;
    dbName: string;
    labels: string[];
    tableName: string;
    bucketCol: string;
    bucketCount: number;
    createTableType: string;
    fieldsTerminatedBy: string;
    hdfsPath: string;
    isTransactional: string;
    linesTerminatedBy: string;
    userComment: string;
  }) => {
    return ajax({
      url: `/tqlab/dataresource/createTable`,
      method: "post",
      data,
      success: () => {
        message.success("创建成功");
        this.getDBTableInfoByUser();
      },
    });
  };

  dropTimelyreTable = (dbName: string, tableName: string) => {
    ajax({
      url: `/tqlab/dataresource/dropTimelyreTable`,
      method: "delete",
      params: { dbName, tableName },
      success: () => {
        message.success("删除成功");
        this.getDBTableInfoByUser();
      },
    });
  };
}
