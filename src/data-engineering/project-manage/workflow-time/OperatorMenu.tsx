import { IconFont, Permission } from "@transquant/ui";
import { DataType } from "@transquant/utils";
import { Divider, message, Popconfirm, Space, Tooltip, Typography } from "antd";
import { observer } from "mobx-react";
import { useState } from "react";
import { Else, If, Then } from "react-if";
import { useStores } from "../../hooks";
import { WorkflowTimeItem } from "../../types";
import EditModal from "./EditModal";

interface OperatorMenuProps {
  data: DataType<WorkflowTimeItem>;
}

export default observer(function OperatorMenu(props: OperatorMenuProps) {
  const { data } = props;
  const state = data.status;

  const {
    deleteWorkflowTime,
    offlineWorkflowTime,
    onlineWorkflowTime,
    getWorkflowTime,
  } = useStores().projectManageStore;
  const [visible, setVisible] = useState(false);

  const onEdit = () => {
    setVisible(true);
  };
  const onOperate = (type: string) => {
    if (type === "offline") {
      offlineWorkflowTime(data.id);
    } else {
      onlineWorkflowTime(data.id);
    }
  };
  const onDelete = async () => {
    await deleteWorkflowTime(data.id)
      .then(() => {
        getWorkflowTime();
        message.success("删除成功");
      })
      .catch(() => {});
  };

  return (
    <Space>
      <Permission code="B100120" disabled>
        <Tooltip title="编辑">
          <Typography.Link
            onClick={() => onEdit()}
            disabled={state === "ONLINE"}
          >
            <IconFont type="bianji" />
          </Typography.Link>
        </Tooltip>
      </Permission>
      <Divider type="vertical" />
      <If condition={data.status === "ONLINE"}>
        <Then>
          <Permission code="B100122" disabled>
            <Tooltip title="下线">
              <Typography.Link onClick={() => onOperate("offline")}>
                <IconFont type="xiaxian" />
              </Typography.Link>
            </Tooltip>
          </Permission>
        </Then>
        <Else>
          <Permission code="B100121" disabled>
            <Tooltip title="上线">
              <Typography.Link onClick={() => onOperate("online")}>
                <IconFont type="shangxian" />
              </Typography.Link>
            </Tooltip>
          </Permission>
        </Else>
      </If>
      <Divider type="vertical" />
      <Permission code="B100123" disabled>
        <Popconfirm
          title="是否确认删除"
          onConfirm={onDelete}
          okText="确认"
          cancelText="取消"
        >
          <Tooltip title="删除">
            <Typography.Link>
              <IconFont type="shanchu" />
            </Typography.Link>
          </Tooltip>
        </Popconfirm>
      </Permission>
      {visible && (
        <EditModal
          data={data}
          visible={visible}
          onVisibleChange={(value) => setVisible(value)}
        />
      )}
    </Space>
  );
});
