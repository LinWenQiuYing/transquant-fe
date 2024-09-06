import { getAccess, IconFont, Permission } from "@transquant/ui";
import { DataType } from "@transquant/utils";
import {
  Divider,
  Dropdown,
  MenuProps,
  message,
  Space,
  Tooltip,
  Typography,
} from "antd";
import { observer } from "mobx-react";
import { MenuClickEventHandler } from "rc-menu/lib/interface";
import { useState } from "react";
import { Else, If, Then } from "react-if";
import { useLocation, useNavigate } from "react-router-dom";
import { useStores } from "../../hooks";
import { WorkflowDefinitionItem } from "../../types";
import StartModal from "./StartModal";
import TimeModal from "./TimeModal";
import VersionModal from "./VersionModal";

interface OperatorMenuProps {
  data: DataType<WorkflowDefinitionItem>;
}

export default observer(function OperatorMenu(props: OperatorMenuProps) {
  const { data } = props;
  const state = data.status;
  const { schedule } = data;
  const [versionVisible, setVersionVisible] = useState(false);
  const [startVisible, setStartVisible] = useState(false);
  const [timeVisible, setTimeVisible] = useState(false);
  const { pathname } = useLocation();
  const navigate = useNavigate();

  const {
    deleteWorkflowDefinition,
    getWorkflowDefinition,
    operateWorkflowDefinition,
    operateWorkflowDefinitionTime,
  } = useStores().projectManageStore;

  const onRun = () => {
    setStartVisible(true);
  };
  const onTime = () => {
    setTimeVisible(true);
  };

  const onOperate = (type: "ONLINE" | "OFFLINE") => {
    operateWorkflowDefinition(data.code, type);
  };

  const onTimeOperate = (type: "online" | "offline") => {
    operateWorkflowDefinitionTime(data.schedule?.id, type);
  };

  const onVersion = () => {
    setVersionVisible(true);
  };

  const onDelete = async () => {
    await deleteWorkflowDefinition(data.code)
      .then(() => {
        getWorkflowDefinition();
        message.success("删除成功");
      })
      .catch(() => {});
  };

  const items: MenuProps["items"] = [
    {
      key: "edit",
      label: "编辑",
      disabled: !getAccess("B100107") || state === "ONLINE",
    },
    {
      key: "version",
      label: "版本信息",
      disabled: !getAccess("B100109"),
    },
    {
      key: "delete",
      label: "删除",
      disabled: !getAccess("B100108") || state === "ONLINE",
    },
  ];

  const onItemClick: MenuClickEventHandler = async (info) => {
    switch (info.key) {
      case "edit":
        navigate(`${pathname}/detail/${data.code}`);
        break;
      case "version":
        onVersion();
        break;
      case "delete":
        onDelete();
        break;
      default:
        break;
    }
  };

  return (
    <Space>
      <Tooltip title="运行">
        <Typography.Link
          onClick={() => onRun()}
          disabled={!getAccess("B100112") || state === "OFFLINE"}
        >
          <IconFont type="yunhang" />
        </Typography.Link>
      </Tooltip>
      <Divider type="vertical" />
      <If condition={data.status === "ONLINE"}>
        <Then>
          <Permission code="B100111" disabled>
            <Tooltip title="下线">
              <Typography.Link onClick={() => onOperate("OFFLINE")}>
                <IconFont type="xiaxian" />
              </Typography.Link>
            </Tooltip>
          </Permission>
        </Then>
        <Else>
          <Permission code="B100110" disabled>
            <Tooltip title="上线">
              <Typography.Link onClick={() => onOperate("ONLINE")}>
                <IconFont type="shangxian" />
              </Typography.Link>
            </Tooltip>
          </Permission>
        </Else>
      </If>
      <Divider type="vertical" />
      <Tooltip title="定时运行">
        <Typography.Link
          onClick={() => onTime()}
          disabled={!getAccess("B100115")}
        >
          <IconFont type="dingshiyunhang" />
        </Typography.Link>
      </Tooltip>
      <Divider type="vertical" />
      <If condition={data.timeStatus === "ONLINE"}>
        <Then>
          <Tooltip title="定时下线">
            <Typography.Link
              onClick={() => onTimeOperate("offline")}
              disabled={
                !getAccess("B100114") || !schedule || data.status !== "ONLINE"
              }
            >
              <IconFont type="dingshixiaxian" />
            </Typography.Link>
          </Tooltip>
        </Then>
        <Else>
          <Tooltip title="定时上线">
            <Typography.Link
              onClick={() => onTimeOperate("online")}
              disabled={
                !getAccess("B100113") || !schedule || data.status !== "ONLINE"
              }
            >
              <IconFont type="dingshishangxian" />
            </Typography.Link>
          </Tooltip>
        </Else>
      </If>
      <Divider type="vertical" />
      <Tooltip title="更多">
        <Dropdown
          menu={{ items, onClick: onItemClick }}
          overlayClassName="workflow-define-operator-menu-dropdown"
        >
          <Typography.Link>
            <IconFont type="gengduo" />
          </Typography.Link>
        </Dropdown>
      </Tooltip>
      {versionVisible && (
        <VersionModal
          visible={versionVisible}
          onVisibleChange={setVersionVisible}
          code={data.code}
          version={data.version}
        />
      )}
      {startVisible && (
        <StartModal
          visible={startVisible}
          onVisibleChange={setStartVisible}
          data={data}
        />
      )}
      {timeVisible && (
        <TimeModal
          visible={timeVisible}
          onVisibleChange={setTimeVisible}
          data={data}
        />
      )}
    </Space>
  );
});
