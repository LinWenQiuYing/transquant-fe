import { EditOutlined, HistoryOutlined } from "@ant-design/icons";
import { Permission } from "@transquant/ui";
import { DataType } from "@transquant/utils";
import { Divider, Space, Tooltip, Typography } from "antd";
import { observer } from "mobx-react";
import { useState } from "react";
import { useStores } from "../../../hooks";
import { Examine } from "../../../types";
import ExamineModal from "./ExamineModal";
import RecordModal from "./RecordModal";

interface OperatorMenuProps {
  data: DataType<Examine>;
}

export default observer(function OperatorMenu(props: OperatorMenuProps) {
  const { data } = props;
  const { getProcessLog, getPublishersList, getAllSimpleUsers } =
    useStores().organizationStore;

  const [examineVisible, setExamineVisible] = useState(false);
  const [recordVisible, setRecordVisible] = useState(false);

  const onEdit = async () => {
    await getPublishersList();
    await getAllSimpleUsers();
    setExamineVisible(true);
  };

  const onRecordClick = async () => {
    await getProcessLog(data.id);
    setRecordVisible(true);
  };

  return (
    <>
      <Space>
        <Permission code="B150123" disabled>
          <Tooltip title="编辑">
            <Typography.Link onClick={onEdit}>
              <EditOutlined />
            </Typography.Link>
          </Tooltip>
        </Permission>
        <Divider type="vertical" style={{ marginLeft: 4, marginRight: 4 }} />
        <Permission code="B150124" disabled>
          <Tooltip title="历史记录">
            <Typography.Link onClick={onRecordClick}>
              <HistoryOutlined />
            </Typography.Link>
          </Tooltip>
        </Permission>
      </Space>
      {examineVisible && (
        <ExamineModal
          title={data.process}
          data={data}
          visible={examineVisible}
          onVisibleChange={(value) => setExamineVisible(value)}
        />
      )}
      <RecordModal
        visible={recordVisible}
        onVisibleChange={(value) => setRecordVisible(value)}
      />
    </>
  );
});
