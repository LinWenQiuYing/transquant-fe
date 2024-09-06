import { ajax, DataType } from "@transquant/utils";
import { Button, Modal, Table, TableProps, Typography } from "antd";
import { observer } from "mobx-react";
import { useState } from "react";
import { MonacoEditor } from "src/common";
import { useDataSource, useStores } from "../hooks";
import { InstallScript } from "../types";

interface InstallProps {
  envToken: string;
  upgrade: (data: any) => Promise<void>;
  visible: boolean;
  onVisibleChange: (value: boolean) => void;
}

const noInstallWhenLaunch = (envToken: string) => {
  return ajax({
    url: `/tqlab/install/notInstallWhenLaunch`,
    params: { envToken },
  });
};

export default observer(function InstallModal(props: InstallProps) {
  const { envToken, visible, onVisibleChange, upgrade } = props;
  const {
    installLoading,
    installScripts,
    getInstallScriptContent,
    scriptContent,
  } = useStores().imageStore;
  const [selectedRowKeys, setSelectedRowKeys] = useState<string[]>([]);
  const [shellVisible, setShellVisible] = useState(false);

  const onShellClick = (fileName: string) => {
    setShellVisible(true);
    getInstallScriptContent(fileName);
  };

  const columns: TableProps<DataType<InstallScript>>["columns"] = [
    {
      title: "版本名",
      dataIndex: "version",
      key: "version",
      width: "20%",
      ellipsis: true,
    },
    {
      title: "文件",
      dataIndex: "fileName",
      key: "fileName",
      width: "25%",
      ellipsis: true,
      render(fileName: string) {
        return (
          <Typography.Link onClick={() => onShellClick(fileName)}>
            {fileName}
          </Typography.Link>
        );
      },
    },
    {
      title: "上传时间",
      dataIndex: "uploadTime",
      key: "uploadTime",
      width: "25%",
      ellipsis: true,
    },
    {
      title: "备注",
      dataIndex: "comment",
      key: "comment",
      width: "30%",
      ellipsis: true,
    },
  ];

  const onChange = (selectedRowKeys: React.Key[]) => {
    setSelectedRowKeys(selectedRowKeys as unknown as string[]);
  };

  const onUnInstall = () => {
    noInstallWhenLaunch(envToken).finally(() => {
      onVisibleChange(false);
    });
  };

  const onInstall = () => {
    upgrade({
      envToken,
      installedScriptIds: selectedRowKeys,
      fromNotification: false, // websocket为true
    }).finally(() => {
      onVisibleChange(false);
    });
  };

  return (
    <>
      <Modal
        title="升级"
        open={visible}
        onCancel={() => onVisibleChange(false)}
        width={800}
        footer={[
          <Button key="unInstall" onClick={onUnInstall}>
            不安装
          </Button>,
          <Button type="primary" onClick={onInstall} key="install">
            立即安装
          </Button>,
        ]}
      >
        <div className="text-gray-300">
          系统管理员对该环境进行了统一提醒的操作。安装操作将立即进行安装、固化、重启操作。为避免丢失重要信息，请选择是否立即安装，如当下不安装，需使用该版本特性时，请手动安装
        </div>
        <Table
          bordered
          size="small"
          rowSelection={{
            type: "checkbox",
            onChange,
          }}
          loading={installLoading}
          columns={columns}
          scroll={{ y: 200 }}
          pagination={false}
          dataSource={useDataSource(installScripts)}
          rowKey={(record) => record.id}
        />
      </Modal>
      <Modal
        title="脚本内容"
        open={shellVisible}
        onCancel={() => setShellVisible(false)}
        footer={null}
        width={800}
      >
        <div className="h-[500px]">
          <MonacoEditor value={scriptContent} language="bash" />
        </div>
      </Modal>
    </>
  );
});
