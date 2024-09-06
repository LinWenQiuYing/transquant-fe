import { Permission } from "@transquant/ui";
import { DataType, useDataSource, usePagination } from "@transquant/utils";
import { useMount } from "ahooks";
import type { TableProps } from "antd";
import { Button, Card, Input, Table } from "antd";
import { observer } from "mobx-react";
import { useState } from "react";
import { useStores } from "../hooks";
import { File } from "../types";
import CreateFile from "./CreateFile";
import OperatorMenu from "./OperatorMenu";
import UploadFile from "./UploadFile";

const columns: TableProps<DataType<File>>["columns"] = [
  {
    title: "序号",
    dataIndex: "index",
    key: "index",
    width: "5%",
  },
  {
    title: "名称",
    dataIndex: "alias",
    key: "alias",
    width: "15%",
  },
  {
    title: "所属租户",
    dataIndex: "userName",
    key: "userName",
    width: "15%",
  },
  {
    title: "文件名称",
    dataIndex: "fileName",
    key: "fileName",
    width: "15%",
  },
  {
    title: "大小",
    dataIndex: "size",
    key: "size",
    width: "10%",
  },
  {
    title: "创建时间",
    dataIndex: "createTime",
    key: "createTime",
    width: "15%",
  },
  {
    title: "更新时间",
    dataIndex: "updateTime",
    key: "updateTime",
    width: "15%",
  },

  {
    title: "操作",
    key: "action",
    width: "10%",
    render: (_, record: File) => <OperatorMenu data={record} />,
  },
];

export default observer(function FileView() {
  const {
    getFileList,
    files,
    pagination,
    onPaginationChange,
    onSearchValChange,
  } = useStores().dataManageStore;
  const [createVisible, setCreateVisible] = useState(false);
  const [uploadVisible, setUploadVisible] = useState(false);

  useMount(() => {
    getFileList(pagination.pageNum, pagination.pageSize);
  });

  const extraEl = (
    <div className="flex gap-2">
      <Input.Search
        placeholder="请输入搜索关键字"
        allowClear
        onSearch={(value) => {
          onSearchValChange(value);
          getFileList(pagination.pageNum, pagination.pageSize, value);
        }}
        className="w-60"
      />
      <Permission code="B120101" hidden>
        <Button onClick={() => setUploadVisible(true)}>上传文件</Button>
      </Permission>
      <Permission code="B120102" hidden>
        <Button type="primary" onClick={() => setCreateVisible(true)}>
          创建文件
        </Button>
      </Permission>
    </div>
  );
  return (
    <Card title="文件列表" className="m-5" extra={extraEl}>
      <Table
        columns={columns}
        dataSource={useDataSource(files?.list)}
        size="small"
        pagination={{
          ...usePagination({
            total: files?.total,
            IPageNum: pagination.pageNum,
            IPageSize: pagination.pageSize,
            onPaginationChange: (
              config: Partial<{
                pageNum: number;
                pageSize: number;
              }>
            ) => {
              onPaginationChange({ ...pagination, ...config });
            },
            onRequest: (pageNum, pageSize) => {
              getFileList(pageNum, pageSize);
            },
          }),
        }}
      />
      {createVisible && (
        <CreateFile
          onVisibleChange={setCreateVisible}
          visible={createVisible}
        />
      )}
      {uploadVisible && (
        <UploadFile
          onVisibleChange={setUploadVisible}
          visible={uploadVisible}
        />
      )}
    </Card>
  );
});
