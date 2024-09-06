import { DeleteOutlined, EditOutlined } from "@ant-design/icons";
import { IconFont, Permission } from "@transquant/ui";
import { DataType } from "@transquant/utils";
import { Divider, Modal, Space, Tooltip, Typography } from "antd";
import { observer } from "mobx-react";
import { useState } from "react";
import { useStores } from "../../hooks";
import { SourceListItem } from "../../types";
import EmpowerModal from "./EmpowerModal";
import SourceModal from "./SourceModal";

interface OperatorMenuProps {
  data: DataType<SourceListItem>;
  readonly: boolean;
}

export default observer(function OperatorMenu(props: OperatorMenuProps) {
  const { data, readonly } = props;
  const { deleteSource, getSourceDetail, getUsers } =
    useStores().sourceCenterStore;
  const [sourceModalVisible, setSourceModalVisible] = useState(false);
  const [modalTitle, setModalTitle] = useState("");

  const onDelete = () => {
    Modal.confirm({
      title: "是否确认删除该数据源？",
      content: "该操作将删除该数据源，是否确认删除？",
      onOk: () => {
        deleteSource(data.id);
      },
    });
  };

  const handleEdit = async () => {
    setModalTitle("编辑数据源");
    if (data.desc === "--") {
      data.desc = "";
    }
    const res = await getSourceDetail(data.id, readonly);
    data.ip = res.host;
    data.port = res.port;
    data.user = res.userName;
    data.psw = "";
    data.dataBase = res.database;
    data.jdbcParams = res.other ? JSON.stringify(res.other) : "";
    setSourceModalVisible(true);
  };

  const [empowerVisible, setEmpowerVisible] = useState(false);

  const onEmpowerClick = () => {
    getUsers();
    setEmpowerVisible(true);
  };

  return (
    <Space>
      <Permission code="B200105" disabled>
        <Tooltip title="数据源授权">
          <Typography.Link onClick={onEmpowerClick}>
            <IconFont type="shujuyuanshouquan" />
          </Typography.Link>
        </Tooltip>
      </Permission>
      <Divider type="vertical" />

      <Permission code="B200102" disabled>
        <Tooltip title="编辑">
          <Typography.Link onClick={handleEdit}>
            <EditOutlined />
          </Typography.Link>
        </Tooltip>
      </Permission>

      <Divider type="vertical" />
      <Permission code="B200103" disabled>
        <Tooltip title="删除">
          <Typography.Link onClick={onDelete}>
            <DeleteOutlined />
          </Typography.Link>
        </Tooltip>
      </Permission>
      {sourceModalVisible && (
        <SourceModal<DataType<SourceListItem>>
          title={modalTitle}
          data={data}
          readonly={readonly}
          visible={sourceModalVisible}
          onVisibleChange={(value) => setSourceModalVisible(value)}
        />
      )}
      {empowerVisible && (
        <EmpowerModal
          datasourceId={data.id}
          visible={empowerVisible}
          onVisibleChange={setEmpowerVisible}
        />
      )}
    </Space>
  );
});
