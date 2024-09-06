import { last, unique } from "@transquant/utils";
import { useMount, useUnmount } from "ahooks";
import { TreeDataNode, TreeProps } from "antd";
import { toJS } from "mobx";
import { Key, useEffect, useMemo, useState } from "react";
import { MenuPermissionItem } from "../types";

type Options = {
  data: MenuPermissionItem[];
  backfill: number[];
};

export type TreeNodeItem = TreeDataNode & MenuPermissionItem;

const getTreeData = (
  data: MenuPermissionItem[],
  pid?: number
): TreeNodeItem[] => {
  return data.map((item) => ({
    ...item,
    pid,
    key: item.id,
    title: item.name,
    disableCheckbox: !!item.children.length,
    children: getTreeData(item.children, item.id),
  }));
};

const getFlattenList = (data: TreeNodeItem[], list: TreeNodeItem[]) => {
  data.forEach((item) => {
    list.push(item);
    if (item.children) {
      getFlattenList(item.children as TreeNodeItem[], list);
    }
  });
  return list;
};

const getDefaultExpandedKeys = (data: MenuPermissionItem[]) => {
  const defaultExpandedKeys: number[] = [];
  data.forEach((item) => {
    if (item.children) {
      defaultExpandedKeys.push(item.id);
    }
  });
  return defaultExpandedKeys;
};

const getParentKey = (key: React.Key, tree: TreeDataNode[]): React.Key => {
  let parentKey: React.Key;
  for (let i = 0; i < tree.length; i++) {
    const node = tree[i];
    if (node.children) {
      if (node.children.some((item) => item.key === key)) {
        parentKey = node.key;
      } else if (getParentKey(key, node.children)) {
        parentKey = getParentKey(key, node.children);
      }
    }
  }
  return parentKey!;
};

export default function useTreeState(options: Options) {
  const { data, backfill } = options;
  const [trees, setTrees] = useState<TreeNodeItem[]>([]);
  const [flattenTrees, setFlattenTrees] = useState<TreeNodeItem[]>([]);
  const [expandedKeys, setExpandedKeys] = useState<React.Key[]>([]);
  const [selectedKeys, setSelectedKeys] = useState<React.Key[]>([]);
  const [checkedKeys, setCheckedKeys] = useState<React.Key[]>([]);
  const [autoExpandParent, setAutoExpandParent] = useState(true);
  const [searchValue, setSearchValue] = useState("");

  useEffect(() => {
    const dataList = getTreeData(data);
    const flattenList = getFlattenList(dataList, []);
    setTrees(dataList);
    setFlattenTrees(flattenList);
  }, [data]);

  useEffect(() => {
    if (!backfill) return;
    const newExpandedKeys = toJS(backfill).map((key) => {
      const findItem = flattenTrees.find(
        (item) => item.id === key
      ) as TreeNodeItem & { pid: number };
      return findItem?.pid;
    });
    setCheckedKeys(toJS(backfill));

    setExpandedKeys(
      unique([...expandedKeys, ...newExpandedKeys] as number[]) as number[]
    );
  }, [backfill]);

  useMount(() => {
    const defaultExpandedKeys = getDefaultExpandedKeys(data);
    setExpandedKeys(defaultExpandedKeys);
  });

  const onExpand = (newExpandedKeys: React.Key[]) => {
    setExpandedKeys(newExpandedKeys);
    setAutoExpandParent(false);
  };

  const onSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    const newExpandedKeys = flattenTrees
      .map((item) => {
        if ((item?.title as string)?.indexOf(value) > -1) {
          return getParentKey(item.key, flattenTrees);
        }
        return null;
      })
      .filter(
        (item, i, self): item is React.Key =>
          !!(item && self.indexOf(item) === i)
      );
    setExpandedKeys(newExpandedKeys);
    setSearchValue(value);
    setAutoExpandParent(true);
  };

  const treeData = useMemo(() => {
    const loop = (data: TreeDataNode[]): TreeDataNode[] =>
      data.map((item) => {
        const strTitle = item.title as string;
        const index = strTitle.indexOf(searchValue);
        const beforeStr = strTitle.substring(0, index);
        const afterStr = strTitle.slice(index + searchValue.length);
        const title =
          index > -1 ? (
            <span key={item.key}>
              {beforeStr}
              <span className="text-orange-400">{searchValue}</span>
              {afterStr}
            </span>
          ) : (
            <span key={item.key}>{strTitle}</span>
          );
        if (item.children) {
          return {
            ...item,
            title,
            key: item.key,
            children: loop(item.children),
          };
        }

        return {
          ...item,
          title,
          key: item.key,
        };
      });

    return loop(trees);
  }, [searchValue, trees]);

  const onSelect: TreeProps["onSelect"] = (selectedKeys) => {
    if (selectedKeys.length === 0) return;

    setSelectedKeys(selectedKeys);
  };

  const onCheck: TreeProps["onCheck"] = (checkedKeys, info) => {
    if (info.checked) {
      const selectedKey = last(checkedKeys as Key[]) as Key;
      onSelect([selectedKey], info as any);
    }

    setCheckedKeys(checkedKeys as Key[]);
  };

  const reset = () => {
    setFlattenTrees([]);
    setExpandedKeys([]);
    setSelectedKeys([]);
    setCheckedKeys([]);
    setAutoExpandParent(true);
    setSearchValue("");
  };

  useUnmount(() => {
    reset();
  });

  return {
    trees,
    expandedKeys,
    selectedKeys,
    checkedKeys,
    onExpand,
    autoExpandParent,
    onSearch,
    searchValue,
    treeData,
    onCheck,
    onSelect,
  };
}
