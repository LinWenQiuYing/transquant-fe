/* eslint-disable @typescript-eslint/no-use-before-define */
import { clsPrefix } from "@transquant/constants";
import { IconFont } from "@transquant/ui";
import { Nullable } from "@transquant/utils";
import { useDebounce, useMount } from "ahooks";
import { Card, Input, Spin, Tree } from "antd";
import type { DataNode as TreeDataNode, TreeProps } from "antd/es/tree";
import { observer } from "mobx-react";
import React, { useEffect, useState } from "react";
import { useStores } from "../../hooks";
import { PublicFactorTree } from "../../types/publicFactor";

export type DataNode = TreeDataNode &
  PublicFactorTree & {
    _title?: string;
    _fileType?: "directory" | "file";
    _canDownload?: boolean;
  };

export const RedStyle = { color: "var(--red-600)" };
const DirectoryIcon = <IconFont type="yinziwenjianjia" style={RedStyle} />;
const FileIcon = <IconFont type="wenjianliebiao" style={RedStyle} />;
const FactorIcon = <IconFont type="yinzi1" style={RedStyle} />;

const getIcon = (type: "directory" | "file", canDownload: boolean) => {
  let icon = DirectoryIcon;
  if (type === "directory") {
    icon = canDownload ? FactorIcon : DirectoryIcon;
  }
  if (type === "file") {
    icon = FileIcon;
  }
  return icon;
};

export default observer(function LeftView() {
  const {
    getPublicFactorTree,
    treeDataSource,
    treeLoading,
    readFile,
    getFactorMD,
    onSelectedNodeChange,
    onActivePathChange,
  } = useStores().publicFactorStore;
  const [expandedKeys, setExpandedKeys] = useState<React.Key[]>([]);
  const [autoExpandParent, setAutoExpandParent] = useState(true);

  const [searchValue, setSearchValue] = useState("");
  const debouncedValue = useDebounce(searchValue, { wait: 500 });

  useMount(async () => {
    getPublicFactorTree();
  });

  useEffect(() => {
    getPublicFactorTree(debouncedValue);
  }, [debouncedValue]);

  const onExpand = (newExpandedKeys: React.Key[]) => {
    setExpandedKeys(newExpandedKeys);
    setAutoExpandParent(false);
  };

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    setSearchValue(value);
  };

  const onSelect: TreeProps["onSelect"] = (selectedKeys, info) => {
    if ((info.node as any)._fileType === "file") {
      const path = `${info.node.key}`;
      readFile(path);
      onActivePathChange(path);
    }

    if ((info.node as any)._canDownload) {
      const path = `${info.node.key}`;
      getFactorMD(path);
      onActivePathChange(path);
    }

    onSelectedNodeChange(info.node as any);
  };

  const mapToTreeData = (data: Nullable<PublicFactorTree[]>): DataNode[] => {
    if (!data) return [];

    return data?.map((item: PublicFactorTree) => {
      return {
        ...item,
        _fileType: item.fileType,
        _canDownload: item.canDownload,
        title: item.name,
        key: item.path,
        icon: getIcon(item.fileType, item.canDownload),
        children: mapToTreeData(item.children),
      };
    });
  };

  const mapTreeData = mapToTreeData(treeDataSource);

  return (
    <>
      <Card title="公共因子库" className={`${clsPrefix}-research-left`}>
        <Input.Search
          placeholder="请输入关键字搜索"
          onChange={onChange}
          style={{ marginBottom: 20 }}
        />
        <Spin spinning={treeLoading} style={{ paddingTop: 200 }}>
          <Tree
            onExpand={onExpand}
            expandedKeys={expandedKeys}
            autoExpandParent={autoExpandParent}
            treeData={mapTreeData}
            onSelect={onSelect}
            blockNode
            showIcon
            style={{ overflow: "auto" }}
          />
        </Spin>
      </Card>
    </>
  );
});
