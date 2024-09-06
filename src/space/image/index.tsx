import { CloseOutlined } from "@ant-design/icons";
import { useStores } from "@transquant/app/hooks";
import { clsPrefix } from "@transquant/constants";
import { useStores as usePersonStores } from "@transquant/person/hooks";
import { useStores as useSpaceStores } from "@transquant/space/hooks";
import { Drawer, Space } from "antd";
import { observer } from "mobx-react";
import { useMemo } from "react";
import "./index.less";
import InstallModal from "./InstallModal";
import TabView from "./TabView";

interface ImageProps {
  visible: boolean;
  onVisibleChange: (visible: boolean) => void;
}

export default observer(function Image(props: ImageProps) {
  const { visible, onVisibleChange } = props;

  const { collapsed } = useStores().appStore;
  const { installVisible, installToken, onInstallVisibleChange, installType } =
    useSpaceStores().imageStore;
  const { upgradeJupyterEnv, upgradeTeamJupyterEnv } =
    usePersonStores().profileStore;

  const upgrade = useMemo(() => {
    return installType === "personal"
      ? upgradeJupyterEnv
      : upgradeTeamJupyterEnv;
  }, [installType]);

  return (
    <>
      <Drawer
        className={`${clsPrefix}-image-drawer`}
        style={{
          left: collapsed ? 0 : 280,
          width: `calc(100% - ${collapsed ? 0 : 280}px)`,
          transition: "all 0.3s",
        }}
        height={400}
        placement="bottom"
        onClose={() => onVisibleChange(false)}
        closable={false}
        rootClassName={`${clsPrefix}-image-drawer-root`}
        maskStyle={{ marginLeft: 280 }}
        open={visible}
        zIndex={15}
        destroyOnClose
        extra={
          <Space>
            <span
              className={`${clsPrefix}-image-drawer-close`}
              onClick={() => onVisibleChange(false)}
            >
              <CloseOutlined />
            </span>
          </Space>
        }
      >
        <TabView onVisibleChange={(value: boolean) => onVisibleChange(value)} />
      </Drawer>

      <InstallModal
        visible={installVisible}
        onVisibleChange={onInstallVisibleChange}
        envToken={installToken}
        upgrade={upgrade}
      />
    </>
  );
});
