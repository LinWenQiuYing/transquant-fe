import { ajax } from "@transquant/utils";
import { message } from "antd";
import { observable } from "mobx";
import { Image } from "../types";

export default class ImageStore {
  @observable imageList: Image[] = [];

  getAllImageList = () => {
    ajax({
      url: `/tqlab/image/getAllImageList`,
      success: (data) => {
        this.imageList = data;
      },
    });
  };

  addImage = (data: Omit<Image, "id">) => {
    ajax({
      url: `/tqlab/image/addImage`,
      method: "post",
      data,
      success: () => {
        message.success("新增成功");
        this.getAllImageList();
      },
    });
  };

  updateImage = (data: Pick<Image, "id" | "desc" | "name">) => {
    ajax({
      url: `/tqlab/image/updateImage`,
      method: "post",
      data,
      success: () => {
        message.success("更新成功");
        this.getAllImageList();
      },
    });
  };

  deleteImage = (imageId: number) => {
    ajax({
      url: `/tqlab/image/deleteImage`,
      method: "delete",
      params: { imageId },
      success: () => {
        message.success("删除成功");
        this.getAllImageList();
      },
    });
  };
}
