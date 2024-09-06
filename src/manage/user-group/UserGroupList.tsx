import { PlusOutlined } from "@ant-design/icons";
import { IconFont, Permission } from "@transquant/ui";
import { useMount, useUnmount } from "ahooks";
import {
  Button,
  Card,
  Modal,
  Spin,
  Tree,
  TreeDataNode,
  TreeProps,
  Typography,
} from "antd";
import { observer } from "mobx-react";
import { ReactPortal, useMemo, useState } from "react";
import { useStores } from "../hooks";
import { Group } from "../types";
import UserGroupModal from "./UserGroupModal";

export default observer(function UserGroupList() {
  const { groups, getAllGroups, groupsLoading, deleteGroup, onSelectedGroup } =
    useStores().userGroupStore;
  const [createVisible, setCreateVisible] = useState(false);

  useMount(() => {
    getAllGroups();
  });

  useUnmount(() => {
    onSelectedGroup(null);
  });

  const onAdd = () => setCreateVisible(true);

  const extraEl = (
    <Permission code="B140101" hidden>
      <Button type="primary" icon={<PlusOutlined />} onClick={onAdd}>
        添加
      </Button>
    </Permission>
  );

  const treeData: TreeDataNode[] = useMemo(() => {
    return groups.map((item) => ({
      title: item.name,
      key: item.id,
      description: item.description,
      icon: <IconFont type="tuandui1" className="mr-2 text-red-600" />,
    }));
  }, [groups]);

  const onDelete = (groupId: number) => {
    Modal.confirm({
      title: "是否确认删除用户组？",
      content: "该用户组中的用户将失去所有该用户组权限，是否继续删除？",
      onOk() {
        deleteGroup(groupId);
      },
    });
  };

  const titleRender = (node: TreeDataNode) => {
    const isSuper = node.title === "超级管理员组";

    return (
      <div className="relative p-1 rounded-sm group">
        {node.icon as unknown as ReactPortal}
        {node.title as string}
        {isSuper ? null : (
          <Permission code="B140109" disabled>
            <Typography.Link
              onClick={() => onDelete(node.key as number)}
              className="absolute invisible text-red-600 cursor-pointer right-1 group-hover:visible hover:text-red-400"
            >
              <IconFont type="shanchu" />
            </Typography.Link>
          </Permission>
        )}
      </div>
    );
  };

  const onSelect: TreeProps["onSelect"] = (_, { node }) => {
    const item = {
      id: node.key as number,
      name: node.title as string,
      description: (node as unknown as { description: string }).description,
    };
    onSelectedGroup(item as Group);
  };

  return (
    <Card
      title="用户组列表"
      extra={extraEl}
      className="h-full overflow-hidden  [&>.trans-quant-antd-card-body]:h-[calc(100%-56px)] [&>.trans-quant-antd-card-body]:overflow-auto"
    >
      <Spin spinning={groupsLoading}>
        <Tree
          treeData={treeData}
          blockNode
          titleRender={titleRender}
          onSelect={onSelect}
          className="user-group"
        />
      </Spin>
      {createVisible && (
        <UserGroupModal
          visible={createVisible}
          onVisibleChange={setCreateVisible}
          type="create"
        />
      )}
    </Card>
  );
});
