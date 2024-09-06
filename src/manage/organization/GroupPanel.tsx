import { EditOutlined } from "@ant-design/icons";
import { IconFont, Permission } from "@transquant/ui";
import { Button, Card, Descriptions, Empty, Typography } from "antd";
import { observer } from "mobx-react";
import { useMemo, useState } from "react";
import { useStores } from "../hooks";
import GroupModal, { IGroupValue } from "./GroupModal";

const ellipsis = {
  display: "inline-block",
  width: 160,
  whiteSpace: "nowrap",
  overflow: "hidden",
  textOverflow: "ellipsis",
};

export default observer(function GroupPanel() {
  const { selectedGroup } = useStores().organizationStore;
  const [editVisible, setEditVisible] = useState(false);
  const onEdit = () => setEditVisible(true);

  const groupInfo = useMemo(
    () => ({
      ...selectedGroup,
      spaceName: selectedGroup?.teamSpaceName,
      dbName: selectedGroup?.teamDBName,
    }),
    [selectedGroup]
  );

  return (
    <Card
      title="团队详情"
      className="h-56 overflow-hidden min-h-56"
      extra={
        <Permission code="B150101" hidden>
          <Button
            icon={<EditOutlined />}
            type="primary"
            disabled={!selectedGroup}
            onClick={onEdit}
          >
            编辑
          </Button>
        </Permission>
      }
    >
      {selectedGroup ? (
        <div>
          <Descriptions
            column={3}
            title={
              <div>
                <IconFont
                  type="tuandui1"
                  style={{ color: "var(--red-600)" }}
                  className="mr-2"
                />
                <span>{selectedGroup?.name}</span>
              </div>
            }
          >
            <Descriptions.Item label="联系人">
              <div title={selectedGroup?.contacter} style={ellipsis}>
                {selectedGroup?.contacter}
              </div>
            </Descriptions.Item>
            <Descriptions.Item label="联系方式">
              <div title={selectedGroup?.contacterInfo} style={ellipsis}>
                {selectedGroup?.contacterInfo}
              </div>
            </Descriptions.Item>
            <Descriptions.Item label="创建时间">
              <div title={selectedGroup?.creatTime} style={ellipsis}>
                {selectedGroup?.creatTime}
              </div>
            </Descriptions.Item>
          </Descriptions>
          <Descriptions>
            <Descriptions.Item label="团队介绍">
              {selectedGroup?.description || (
                <Typography.Paragraph>
                  <Typography.Text disabled>暂无团队介绍</Typography.Text>
                </Typography.Paragraph>
              )}
            </Descriptions.Item>
          </Descriptions>
        </div>
      ) : (
        <Empty description="请选择团队" />
      )}

      {editVisible && (
        <GroupModal
          visible={editVisible}
          onVisibleChange={setEditVisible}
          type="edit"
          teamId={selectedGroup!.id}
          data={groupInfo as unknown as IGroupValue}
        />
      )}
    </Card>
  );
});
