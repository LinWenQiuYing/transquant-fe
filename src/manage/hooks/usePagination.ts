import { useMergeProps } from "@transquant/utils";
import { TablePaginationConfig } from "antd";
import { useEffect, useState } from "react";

type onRequest = (pageIndex: number, pageSize: number, ...args: any[]) => void;

const defaultConfig: TablePaginationConfig = {
  current: 1,
  size: "small",
  total: 0,
  showTotal: (total) => `总共${total}条记录`,
  showSizeChanger: true,
  showQuickJumper: true,
  pageSizeOptions: ["10", "15", "30", "50"],
};

export default function usePagination(
  config?: TablePaginationConfig &
    Partial<{ onRequest: onRequest; id?: number }>
) {
  const [pageIndex, setPageIndex] = useState(1);
  const [pageSize, setPageSize] = useState(15);
  const pagination = useMergeProps(config, defaultConfig);

  useEffect(() => {
    if (config?.onRequest) {
      config.onRequest(pageIndex, pageSize);
    }
  }, [config?.id]);

  const onChange = (index: number, size: number) => {
    setPageIndex(index);
    setPageSize(size);

    if (config?.onRequest) {
      config?.onRequest(index, size);
    }
  };

  const onShowSizeChange = (current: number, size: number) => {
    setPageIndex(current);
    setPageSize(size);

    if (config?.onRequest) {
      config.onRequest(current, size);
    }
  };

  return {
    ...pagination,
    onChange,
    onShowSizeChange,
    current: pageIndex,
    pageSize,
  };
}
