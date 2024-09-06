import { DataType, usePagination } from "@transquant/utils";
import { Empty, Table } from "antd";
import type { ColumnsType } from "antd/es/table";
import { observer } from "mobx-react";
import { useStores } from "../hooks";
import { PythonModuleItem } from "../types";

const getDataSource = (data?: PythonModuleItem[]) => {
  if (!data) return [];

  return data.map((item) => ({
    key: item.moduleName,
    ...item,
  }));
};

export default observer(function InstalledModule() {
  const {
    pythonModule,
    getPythonModule,
    activeEnv,
    moduleName,
    pythonModuleLoading,
  } = useStores().thirdPartyStore;
  const columns: ColumnsType<DataType<PythonModuleItem>> = [
    {
      title: "名称",
      dataIndex: "moduleName",
      key: "moduleName",
      width: "50%",
    },
    {
      title: "版本",
      dataIndex: "moduleVersion",
      key: "moduleVersion",
      width: "50%",
    },
  ];

  return (
    <Table
      columns={columns}
      dataSource={getDataSource(pythonModule?.pythonModuleList)}
      size="small"
      loading={pythonModuleLoading}
      pagination={{
        ...usePagination({
          total: pythonModule?.total || 0,
          onRequest(pageIndex, pageSize) {
            getPythonModule({
              pageNum: pageIndex,
              pageSize,
              envToken: activeEnv,
              moduleName,
            });
          },
        }),
      }}
      scroll={{ y: "calc(100vh - 300px)" }}
      locale={{
        emptyText: <Empty description="请选择镜像环境" />,
      }}
    />
  );
});
