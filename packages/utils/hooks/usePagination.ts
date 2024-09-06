import { useMergeProps } from "@transquant/utils";
import { useMount } from "ahooks";
import { TablePaginationConfig } from "antd";
import { useEffect, useState } from "react";

type onRequest = (pageIndex: number, pageSize: number, ...args: any[]) => void;

type UsePagination = {
  IPageNum: number;
  IPageSize: number;
  onRequest: onRequest;
  onPaginationChange: (
    config: Partial<{
      pageNum: number;
      pageSize: number;
    }>
  ) => void;
};

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
  config?: TablePaginationConfig & Partial<UsePagination>
) {
  const [pageIndex, setPageIndex] = useState(1);
  const [pageSize, setPageSize] = useState(15);
  const pagination = useMergeProps(config, defaultConfig);

  useMount(() => {
    if (config?.onRequest) {
      config.onRequest(pageIndex, pageSize);
    }
  });

  useEffect(() => {
    if (config?.IPageNum) {
      setPageIndex(config.IPageNum);
    }

    if (config?.IPageSize) {
      setPageSize(config.IPageSize);
    }
  }, [config?.IPageNum, config?.IPageSize]);

  const onChange = (index: number, size: number) => {
    setPageIndex(index);
    setPageSize(size);

    if (config?.onPaginationChange) {
      config.onPaginationChange({ pageNum: index, pageSize: size });
    }

    if (config?.onRequest) {
      config?.onRequest(index, size);
    }
  };

  const onShowSizeChange = (current: number, size: number) => {
    setPageIndex(current);
    setPageSize(size);

    if (config?.onPaginationChange) {
      config.onPaginationChange({ pageNum: current, pageSize: size });
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
