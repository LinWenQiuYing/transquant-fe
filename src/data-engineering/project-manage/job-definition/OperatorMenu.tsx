import { IconFont, Permission } from "@transquant/ui";
import { DataType } from "@transquant/utils";
import { Divider, message, Popconfirm, Space, Tooltip, Typography } from "antd";
import { observer } from "mobx-react";
import { useState } from "react";
import { useStores } from "../../hooks";
import { JobDefinitionItem } from "../../types";
import VersionModal from "./VersionModal";

interface OperatorMenuProps {
  data: DataType<JobDefinitionItem>;
}

export default observer(function OperatorMenu(props: OperatorMenuProps) {
  const { data } = props;
  const [visible, setVisible] = useState(false);

  const { deleteJobDefinition, getJobDefinition } =
    useStores().projectManageStore;

  const onVersion = () => {
    setVisible(true);
  };
  const onDelete = async () => {
    await deleteJobDefinition(data.jobCode)
      .then(() => {
        getJobDefinition();
        message.success("删除成功");
      })
      .catch(() => {});
  };

  return (
    <Space>
      <Permission code="B100124" disabled>
        <Tooltip title="版本">
          <Typography.Link onClick={() => onVersion()}>
            <IconFont type="banbenxinxi" />
          </Typography.Link>
        </Tooltip>
      </Permission>
      <Divider type="vertical" />
      <Permission code="B100125" disabled>
        <Popconfirm
          title="是否确认删除？"
          onConfirm={onDelete}
          okText="确认"
          cancelText="取消"
        >
          <Tooltip title="删除">
            <Typography.Link
              disabled={!!data.workflowCode && data.workflowStatus === "ONLINE"}
            >
              <IconFont type="shanchu" />
            </Typography.Link>
          </Tooltip>
        </Popconfirm>
      </Permission>
      {visible && (
        <VersionModal
          visible={visible}
          onVisibleChange={setVisible}
          code={data.jobCode}
          version={data.version}
        />
      )}
    </Space>
  );
});
