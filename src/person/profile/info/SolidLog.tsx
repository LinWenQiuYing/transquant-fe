import { IconFont } from "@transquant/ui";
import { useDataSource } from "@transquant/utils";
import { message, Modal, Space, Table, Tag, Tooltip, Typography } from "antd";
import type { ColumnsType } from "antd/es/table";
import { observer } from "mobx-react";
import { useStores } from "../../hooks";
import { LogItem } from "../../types";

interface SolidLogProps {
  envStatus: number;
  envId: number;
  visible: boolean;
  onVisibleChange: (value: boolean) => void;
}

const SolidType = {
  0: "手动固化",
  1: "自动固化",
  2: "自动压缩",
  3: "关闭前固化",
};

export default observer(function SolidLog(props: SolidLogProps) {
  const { logList, envRollback } = useStores().profileStore;
  const { visible, onVisibleChange, envId, envStatus } = props;

  const onRestore = (record: LogItem) => {
    Modal.confirm({
      title: `是否确定回退到【${record.time}】固化的[${record.id}]版本的镜像？`,
      onOk() {
        envRollback(record.id, envId);
        message.info("镜像回退中，此过程可能需要一分钟，请稍后");
        onVisibleChange(false);
      },
    });
  };

  const columns: ColumnsType<LogItem> = [
    {
      title: "固化时间",
      dataIndex: "time",
      key: "time",
      width: "15%",
    },
    {
      title: "编号",
      dataIndex: "id",
      key: "id",
      width: "10%",
      render(id: number, record: LogItem) {
        return (
          <Space>
            {id} {record.current ? <Tag color="red">当前</Tag> : ""}
          </Space>
        );
      },
    },
    {
      title: "镜像地址",
      dataIndex: "solidifyPath",
      key: "solidifyPath",
      ellipsis: true,
      width: "45%",
    },
    {
      title: "类型",
      dataIndex: "type",
      key: "type",
      width: "15%",
      render(type: keyof typeof SolidType) {
        return SolidType[type];
      },
    },
    {
      title: "操作",
      dataIndex: "action",
      key: "action",
      width: "15%",
      render(_, record: LogItem) {
        return (
          <Tooltip title="镜像回退">
            <Typography.Link disabled={record.current === 1 || envStatus !== 6}>
              <IconFont type="huitui" onClick={() => onRestore(record)} />
            </Typography.Link>
          </Tooltip>
        );
      },
    },
  ];

  return (
    <Modal
      title="固化日志"
      open={visible}
      width="70%"
      onCancel={() => onVisibleChange(false)}
      footer={null}
    >
      <Table
        columns={columns}
        dataSource={useDataSource<LogItem>(logList)}
        scroll={{ y: 400 }}
        pagination={false}
      />
    </Modal>
  );
});
