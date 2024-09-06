import { PopoverTag } from "@transquant/common";
import { StrategyLibItem } from "@transquant/space/types";
import { IconFont } from "@transquant/ui";
import { DataType, useDataSource } from "@transquant/utils";
import useMount from "ahooks/lib/useMount";
import { Table, Tooltip, Typography } from "antd";
import type { ColumnsType } from "antd/es/table";
import { observer } from "mobx-react";
import { useState } from "react";
import { useParams } from "react-router-dom";
import { useStores } from "../../hooks";
import ChatViewModal from "./ChatViewModal";
import "./index.less";

export default observer(function FactorLib() {
  const {
    getStrategyResultListByProjectId,
    strategyResultList,
    getStrategyResultJSON,
    strategyResultListLoading,
  } = useStores().publishStore;
  const params = useParams();
  const [visible, setVisible] = useState<boolean>(false);

  useMount(() => {
    getStrategyResultListByProjectId(params.id);
  });

  const onView = (data: DataType<StrategyLibItem>) => {
    getStrategyResultJSON(`${data.id}`);
    setVisible(true);
  };

  const columns: ColumnsType<DataType<StrategyLibItem>> = [
    {
      title: "类名",
      dataIndex: "className",
      width: 200,
    },
    {
      title: "策略名称",
      dataIndex: "name",
      width: 200,
    },
    {
      title: "标签",
      key: "tags",
      dataIndex: "tags",
      width: 300,
      render: (_, { tags }) => <PopoverTag tags={tags} />,
    },
    {
      title: "修改时间",
      dataIndex: "srcUpdateTime",
      width: 200,
    },
    {
      title: "回测时间",
      dataIndex: "triggerTime",
      width: 200,
    },
    {
      title: "回测时间区间",
      dataIndex: "timeRange",
      width: 200,
    },
    {
      title: "年化收益率",
      dataIndex: "annStrategyReturn",
      width: 200,
    },
    {
      title: "Alpha",
      dataIndex: "alpha",
      width: 200,
    },
    {
      title: "Beta",
      dataIndex: "beta",
      width: 200,
    },
    {
      title: "基准",
      dataIndex: "benchmark",
      width: 200,
    },
    {
      title: "基准年化收益",
      dataIndex: "annBenchmarkReturn",
      width: 200,
    },
    {
      title: "夏普率",
      dataIndex: "sharpRatio",
      width: 200,
    },
    {
      title: "索提诺比率",
      dataIndex: "sortinoRatio",
      width: 200,
    },
    {
      title: "最大回撤",
      dataIndex: "maxDrawdown",
      width: 200,
    },
    {
      title: "最大回撤区间",
      dataIndex: "maxDrawdownRange",
      width: 200,
    },
    {
      title: "波动率",
      dataIndex: "volatility",
      width: 200,
    },
    {
      title: "操作",
      key: "action",
      width: 100,
      fixed: "right",
      render: (_: any, data: DataType<StrategyLibItem>) => (
        <Tooltip title="查看详情">
          <Typography.Link onClick={() => onView(data)}>
            <IconFont type="chakanxiangqing" />
          </Typography.Link>
        </Tooltip>
      ),
    },
  ];

  return (
    <>
      <Table
        columns={columns}
        dataSource={useDataSource<StrategyLibItem>(strategyResultList)}
        size="small"
        loading={strategyResultListLoading}
        pagination={false}
        scroll={{ x: 1200 }}
      />
      {visible && (
        <ChatViewModal
          visible={visible}
          onVisibleChange={(value: boolean) => setVisible(value)}
        />
      )}
    </>
  );
});
