import { MoreOutlined } from "@ant-design/icons";
import { ResearchModule } from "@transquant/app/components/left/menu/ResearchMenu";
import { useStores as useAppStores } from "@transquant/app/hooks";
import { IMAGE_INSTANCE, paths, USER_TOKEN } from "@transquant/constants";
import { ImageInstance } from "@transquant/manage";
import { useStores as usePersonStores } from "@transquant/person/hooks";
import SolidLog from "@transquant/person/profile/info/SolidLog";
import { IconFont } from "@transquant/ui";
import { ls } from "@transquant/utils";
import { getToken } from "@transquant/utils/ajax";
import {
  Checkbox,
  Divider,
  Dropdown,
  message,
  Modal,
  Space,
  Tooltip,
  Typography,
} from "antd";
import { observer } from "mobx-react";
import { MenuClickEventHandler } from "rc-menu/lib/interface";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useStores } from "../hooks";
import UpgradeModal from "./UpgradeModal";

type DataType = ImageInstance & { key: string };

interface OperatorMenuProps {
  type?: "team" | "personal";
  data: DataType;
  onVisibleChange: (value: boolean) => void;
}

export default observer(function OperatorMenu(props: OperatorMenuProps) {
  const { data, onVisibleChange } = props;
  const {
    setImageInstance,
    imageInstance,
    onIframePathChange,
    onEnvWebSocketConnect,
    launchTeamEnv,
    shutdownTeamEnv,
    getInstallScripts4Env,
  } = useStores().imageStore;
  const { onLeftMenuSelect } = useAppStores().appStore;
  const {
    getEnvHistory,
    rollbacking,
    upgradeTeamJupyterEnv,
    solidifyTeamJupyterEnv,
  } = usePersonStores().profileStore;
  const navigate = useNavigate();

  const connectEnv = (envToken: string) => {
    const url = "/tqlab/ws/analysis";
    const ssToken = ls.getItem(USER_TOKEN);
    const newToken = getToken(ssToken, url);
    onEnvWebSocketConnect(newToken, envToken);
  };

  const toggleImage = () => {
    if (data.imageType === 2) {
      message.info("编辑器切换异常");
      return;
    }
    const token = ls.getItem(USER_TOKEN);

    onIframePathChange("");
    setImageInstance(data);

    if (data.imageType === 0) {
      connectEnv(data.token);
    }

    launchTeamEnv(data.id);

    onVisibleChange(false);
    ls.setItem(IMAGE_INSTANCE, { ...data, personalToken: token });

    onLeftMenuSelect(ResearchModule.ResearchEnv);
    navigate(paths.env);
  };

  const [closing, setClosing] = useState(false);
  let solidify = 0;
  const onEnvClose = async () => {
    setImageInstance(data);
    Modal.confirm({
      title: "关闭环境确认!",
      content: (
        <Space className="flex flex-col items-start">
          <div>是否确定关闭环境【{data.name}】?</div>
          <Checkbox
            value={solidify}
            onChange={(e) => {
              solidify = e.target.checked ? 1 : 0;
            }}
          >
            关闭前固化该环境
          </Checkbox>
        </Space>
      ),
      onOk() {
        setClosing(true);
        shutdownTeamEnv(data.id, solidify).finally(() => {
          setClosing(false);
        });
      },
    });
  };

  const [editKey, setEditKey] = useState("");
  const [solidifying, setSolidifying] = useState(false);
  const [logVisible, setLogVisible] = useState(false);
  const [envId, setEnvId] = useState(-1);
  const [envStatus, setEnvStatus] = useState(-1);
  const [envToken, setEnvToken] = useState("");
  const [scriptVisible, setScriptVisible] = useState(false);

  const disabled = solidifying || rollbacking;

  const onUpgradeClick = (raw: DataType) => {
    setScriptVisible(true);
    setEnvToken(raw.token);
    getInstallScripts4Env(raw.token);

    // setEditKey(raw.key);
    // setUpgrading(true);
    // message.info("环境升级中...，此过程可能需要几分钟，请稍后");
    // upgradeTeamJupyterEnv(raw.id).finally(() => {
    //   setEditKey("");
    //   setUpgrading(false);
    // });
  };

  const onSolidifyClick = (raw: DataType) => {
    setEditKey(raw.key);
    setSolidifying(true);
    message.info("环境固化中...，此过程可能需要几分钟，请稍后");
    solidifyTeamJupyterEnv(raw.id).finally(() => {
      setSolidifying(false);
      setEditKey("");
    });
  };

  const onSolidLog = (raw: DataType) => {
    setLogVisible(true);
    getEnvHistory(raw.id);
    setEnvId(raw.id);
    setEnvStatus(raw?.envStatus || -1);
  };

  const onItemClick: MenuClickEventHandler = async (info) => {
    switch (info.key) {
      case "upgrade":
        onUpgradeClick(data);
        break;
      case "solidify":
        onSolidifyClick(data);
        break;
      case "solidifyLog":
        onSolidLog(data);
        break;
      default:
        break;
    }
  };

  const items = [
    {
      key: "upgrade",
      disabled: data.envStatus !== 6 || (editKey === data.key && disabled),
      label: (
        <Tooltip
          title={
            editKey === data.key || disabled
              ? "仅处于‘运行中的环境可以进行升级操作’"
              : "环境升级"
          }
        >
          <Typography.Link>升级</Typography.Link>
        </Tooltip>
      ),
    },
    {
      key: "solidify",
      disabled: data.envStatus !== 6 || (editKey === data.key && disabled),
      label: (
        <Tooltip
          title={
            editKey === data.key || disabled
              ? "仅处于‘运行中’的环境可以进行固化操作"
              : "环境固化"
          }
        >
          <Typography.Link>固化</Typography.Link>
        </Tooltip>
      ),
    },
    {
      key: "solidifyLog",
      disabled: editKey === data.key && disabled,
      label: (
        <Tooltip title="固化日志">
          <Typography.Link>固化日志</Typography.Link>
        </Tooltip>
      ),
    },
  ];

  return (
    <>
      <Space>
        <Typography.Link
          disabled={data.envStatus !== 6 && data.envStatus !== 0}
          onClick={toggleImage}
        >
          <Tooltip title="打开">
            <IconFont type="dakaikongjian" />
          </Tooltip>
        </Typography.Link>
        <Divider type="vertical" />
        <Typography.Link
          onClick={onEnvClose}
          disabled={
            (+(data as any).key === imageInstance?.id && closing) ||
            data.envStatus === 0 ||
            data.envStatus === 4
          }
        >
          <Tooltip title="关闭">
            <IconFont type="shutdown" />
          </Tooltip>
        </Typography.Link>
        <Divider type="vertical" />
        <Dropdown
          menu={{ items, onClick: onItemClick }}
          overlayStyle={{ textAlign: "center" }}
        >
          <Typography.Link>
            <MoreOutlined className="rotate-90" />
          </Typography.Link>
        </Dropdown>
      </Space>
      <SolidLog
        envStatus={envStatus}
        envId={envId}
        visible={logVisible}
        onVisibleChange={(value) => setLogVisible(value)}
      />
      {scriptVisible && (
        <UpgradeModal
          visible={scriptVisible}
          onVisibleChange={setScriptVisible}
          envToken={envToken}
          upgrade={upgradeTeamJupyterEnv}
        />
      )}
    </>
  );
});
