import { PlusOutlined } from "@ant-design/icons";
import { Permission } from "@transquant/ui";
import { Button, Card } from "antd";
import { observer } from "mobx-react";
import { useState } from "react";
import ImageModal from "./ImageModal";
import ImageTable from "./ImageTable";

export default observer(function ImageManage() {
  const [imageModalVisible, setImageModalVisible] = useState(false);

  const extraEl = (
    <Permission code="B190109" hidden>
      <Button
        type="primary"
        icon={<PlusOutlined />}
        onClick={() => setImageModalVisible(true)}
      >
        添加
      </Button>
    </Permission>
  );

  return (
    <>
      <Card title="镜像列表" extra={extraEl}>
        <ImageTable />
      </Card>
      <ImageModal
        title="添加镜像"
        visible={imageModalVisible}
        onVisibleChange={(value) => setImageModalVisible(value)}
      />
    </>
  );
});
