import { DeleteOutlined, EditOutlined } from "@ant-design/icons";
import { Permission } from "@transquant/ui";
import { DataType } from "@transquant/utils";
import { Divider, Modal, Space, Tooltip, Typography } from "antd";
import { observer } from "mobx-react";
import { useState } from "react";
import { useStores } from "../../hooks";
import { EnvironmentListItem } from "../../types";
import EnvironmentModal from "./EnvironmentModal";

interface OperatorMenuProps {
  data: DataType<EnvironmentListItem>;
}

export default observer(function OperatorMenu(props: OperatorMenuProps) {
  const { data } = props;
  const { deleteEnvironment } = useStores().environmentManageStore;
  const [environmentModalVisible, setEnvironmentModalVisible] = useState(false);
  const [modalTitle, setModalTitle] = useState("");

  const onDelete = () => {
    Modal.confirm({
      title: "是否确认删除该环境？",
      content: "该操作将删除该环境，是否确认删除？",
      onOk: () => {
        deleteEnvironment(data.code);
      },
    });
  };

  const handleEdit = async () => {
    setModalTitle("编辑环境");
    if (data.desc === "--") {
      data.desc = "";
    }
    setEnvironmentModalVisible(true);
  };

  return (
    <Space>
      <Permission code="B110102" disabled>
        <Tooltip title="编辑">
          <Typography.Link onClick={handleEdit}>
            <EditOutlined />
          </Typography.Link>
        </Tooltip>
      </Permission>

      <Divider type="vertical" />
      <Permission code="B110103" disabled>
        <Tooltip title="删除">
          <Typography.Link onClick={onDelete}>
            <DeleteOutlined />
          </Typography.Link>
        </Tooltip>
      </Permission>
      {environmentModalVisible && (
        <EnvironmentModal<DataType<EnvironmentListItem>>
          title={modalTitle}
          data={data}
          visible={environmentModalVisible}
          onVisibleChange={(value) => setEnvironmentModalVisible(value)}
        />
      )}
    </Space>
  );
});
