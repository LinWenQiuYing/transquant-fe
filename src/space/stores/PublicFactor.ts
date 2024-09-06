/* eslint-disable no-return-await */
import { Label } from "@transquant/ui";
import { ajax, Nullable } from "@transquant/utils";
import { message } from "antd";
import { observable } from "mobx";
import { IFormValues } from "../research-resource/public-factor/DownLoadModal";
import { DataNode } from "../research-resource/public-factor/LeftView";
import { PublicFactorTree } from "../types/publicFactor";

type FileData = {
  type: "code" | "md";
  data: string;
};

export default class PublicFactorStore {
  @observable allTags: Label[] = [];

  @observable fileData: Nullable<FileData> = null;

  @observable activePath: string = "";

  @observable selectedNode: Nullable<DataNode> = null;

  @observable treeLoading: boolean = false;

  @observable treeDataSource: PublicFactorTree[] = [];

  onActivePathChange = (path: string) => {
    this.activePath = path;
  };

  onSelectedNodeChange = (node: DataNode) => {
    this.selectedNode = node;
  };

  getPublicFactorTree = async (name?: string) => {
    this.treeLoading = true;
    return await ajax({
      url: `/tqlab/researchRes/getPublicFactorTree`,
      params: { name },
      success: (data) => {
        this.treeDataSource = data;
      },
      effect: () => {
        this.treeLoading = false;
      },
    });
  };

  mark = async (path: string) => {
    await ajax({
      url: `/tqlab/researchRes/mark`,
      params: { path },
      success: () => {
        message.success("收藏成功");
      },
    });
  };

  unMark = async (path: string) => {
    await ajax({
      url: `/tqlab/researchRes/unMark`,
      params: { path },
      success: () => {
        message.success("取消收藏成功");
      },
    });
  };

  download2PersonalSpace = (data: Partial<IFormValues>) => {
    ajax({
      url: `/tqlab/researchRes/download2PersonalSpace`,
      method: "post",
      data,
      success: () => {
        message.success("新建成功");
      },
    });
  };

  getTags = async () => {
    await ajax({
      url: `/tqlab/tag/getTags`,
      success: (data) => {
        this.allTags = data;
      },
    });
  };

  readFile = async (path: string) => {
    await ajax({
      url: `/tqlab/researchRes/readFile`,
      params: { path },
      success: (data) => {
        this.fileData = {
          type: "code",
          data,
        };
      },
    });
  };

  getFactorMD = async (path: string) => {
    await ajax({
      url: `/tqlab/researchRes/getFactorMD`,
      params: { path },
      success: (data) => {
        this.fileData = {
          type: "md",
          data,
        };
      },
    });
  };

  onReset = () => {
    this.fileData = null;
    this.activePath = "";
  };
}
