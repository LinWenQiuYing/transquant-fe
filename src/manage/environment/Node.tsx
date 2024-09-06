import { QuestionCircleOutlined } from "@ant-design/icons";
import { useDataSource } from "@transquant/utils";
import { useMount, useUnmount } from "ahooks";
import { Table, Tooltip } from "antd";
import type { ColumnsType } from "antd/es/table";
import { observer } from "mobx-react";
import { useStores } from "../hooks";
import { NodeItem } from "../types/environment";

const hintRender = (value: string) => {
  const color = parseInt(value) > 85 ? "text-red-600" : "text-green-600";
  return <span className={color}>{value}</span>;
};

const limitRender = (value: string, limit: string) => {
  const color = limit === "true" ? "text-red-600" : "text-green-600";
  return <span className={color}>{value}</span>;
};

const columns: ColumnsType<NodeItem> = [
  {
    title: "节点名称",
    dataIndex: "name",
    fixed: "left",
    width: 180,
  },
  {
    title: "环境个数",
    dataIndex: "环境个数",
    width: 140,
    render: (value: string, record: NodeItem) =>
      limitRender(value, record["环境个数超过限额"]),
  },
  {
    title: (
      <div>
        cpu预占比例
        <Tooltip title="CPU预占的上限的集合与CPU实际总额度的比例">
          <QuestionCircleOutlined className="ml-2 text-gray-400 cursor-pointer" />
        </Tooltip>
      </div>
    ),
    dataIndex: "cpu预占比例",
    width: 140,
    render: (value: string, record: NodeItem) =>
      limitRender(value, record["cpu预占比例超过限额"]),
  },
  {
    title: (
      <div>
        内存预占比例
        <Tooltip title="内存预占的上限的集合与内存实际总额度的比例">
          <QuestionCircleOutlined className="ml-2 text-gray-400 cursor-pointer" />
        </Tooltip>
      </div>
    ),
    dataIndex: "内存预占比例",
    width: 140,
    render: (value: string, record: NodeItem) =>
      limitRender(value, record["内存预占比例超过限额"]),
  },
  {
    title: (
      <div>
        GPU预占比例
        <Tooltip title="GPU预占的上限的集合与GPU实际总额度的比例">
          <QuestionCircleOutlined className="ml-2 text-gray-400 cursor-pointer" />
        </Tooltip>
      </div>
    ),
    dataIndex: "GPU预占比例",
    width: 140,
    render: (value: string, record: NodeItem) =>
      limitRender(value, record["GPU预占比例超过限额"]),
  },
  {
    title: "cpu使用（Core）",
    dataIndex: "cpu使用",
    width: 160,
  },
  {
    title: "cpu使用率",
    dataIndex: "cpu使用率",
    render: hintRender,
    width: 140,
  },
  {
    title: "内存使用",
    dataIndex: "内存使用",
    width: 140,
  },
  {
    title: "内存使用率",
    dataIndex: "内存使用率",
    render: hintRender,
    width: 140,
  },
  {
    title: "已用磁盘",
    dataIndex: "已用磁盘",
    width: 140,
  },
  {
    title: "磁盘使用率",
    dataIndex: "磁盘使用率",
    render: hintRender,
    width: 140,
  },
  {
    title: "网络上传速率",
    dataIndex: "网络上传速率",
    width: 140,
  },
  {
    title: "网络下载速率",
    dataIndex: "网络下载速率",
    width: 140,
  },
];

export default observer(function NodeTable() {
  const { getNodeInfo, nodeList } = useStores().environmentStore;
  let lastTime = Date.now();
  let intervalId: number;

  const loopGetNode = () => {
    intervalId = requestAnimationFrame(() => {
      const now = Date.now();
      if (now - lastTime > 1000 * 60) {
        getNodeInfo();
        lastTime = now;
      }
      loopGetNode();
    });
  };

  useMount(() => {
    getNodeInfo();
    loopGetNode();
  });

  useUnmount(() => {
    if (!intervalId) return;
    cancelAnimationFrame(intervalId);
  });

  return (
    <Table
      columns={columns}
      dataSource={useDataSource<NodeItem>(nodeList)}
      scroll={{ y: "calc(100vh - 320px)", x: 1100 }}
      size="small"
    />
  );
});
