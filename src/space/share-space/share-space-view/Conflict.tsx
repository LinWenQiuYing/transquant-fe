import { Checkbox, Drawer, Table } from "antd";
import type { ColumnsType } from "antd/es/table";
import { observer } from "mobx-react";
import { useStores } from "../../hooks";

interface ConflictProps {
  shareId: string;
  visible: boolean;
  onVisibleChange: (value: boolean) => void;
}

export default observer(function Conflict(props: ConflictProps) {
  const { visible, onVisibleChange, shareId } = props;
  const { conflictList, markAsUnConflict, getConflict } =
    useStores().shareStore;

  const onClose = () => {
    onVisibleChange(false);
  };

  interface DataType {
    key: string;
    name: string;
    conflictName: string;
  }

  const columns: ColumnsType<DataType> = [
    {
      title: "文件名称",
      dataIndex: "name",
      key: "name",
      ellipsis: true,
    },
    {
      title: "是否解决",
      dataIndex: "conflictName",
      key: "conflictName",
      render: (conflictName: string) => (
        <Checkbox
          onClick={async () => {
            await markAsUnConflict({ filePath: conflictName, shareId });
            await getConflict(shareId);
          }}
        />
      ),
    },
  ];

  const data: DataType[] = conflictList.map((item) => ({
    key: item,
    name: item,
    conflictName: item,
  }));

  return (
    <>
      <Drawer
        title="冲突列表"
        placement="right"
        onClose={onClose}
        open={visible}
      >
        <Table columns={columns} dataSource={data} />
      </Drawer>
    </>
  );
});
