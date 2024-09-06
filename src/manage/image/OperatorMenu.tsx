import { DeleteOutlined, EditOutlined } from "@ant-design/icons";
import { Permission } from "@transquant/ui";
import { DataType } from "@transquant/utils";
import { Divider, Modal, Space, Tooltip, Typography } from "antd";
import { observer } from "mobx-react";
import { useState } from "react";
import { useStores } from "../hooks";
import { Image } from "../types";
import ImageModal from "./ImageModal";

interface OperatorMenuProps {
  data: DataType<Image>;
}

export default observer(function OperatorMenu(props: OperatorMenuProps) {
  const { data } = props;
  const { deleteImage } = useStores().imageStore;
  const [imageModalVisible, setImageModalVisible] = useState(false);

  const onDelete = () => {
    Modal.confirm({
      title: (
        <div>
          是否确认删除镜像
          <span style={{ color: "var(--red-600)" }}>「{data.name}」</span>？
        </div>
      ),
      onOk: () => {
        deleteImage(data.id);
      },
    });
  };

  return (
    <>
      <Space>
        <Permission code="B190110" disabled>
          <Tooltip title="编辑">
            <Typography.Link onClick={() => setImageModalVisible(true)}>
              <EditOutlined />
            </Typography.Link>
          </Tooltip>
        </Permission>

        <Divider type="vertical" />
        <Permission code="B190111" disabled>
          <Tooltip title="删除">
            <Typography.Link onClick={onDelete}>
              <DeleteOutlined />
            </Typography.Link>
          </Tooltip>
        </Permission>
      </Space>
      <ImageModal
        data={data}
        title="编辑镜像"
        visible={imageModalVisible}
        onVisibleChange={(value) => setImageModalVisible(value)}
      />
    </>
  );
});
