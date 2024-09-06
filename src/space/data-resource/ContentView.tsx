import { clsPrefix } from "@transquant/constants";
import { Button, Card, Empty, Space, Tabs, TabsProps } from "antd";
import { observer } from "mobx-react";
import { useState } from "react";
import { Else, If, Then } from "react-if";
import { useStores } from "../hooks";
import CreateTable from "./CreateTable";
import Database from "./Database";
import DataExample from "./DataExample";
import DownloadModal from "./DownloadModal";
import Snapshot from "./Snapshot";
import TableComment from "./TableComment";
import UploadFileTable from "./UploadFileTable";
import UploadModal from "./UploadModal";

const items: TabsProps["items"] = [
  {
    key: "1",
    label: "表详情",
    children: (
      <>
        <TableComment />
        <Database />
        <DataExample />
        <CreateTable />
      </>
    ),
  },
  {
    key: "2",
    label: "数据管理",
    children: <UploadFileTable />,
  },
];

export default observer(function ContentView() {
  const { tableInfo, downloadDataFile, downloading } =
    useStores().dataResourceStore;
  const [activeTab, setActiveTab] = useState("1");
  const [uploadVisible, setUploadVisible] = useState(false);
  const [downloadVisible, setDownloadVisible] = useState(false);

  const onTabChange = (key: string) => {
    setActiveTab(key);
  };

  const onDownload = () => {
    if (tableInfo && !tableInfo?.filterTypes.length) {
      downloadDataFile({
        dbName: tableInfo.dbName,
        tableName: tableInfo.tableName,
      });
    } else {
      setDownloadVisible(true);
    }
  };

  const isTextTable = tableInfo?.ddl.includes(
    "org.apache.hadoop.mapred.TextInputFormat"
  );

  const getTabBar = () => {
    if (activeTab === "1") {
      return null;
    }

    if (activeTab === "2") {
      return (
        <Space>
          <Button
            type="primary"
            onClick={() => setUploadVisible(true)}
            disabled={!tableInfo?.canUpload || isTextTable}
          >
            上传
          </Button>
          <Button
            type="primary"
            onClick={onDownload}
            disabled={!tableInfo?.canDownload}
            loading={downloading}
          >
            下载
          </Button>
        </Space>
      );
    }
  };

  return (
    <Card title="表详情" className={`${clsPrefix}-data-resource-content`}>
      <If condition={tableInfo === null}>
        <Then>
          <Empty
            style={{ marginTop: 200 }}
            description="请点击左侧数据表名，查看数据详情"
          />
        </Then>
        <Else>
          <Snapshot />
          <Tabs
            activeKey={activeTab}
            items={items}
            tabBarExtraContent={getTabBar()}
            onChange={onTabChange}
            destroyInactiveTabPane
          />
        </Else>
      </If>
      {uploadVisible && (
        <UploadModal
          visible={uploadVisible}
          onVisibleChange={(value) => setUploadVisible(value)}
        />
      )}
      {downloadVisible && (
        <DownloadModal
          visible={downloadVisible}
          onVisibleChange={(value) => setDownloadVisible(value)}
        />
      )}
    </Card>
  );
});
