import { ExportOutlined } from "@ant-design/icons";
import SolidifyModal from "@transquant/common/solidify-modal";
import { IMAGE_INSTANCE, paths } from "@transquant/constants";
import { ImageInstance } from "@transquant/manage";
import { useStores as useSpaceStores } from "@transquant/space/hooks";
import ImageDrawer from "@transquant/space/image";
import { IconFont } from "@transquant/ui";
import { ajax, Esc, ls } from "@transquant/utils";
import { useMount } from "ahooks";
import { Button, Space } from "antd";
import { observer } from "mobx-react";
import { useCallback, useState } from "react";
import { useNavigate } from "react-router";
import { useStores } from "../../hooks";
import { ModuleType } from "./NavMenu";
import TokenModal from "./TokenModal";

interface ToolBoxProps {
  activeModule?: Exclude<ModuleType, "manage">;
}

const hotKey = { key: "q", ctrlKey: true };

export default observer(function ToolBox(props: ToolBoxProps) {
  const { activeModule = "research" } = props;
  const { logout: _logout } = useStores().appStore;
  const { imageInstance, onEnvWebSocketClose } = useSpaceStores().imageStore;

  const navigate = useNavigate();
  const [tokenVisible, setTokenVisible] = useState(false);
  const [imageVisible, setImageVisible] = useState(false);
  const [solidifyVisible, setSolidifyVisible] = useState(false);

  const globalHotKeyHandle = useCallback((event: KeyboardEvent) => {
    if (event.key === Esc.key) {
      setTokenVisible(false);
      return;
    }

    let needShow = true;
    Object.entries(hotKey).forEach(([param, value]) => {
      if (event[param as keyof KeyboardEvent] !== value) {
        needShow = false;
      }
    });

    if (needShow) {
      setTokenVisible(true);
    }
  }, []);

  useMount(() => {
    window.addEventListener("keydown", globalHotKeyHandle);

    return () => {
      window.removeEventListener("keydown", globalHotKeyHandle);
    };
  });

  const onImageClick = () => {
    setImageVisible(true);
  };

  const onDocumentClick = () => {
    // navigate(paths.doc);
    window.open(paths.doc);
  };

  const researchToolbox = (
    <Space direction="vertical" className="w-full">
      <Button
        icon={<IconFont type="jingxiangqiehuan" />}
        block
        onClick={onImageClick}
      >
        <span>
          {imageInstance?.name ||
            ls.getItem(IMAGE_INSTANCE)?.name ||
            "环境选择"}
        </span>
      </Button>
      {/* <Button icon={<IconFont type="dingshirenwu" />} block>
        定时任务
      </Button> */}
      <Button
        icon={<IconFont type="bangzhuwendang" />}
        block
        onClick={onDocumentClick}
      >
        帮助文档
      </Button>
      {/* <Button
        icon={<IconFont type="yingbi" />}
        block
        onClick={() => setTokenVisible(true)}
      >
        获取token
      </Button> */}
    </Space>
  );

  const logout = (solidify: number) => {
    _logout(solidify).then(() => {
      onEnvWebSocketClose();
      navigate("/login");
    });
  };

  const preHandle = async () => {
    let result = await ajax<ImageInstance[]>({
      url: `/tqlab/k8s/getPrivateEnvList`,
    });

    result = result.filter((item) => item.envStatus !== 0);
    if (!result.length) {
      return logout(0);
    }

    setSolidifyVisible(true);
  };

  const personalToolbox = (
    <Space direction="vertical" className="w-full">
      <Button
        icon={<ExportOutlined className="rotate-180" />}
        block
        onClick={preHandle}
      >
        退出登录
      </Button>
    </Space>
  );

  const toolboxMap = {
    research: researchToolbox,
    personal: personalToolbox,
  };

  return (
    <div>
      {activeModule === "research" && (
        <h3 className="mb-5 text-gray-700">工具箱</h3>
      )}
      {toolboxMap[activeModule]}
      <TokenModal
        visible={tokenVisible}
        onVisibleChange={(value) => setTokenVisible(value)}
      />
      <ImageDrawer
        visible={imageVisible}
        onVisibleChange={(value) => setImageVisible(value)}
      />
      {solidifyVisible && (
        <SolidifyModal
          onOk={logout}
          visible={solidifyVisible}
          onVisibleChange={(value) => setSolidifyVisible(value)}
        />
      )}
    </div>
  );
});
