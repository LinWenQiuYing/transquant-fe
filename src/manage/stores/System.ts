import { ajax, Nullable, resolveBlob } from "@transquant/utils";
import { message } from "antd";
import { RcFile } from "antd/es/upload";
import { observable } from "mobx";
import { ICompressState, ISolidState } from "../system/EnvSetting";
import {
  EnvTemplate,
  Image,
  InstallEvent,
  PipItem,
  TemplateItem,
  TransmatrixItem,
} from "../types";

export default class SystemStore {
  @observable transmatrixList: TransmatrixItem[] = [];

  @observable transmatrixLoading: boolean = false;

  @observable templateList: TemplateItem[] = [];

  @observable templateLoading: boolean = false;

  @observable pipList: PipItem[] = [];

  @observable solidProxyState: Nullable<ISolidState> = null;

  @observable compressProxyState: Nullable<ICompressState> = null;

  @observable envTemplateList: EnvTemplate[] = [];

  @observable scriptListLoading: boolean = false;

  @observable fileLoading: boolean = false;

  @observable allImages: Image[] = [];

  @observable installEvents: InstallEvent[] = [];

  @observable eventLoading: boolean = false;

  // 获取所有镜像列表
  getAllImageList = async () => {
    return await ajax({
      url: `/tqlab/image/getAllImageList`,
      params: { code: "190106" },
      success: (data) => {
        this.allImages = data;
      },
    });
  };

  showTransMatrixFile = () => {
    this.transmatrixLoading = true;
    ajax({
      url: `/tqlab/upgradeFile/showTransMatrixFile`,
      method: "post",
      success: (data) => {
        this.transmatrixList = data;
      },
      effect: () => {
        this.transmatrixLoading = false;
      },
    });
  };

  deleteTransMatrixFile = (fileName: string) => {
    ajax({
      url: `/tqlab/upgradeFile/deleteTransMatrixFile`,
      method: "delete",
      params: { fileName },
      success: () => {
        message.success("删除成功");
        this.showTransMatrixFile();
      },
    });
  };

  getCommonTemplate = () => {
    this.templateLoading = true;
    ajax({
      url: `/tqlab/template/getCommonTemplate`,
      success: (data) => {
        this.templateList = data;
      },
      effect: () => {
        this.templateLoading = false;
      },
    });
  };

  // 新增团队模版（type: 0, 策略）
  addCommonTemplateFile = (data: { name: string; type: number }) => {
    return ajax({
      url: `/tqlab/template/addCommonTemplateFile`,
      method: "post",
      data,
    });
  };

  // 删除模版
  deleteGroupTemplateFile = (id: number) => {
    return ajax({
      url: `/tqlab/template/deleteGroupTemplateFile`,
      method: "delete",
      params: { id },
      success: () => {
        message.success("删除成功");
        this.getCommonTemplate();
      },
    });
  };

  // 下载模版
  downloadTemplateZip = (fileName: string, templateId: number) => {
    ajax({
      url: `/tqlab/template/downloadTemplateZip`,
      params: { templateId },
      responseType: "blob",
      headers: {
        "Content-Type": "application/vnd.ms-excel;chartset=utf-8",
      },
      success: (data) => {
        resolveBlob(data, "zip", fileName);
      },
    });
  };

  // 获取pip源
  getPipUrl = () => {
    ajax({
      url: `/tqlab/sys/getPipUrl`,
      success: (data) => {
        if (data) {
          this.pipList = [data];
        }
      },
    });
  };

  // 新增或修改pip源
  addOrUpdatePip = (
    data: Partial<{
      id: number;
      name: string;
      url: string;
    }>
  ) => {
    return ajax({
      url: `/tqlab/sys/addOrUpdatePip`,
      method: "post",
      data,
      success: () => {
        if (data.id) {
          message.success("操作成功");
        } else {
          message.success("编辑成功");
        }
      },
    });
  };

  // 获取自动固化配置
  getAutoSolidifyConfig = () => {
    ajax({
      url: `/tqlab/sys/getAutoSolidifyConfig`,
      success: (data) => {
        this.solidProxyState = data;
      },
    });
  };

  // 获取自动压缩配置
  getAutoSquashConfig = () => {
    ajax({
      url: `/tqlab/sys/getAutoSquashConfig`,
      success: (data) => {
        this.compressProxyState = data;
      },
    });
  };

  // 配置自动压缩
  configAutoSquash = async (data: ICompressState) => {
    await ajax({
      url: `/tqlab/sys/configAutoSquash`,
      method: "post",
      data,
    });
  };

  // 配置自动固化
  configAutoSolidify = async (data: ISolidState) => {
    await ajax({
      url: `/tqlab/sys/configAutoSolidify`,
      method: "post",
      data,
    });
  };

  getEnvTemplates = () => {
    return ajax({
      url: `/tqlab/sys/getEnvTemplates`,
      params: { code: "190107" },
      success: (data) => {
        this.envTemplateList = data;
      },
    });
  };

  addEnvTemplate = (data: Omit<EnvTemplate, "id">) => {
    return ajax({
      url: `/tqlab/sys/addEnvTemplate`,
      method: "post",
      data,
    });
  };

  updateEnvTemplate = (
    data: Omit<EnvTemplate, "id"> & { envTemplateId: number }
  ) => {
    return ajax({
      url: `/tqlab/sys/updateEnvTemplate`,
      method: "post",
      data,
    });
  };

  deleteEnvTemplate = (envTemplateId: number) => {
    return ajax({
      url: `/tqlab/sys/deleteEnvTemplate`,
      method: "delete",
      params: { envTemplateId },
      success: () => {
        message.success("删除成功");
        this.getEnvTemplates();
      },
    });
  };

  getAllScripts = async () => {
    this.scriptListLoading = true;
    return await ajax({
      url: `/tqlab/install/getAllScripts`,
      compatibleData: [],
      effect: () => {
        this.scriptListLoading = false;
      },
    });
  };

  addInstallScript = (data: {
    version: string;
    imageId: string;
    comment: string;
    file: RcFile;
  }) => {
    return ajax({
      url: `/tqlab/install/addInstallScript`,
      method: "post",
      data,
      headers: {
        "Content-Type": "multipart/form-data;",
      },
    });
  };

  addInstallFile = (data: { file: RcFile }) => {
    return ajax({
      url: `/tqlab/install/addInstallFile`,
      method: "post",
      data,
      headers: {
        "Content-Type": "multipart/form-data;",
      },
    });
  };

  deleteInstallScript = (id: string) => {
    return ajax({
      url: `/tqlab/install/deleteInstallScript`,
      method: "delete",
      params: { id },
      success: () => {
        message.success("删除成功");
      },
    });
  };

  deleteInstallFile = (id: string) => {
    return ajax({
      url: `/tqlab/install/deleteInstallFile`,
      method: "delete",
      params: { id },
      success: () => {
        message.success("删除成功");
      },
    });
  };

  installNotification = (id: string) => {
    return ajax({
      url: `/tqlab/install/installNotification`,
      method: "post",
      params: { id },
      success: () => {
        message.success("操作成功");
      },
    });
  };

  getInstallFiles = () => {
    this.fileLoading = true;
    return ajax({
      url: `/tqlab/install/getInstallFiles`,
      compatibleData: [],
      effect: () => {
        this.fileLoading = false;
      },
    });
  };

  getInstallEvents = () => {
    this.eventLoading = true;
    return ajax({
      url: `/tqlab/install/getInstallEvents`,
      success: (data) => {
        this.installEvents = data;
      },
      effect: () => {
        this.eventLoading = false;
      },
    });
  };
}
