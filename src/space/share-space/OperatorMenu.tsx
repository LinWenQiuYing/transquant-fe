import { paths } from "@transquant/constants";
import { getAccess, IconFont } from "@transquant/ui";
import { Divider, Space, Tooltip, Typography } from "antd";
import { observer } from "mobx-react";
import { useState } from "react";
import { useStores } from "../hooks";
import { ShareItem } from "../types";
import ShareModal from "./ShareModal";

declare global {
  interface Window {
    _token: string;
    _childWindow: Map<string, Window | null>;
  }
}

export default observer(function OperatorMenu(props: { data: ShareItem }) {
  const { data } = props;
  const {
    currentTeamId,
    getMemberListByTeam,
    getAllImageList,
    getFactorStrategySysTemplate,
    launchShareEnvInstance,
    shutdownShareEnv,
    getEnvTemplates,
  } = useStores().shareStore;
  const [shareVisible, setShareVisible] = useState(false);

  const onEdit = async () => {
    await getEnvTemplates();
    await getMemberListByTeam(currentTeamId || -1);
    await getAllImageList();
    await getFactorStrategySysTemplate(currentTeamId || -1);
    setShareVisible(true);
  };

  const onDestroy = () => {
    shutdownShareEnv(data.token);
  };

  const onShareSpaceOpen = () => {
    const childWindow = window.open(
      `${paths.shareSpace}/${data.id}?name=${data.name}`,
      data.token
    );

    if (childWindow) {
      childWindow._token = data.token;
    }

    if (!window._childWindow) {
      window._childWindow = new Map();
    }
    window._childWindow.set(data.token, childWindow);

    setTimeout(() => {
      launchShareEnvInstance(data.id);
    }, 10 * 1000);
  };

  const isExist = window._childWindow?.has(data.token);

  return (
    <>
      <Space>
        <Tooltip title="打开协作空间">
          <Typography.Link
            onClick={onShareSpaceOpen}
            /** 未启动或运行中 才可以打开 */
            disabled={
              !getAccess("B050101") ||
              isExist ||
              !data.canOpen ||
              (data.status !== 0 && data.status !== 6)
            }
          >
            <IconFont type="dakaikongjian" />
          </Typography.Link>
        </Tooltip>
        <Divider type="vertical" />
        <Tooltip title="关闭协作空间">
          <Typography.Link
            onClick={onDestroy}
            /** 运行中 才可以打开 */
            disabled={
              !getAccess("B050102") || !data.canOpen || data.status !== 6
            }
          >
            <IconFont type="shutdown" />
          </Typography.Link>
        </Tooltip>
        <Divider type="vertical" />
        <Tooltip title="编辑">
          <Typography.Link onClick={onEdit} disabled={!getAccess("B050103")}>
            <IconFont type="bianji" />
          </Typography.Link>
        </Tooltip>
      </Space>
      {shareVisible && (
        <ShareModal
          title="编辑协作空间"
          data={data}
          visible={shareVisible}
          onVisibleChange={(value) => setShareVisible(value)}
        />
      )}
    </>
  );
});
