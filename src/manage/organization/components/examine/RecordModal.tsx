import { PopoverTag } from "@transquant/common";
import { useDataSource } from "@transquant/space/hooks";
import { DataType } from "@transquant/utils";
import { Modal, Table, Tag } from "antd";
import type { ColumnsType } from "antd/es/table";
import { observer } from "mobx-react";
import { useStores } from "../../../hooks";
import { ProcessLog } from "../../../types";

enum AuditType {
  "逐层审批",
  "无需审批",
  "全部通过",
  "任一人通过",
}

const columns: ColumnsType<DataType<ProcessLog>> = [
  {
    title: "时间",
    dataIndex: "date",
    key: "date",
    width: "20%",
    ellipsis: true,
  },
  {
    title: "修改人",
    dataIndex: "operator",
    key: "operator",
    width: "15%",
    ellipsis: true,
  },
  {
    title: "审批方式",
    dataIndex: "category",
    key: "category",
    width: "15%",
    ellipsis: true,
    render(value) {
      return <Tag>{AuditType[value]}</Tag>;
    },
  },
  {
    title: "审核员",
    dataIndex: "auditors",
    key: "auditors",
    width: "25%",
    ellipsis: true,
    render: (menus: string[] = []) => <PopoverTag tags={menus} />,
  },
  {
    title: "可发布人员",
    dataIndex: "publishers",
    key: "publishers",
    width: "25%",
    ellipsis: true,
    render: (menus: string[]) => <PopoverTag tags={menus} />,
  },
];

interface RecordModalProps {
  visible: boolean;
  onVisibleChange: (value: boolean) => void;
}

export default observer(function RecordModal(props: RecordModalProps) {
  const { visible, onVisibleChange } = props;
  const { processLog } = useStores().organizationStore;

  return (
    <Modal
      title="修改记录"
      open={visible}
      onCancel={() => onVisibleChange(false)}
      width={1200}
      footer={null}
    >
      <Table
        bordered
        size="small"
        dataSource={useDataSource<ProcessLog>(processLog)}
        columns={columns}
        pagination={false}
        scroll={{ y: 500 }}
      />
    </Modal>
  );
});
