import { DownloadOutlined } from "@ant-design/icons";
import { IconFont, Permission } from "@transquant/ui";
import { DataType } from "@transquant/utils";
import { Divider, Space, Tooltip, Typography } from "antd";
import { observer } from "mobx-react";
import { useState } from "react";
import { useStores } from "../../hooks";
import { JobInstanceItem } from "../../types";
import LogModal from "./LogModal";

interface OperatorMenuProps {
  data: DataType<JobInstanceItem>;
}

export default observer(function OperatorMenu(props: OperatorMenuProps) {
  const { data } = props;
  const [visible, setVisible] = useState<boolean>(false);
  const [log, setLog] = useState<string>("");

  const { checkLog, downloadLog, handleForceSuccess } =
    useStores().projectManageStore;

  const onForceSuccess = () => {
    handleForceSuccess(data.id);
  };
  const onCheckLog = async () => {
    setVisible(true);
    const res = await checkLog(data.id);
    setLog(res.message);
  };
  const onDownloadLog = async () => {
    downloadLog(data.id);
  };

  return (
    <Space>
      <Permission code="B100126" disabled>
        <Tooltip title="强制成功">
          <Typography.Link
            onClick={onForceSuccess}
            disabled={
              !(
                data.status === "FAILURE" ||
                data.status === "NEED_FAULT_TOLERANCE" ||
                data.status === "KILL"
              )
            }
          >
            <IconFont type="qiangzhichenggong" />
          </Typography.Link>
        </Tooltip>
      </Permission>
      <Divider type="vertical" />
      <Permission code="B100127" disabled>
        <Tooltip title="查看日志">
          <Typography.Link disabled={!data.host} onClick={onCheckLog}>
            <IconFont type="chakanrizhi" />
          </Typography.Link>
        </Tooltip>
      </Permission>
      <Divider type="vertical" />
      <Permission code="B100128" disabled>
        <Tooltip title="下载日志">
          <Typography.Link disabled={!data.host} onClick={onDownloadLog}>
            <DownloadOutlined />
          </Typography.Link>
        </Tooltip>
      </Permission>
      {visible && (
        <LogModal visible={visible} onVisibleChange={setVisible} data={log} />
      )}
    </Space>
  );
});
