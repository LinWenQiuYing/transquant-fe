import { ajax, diff, Nullable, resolveBlob } from "@transquant/utils";
import { message } from "antd";
import { computed, observable } from "mobx";
import { IGroupConfigValue } from "../organization/components/resource/ConfigModal";
import { ShareSpaceValue } from "../organization/components/resource/ShareModal";
import { IRoleFormValue } from "../organization/components/role/RoleModal";
import { IGroupValue } from "../organization/GroupModal";
import { State } from "../organization/team-modal";
import { ResultValue } from "../permission";
import { Image, Role } from "../types";
import {
  Examine,
  Group,
  MemberTable,
  Permission,
  ProcessLog,
  RoleTable,
  ShareList,
  SimpleUser,
  Template,
  TemplateItem,
} from "../types/organization";
import { EnvTemp } from "../types/user";

export default class OrganizationStore {
  @observable groups: Group[] = [];

  @observable groupsLoading: boolean = false;

  @observable selectedGroup: Nullable<Group> = null;

  @observable memberTable: Nullable<MemberTable> = null;

  @observable memeberTableLoading: boolean = false;

  @observable roleList: Role[] = [];

  @observable allUsers: SimpleUser[] = [];

  @observable allUsersSearchValue: string = "";

  @observable roleTable: Nullable<RoleTable> = null;

  @observable roleTableLoading: boolean = false;

  @observable templates: Template[] = [];

  @observable shareList: Nullable<ShareList> = null;

  @observable shareListLoading: boolean = false;

  @observable userList: SimpleUser[] = [];

  @observable imageList: Image[] = [];

  @observable envTemplates: EnvTemp[] = [];

  @observable FactorStategyTemplates: TemplateItem[] = [];

  @observable examine: Examine[] = [];

  @observable publishers: SimpleUser[] = [];

  @observable processLog: ProcessLog[] = [];

  @observable permission: Nullable<Permission> = null;

  @observable mergeLoading: boolean = false;

  @observable splitLoading: boolean = false;

  onSelectedGroup = (group: Nullable<Group>) => {
    this.selectedGroup = group;
  };

  onAllUsersSearchValueChange = (value: string) => {
    this.allUsersSearchValue = value;
  };

  @computed
  get filterAllUsers() {
    if (!this.memberTable) return [];
    const excludes = diff(
      this.allUsers,
      this.memberTable.list,
      (item) => item.id
    );
    return excludes.filter((item) =>
      item.realName.includes(this.allUsersSearchValue)
    );
  }

  getTeamTree = () => {
    this.groupsLoading = true;
    ajax<Group[]>({
      url: `/tquser/team/getTeamTree`,
      success: (data) => {
        this.groups = data;
      },
      effect: () => {
        this.groupsLoading = false;
      },
    });
  };

  addTeam = (data: Partial<IGroupValue>) => {
    return ajax({
      url: `/tquser/team/addTeam`,
      method: "post",
      data,
      success: () => {
        this.getTeamTree();
        message.success("添加成功");
      },
    });
  };

  deleteTeam = (teamId: number) => {
    return ajax({
      url: `/tquser/team/deleteTeam`,
      method: "delete",
      params: { teamId },
      success: () => {
        this.getTeamTree();
        if (this.selectedGroup?.id === teamId) {
          this.selectedGroup = null;
        }
        message.success("删除成功");
      },
    });
  };

  updateTeam = (data: Partial<IGroupValue>) => {
    return ajax({
      url: `/tquser/team/updateTeam`,
      method: "post",
      data,
      success: (data) => {
        this.selectedGroup = data;
        message.success("编辑成功");
        this.getTeamTree();
      },
    });
  };

  getMembersByTeam = (params: {
    pageIndex?: number;
    pageSize?: number;
    teamId: number;
  }) => {
    this.memeberTableLoading = true;
    ajax({
      url: `/tquser/user/getMembersByTeam`,
      params: {
        pageIndex: params.pageIndex || 1,
        pageSize: params.pageSize || 15,
        teamId: params.teamId,
      },
      success: (data) => {
        this.memberTable = data;
      },
      effect: () => {
        this.memeberTableLoading = false;
      },
    });
  };

  // 添加团队成员
  addMemberOfTeam = (data: {
    roleId?: number;
    teamId: number;
    userIds?: number[];
  }) => {
    ajax({
      url: `/tquser/user/addMemberOfTeam`,
      method: "post",
      data,
      success: () => {
        message.success("新增成功");
        this.getMembersByTeam({
          teamId: data.teamId,
        });
      },
    });
  };

  // 编辑用户角色
  updateUserRole = (data: { roleId: number; userId: number }) => {
    ajax({
      url: `/tquser/user/updateUserRole`,
      method: "post",
      data,
      success: () => {
        message.success("编辑成功");
        this.getMembersByTeam({
          teamId: this.selectedGroup?.id!,
        });
      },
    });
  };

  // 移出团队成员
  removeMemberOfTeam = (data: { teamId: number; userId: number }) => {
    ajax({
      url: `/tquser/user/removeMemberOfTeam`,
      method: "post",
      data,
      success: () => {
        message.success("移出成功");
        this.getMembersByTeam({
          teamId: data.teamId,
        });
      },
    });
  };

  // 获取角色列表
  getRoleListOfTeam = async (teamId: number) => {
    await ajax({
      url: `/tquser/role/getRoleListOfTeam`,
      params: { teamId },
      success: (data) => {
        this.roleList = data;
      },
    });
  };

  getAllSimpleUsers = async () => {
    await ajax({
      url: `/tquser/user/getAllSimpleUsers`,
      success: (data) => {
        this.allUsers = data;
      },
    });
  };

  // 获取团队角色列表
  getRolesByTeam = (params?: {
    pageIndex?: number;
    pageSize?: number;
    teamId?: number;
  }) => {
    this.roleTableLoading = true;
    ajax({
      url: `/tquser/role/getRolesByTeam`,
      params: {
        pageIndex: params?.pageIndex || 1,
        pageSize: params?.pageSize || 15,
        teamId: params?.teamId || this.selectedGroup?.id,
      },
      success: (data) => {
        this.roleTable = data;
      },
      effect: () => {
        this.roleTableLoading = false;
      },
    });
  };

  deleteRoleOfTeam = (roleId: number) => {
    ajax({
      url: `/tquser/role/deleteRoleOfTeam`,
      method: "delete",
      params: { roleId },
      success: () => {
        message.success("删除成功");
        this.getRolesByTeam({ teamId: this.selectedGroup!.id });
      },
    });
  };

  addRoleOfTeam = (data: Partial<IRoleFormValue>) => {
    return ajax({
      url: `/tquser/role/addRoleOfTeam`,
      method: "post",
      data,
      success: () => {
        message.success("新增成功");
        this.getRolesByTeam();
      },
    });
  };

  // 获取团队下模版
  getAllTemplate = (teamId: number) => {
    ajax({
      url: `/tqlab/template/getAllTemplate`,
      params: { teamId },
      success: (data) => {
        this.templates = data;
      },
    });
  };

  // 删除模版
  deleteTemplate = (id: number) => {
    return ajax({
      url: `/tqlab/template/deleteGroupTemplateFile`,
      method: "delete",
      params: { id },
      success: () => {
        message.success("删除成功");
        this.getAllTemplate(this.selectedGroup!.id);
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

  // 新增团队模版（type: 0, 策略）
  addGroupTemplateFile = (data: {
    name: string;
    teamId: number;
    type: number;
  }) => {
    return ajax({
      url: `/tqlab/template/addGroupTemplateFile`,
      method: "post",
      data,
    });
  };

  // 配置时获取团队镜像实例列表
  getConfigTeamImageInstance = () => {
    return ajax({
      url: `/tqlab/k8s/getConfigTeamImageInstance`,
      params: { teamId: this.selectedGroup?.id },
    });
  };

  // 创建团队镜像实例
  createTeamEnv = (data: {
    envTemplateId: number;
    imageId: number;
    name: string;
    node?: string;
    teamId: number;
  }) => {
    return ajax({
      url: `/tqlab/k8s/createTeamEnv`,
      method: "POST",
      data,
    });
  };

  // 删除团队镜像实例
  deleteTeamEnv = (data: { jupyterEnvId: number; teamId: number }) => {
    return ajax({
      url: `/tqlab/k8s/deleteTeamEnv`,
      method: "delete",
      params: data,
    });
  };

  // 获取协作空间列表
  getShareSpace = async (teamId: number) => {
    this.shareListLoading = true;
    await ajax({
      url: `/tqlab/share/getShareSpace`,
      params: { teamId },
      success: (data) => {
        this.shareList = data;
      },
      effect: () => {
        this.shareListLoading = false;
      },
    });
  };

  // 删除协作空间
  deleteShareSpace = (shareId: number) => {
    ajax({
      url: `/tqlab/share/deleteShareSpace`,
      method: "delete",
      params: { shareId },
      success: () => {
        message.success("删除成功");
        this.getShareSpace(this.selectedGroup!.id);
      },
    });
  };

  // 创建协作空间
  createShareSpace = async (data: Partial<ShareSpaceValue>) => {
    await ajax({
      url: `/tqlab/share/createShareSpace`,
      method: "post",
      data,
      success: () => {
        message.success("新建成功");
        this.getShareSpace(this.selectedGroup!.id);
      },
    });
  };

  // 编辑协作空间
  editShareSpace = async (
    data: Partial<ShareSpaceValue> & { shareId: number }
  ) => {
    await ajax({
      url: `/tqlab/share/editShareSpace`,
      method: "post",
      data,
      success: () => {
        message.success("编辑成功");
        this.getShareSpace(this.selectedGroup!.id);
      },
    });
  };

  // 获取团队下用户列表
  getMemberListByTeam = async (teamId: number) => {
    await ajax({
      url: `/tquser/user/getMemberListByTeam`,
      params: { teamId },
      success: (data) => {
        this.userList = data;
      },
    });
  };

  // 获取所有镜像列表
  getAllImageList = async () => {
    await ajax({
      url: `/tqlab/image/getAllImageList`,
      params: { code: "150101" },
      success: (data) => {
        this.imageList = data;
      },
    });
  };

  getEnvTemplates = () => {
    ajax({
      url: `/tqlab/sys/getEnvTemplates`,
      params: {
        code: "150101",
      },
      success: (data) => {
        this.envTemplates = data;
      },
    });
  };

  // 获取模版
  getFactorStrategySysTemplate = async (teamId: number) => {
    ajax({
      url: `/tqlab/template/getFactorStrategySysTemplate`,
      params: {
        teamId,
      },
      success: (data) => {
        this.FactorStategyTemplates = data;
      },
    });
  };

  updateTeamDBAndSpace = (data: Partial<IGroupConfigValue>) => {
    return ajax({
      url: `/tquser/team/updateTeamDBAndSpace`,
      method: "post",
      data,
      success: (data) => {
        this.selectedGroup = data;
        message.success("配置成功");
      },
    });
  };

  // 获取审批设置
  getProcessConfig = () => {
    ajax({
      url: `/tqlab/process/getProcessConfig`,
      params: {
        teamId: this.selectedGroup!.id,
      },
      success: (data) => {
        this.examine = data;
      },
    });
  };

  // 获取审核人员列表
  getPublishersList = async () => {
    await ajax({
      url: `/tquser/user/getPublishersList`,
      params: { teamId: this.selectedGroup!.id },
      success: (data) => {
        this.publishers = data;
      },
    });
  };

  // 获取审批流程修改日志
  getProcessLog = async (processId: number) => {
    await ajax({
      url: `/tqlab/process/getProcessLog`,
      params: { processId },
      success: (data) => {
        this.processLog = data;
      },
    });
  };

  // 更新审批设置
  updateProcessConfig = async (data: {
    auditorId: number;
    category: number;
    id: number;
    publisherIds: number[];
  }) => {
    await ajax({
      url: `/tqlab/process/updateProcessConfig`,
      method: "post",
      data,
      success: () => {
        message.success("更新成功");
        this.getProcessConfig();
      },
    });
  };

  getAllPermissions4Roles = (roleId: number) => {
    ajax({
      url: `/tquser/menu/getAllPermissions4Roles`,
      params: { roleId },
      success: (data) => {
        this.permission = data;
      },
    });
  };

  updateRolePermission = (data: ResultValue, roleId: number) => {
    const {
      selectedBtnPermissions,
      selectedMenuPermissions,
      selectedDataPermissions,
      selectedGuardianPermissions,
    } = data;
    const dataPermission = selectedDataPermissions.map((item) => {
      const [id, type] = item.split("_");
      return { id, type };
    });
    return ajax({
      url: `/tquser/role/updateRolePermission`,
      method: "post",
      data: {
        roleId,
        selectedBtnPermissions,
        selectedMenuPermissions,
        selectedDataPermissions: dataPermission,
        selectedGuardianPermissions,
      },
      success: () => {
        message.success("配置成功");
      },
    });
  };

  getToBeSelectedTeam = async (excludeTeamId: number) => {
    return await ajax({
      url: `/tquser/team/getToBeSelectedTeam`,
      params: { excludeTeamId },
    });
  };

  mergeTeam = async (data: Partial<State>) => {
    this.mergeLoading = true;
    return await ajax({
      url: `/tquser/team/mergeTeam`,
      method: "post",
      data,
      success: () => {
        this.getTeamTree();
        message.success("合并成功");
      },
      effect: () => {
        this.mergeLoading = false;
      },
    });
  };

  splitTeam = async (data: Partial<State>) => {
    this.splitLoading = true;
    return await ajax({
      url: `/tquser/team/splitTeam`,
      method: "post",
      data,
      success: () => {
        this.getTeamTree();
        message.success("拆分成功");
      },
      effect: () => {
        this.splitLoading = false;
      },
    });
  };
}
