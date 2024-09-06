import { USER_TOKEN } from "@transquant/constants";
import { ls } from "@transquant/utils";
import { Button, Col, Modal, Row, Typography, Upload, UploadProps } from "antd";
import { RcFile } from "antd/lib/upload";
import { observer } from "mobx-react";
import { useState } from "react";
import { useStores } from "../../hooks";

type ImportModalProps = {
  visible: boolean;
  onVisibleChange: (value: boolean) => void;
};

export default observer(function ImportModal(props: ImportModalProps) {
  const { importWorkflow } = useStores().projectManageStore;
  const { visible, onVisibleChange } = props;
  const [file, setFile] = useState<RcFile>();

  const handleUpload: UploadProps["onChange"] = async ({ fileList }) => {
    const [file] = fileList;

    const json = await file?.originFileObj;
    setFile(json);
  };

  const onOk = () => {
    if (!file) return;
    importWorkflow(file).then(() => {
      onVisibleChange(false);
    });
  };
  return (
    <Modal
      title="导入工作流"
      onCancel={() => onVisibleChange(false)}
      open={visible}
      onOk={onOk}
    >
      <div className="relative">
        <Row>
          <Col span={4} className="flex items-center">
            上传文件：
          </Col>
          <Col span={20} className="flex items-center">
            <Upload
              action="/tqlab/template/empty"
              accept=".json"
              maxCount={1}
              headers={{ token: ls.getItem(USER_TOKEN) }}
              onChange={handleUpload}
              className="w-full"
            >
              <Button type="primary" style={{ marginRight: 10 }}>
                上传文件
              </Button>
            </Upload>
          </Col>
        </Row>
        <Typography.Text disabled className="absolute left-44 top-1">
          仅支持.json 格式的文件
        </Typography.Text>
      </div>
    </Modal>
  );
});
