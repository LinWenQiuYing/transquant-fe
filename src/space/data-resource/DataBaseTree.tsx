import {
  DeleteOutlined,
  DownOutlined,
  PlusSquareOutlined,
} from "@ant-design/icons";
import { clsPrefix } from "@transquant/constants";
import { IconFont } from "@transquant/ui";
import { Nullable, UUID } from "@transquant/utils";
import { Modal, Spin, Tooltip, Tree, TreeProps, Typography } from "antd";
import type { DataNode } from "antd/es/tree";
import classNames from "classnames";
import { observer } from "mobx-react";
import React, { Dispatch, SetStateAction, useEffect, useState } from "react";
import { useStores } from "../hooks";
import { Idb, ITable, TreeData } from "../types/dataResource";
import TableModal from "./TableModal";

type DataNodeType = DataNode & { dbName: string; tableName: string };

const getTableChildren = (
  tables: ITable[],
  dbName: string,
  onDeleteTable: (dbName: string, tableName: string) => void
) => {
  return tables.map((item) => ({
    title: (
      <span
        className={classNames([
          `${clsPrefix}-ellipsis`,
          `${clsPrefix}-tree-node`,
        ])}
      >
        {item.tableName}
        <Tooltip title={item.canDelTable ? "删除表" : "您没有删除该表的权限"}>
          <Typography.Link
            disabled={!item.canDelTable}
            className={`${
              item.canDelTable ? "visible" : "hidden"
            } absolute right-0`}
            onClick={() => onDeleteTable(dbName, item.tableName)}
          >
            <DeleteOutlined />
          </Typography.Link>
        </Tooltip>
      </span>
    ),
    dbName,
    tableName: item.tableName,
    key: `${UUID()}`,
    icon: item.isFactor ? (
      <IconFont type="yinzi" style={{ color: "var(--red-600)" }} />
    ) : (
      <IconFont type="biao" style={{ color: "var(--red-600)" }} />
    ),
  }));
};

const getDbChildren = (
  dbs: Idb[],
  name: string,
  expandedKeys: string[],
  setTableVisible: Dispatch<React.SetStateAction<boolean>>,
  setDatabase: Dispatch<React.SetStateAction<string>>,
  onDeleteTable: (dbName: string, tableName: string) => void
) => {
  return dbs.map((item) => {
    const key = `${name}-${item.dbName}`;
    expandedKeys.push(key);
    return {
      title: (
        <span
          className={classNames([
            `${clsPrefix}-ellipsis`,
            `${clsPrefix}-tree-node`,
          ])}
        >
          {item.dbName}
          <Tooltip
            title={
              item.canCreateTable ? "新建表" : "您没有该数据库下创建表的权限"
            }
          >
            <Typography.Link
              disabled={!item.canCreateTable}
              className={`absolute right-0 ${
                item.canCreateTable ? "visible" : "hidden"
              } `}
              onClick={() => {
                setTableVisible(true);
                setDatabase(item.dbName);
              }}
            >
              <PlusSquareOutlined />
            </Typography.Link>
          </Tooltip>
        </span>
      ),
      key,
      dbName: undefined,
      tableName: undefined,
      icon: <IconFont type="worth" style={{ color: "var(--red-600)" }} />,
      children: getTableChildren(item.tableInfos, item.dbName, onDeleteTable),
    };
  });
};

const getTreeData = (
  data: Nullable<TreeData>,
  setExpandedKeys: Dispatch<SetStateAction<string[]>>,
  setTableVisible: Dispatch<React.SetStateAction<boolean>>,
  setDatabase: Dispatch<React.SetStateAction<string>>,
  onDeleteTable: (dbName: string, tableName: string) => void
): DataNode[] => {
  if (!data) return [];

  const { commonDB, personalDB, teamDB } = data;
  const expandedKeys = ["commonDB", "personalDB", "teamDB"];

  const commonDBTree = getDbChildren(
    commonDB,
    "commonDB",
    expandedKeys,
    setTableVisible,
    setDatabase,
    onDeleteTable
  );
  const personalDBTree = getDbChildren(
    personalDB,
    "personalDB",
    expandedKeys,
    setTableVisible,
    setDatabase,
    onDeleteTable
  );
  const teamDBTree = getDbChildren(
    teamDB,
    "teamDB",
    expandedKeys,
    setTableVisible,
    setDatabase,
    onDeleteTable
  );

  const _treeData: DataNode[] = [
    {
      title: "公共资源",
      key: "commonDB",
      children: commonDBTree,
    },
    {
      title: "个人空间",
      key: "personalDB",
      children: personalDBTree,
    },
    {
      title: "团队空间",
      key: "teamDB",
      children: teamDBTree,
    },
  ];

  setExpandedKeys(expandedKeys);
  return _treeData;
};

export default observer(function DataBaseTree() {
  const {
    treeData,
    getTableDetailInfo,
    getPreviewData,
    getUploadHistory,
    dropTimelyreTable,
  } = useStores().dataResourceStore;

  const [expandedKeys, setExpandedKeys] = useState<string[]>([]);
  const [data, setData] = useState<DataNode[]>([]);
  const [tableVisible, setTableVisible] = useState(false);
  const [database, setDatabase] = useState("");

  const onDeleteTable = (dbName: string, tableName: string) => {
    Modal.confirm({
      title: "库表删除确认",
      content: `该操作无法撤销，是否确定删除表【${tableName}】及其数据？`,
      onOk() {
        dropTimelyreTable(dbName, tableName);
      },
    });
  };

  useEffect(() => {
    const _treeData = getTreeData(
      treeData,
      setExpandedKeys,
      setTableVisible,
      setDatabase,
      onDeleteTable
    );
    setData(_treeData);
  }, [treeData]);

  if (!treeData)
    return (
      <div className={`${clsPrefix}-data-resource-left-spin-wrapper`}>
        <Spin />
      </div>
    );

  const onSelect: TreeProps["onSelect"] = (keys, info) => {
    if (!info.selectedNodes.length) return;
    const { dbName, tableName } = info.selectedNodes[0] as DataNodeType;

    if (!tableName) return;

    getTableDetailInfo({
      dbName,
      tableName,
    });

    getPreviewData({
      dbName,
      tableName,
    });

    getUploadHistory({
      dbName,
      tableName,
    });
  };

  const onExpand = (expandedKeysValue: React.Key[]) => {
    setExpandedKeys(expandedKeysValue as string[]);
  };

  return (
    <>
      <Tree
        showIcon
        blockNode
        onExpand={onExpand}
        expandedKeys={expandedKeys}
        defaultExpandedKeys={["commonDB"]}
        switcherIcon={<DownOutlined />}
        treeData={data}
        onSelect={onSelect}
        height={innerHeight - 220}
      />
      {tableVisible && (
        <TableModal
          visible={tableVisible}
          onVisibleChange={(value) => setTableVisible(value)}
          database={database}
        />
      )}
    </>
  );
});
