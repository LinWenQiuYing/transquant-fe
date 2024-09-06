import { DeleteOutlined } from "@ant-design/icons";
import { IconFont } from "@transquant/ui";
import { useMount } from "ahooks";
import {
  message,
  Modal,
  Space,
  Table,
  TableProps,
  Tag,
  Tooltip,
  Typography,
} from "antd";
import { useState } from "react";
import { deleteVersion, queryVersions, switchVersion } from "../api";
import { WorkflowDefinition } from "./types";

interface VersionModalProps {
  visible: boolean;
  onVisibleChange: (value: boolean) => void;
  projectCode: number;
  code: number;
  onRefresh?: () => void;
  row?: WorkflowDefinition["processDefinition"];
}

interface DataType {
  key: string;
  id: string;
  version: number;
  description: string;
  operateTime: string[];
}

export default function VersionModal(props: VersionModalProps) {
  const { visible, onVisibleChange, projectCode, code, row, onRefresh } = props;
  const [data, setData] = useState();
  const [total, setTotal] = useState(0);
  const [currentPage, setCurrentPage] = useState(0);

  const getVersions = (pageNo: number) => {
    queryVersions({ pageSize: 10, pageNo }, projectCode, code).then(
      (res: any) => {
        const { totalList, ...rest } = res || {};
        const result = totalList.map((item: any) => ({
          key: item.id,
          id: item.version,
          version: item.version,
          description: item.description,
          createTime: item.createTime,
        }));
        setData(result);
        setTotal(rest.total);
        setCurrentPage(rest.currentPage);
      }
    );
  };

  useMount(() => {
    getVersions(1);
  });

  const onSwitchVersion = (versionId: number) => {
    switchVersion(projectCode, code, versionId).then(() => {
      getVersions(currentPage);
      onRefresh?.();
      message.success("切换成功");
    });
  };
  const onDeleteVersion = (versionId: number) => {
    deleteVersion(projectCode, code, versionId).then(() => {
      getVersions(currentPage);
      onRefresh?.();
      message.success("删除成功");
    });
  };

  const columns: TableProps<DataType>["columns"] = [
    {
      title: "#",
      dataIndex: "id",
      key: "id",
      width: "10%",
      ellipsis: true,
      render: (value: any, _: any, index: number) => `${index + 1}`,
    },
    {
      title: "版本",
      dataIndex: "version",
      key: "version",
      width: "20%",
      ellipsis: true,
      render: (value: number) =>
        value === row?.version ? (
          <Tag color="green">{`V${value}`}当前版本</Tag>
        ) : (
          `V${value}`
        ),
    },
    {
      title: "描述",
      dataIndex: "description",
      key: "description",
      width: "25%",
      ellipsis: true,
    },
    {
      title: "创建时间",
      key: "createTime",
      dataIndex: "createTime",
      width: "25%",
      ellipsis: true,
    },
    {
      title: "操作",
      key: "action",
      width: "20%",
      align: "center",
      ellipsis: true,
      render: (_: any, record: any) => (
        <Space size="middle">
          <Tooltip title="切换到该版本">
            <Typography.Link onClick={() => onSwitchVersion(record.id)}>
              <IconFont type="gengxin" />
            </Typography.Link>
          </Tooltip>
          <Tooltip title="删除">
            <Typography.Link onClick={() => onDeleteVersion(record.id)}>
              <DeleteOutlined />
            </Typography.Link>
          </Tooltip>
        </Space>
      ),
    },
  ];
  return (
    <Modal
      title="版本信息"
      open={visible}
      onCancel={() => onVisibleChange(false)}
      width={700}
    >
      <Table
        columns={columns}
        dataSource={data}
        pagination={{
          pageSize: 10,
          current: currentPage,
          total,
          onChange(page) {
            getVersions(page);
          },
        }}
      />
    </Modal>
  );
}
