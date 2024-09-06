import { DataType } from "@transquant/utils";
import { useMount } from "ahooks";
import { Table } from "antd";
import type { ColumnsType } from "antd/es/table";
import { observer } from "mobx-react";
import { useStores } from "../hooks";
import usePagination from "../hooks/usePagination";
import { Image } from "../types";
import OperatorMenu from "./OperatorMenu";

const getDataSource = (imageList: Image[]) => {
  return imageList.map((item) => ({
    key: item.id,
    ...item,
  }));
};

export default observer(function ImageTable() {
  const { getAllImageList, imageList } = useStores().imageStore;

  useMount(() => {
    getAllImageList();
  });

  const columns: ColumnsType<DataType<Image>> = [
    {
      title: "镜像名称",
      dataIndex: "name",
      width: "30%",
      ellipsis: true,
    },
    {
      title: "镜像地址",
      dataIndex: "path",
      width: "30%",
      ellipsis: true,
    },
    {
      title: "描述",
      dataIndex: "desc",
      width: "30%",
      ellipsis: true,
    },
    {
      title: "操作",
      key: "action",
      width: 120,
      render: (raw: DataType<Image>) => <OperatorMenu data={raw} />,
    },
  ];

  return (
    <Table
      columns={columns}
      dataSource={getDataSource(imageList)}
      size="small"
      scroll={{ y: "300px" }}
      pagination={{
        ...usePagination({
          total: imageList.length,
        }),
      }}
    />
  );
});
