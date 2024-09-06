import { ajax, Nullable } from "@transquant/utils";
import { message } from "antd";
import { observable } from "mobx";
import { IFormValues } from "../environment/EnvironmentOperatorMenu";
import { IEnvSearch } from "../environment/EnvSearchHeader";
import { FormValueType } from "../environment/ResourceQuotaModal";
import { IShareSpaceSearch } from "../environment/ShareSpaceSearchHeader";
import { EnvTemp, Host as HostInfo, ShareEnv } from "../types";
import {
  Environment,
  Host,
  Node,
  NodeItem,
  QuotaData,
} from "../types/environment";

interface Pagination {
  pageNum: number;
  pageSize: number;
}

export const defaultConfig = {
  pageNum: 1,
  pageSize: 15,
};

export default class EnvironmentStore {
  @observable nodeList: NodeItem[] = [];

  @observable envList: Environment[] = [];

  @observable hosts: Host[] = [];

  @observable envTemplates: EnvTemp[] = [];

  @observable shareEnvList: ShareEnv[] = [];

  @observable cacheEnvConfig: Partial<IEnvSearch> = {};

  @observable pagination: Partial<Pagination> = defaultConfig;

  @observable nodes: string[] = [];

  @observable hostInfos: HostInfo[] = [];

  @observable quotaData: Nullable<QuotaData> = null;

  onPaginationChange = (config: Partial<Pagination>) => {
    this.pagination = { ...this.pagination, ...config };
  };

  resetQuotaData = () => {
    this.quotaData = null;
  };

  getNodeInfo = () => {
    ajax<Node>({
      url: `/tqlab/sys/getNodeInfo`,
      success: (data) => {
        if (!data) return;

        const entries = Object.entries(data).map(([name, props]) => ({
          name,
          ...props,
        }));

        this.nodeList = entries;
      },
    });
  };

  getManagedEnvList = (data?: Partial<IEnvSearch>) => {
    ajax({
      url: `/tqlab/env/getManagedEnvList`,
      method: "post",
      data,
      success: (data) => {
        this.envList = data;
      },
    });
  };

  getShareEnvList = (data?: Partial<IShareSpaceSearch>) => {
    ajax({
      url: `/tqlab/env/getShareEnvList`,
      method: "post",
      data,
      success: (data) => {
        this.shareEnvList = data;
      },
    });
  };

  getNodeList = () => {
    ajax({
      url: `/tqlab/env/getNodeList`,
      success: (data) => {
        this.nodes = data;
      },
    });
  };

  onCacheEnvConfigChange = (config: Partial<IEnvSearch>) => {
    this.cacheEnvConfig = config;
  };

  getEnvTemplates = (code: string) => {
    ajax({
      url: `/tqlab/sys/getEnvTemplates`,
      params: { code },
      success: (data) => {
        this.envTemplates = data;
      },
    });
  };

  updateManageEnv = async (data: Partial<IFormValues>) => {
    await ajax({
      url: `/tqlab/env/updateManagedEnv`,
      method: "post",
      data,
      success: () => {
        this.getManagedEnvList();
        message.success("修改成功");
      },
    });
  };

  // 获取部署服务器下拉列表
  getHostInfo = () => {
    ajax({
      url: `/tqlab/k8s/getHostInfo`,
      success: (data) => {
        this.hosts = data;
      },
    });
  };

  getNodeResourceUsage = () => {
    ajax({
      url: `/tqlab/k8s/getNodeResourceUsage`,
      success: (data) => {
        this.hostInfos = data;
      },
    });
  };

  // 修改协作空间环境
  updateShareEnv = (data: { shareId: number; envTemplateId: number }) => {
    ajax({
      url: `/tqlab/env/updateShareEnv`,
      method: "post",
      data,
      success: () => {
        message.success("修改成功");
        this.getShareEnvList();
      },
    });
  };

  persistResourceQuota = (data: Partial<FormValueType>) => {
    return ajax({
      url: `/tqlab/sys/persistResourceQuota`,
      method: "post",
      data,
      success: () => {
        message.success("操作成功");
      },
    });
  };

  getResourceQuota = () => {
    ajax({
      url: `/tqlab/sys/getResourceQuota`,
      success: (data) => {
        this.quotaData = data;
      },
    });
  };
}
