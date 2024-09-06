import { IconFont, Permission } from "@transquant/ui";
import { Divider, Modal, Space, Tooltip, Typography } from "antd";
import { observer } from "mobx-react";
import { useState } from "react";
import { useStores } from "../hooks";
import { File } from "../types";
import CreateFile from "./CreateFile";
import Rename from "./Rename";

export type FileInfo = {
  alias: string;
  content: string;
  fileName: string;
  fullName: string;
};

const pyPattern = /.*\.py$/;

export default observer(function OperatorMenu(props: { data: File }) {
  const { data } = props;
  const { getFileInfo, deleteFile, downloadFile } = useStores().dataManageStore;
  const [createVisible, setCreateVisible] = useState(false);
  const [renameVisible, setRenameVisible] = useState(false);
  const [fileInfo, setFileInfo] = useState<Partial<FileInfo>>({
    fileName: data.fileName,
    fullName: data.fullName,
  });

  const onEdit = async () => {
    const res = await getFileInfo(data.fullName);
    setFileInfo({ ...fileInfo, ...res });
    setCreateVisible(true);
  };

  const onDelete = () => {
    Modal.confirm({
      title: "是否确认删除该文件？",
      onOk: () => {
        deleteFile(data.fullName);
      },
    });
  };

  const onDownload = () => {
    downloadFile(data.fullName, data.fileName);
  };

  return (
    <>
      <Space size="middle">
        <Permission code="B120103" disabled>
          <Tooltip title="编辑">
            <Typography.Link
              onClick={onEdit}
              disabled={!pyPattern.test(data.alias)}
            >
              <IconFont type="bianji" />
            </Typography.Link>
          </Tooltip>
        </Permission>
        <Divider type="vertical" className="mx-0" />
        <Permission code="B120104" disabled>
          <Tooltip title="重命名">
            <Typography.Link onClick={() => setRenameVisible(true)}>
              <IconFont type="zhongmingming" />
            </Typography.Link>
          </Tooltip>
        </Permission>
        <Divider type="vertical" className="mx-0" />
        <Permission code="B120105" disabled>
          <Tooltip title="下载">
            <Typography.Link onClick={onDownload}>
              <IconFont type="xiazai" />
            </Typography.Link>
          </Tooltip>
        </Permission>
        <Divider type="vertical" className="mx-0" />
        <Permission code="B120106" disabled>
          <Tooltip title="删除">
            <Typography.Link onClick={onDelete}>
              <IconFont type="shanchu" />
            </Typography.Link>
          </Tooltip>
        </Permission>
      </Space>
      {createVisible && (
        <CreateFile
          data={fileInfo}
          visible={createVisible}
          onVisibleChange={setCreateVisible}
        />
      )}
      {renameVisible && (
        <Rename
          data={{ name: data.fileName, fullName: data.fullName }}
          visible={renameVisible}
          onVisibleChange={setRenameVisible}
        />
      )}
    </>
  );
});
