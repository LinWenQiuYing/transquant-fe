import { SearchOutlined } from "@ant-design/icons";
import { clsPrefix, IMAGE_INSTANCE } from "@transquant/constants";
import { ImageInstance } from "@transquant/manage";
import { ls } from "@transquant/utils";
import { useUnmount } from "ahooks";
import { Button, Input, InputRef, Space, Table, Tag } from "antd";
import { observer } from "mobx-react";
import React, { useRef } from "react";
import { When } from "react-if";
import { useStores } from "../hooks";
import PersonalOperatorMenu from "./PersonalOperatorMenu";
import { TabViewProps } from "./TabView";

export const EnvStatus = {
  0: "未启动",
  1: "启动中",
  2: "固化中",
  3: "升级中",
  4: "销毁中",
  5: "重启中",
  6: "运行中",
  7: "资源申请中",
};
export interface DataType {
  key: React.Key;
  name: string;
  imageName: string;
  solidDate: string;
  gpuMem: number;
  cpuCoreLimit: number;
  node: string;
  cpuMem: number;
  cpuMemLimit: number;
  isDefault: boolean;
  type: number;
  envStatus: keyof typeof EnvStatus;
}

interface PersonalTableProps extends TabViewProps {}

const getDataSource = (data: ImageInstance[]) => {
  return data.map((item) => {
    return {
      key: item.id,
      ...item,
    };
  });
};

export default observer(function PersonalTable(props: PersonalTableProps) {
  const { onVisibleChange } = props;
  const { imageInstance, personalImageLoading, reset, personalInstances } =
    useStores().imageStore;

  useUnmount(() => {
    reset();
  });

  const searchInput = useRef<InputRef>(null);

  const handleReset = (clearFilters: () => void) => {
    clearFilters();
  };

  const currentImageInstanceId =
    ls.getItem(IMAGE_INSTANCE)?.id || imageInstance?.id;

  const columns = [
    {
      title: "环境名称",
      dataIndex: "name",
      width: 300,
      fixed: "left" as const,
      render: (name: string, record: DataType) => {
        return (
          <div className="flex items-center">
            <span className="block max-w-[140px] mr-2 truncate">{name}</span>
            <When
              condition={
                record.key === currentImageInstanceId && record.envStatus !== 0
              }
            >
              <Tag style={{ marginLeft: 3 }} color="red">
                当前
              </Tag>
            </When>
            <When condition={record.isDefault}>
              <Tag bordered={false} style={{ marginLeft: 3 }} color="red">
                默认
              </Tag>
            </When>
          </div>
        );
      },
    },
    {
      title: "镜像名称",
      dataIndex: "imageName",
      width: 200,
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
      title: "内存上限(M)",
      dataIndex: "cpuMem",
      width: 200,
      render: (_: any, record: DataType) => {
        return (
          <Space>
            <span>{record.cpuMemLimit || "-"}</span>
          </Space>
        );
      },
    },
    {
      title: "CPU上限(Core)",
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
      width: 200,
      fixed: "right" as const,
      render(_: string, record: DataType) {
        return (
          <PersonalOperatorMenu
            data={record as unknown as ImageInstance & { key: string }}
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
      dataSource={getDataSource(personalInstances)}
      pagination={false}
      size="small"
      scroll={{ x: 1100 }}
      loading={personalImageLoading}
    />
  );
});
