import { Label } from "@transquant/ui";
import { ajax } from "@transquant/utils";
import { message } from "antd";
import { computed, observable } from "mobx";

export default class LabelStore {
  @observable labels: Label[] = [];

  @observable searchValue: string = "";

  getTags = () => {
    ajax({
      url: `/tqlab/tag/getTags`,
      success: (data) => {
        this.labels = data;
      },
    });
  };

  deleteTag = (id: number) => {
    return ajax({
      url: `/tqlab/tag/deleteTag`,
      method: "DELETE",
      params: { id },
      success: () => {
        message.success("删除成功");
      },
    });
  };

  updateTag = (data: { id: number; name: string }) => {
    return ajax({
      url: `/tqlab/tag/updateTag`,
      method: "POST",
      data,
      success: () => {
        message.success("编辑成功");
      },
    });
  };

  onSearchValueChange = (value: string) => {
    this.searchValue = value;
  };

  @computed
  get filterLabels() {
    return this.labels.filter((item) => item.name.includes(this.searchValue));
  }
}
