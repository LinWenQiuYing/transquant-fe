import { message } from "antd";
/* eslint-disable no-return-await */
import { Label } from "@transquant/ui";
import { ajax } from "@transquant/utils";
import { action, observable } from "mobx";
import { PublishInfoState } from "../publish/PublishInfo";
import { SelectTeamState } from "../publish/SelectTeam";
import { File, MapFile, TeamItem, UserItem } from "../types";

export default class PublishStore {
  @observable teams: TeamItem[] = [];

  @observable personalFiles: MapFile[] = [];

  @observable userList: UserItem[] = [];

  @observable teamTags: Label[] = [];

  @observable publishLoading: boolean = false;

  // 检查用户是否具有发布条件
  checkBeforePublish = async (data: SelectTeamState & { type: 0 | 1 }) => {
    return await ajax({
      url: `/tqlab/process/checkBeforePublish`,
      method: "post",
      data,
    });
  };

  // 获取用户团队列表
  getAllTeamInfos = async () => {
    await ajax({
      url: `/tquser/team/getAllTeamInfos`,
      success: (data) => {
        this.teams = data;
      },
    });
  };

  getBelongTeamInfos = async () => {
    await ajax({
      url: `/tquser/team/getBelongTeamInfos`,
      success: (data) => {
        this.teams = data;
      },
    });
  };

  // 获取个人空间文件列表
  getPersonalFolder = async (params: {
    type: 0 | 1;
    projectId: number;
    path?: string;
  }) => {
    ajax({
      url: `/tqlab/workspace/getPersonalFolder`,
      params,
      success: (data: File[]) => {
        const result = data.map((file) => ({
          ...file,
          pId: params.path || 0,
          id: file.path,
          value: file.path,
          title: file.name,
          disabled: true,
          isLeaf: file.type === "file",
        }));
        this.personalFiles = [...this.personalFiles, ...result];
      },
    });
  };

  // 获取团队下的用户列表
  getUserListByTeam = async (teamId: number) => {
    await ajax({
      url: `/tquser/user/getUserListByTeam`,
      params: { teamId },
      success: (data) => {
        this.userList = data;
      },
    });
  };

  // 查询团队标签
  getTeamTags = async (teamId: number) => {
    await ajax({
      url: `/tqlab/tag/getTeamTags`,
      params: { teamId },
      success: (data) => {
        this.teamTags = data;
      },
    });
  };

  publish = async (
    data: Partial<SelectTeamState & PublishInfoState> & {
      type: number;
      sourceProjectId: number;
    }
  ) => {
    this.publishLoading = true;
    await ajax({
      url: `/tqlab/process/publish`,
      method: "post",
      data,
      success: () => {
        message.success("提交成功");
      },
      effect: () => {
        this.publishLoading = false;
      },
    });
  };

  @action
  onReset = () => {
    this.personalFiles = [];
  };
}
