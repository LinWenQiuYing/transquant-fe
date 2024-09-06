import { InboxOutlined } from "@ant-design/icons";
import { message, Modal, Typography, Upload, UploadProps } from "antd";
import { RcFile } from "antd/lib/upload";
import { observer } from "mobx-react";
import { useStores } from "../hooks";

const { Dragger } = Upload;

interface UploadModalProps {
  visible: boolean;
  onVisibleChange: (value: boolean) => void;
}

export default observer(function UploadTableModal(props: UploadModalProps) {
  const { visible, onVisibleChange } = props;
  const { parseTableFile } = useStores().dataResourceStore;

  const uploadProps: UploadProps = {
    multiple: true,
    accept: ".xlsx,.csv",
    showUploadList: false,
    beforeUpload: (file: RcFile) => {
      const isLt10M = file.size / 1024 / 1024 <= 10;

      if (!isLt10M) {
        message.info("文件勿超10Mb");
        return false;
      }

      parseTableFile(file).finally(() => {
        onVisibleChange(false);
      });
      return false;
    },
  };

  return (
    <Modal
      title="导入列名"
      open={visible}
      onCancel={() => onVisibleChange(false)}
      destroyOnClose
      width={800}
      footer={null}
    >
      <div style={{ height: 300 }}>
        <Dragger {...uploadProps} height={240}>
          <p className="ant-upload-drag-icon">
            <InboxOutlined />
          </p>
          <p className="ant-upload-text">点击或将文件拖拽到这里上传</p>
          <Typography.Text disabled style={{ cursor: "pointer" }}>
            支持扩展名：.xlsx，.csv，单个文件不超过10M
          </Typography.Text>
          <br />
        </Dragger>
        <div className="leading-8">1、导入的列信息将覆盖原有列；</div>
        <div>2、当导入格式为.xlsx时，请将列名统一放在首行。</div>
      </div>
    </Modal>
  );
});
