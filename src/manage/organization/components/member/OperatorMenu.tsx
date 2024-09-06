import { EditOutlined } from "@ant-design/icons";
import { IconFont, Permission } from "@transquant/ui";
import { DataType } from "@transquant/utils";
import { Divider, Modal, Space, Tooltip, Typography } from "antd";
import { observer } from "mobx-react";
import { useState } from "react";
import { useStores } from "../../../hooks";
import { MemberItem } from "../../../types";
import MemberModal from "./MemberModal";

interface OperatorMenuProps {
  data: DataType<MemberItem>;
}

export default observer(function OperatorMenu(props: OperatorMenuProps) {
  const { data } = props;
  const { removeMemberOfTeam, selectedGroup, getRoleListOfTeam } =
    useStores().organizationStore;
  // 编辑成员弹框
  const [memberModalVisible, setMemberModalVisible] = useState(false);

  const onRemove = () => {
    Modal.confirm({
      title: (
        <div>
          是否确认移出用户
          <span style={{ color: "var(--red-600)" }}>「{data.realName}」</span>？
        </div>
      ),
      onOk: () => {
        removeMemberOfTeam({ userId: data.id, teamId: selectedGroup!.id });
      },
    });
  };

  const onEdit = async () => {
    await getRoleListOfTeam(selectedGroup!.id);
    setMemberModalVisible(true);
  };

  return (
    <>
      <Space>
        <Permission code="B150125" disabled>
          <Tooltip title="编辑">
            <Typography.Link onClick={onEdit} disabled={!data.editable}>
              <EditOutlined />
            </Typography.Link>
          </Tooltip>
        </Permission>

        <Divider type="vertical" />
        <Permission code="B150108" disabled>
          <Tooltip title="移出成员">
            <Typography.Link onClick={onRemove}>
              <IconFont type="yichu" />
            </Typography.Link>
          </Tooltip>
        </Permission>
      </Space>

      {memberModalVisible && (
        <MemberModal
          title="编辑用户"
          data={data}
          visible={memberModalVisible}
          onVisibleChange={(visible: boolean) => setMemberModalVisible(visible)}
        />
      )}
    </>
  );
});
