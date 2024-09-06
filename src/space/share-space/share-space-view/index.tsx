/* eslint-disable camelcase */
import { DownOutlined, QuestionCircleOutlined } from "@ant-design/icons";
import { antdClsPrefix, clsPrefix, PUBLICURL } from "@transquant/constants";
import { useStores as useSpaceStore } from "@transquant/space/hooks";
import UpgradeModal from "@transquant/space/image/UpgradeModal";
import { useTheme } from "@transquant/utils";
import { useMount } from "ahooks";
import {
  Badge,
  Button,
  Card,
  ConfigProvider,
  Dropdown,
  FloatButton,
  MenuProps,
  message,
  Modal,
  Space,
  Tooltip,
} from "antd";
import enUS from "antd/locale/en_US";
import zhCN from "antd/locale/zh_CN";
import "dayjs/locale/zh-cn";
import { observer } from "mobx-react";
import { useState } from "react";
import { useParams, useSearchParams } from "react-router-dom";
import { useStores } from "../../hooks";
import CommitModal from "./CommitModal";
import Conflict from "./Conflict";
import GitLogModal from "./GitLogModal";
import IFrame from "./IFrame";
import "./index.less";

declare global {
  interface Window {
    _token: string;
    _childWindow: Map<string, Window | null>;
  }
}

export default observer(function ShareSpaceView() {
  const {
    onWebsocketClose,
    restartShareEnv,
    upgradeShareEnv,
    solidifyShareEnv,
    getConflict,
    getRemoteUpdate,
    hasUpdate,
    hasConflict,
    updateCode,
    pushCode,
    getLog,
    switchEnvEditor,
    checkVSCode,
  } = useStores().shareStore;
  const { getInstallScripts4Env } = useSpaceStore().imageStore;

  const [url, setUrl] = useState("");
  const [token, setToken] = useState("");
  const [conflictVisible, setConflictVisible] = useState(false);
  const [commitVisible, setCommitVisible] = useState(false);
  const [gitlogVisible, setGitlogVisible] = useState(false);
  const params = useParams();
  const [searchParams] = useSearchParams();

  const shareId = `${params.shareId}`;

  const confirm = () => {
    setUrl("");
    Modal.confirm({
      icon: null,
      title: "启动中...",
      content: (
        <div style={{ textAlign: "center" }}>
          <img
            src={`${PUBLICURL}/images/loading.gif`}
            alt="loading"
            className="inline-block"
          />
          <p>正在启动空间，请稍等...</p>
        </div>
      ),
      footer: null,
    });
  };

  let destroy = true;

  useMount(() => {
    confirm();
    getRemoteUpdate(`${params.shareId}`);
    window.addEventListener("message", function (e) {
      if (e.data.type === "expired") {
        destroy = false;
        window.close();
      }

      if (e.data.type === "launch") {
        setUrl(e.data.url);
        setToken(e.data.token);
        Modal.destroyAll();
      }
    });
  });

  window.onbeforeunload = function () {
    onWebsocketClose(destroy, window._token);
  };

  const [scriptVisible, setScriptVisible] = useState(false);

  const items: MenuProps["items"] = [
    {
      key: "1",
      label: "固化环境",
      onClick() {
        solidifyShareEnv(window._token);
        confirm();
      },
    },
    {
      key: "2",
      label: "重启环境",
      onClick() {
        restartShareEnv(window._token);
        confirm();
      },
    },
    {
      key: "3",
      label: "环境升级",
      onClick() {
        setScriptVisible(true);
        getInstallScripts4Env(window._token);
        // confirm();
      },
    },
  ];

  const onUpdateCode = async () => {
    let list = await getConflict(`${params.shareId}`);
    if (list.length) {
      setConflictVisible(true);
    } else {
      await updateCode(shareId);
      list = await getConflict(`${params.shareId}`);
      if (list.length) {
        setConflictVisible(true);
      }
    }
  };

  const onPushCode = async () => {
    const list = await getConflict(`${params.shareId}`);
    if (list.length) {
      setConflictVisible(true);
    } else {
      pushCode(shareId);
    }
  };

  const onCommitCode = async () => {
    const list = await getConflict(`${params.shareId}`);
    if (list.length) {
      setConflictVisible(true);
    } else {
      setCommitVisible(true);
    }
  };

  const onLogClick = async () => {
    await getLog(shareId);
    setGitlogVisible(true);
  };

  const imageType = url.includes("/tqcode/") ? 1 : 0;

  const extraEl = (
    <Space>
      <Badge dot={hasUpdate} style={{ width: 10, height: 10 }}>
        <Button onClick={onUpdateCode} disabled={hasConflict}>
          更新
        </Button>
      </Badge>
      <Button disabled={hasConflict} onClick={onPushCode}>
        推送
      </Button>
      <Button disabled={hasConflict} onClick={onCommitCode}>
        提交
      </Button>
      <Button onClick={onLogClick}>日志</Button>
      <Dropdown menu={{ items }}>
        <Button type="primary">
          环境操作 <DownOutlined />
        </Button>
      </Dropdown>
    </Space>
  );

  const { theme } = useTheme();

  const onConflictClick = () => {
    getConflict(`${params.shareId}`);
    setConflictVisible(true);
  };

  const onImageChange = async () => {
    const hasVscode = (await checkVSCode(token || "")) as any;

    if (!hasVscode) {
      return message.info(
        "当前环境仅有jupyterlab编辑器，如需vscode编辑器，请联系管理员"
      );
    }

    Modal.confirm({
      title: "切换编辑器确认",
      content: `是否确定切换为${
        imageType === 0 ? "vscode" : "jupyter"
      }编辑器？`,
      onOk() {
        confirm();
        switchEnvEditor({
          envToken: token,
          editorType: imageType === 0 ? 1 : 0,
        }).then((data) => {
          if (data.imageType === 0) {
            setUrl(`/tq/${data.ip}/${data.port}/?a=a&token=${data.token}`);
          }
          if (data.imageType === 1) {
            setUrl(`/tqcode/${data.ip}/${data.port}/?folder=/root/workspace`);
          }

          if (data.imageType === 2) {
            message.info("编辑器切换异常");
          }
          Modal.destroyAll();
          message.success(
            `已成功切换为${imageType === 1 ? "jupyter" : "vscode"}编辑器`
          );
        });
      },
    });
  };

  return (
    <ConfigProvider
      prefixCls={antdClsPrefix}
      theme={theme}
      locale={theme.lang === "zh" ? zhCN : enUS}
    >
      <div className={`${clsPrefix}-share-space-view`}>
        {url && (
          <Card
            title={searchParams.get("name")}
            style={{ height: "100%" }}
            extra={extraEl}
          >
            <Tooltip
              title={`切换${imageType === 0 ? "vscode" : "jupyter"}编辑器`}
            >
              <div
                onClick={onImageChange}
                className="absolute flex items-center justify-between p-2 text-red-600 duration-75 bg-white rounded-l-full cursor-pointer top-1/4 -right-10 hover:right-0"
              >
                <img
                  className="mr-1"
                  src={`${PUBLICURL}/images/${
                    imageType === 0 ? "vscode.svg" : "jupyter.svg"
                  }`}
                  alt="icon"
                />
                切换
              </div>
            </Tooltip>

            <IFrame path={url} />
            <FloatButton
              icon={<QuestionCircleOutlined />}
              shape="square"
              type="primary"
              style={{ right: 0 }}
              onClick={onConflictClick}
            />
            {conflictVisible && (
              <Conflict
                shareId={params.shareId || ""}
                visible={conflictVisible}
                onVisibleChange={(value) => setConflictVisible(value)}
              />
            )}
            {commitVisible && (
              <CommitModal
                shareId={params.shareId || ""}
                visible={commitVisible}
                onVisibleChange={(value) => setCommitVisible(value)}
              />
            )}
            {gitlogVisible && (
              <GitLogModal
                visible={gitlogVisible}
                onVisibleChange={(value) => setGitlogVisible(value)}
                shareId={params.shareId || ""}
              />
            )}
          </Card>
        )}
      </div>
      {scriptVisible && (
        <UpgradeModal
          envToken={window._token}
          visible={scriptVisible}
          onVisibleChange={setScriptVisible}
          upgrade={upgradeShareEnv}
        />
      )}
    </ConfigProvider>
  );
});
