import { ajax, Nullable, resolveBlob } from "@transquant/utils";
import { RcFile } from "antd/es/upload";
import { observable } from "mobx";
import { File, FileInfo } from "../types";

type Pagination = {
  pageNum: number;
  pageSize: number;
};

export default class DataManageStore {
  @observable files: Nullable<FileInfo> = null;

  @observable fileListLoading: boolean = false;

  @observable pagination: Pagination = {
    pageNum: 1,
    pageSize: 15,
  };

  @observable searchVal: string = "";

  onSearchValChange = (value: string) => {
    this.searchVal = value;
  };

  onPaginationChange = (config: Partial<Pagination>) => {
    this.pagination = { ...this.pagination, ...config };
  };

  getFileList = (pageNo: number, pageSize: number, searchVal?: string) => {
    this.fileListLoading = true;
    const defaultParams = {
      fullName: "",
      tenantCode: "",
      type: "FILE",
    };
    ajax({
      url: `/tqdata/resources`,
      params: {
        ...defaultParams,
        pageNo,
        pageSize,
        searchVal,
      },
      success: (res) => {
        this.files = {
          total: res.total,
          list: res.totalList.map((item: File, index: number) => {
            return {
              ...item,
              index: index + 1,
            };
          }),
        };
      },
      effect: () => {
        this.fileListLoading = false;
      },
    });
  };

  createFile = async (data: {
    fileName: string;
    suffix: string;
    content: string;
  }) => {
    const defaultParams = {
      pid: -1,
      type: "FILE",
      description: "",
      currentDir: "/",
    };
    await ajax({
      url: `/tqdata/resources/online-create`,
      method: "post",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      data: {
        ...defaultParams,
        ...data,
      },
      success: () => {
        this.getFileList(
          this.pagination.pageNum,
          this.pagination.pageSize,
          this.searchVal
        );
      },
    });
  };

  updateFile = (data: { fullName: string; content: string }) => {
    ajax({
      url: `/tqdata/resources/update-content`,
      method: "put",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      data: {
        ...data,
        tenantCode: "default",
      },
      success: () => {
        this.getFileList(
          this.pagination.pageNum,
          this.pagination.pageSize,
          this.searchVal
        );
      },
    });
  };

  uploadFile = (data: { name: string; file?: RcFile }) => {
    const defaultParams = {
      description: "",
      currentDir: "/",
      type: "FILE",
    };

    ajax({
      url: `/tqdata/resources`,
      method: "post",
      data: {
        ...defaultParams,
        ...data,
      },
      headers: {
        "Content-Type": "multipart/form-data;",
      },
      success: () => {
        this.getFileList(
          this.pagination.pageNum,
          this.pagination.pageSize,
          this.searchVal
        );
      },
    });
  };

  getFileInfo = async (fullName: string) => {
    const defaultParams = {
      skipLineNum: 0,
      limit: 3000,
      tenantCode: "default",
    };
    return await ajax({
      url: `/tqdata/resources/view`,
      params: {
        ...defaultParams,
        fullName,
      },
    });
  };

  rename = async (data: { name: string; fullName: string }) => {
    const defaultParams = {
      type: "FILE",
      description: "",
      user_name: "default",
      tenantCode: "default",
    };
    await ajax({
      url: `/tqdata/resources`,
      method: "put",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      data: {
        ...defaultParams,
        ...data,
      },
      success: () => {
        this.getFileList(
          this.pagination.pageNum,
          this.pagination.pageSize,
          this.searchVal
        );
      },
    });
  };

  deleteFile = (fullName: string) => {
    ajax({
      url: `/tqdata/resources`,
      method: "delete",
      params: { fullName, tenantCode: "default" },
      success: () => {
        this.getFileList(
          this.pagination.pageNum,
          this.pagination.pageSize,
          this.searchVal
        );
      },
    });
  };

  downloadFile = (fullName: string, fileName: string) => {
    ajax({
      url: `/tqdata/resources/download`,
      method: "get",
      params: { fullName },
      responseType: "blob",
      success: (data) => {
        resolveBlob(data, "", fileName, true);
      },
    });
  };
}
