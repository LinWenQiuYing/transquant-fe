import { clsPrefix } from "@transquant/constants";
import { IconFont } from "@transquant/ui";
import { useMount } from "ahooks";
import { Button, Card, Divider, message, Table, Tag, Tooltip } from "antd";
import type { ColumnsType } from "antd/es/table";
import { observer } from "mobx-react";
import { useState } from "react";
import { useStores } from "../../hooks";
import { EnvVos } from "../../types";
import SolidLog from "./SolidLog";

interface DataType {
  key: string;
  imageName: string;
  envName: string;
  envIP: string;
  sshPort: number;
  sshUser: string;
  envId: number;
  solidDate: string;
  envStatus: number;
}

const getDataSource = (data?: EnvVos[]) => {
  return data?.map((item) => ({
    key: `${item.envId}`,
    ...item,
  }));
};

export default observer(function EnvInfo() {
  const {
    envList,
    getEnvInfo,
    solidifyJupyterEnv,
    upgradeJupyterEnv,
    restartPrivateEnv,
    getEnvHistory,
    rollbacking,
  } = useStores().profileStore;

  const [editKey, setEditKey] = useState("");
  const [loading, setLoading] = useState(false);
  const [logVisible, setLogVisible] = useState(false);
  const [envId, setEnvId] = useState(-1);
  const [envStatus, setEnvStatus] = useState(-1);

  useMount(() => {
    getEnvInfo();
  });

  const onSolidifyClick = (raw: DataType) => {
    setEditKey(raw.key);
    setLoading(true);
    message.info("环境固化中...，此过程可能需要几分钟，请稍后");
    solidifyJupyterEnv(raw.envId).finally(() => {
      setLoading(false);
      setEditKey("");
    });
  };

  const onUpgradeClick = (raw: DataType) => {
    setEditKey(raw.key);
    setLoading(true);
    message.info("环境升级中...，此过程可能需要几分钟，请稍后");
    upgradeJupyterEnv(raw.envId).finally(() => {
      setEditKey("");
      setLoading(false);
    });
  };

  const onRestart = (raw: DataType) => {
    setEditKey(raw.key);
    setLoading(true);
    message.info("环境重启中...，此过程可能需要几分钟，请稍后");
    restartPrivateEnv(raw.envId).finally(() => {
      setEditKey("");
      setLoading(false);
    });
  };

  const onSolidLog = (raw: DataType) => {
    setEditKey(raw.key);
    setLogVisible(true);
    getEnvHistory(raw.envId);
    setEnvId(raw.envId);
    setEnvStatus(raw.envStatus);
  };

  const columns: ColumnsType<DataType> = [
    {
      title: "环境名称",
      dataIndex: "envName",
      key: "envName",
      width: 160,
      fixed: "left",
    },
    {
      title: "镜像类别",
      dataIndex: "type",
      width: 160,
      render: (type: 0 | 1) => {
        return type === 1 ? (
          <Tag color="green" bordered={false}>
            团队
          </Tag>
        ) : (
          <Tag color="blue" bordered={false}>
            个人
          </Tag>
        );
      },
    },
    {
      title: "上次固化时间",
      dataIndex: "solidDate",
      key: "solidDate",
      width: 180,
    },
    {
      title: "镜像名称",
      dataIndex: "imageName",
      key: "imageName",
      width: 240,
    },
    {
      title: "环境IP",
      dataIndex: "envIP",
      key: "envIP",
      width: 160,
    },
    {
      title: "SSH端口",
      dataIndex: "sshPort",
      key: "sshPort",
      width: 160,
    },
    // {
    //   title: "SSH代理端口",
    //   dataIndex: "sshProxyPort",
    //   key: "sshProxyPort",
    //   width: 160,
    // },
    // {
    //   title: "SSH代理IP",
    //   dataIndex: "sshProxyIp",
    //   key: "sshProxyIp",
    //   width: 160,
    // },
    {
      title: "SSH用户名",
      dataIndex: "sshUser",
      key: "sshUser",
      width: 160,
    },
    // {
    //   title: "TransMatrix版本",
    //   dataIndex: "version",
    //   key: "version",
    //   width: 160,
    // },
    {
      title: "Jupyter Server",
      dataIndex: "jupyterURL",
      key: "jupyterURL",
      ellipsis: true,
      render: (url: string) => {
        return url ? `${location.origin}${url}` : "";
      },
    },
    {
      title: "操作",
      dataIndex: "action",
      key: "action",
      width: 300,
      fixed: "right" as const,
      render: (_: any, raw: DataType) => {
        return (
          <div className={`${clsPrefix}-person-info-action`}>
            <Tooltip title="当 TransMatrix 有新的版本时，您可以通过该操作升级您的环境至最新TransMatrix版本，您自行安装的Python包升级后也会保留。">
              <Button
                type="link"
                className="text-red-400"
                disabled={
                  raw.envStatus !== 6 ||
                  (editKey === raw.key && (loading || rollbacking))
                }
                onClick={() => onUpgradeClick(raw)}
              >
                <IconFont type="shengji" />
              </Button>
            </Tooltip>

            <Divider type="vertical" />
            <Tooltip title="如果您自行在环境中安装了一些Python包，可以使用该操作固化您的环境，使这些Python包永久存在于您的环境中">
              <Button
                type="link"
                className="text-red-400"
                disabled={
                  raw.envStatus !== 6 ||
                  (editKey === raw.key && (loading || rollbacking))
                }
                onClick={() => onSolidifyClick(raw)}
              >
                <IconFont type="guhua" />
              </Button>
            </Tooltip>
            <Divider type="vertical" />
            <Tooltip title="环境重启">
              <Button
                type="link"
                className="text-red-400"
                disabled={
                  raw.envStatus !== 6 ||
                  (editKey === raw.key && (loading || rollbacking))
                }
                onClick={() => onRestart(raw)}
              >
                <IconFont type="zhongqi" />
              </Button>
            </Tooltip>
            <Divider type="vertical" />
            <Tooltip title="固化日志">
              <Button
                type="link"
                className="text-red-400"
                onClick={() => onSolidLog(raw)}
                disabled={editKey === raw.key && (loading || rollbacking)}
              >
                <IconFont type="wenjianliebiao" />
              </Button>
            </Tooltip>
          </div>
        );
      },
    },
  ];

  return (
    <Card title="环境信息" bordered={false}>
      <Table
        size="small"
        columns={columns as any}
        dataSource={getDataSource(envList)}
        scroll={{ x: 2200 }}
      />
      <SolidLog
        envStatus={envStatus}
        envId={envId}
        visible={logVisible}
        onVisibleChange={(value) => setLogVisible(value)}
      />
    </Card>
  );
});
