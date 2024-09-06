import { ajax, diff, Nullable } from "@transquant/utils";
import { message } from "antd";
import { computed, observable } from "mobx";
import { ResultValue } from "../permission";
import { Group, ISimpleUser, Member, Permission } from "../types";
import { IUserGroupValue } from "../user-group/UserGroupModal";

type Pagination = {
  pageNum: number;
  pageSize: number;
};

const defaultPagination = {
  pageNum: 1,
  pageSize: 15,
};

export default class UserGroupStore {
  @observable groups: Group[] = [];

  @observable groupsLoading: boolean = false;

  @observable members: Member[] = [];

  @observable membersTotal: number = 0;

  @observable membersLoading: boolean = false;

  @observable users: ISimpleUser[] = [];

  @observable selectedGroup: Nullable<Group> = null;

  @observable searchValue: string = "";

  @observable permission: Nullable<Permission> = null;

  @observable memberPagination: Pagination = defaultPagination;

  onSearchValueChange = (value: string) => {
    this.searchValue = value;
  };

  onSelectedGroup = (group: Nullable<Group>) => {
    this.selectedGroup = group;
    this.getGroupMembers();
  };

  onMemberPaginationChange = (pagination: Partial<Pagination>) => {
    this.memberPagination = { ...this.memberPagination, ...pagination };
  };

  @computed
  get filterMembers() {
    return this.members.filter(
      (item) =>
        item.realName.includes(this.searchValue) ||
        item.userName.includes(this.searchValue)
    );
  }

  getAllGroups = () => {
    this.groupsLoading = true;
    ajax<Group[]>({
      url: `/tquser/group/getAllGroups`,
      success: (data) => {
        this.groups = data;

        // edit rerender
        if (this.selectedGroup) {
          this.selectedGroup =
            data.find((item) => item.id === this.selectedGroup!.id) || null;
        }
      },
      effect: () => {
        this.groupsLoading = false;
      },
    });
  };

  addGroup = (data: IUserGroupValue) => {
    return ajax({
      url: `/tquser/group/addGroup`,
      method: "post",
      data,
      success: () => {
        message.success("添加成功");
        this.getAllGroups();
      },
    });
  };

  deleteGroup = (groupId: number) => {
    ajax({
      url: `/tquser/group/deleteGroup`,
      method: "delete",
      params: { groupId },
      success: () => {
        message.success("删除成功");
        this.getAllGroups();
        this.onSelectedGroup(null);
      },
    });
  };

  updateGroup = (data: IUserGroupValue & { id: number }) => {
    return ajax({
      url: `/tquser/group/updateGroup`,
      method: "post",
      data,
      success: () => {
        message.success("编辑成功");
        this.getAllGroups();
      },
    });
  };

  getGroupMembers = (pageNum?: number, pageSize?: number) => {
    if (!this.selectedGroup) return;
    this.membersLoading = true;
    ajax({
      url: `/tquser/user/getGroupMembers`,
      params: {
        groupId: this.selectedGroup?.id,
        pageNum: pageNum || this.memberPagination.pageNum,
        pageSize: pageSize || this.memberPagination.pageSize,
        search: this.searchValue,
      },
      success: (data) => {
        this.members = data.list;
        this.membersTotal = data.total;
      },
      effect: () => {
        this.membersLoading = false;
      },
    });
  };

  removeGroupMember = (userId: number) => {
    ajax({
      url: `/tquser/user/removeGroupMember`,
      method: "post",
      data: { userId, groupId: this.selectedGroup?.id },
      success: () => {
        message.success("移出成功");
        this.getGroupMembers();
      },
    });
  };

  getAllSimpleUsers = () => {
    ajax({
      url: `/tquser/user/getAllSimpleUsers`,
      success: (data) => {
        const res = diff(data, this.members, (item) => item.id);
        this.users = res;
      },
    });
  };

  addGroupMember = (userIds: number[]) => {
    ajax({
      url: `/tquser/user/addGroupMember`,
      method: "post",
      data: { userIds, groupId: this.selectedGroup?.id },
      success: () => {
        message.success("添加成功");
        this.getGroupMembers();
      },
    });
  };

  getAllPermissions4Group = () => {
    ajax({
      url: `/tquser/menu/getAllPermissions4Group`,
      params: { groupId: this.selectedGroup!.id },
      success: (data) => {
        this.permission = data;
      },
    });
  };

  updateGroupPermission = (data: ResultValue) => {
    const {
      selectedBtnPermissions,
      selectedMenuPermissions,
      selectedDataPermissions,
    } = data;
    const dataPermission = selectedDataPermissions.map((item) => {
      const [id, type] = item.split("_");
      return { id, type };
    });
    return ajax({
      url: `/tquser/group/updateGroupPermission`,
      method: "post",
      data: {
        groupId: this.selectedGroup!.id,
        selectedBtnPermissions,
        selectedMenuPermissions,
        selectedDataPermissions: dataPermission,
      },
      success: () => {
        message.success("配置成功");
      },
    });
  };
}
