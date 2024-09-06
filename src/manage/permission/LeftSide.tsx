import type { TreeDataNode, TreeProps } from "antd";
import { Input, Tree } from "antd";
import { SearchProps } from "antd/es/input";
import React from "react";

const { Search } = Input;

interface LeftSideProps {
  treeData: TreeDataNode[];
  onSearch: SearchProps["onChange"];
  onExpand: TreeProps["onExpand"];
  onSelect: TreeProps["onSelect"];
  onCheck: TreeProps["onCheck"];
  expandedKeys: React.Key[];
  selectedKeys: React.Key[];
  checkedKeys: React.Key[];
  autoExpandParent: boolean;
}

export default function LeftSide(props: LeftSideProps) {
  const {
    treeData,
    onSearch,
    onExpand,
    expandedKeys,
    selectedKeys,
    checkedKeys,
    autoExpandParent,
    onCheck,
    onSelect,
  } = props;

  return (
    <div>
      <Search
        className="mb-2"
        placeholder="请输入关键词搜索"
        onChange={onSearch}
      />
      <Tree
        onExpand={onExpand}
        expandedKeys={expandedKeys}
        checkedKeys={checkedKeys}
        selectedKeys={selectedKeys}
        autoExpandParent={autoExpandParent}
        treeData={treeData}
        onCheck={onCheck}
        onSelect={onSelect}
        checkable
        blockNode
      />
    </div>
  );
}
