import { getAccess, IconFont } from "@transquant/ui";
import { DataType } from "@transquant/utils";
import { Divider, message, Popconfirm, Space, Tooltip, Typography } from "antd";
import { observer } from "mobx-react";
import { useStores } from "../../hooks";
import { WorkflowInstanceItem } from "../../types";

interface OperatorMenuProps {
  data: DataType<WorkflowInstanceItem>;
}

export default observer(function OperatorMenu(props: OperatorMenuProps) {
  const { data } = props;
  const state = data.status;

  const { handleOperate, handleDelete, getWorkflowInstance } =
    useStores().projectManageStore;

  const onRerun = () => {
    handleOperate(data.id, "REPEAT_RUNNING");
  };
  const onStop = () => {
    handleOperate(data.id, "STOP");
  };
  const onDelete = async () => {
    await handleDelete(data.id)
      .then(() => {
        getWorkflowInstance();
        message.success("删除成功");
      })
      .catch(() => {});
  };

  return (
    <Space>
      <Tooltip title="重跑">
        <Typography.Link
          onClick={() => onRerun()}
          disabled={
            !getAccess("B100117") ||
            (state !== "SUCCESS" &&
              state !== "PAUSE" &&
              state !== "FAILURE" &&
              state !== "STOP")
          }
        >
          <IconFont type="zhongpao" />
        </Typography.Link>
      </Tooltip>
      <Divider type="vertical" />
      <Tooltip title="停止">
        <Typography.Link
          onClick={() => onStop()}
          disabled={
            !getAccess("B100118") ||
            (state !== "RUNNING_EXECUTION" && state !== "STOP")
          }
        >
          <IconFont type="tingzhi" />
        </Typography.Link>
      </Tooltip>
      <Divider type="vertical" />
      <Popconfirm
        title="是否确认删除？"
        onConfirm={onDelete}
        okText="确认"
        cancelText="取消"
      >
        <Tooltip title="删除">
          <Typography.Link
            disabled={
              !getAccess("B100119") ||
              (state !== "SUCCESS" &&
                state !== "FAILURE" &&
                state !== "STOP" &&
                state !== "PAUSE")
            }
          >
            <IconFont type="shanchu" />
          </Typography.Link>
        </Tooltip>
      </Popconfirm>
    </Space>
  );
});
