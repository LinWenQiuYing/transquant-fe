import { MoreOutlined } from "@ant-design/icons";
import { getAccess, IconFont } from "@transquant/ui";
import { useMount, useUnmount } from "ahooks";
import {
  Card,
  Dropdown,
  MenuProps,
  Modal,
  Spin,
  Tree,
  TreeDataNode,
  TreeProps,
} from "antd";
import { observer } from "mobx-react";
import React, {
  ReactPortal,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { useStores } from "../hooks";
import { Group, Team } from "../types";
import GroupModal from "./GroupModal";
import TeamModal from "./team-modal";
import { BaseState } from "./team-modal/use-base";

enum DropMenu {
  AddGroup = "addGroup",
  Merge = "merge",
  Split = "split",
  Delete = "delete",
}

export default observer(function UserGroupList() {
  const {
    groups,
    getTeamTree,
    onSelectedGroup,
    groupsLoading,
    deleteTeam,
    getToBeSelectedTeam,
    mergeTeam,
    splitTeam,
    mergeLoading,
    splitLoading,
  } = useStores().organizationStore;
  const [addGroupVisible, setAddGroupVisible] = useState(false);
  const [expandedKeys, setExpandedKeys] = useState<React.Key[]>([]);
  const [autoExpandParent, setAutoExpandParent] = useState<boolean>(true);
  const mounted = useRef(false);

  useMount(() => {
    getTeamTree();
  });

  useEffect(() => {
    if (groups.length === 0) return;
    if (!mounted.current) {
      setExpandedKeys([groups?.[0]?.id]);
      mounted.current = true;
    }
  }, [groups]);

  useUnmount(() => {
    onSelectedGroup(null);
  });

  const treeData = useMemo(() => {
    function iterate(groups: Group[]): TreeDataNode[] {
      return groups.map((item) => ({
        ...item,
        title: item.name,
        key: item.id,
        description: item.description,
        icon: <IconFont type="bumen" className="mr-2 text-red-600" />,
        children: iterate(item.children),
      }));
    }

    return iterate(groups);
  }, [groups]);

  const onDelete = (groupId: number) => {
    Modal.confirm({
      title: "是否确认删除团队？",
      content:
        "删除团队，其子团队数据及文件将同步删除，请慎重！该操作不能删除员工，仅为解散团队，删除团队后，员工将失去该团队内角色。",
      onOk() {
        deleteTeam(groupId);
      },
    });
  };

  const items: MenuProps["items"] = [
    {
      label: "添加团队",
      key: DropMenu.AddGroup,
      disabled: !getAccess("B150102"),
    },
    {
      label: "合并团队",
      key: DropMenu.Merge,
      disabled: !getAccess("B150103"),
    },
    {
      label: "拆分团队",
      key: DropMenu.Split,
      disabled: !getAccess("B150105"),
    },
    {
      label: "删除",
      key: DropMenu.Delete,
      disabled: !getAccess("B150106"),
    },
  ];

  const [parentId, setParentId] = useState<Partial<number>>();
  const [teamModalVisible, setTeamModalVisible] = useState(false);
  const [type, setType] = useState<"split" | "merge">("merge");
  const [modalTitle, setModalTitle] = useState("");
  const [teams, setTeams] = useState<Team[]>([]);

  const onMemuClick =
    (node: TreeDataNode): MenuProps["onClick"] =>
    (info) => {
      setParentId(node.key as number);
      info.domEvent.stopPropagation();

      if (info.key === DropMenu.Merge || info.key === DropMenu.Split) {
        getToBeSelectedTeam(node.key as number).then((res) => {
          setTeams(res);
        });
      }

      switch (info.key) {
        case DropMenu.AddGroup:
          setAddGroupVisible(true);
          break;
        case DropMenu.Delete:
          onDelete(node.key as number);
          break;
        case DropMenu.Merge:
          setType("merge");
          setModalTitle("合并团队");
          setTeamModalVisible(true);

          break;
        case DropMenu.Split:
          setType("split");
          setModalTitle("拆分团队");
          setTeamModalVisible(true);
          getToBeSelectedTeam(node.key as number);
          break;
        default:
          break;
      }
    };

  const titleRender = (node: TreeDataNode) => {
    return (
      <div className="relative p-1 rounded-sm group">
        {node.icon as unknown as ReactPortal}
        {node.title as string}
        <Dropdown
          menu={{
            items,
            onClick: onMemuClick(node),
          }}
        >
          <span className="absolute invisible text-red-600 cursor-pointer right-1 group-hover:visible hover:text-red-400">
            <MoreOutlined className="text-2xl rotate-90" />
          </span>
        </Dropdown>
      </div>
    );
  };

  const onSelect: TreeProps["onSelect"] = (_, { node }) => {
    onSelectedGroup(node as unknown as Group);
  };

  const onExpand: TreeProps["onExpand"] = (keys) => {
    setExpandedKeys(keys);
    setAutoExpandParent(false);
  };

  const onSubmit = async (value: Partial<BaseState>) => {
    return type === "merge" ? mergeTeam(value) : splitTeam(value);
  };

  return (
    <Card
      title="组织架构"
      className="h-full overflow-hidden [&>.trans-quant-antd-card-body]:h-[calc(100%-56px)] [&>.trans-quant-antd-card-body]:overflow-auto"
    >
      <Spin spinning={groupsLoading}>
        <Tree
          treeData={treeData}
          blockNode
          titleRender={titleRender}
          onSelect={onSelect}
          expandedKeys={expandedKeys}
          onExpand={onExpand}
          autoExpandParent={autoExpandParent}
        />
      </Spin>

      {addGroupVisible && (
        <GroupModal
          visible={addGroupVisible}
          onVisibleChange={setAddGroupVisible}
          type="create"
          parentTeamId={parentId!}
        />
      )}
      {teamModalVisible && (
        <TeamModal
          id={parentId!}
          visible={teamModalVisible}
          onVisibleChange={setTeamModalVisible}
          type={type}
          title={modalTitle}
          teams={teams}
          onSubmit={onSubmit}
          loading={type === "merge" ? mergeLoading : splitLoading}
        />
      )}
    </Card>
  );
});
