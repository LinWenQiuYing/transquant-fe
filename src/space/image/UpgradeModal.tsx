import { Modal, Table, TableProps, Typography } from "antd";
import { observer } from "mobx-react";
import { DataType } from "packages/utils";
import { useState } from "react";
import { MonacoEditor } from "src/common";
import { useDataSource, useStores } from "../hooks";
import { InstallScript } from "../types";

interface UpgradeProps {
  envToken: string;
  upgrade: (data: any) => Promise<void>;
  visible: boolean;
  onVisibleChange: (value: boolean) => void;
}

export default observer(function UpgradeModal(props: UpgradeProps) {
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

  const onOk = () => {
    upgrade({
      envToken,
      installedScriptIds: selectedRowKeys,
      fromNotification: false, // websocket为true
    });
    onVisibleChange(false);
  };

  return (
    <>
      <Modal
        title="升级"
        open={visible}
        onCancel={() => onVisibleChange(false)}
        onOk={onOk}
        width={800}
      >
        <div className="text-gray-300">请选择安装脚本</div>
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
