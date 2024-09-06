import { DeleteOutlined } from "@ant-design/icons";
import { clsPrefix } from "@transquant/constants";
import { IconFont } from "@transquant/ui";
import { useMount } from "ahooks";
import {
  message,
  Modal,
  Space,
  Table,
  TableProps,
  Tooltip,
  Typography,
} from "antd";
import { useState } from "react";
import { useStores } from "../../hooks";

interface VersionModalProps {
  visible: boolean;
  onVisibleChange: (value: boolean) => void;
  code: number;
  getDefinition?: () => void;
  version: number;
}

interface DataType {
  key: string;
  id: string;
  version: number;
  description: string;
  operateTime: string[];
}

export default function VersionModal(props: VersionModalProps) {
  const { visible, onVisibleChange, code, version } = props;
  const {
    getWorkflowDefinitionVersions,
    switchWorkflowDefinitionVersions,
    deleteWorkflowDefinitionVersions,
  } = useStores().projectManageStore;

  const [data, setData] = useState();
  const [total, setTotal] = useState(0);
  const [currentPage, setCurrentPage] = useState(0);
  const [currentVersion, setCurrentVersion] = useState(version);

  const getVersions = (pageNo: number) => {
    getWorkflowDefinitionVersions(code, pageNo).then((res: any) => {
      const { totalList, ...rest } = res || {};
      const result = totalList.map((item: any) => ({
        key: item.id,
        version: item.version,
        description: item.description || "--",
        createTime: item.createTime,
      }));
      setData(result);
      setTotal(rest.total);
      setCurrentPage(rest.currentPage);
    });
  };

  useMount(() => {
    getVersions(1);
  });

  const onSwitchVersion = (versionId: number) => {
    switchWorkflowDefinitionVersions(code, versionId).then(() => {
      getVersions(currentPage);
      setCurrentVersion(versionId);
      message.success("切换成功");
    });
  };
  const onDeleteVersion = (versionId: number) => {
    deleteWorkflowDefinitionVersions(code, versionId).then(() => {
      getVersions(currentPage);
      message.success("删除成功");
    });
  };

  const columns: TableProps<DataType>["columns"] = [
    {
      title: "序号",
      dataIndex: "index",
      key: "index",
      width: 60,
      ellipsis: true,
      render: (value: any, _: any, index: number) => `${index + 1}`,
    },
    {
      title: "版本",
      dataIndex: "version",
      key: "version",
      width: 208,
      ellipsis: true,
      render: (value: number) =>
        value === currentVersion ? (
          <span>
            {`V${value}`}
            <span className="current-tag">当前版本</span>
          </span>
        ) : (
          `V${value}`
        ),
    },
    {
      title: "描述",
      dataIndex: "description",
      key: "description",
      width: 208,
      ellipsis: true,
    },
    {
      title: "创建时间",
      key: "createTime",
      dataIndex: "createTime",
      width: 180,
      ellipsis: true,
    },
    {
      title: "操作",
      key: "action",
      width: 88,
      align: "left",
      ellipsis: true,
      render: (_: any, record: any) => (
        <Space size="middle">
          <Tooltip title="切换到该版本">
            <Typography.Link
              onClick={() => onSwitchVersion(record.version)}
              disabled={currentVersion === record.version}
            >
              <IconFont type="gengxin" />
            </Typography.Link>
          </Tooltip>
          <Tooltip title="删除">
            <Typography.Link
              onClick={() => onDeleteVersion(record.version)}
              disabled={currentVersion === record.version}
            >
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
      onOk={() => onVisibleChange(false)}
      onCancel={() => onVisibleChange(false)}
      width={792}
      className={`${clsPrefix}-version-modal`}
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
