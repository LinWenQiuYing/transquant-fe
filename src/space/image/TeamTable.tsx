import { SearchOutlined } from "@ant-design/icons";
import { clsPrefix } from "@transquant/constants";
import { ImageInstance } from "@transquant/manage";
import { useUnmount } from "ahooks";
import { Button, Input, InputRef, Space, Table, Tag } from "antd";
import { observer } from "mobx-react";
import React, { useRef } from "react";
import { When } from "react-if";
import { useStores } from "../hooks";
import OperatorMenu from "./OperatorMenu";
import { EnvStatus } from "./PersonalTable";
import { TabViewProps } from "./TabView";

interface DataType {
  key: React.Key;
  name: string;
  imageName: string;
  cpuCore: number;
  cpuCoreLimit: number;
  solidDate: string;
  node: string;
  cpuMem: number;
  teamName: string;
  gpuMem: number;
  cpuMemLimit: number;
  isDefault: boolean;
  type: number;
}

interface TeamTableProps extends TabViewProps {}

const getDataSource = (data: ImageInstance[]) => {
  return data.map((item) => {
    return {
      key: item.id,
      ...item,
    };
  });
};

export default observer(function TeamTable(props: TeamTableProps) {
  const { onVisibleChange } = props;
  const { teamInstances, teamImageLoading, imageInstance, reset } =
    useStores().imageStore;

  useUnmount(() => {
    reset();
  });

  const searchInput = useRef<InputRef>(null);

  const handleReset = (clearFilters: () => void) => {
    clearFilters();
  };

  const columns = [
    {
      title: "环境名称",
      dataIndex: "name",
      width: 200,
      ellipsis: true,
      fixed: "left" as const,
    },
    {
      title: "镜像名称",
      dataIndex: "imageName",
      width: 200,
      ellipsis: true,
      render: (name: string, record: DataType) => {
        return (
          <div style={{ display: "flex", alignItems: "center" }}>
            <span>{name}</span>
            <When condition={record.key === imageInstance?.id}>
              <Tag style={{ marginLeft: 3 }} color="blue">
                当前使用
              </Tag>
            </When>
            <When condition={record.isDefault}>
              <Tag
                bordered={false}
                style={{ marginLeft: 3 }}
                color={record.type === 1 ? "green" : "blue"}
              >
                默认
              </Tag>
            </When>
          </div>
        );
      },
      filterDropdown: ({
        setSelectedKeys,
        selectedKeys,
        confirm,
        clearFilters,
      }: any) => (
        <div style={{ padding: 8 }} onKeyDown={(e) => e.stopPropagation()}>
          <Input
            ref={searchInput}
            placeholder="请输入搜索镜像名称"
            value={selectedKeys[0]}
            onChange={(e) =>
              setSelectedKeys(e.target.value ? [e.target.value] : [])
            }
            onPressEnter={() => confirm()}
            style={{ marginBottom: 8, display: "block" }}
          />
          <Space>
            <Button
              type="primary"
              onClick={() => confirm()}
              icon={<SearchOutlined />}
              size="small"
              style={{ width: 90 }}
            >
              搜索
            </Button>
            <Button
              onClick={() => clearFilters && handleReset(clearFilters)}
              size="small"
              style={{ width: 90 }}
            >
              重置
            </Button>
          </Space>
        </div>
      ),
      filterIcon: (filtered: boolean) => (
        <SearchOutlined style={{ color: filtered ? "#1677ff" : undefined }} />
      ),
      onFilter: (value: any, record: DataType) =>
        record.imageName
          .toString()
          .toLowerCase()
          .includes((value as string).toLowerCase()),
      onFilterDropdownOpenChange: (visible: boolean) => {
        if (visible) {
          setTimeout(() => searchInput.current?.select(), 100);
        }
      },
    },
    {
      title: "所属团队",
      dataIndex: "teamName",
      width: 200,
      ellipsis: true,
    },
    {
      title: "环境状态",
      dataIndex: "envStatus",
      key: "envStatus",
      width: 200,
      render(status: keyof typeof EnvStatus) {
        return EnvStatus[status];
      },
    },
    {
      title: "上次固化时间",
      dataIndex: "solidDate",
      key: "solidDate",
      width: 200,
    },
    {
      title: "内存上限（M）",
      dataIndex: "cpuMem",
      render: (_: any, record: DataType) => {
        return (
          <Space>
            <span>{record.cpuMemLimit || "-"}</span>
          </Space>
        );
      },
      width: 200,
    },
    {
      title: "CPU上限（Core）",
      dataIndex: "cpuCore",
      render: (_: any, record: DataType) => {
        return (
          <Space>
            <span>{record.cpuCoreLimit || "-"}</span>
          </Space>
        );
      },
      width: 200,
    },
    {
      title: "GPU显存(G)",
      dataIndex: "gpuMem",
      width: 200,
      render: (_: any, record: DataType) => {
        return (
          <Space>
            <span>{record.gpuMem || "-"}</span>
          </Space>
        );
      },
    },
    {
      title: "部署服务器",
      dataIndex: "node",
      width: 200,
    },
    {
      title: "环境IP",
      dataIndex: "ip",
      width: 200,
    },
    {
      title: "操作",
      dataIndex: "action",
      width: 170,
      fixed: "right" as const,
      render(_: string, record: DataType) {
        return (
          <OperatorMenu
            data={record as unknown as ImageInstance & { key: string }}
            type="team"
            onVisibleChange={onVisibleChange}
          />
        );
      },
    },
  ];

  return (
    <Table
      className={`${clsPrefix}-image-drawer-table`}
      columns={columns}
      dataSource={getDataSource(teamInstances)}
      pagination={false}
      size="small"
      scroll={{ x: 1100 }}
      loading={teamImageLoading}
    />
  );
});
