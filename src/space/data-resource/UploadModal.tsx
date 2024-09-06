import { InboxOutlined } from "@ant-design/icons";
import { message, Modal, Typography, Upload, UploadProps } from "antd";
import type { RcFile, UploadFile } from "antd/es/upload/interface";
import { observer } from "mobx-react";
import { SyntheticEvent, useState } from "react";
import { useStores } from "../hooks";

const { Dragger } = Upload;

interface UploadModalProps {
  visible: boolean;
  onVisibleChange: (value: boolean) => void;
}

export default observer(function UploadModal(props: UploadModalProps) {
  const { visible, onVisibleChange } = props;
  const { downloadTableTemplate, tableInfo, uploadDataFile } =
    useStores().dataResourceStore;

  const onTemplateDownload = (e: SyntheticEvent<HTMLElement>) => {
    e.preventDefault();
    e.stopPropagation();
    if (!tableInfo) return;

    downloadTableTemplate({
      dbName: tableInfo.dbName,
      tableName: tableInfo.tableName,
    });
  };

  const [fileList, setFileList] = useState<UploadFile[]>([]);
  const [uploading, setUploading] = useState(false);

  const onOk = () => {
    fileList.forEach((file) => {
      uploadDataFile({
        file: file as RcFile,
        dbName: tableInfo!.dbName,
        tableName: tableInfo!.tableName,
      })
        .then(() => {
          setFileList([]);
          message.success(`${file.name}开始上传`);
        })
        .catch(() => {
          message.error(`${file.name}上传失败`);
        })
        .finally(() => {
          setUploading(false);
        });
    });
  };

  const uploadProps: UploadProps = {
    multiple: true,
    onRemove: (file) => {
      const index = fileList.indexOf(file);
      const newFileList = fileList.slice();
      newFileList.splice(index, 1);
      setFileList(newFileList);
    },
    beforeUpload: (_, fileList) => {
      setFileList(fileList);

      return false;
    },
    fileList,
  };

  return (
    <Modal
      title="上传数据"
      open={visible}
      onCancel={() => onVisibleChange(false)}
      onOk={onOk}
      destroyOnClose
      width={800}
      okButtonProps={{ loading: uploading }}
    >
      <div style={{ height: 400 }}>
        <p className="mt-4 text-gray-400">
          时序表上传数据成功后，当时间戳所在列与标签列的数据完全一致时覆盖数据，不同时新增数据
        </p>
        <p className="mb-4 text-gray-400">非时序表上传成功后新增数据</p>
        <Dragger {...uploadProps} height={240}>
          <p className="ant-upload-drag-icon">
            <InboxOutlined />
          </p>
          <p className="ant-upload-text">点击或将文件拖拽到这里上传</p>
          <Typography.Text disabled style={{ cursor: "pointer" }}>
            支持扩展名：.xlsx，单个文件不超过10M
          </Typography.Text>
          <br />

          <Typography.Paragraph
            style={{ cursor: "pointer" }}
            ellipsis={{ rows: 3, expandable: false }}
          >
            列名必须为：
            {tableInfo?.tableStructures.map((item, index) =>
              index === tableInfo.tableStructures.length - 1
                ? `${item.col_name}`
                : `${item.col_name}、`
            )}
          </Typography.Paragraph>
          <Typography.Link
            style={{ marginLeft: 20 }}
            onClick={onTemplateDownload}
          >
            模版下载
          </Typography.Link>
        </Dragger>
      </div>
    </Modal>
  );
});
