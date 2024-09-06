import { ajax } from "@transquant/utils";
import { message } from "antd";
import { computed, observable } from "mobx";
import {
  EnvTemp,
  Host,
  Image,
  PageMenuItem,
  UserItem,
  UserPermission,
} from "../types";
import { UserStatus } from "../user/UserTable";

export default class UserStore {
  @observable createLoading: boolean = false;

  @observable loading: boolean = false;

  @observable allImages: Image[] = [];

  @observable allUsers: UserItem[] = [];

  @observable hosts: Host[] = [];

  @observable allMenus: PageMenuItem[] = [];

  @observable searchValue: string = "";

  @observable userPermission: UserPermission[] = [];

  @observable userMenuPermissions: string[] = [];

  @observable permissionLoading: boolean = true;

  @observable envTemplates: EnvTemp[] = [];

  onPermissionLoadingChange = (value: boolean) => {
    this.permissionLoading = value;
  };

  onSearchValueChange = (value: string) => {
    this.searchValue = value;
  };

  getAllUsers = () => {
    this.loading = true;
    ajax({
      url: `tquser/user/getAllUsers`,
      success: (data) => {
        this.allUsers = data;
      },
      effect: () => {
        this.loading = false;
      },
    });
  };

  @computed
  get filterAllUsers() {
    return this.allUsers.filter((item) =>
      item.username.includes(this.searchValue)
    );
  }

  // 获取菜单列表
  getAllMenus = async () => {
    await ajax({
      url: `/tquser/menu/getAllMenus`,
      success: (data) => {
        this.allMenus = data;
      },
    });
  };

  getUserDBPermission = async (userId: number) => {
    await ajax({
      url: `/tqlab/user/getUserDBPermission`,
      params: { userId },
      success: (data) => {
        this.userPermission = data;
      },
    });
  };

  createUser = async (data: {
    email: string;
    name: string;
    username: string;
    status?: UserStatus;
    positionId?: number;
    telephone?: string;
  }) => {
    this.createLoading = true;
    await ajax({
      url: `tquser/user/createUser`,
      method: "POST",
      data,
      success: () => {
        message.success("添加成功");
        this.getAllUsers();
      },
      effect: () => {
        this.createLoading = false;
      },
    });
  };

  updateUser = async (data: {
    email: string;
    id: number;
    name: string;
    status?: UserStatus;
    positionId?: number;
    telephone?: string;
  }) => {
    await ajax({
      url: `tquser/user/updateUser`,
      method: "POST",
      data,
      success: () => {
        message.success("更新成功");

        this.getAllUsers();
      },
    });
  };

  resetPassword = (id: number) => {
    ajax({
      url: `tquser/user/resetPassword`,
      params: { id },
      success: () => {
        message.success("密码重置成功");
        this.getAllUsers();
      },
    });
  };

  deleteUser = (id: number) => {
    ajax({
      url: `/tquser/user/deleteUser`,
      params: { id },
      success: () => {
        message.success("删除成功");
        this.getAllUsers();
      },
    });
  };

  // 获取所有镜像列表
  getAllImageList = () => {
    return ajax({
      url: `/tqlab/image/getAllImageList`,
      params: { code: "130101" },
      success: (data) => {
        this.allImages = data;
      },
    });
  };

  // 获取用户镜像列表
  getPrivateEnvList = (userId: number) => {
    return ajax({
      url: `/tqlab/k8s/getPrivateEnvList`,
      params: { userId },
    });
  };

  // 创建用户镜像实例
  createPrivateEnv = (data: {
    envTemplateId: number;
    userId: number;
    imageId: number;
    name: string;
    node?: string;
  }) => {
    return ajax({
      url: `/tqlab/k8s/createPrivateEnv`,
      method: "POST",
      data,
    });
  };

  // 删除用户镜像实例
  deletePrivateEnv = (data: { jupyterEnvId: number; userId: number }) => {
    return ajax({
      url: `/tqlab/k8s/deletePrivateEnv`,
      method: "delete",
      params: data,
    });
  };

  getNodeResourceUsage = () => {
    ajax({
      url: `/tqlab/k8s/getNodeResourceUsage`,
      success: (data) => {
        this.hosts = data;
      },
    });
  };

  // 获取菜单权限
  getMenuAuthByUserId = async (userId: number) => {
    await ajax({
      url: `/tquser/menu/getMenuAuthByUserId`,
      params: { userId },
      success: (data) => {
        this.userMenuPermissions = data?.map(
          (item: { code: string }) => item.code
        );
      },
    });
  };

  getEnvTemplates = () => {
    ajax({
      url: `/tqlab/sys/getEnvTemplates`,
      params: { code: "130101" },
      success: (data) => {
        this.envTemplates = data;
      },
    });
  };
}
