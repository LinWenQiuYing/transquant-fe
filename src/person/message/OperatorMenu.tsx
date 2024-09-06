import { FileSearchOutlined } from "@ant-design/icons";
import { ManageCenterModule } from "@transquant/app/components/left/menu/ManageMenu";
import { PersonalModule } from "@transquant/app/components/left/menu/PersonMenu";
import { ResearchModule } from "@transquant/app/components/left/menu/ResearchMenu";
import { useStores as useAppStores } from "@transquant/app/hooks";
import { DataType } from "@transquant/utils";
import { Space, Tooltip, Typography } from "antd";
import { observer } from "mobx-react";
import { useNavigate } from "react-router";
import { FactorResearchTabEnum } from "../../space/group/factor/TabView";
import { StrategyResearchTabEnum } from "../../space/group/strategy/TabView";
import { useStores as useSpaceStore } from "../../space/hooks";
import { useStores } from "../hooks";
import { RecordTab } from "../publish/TabView";
import { Message } from "../types";
import { strategy } from "./event";

interface OperatorMenuProps {
  data: DataType<Message>;
}

export default observer(function OperatorMenu(props: OperatorMenuProps) {
  const { data } = props;
  const { updateNotificationRead } = useStores().messageStore;
  const { onActiveTabChange } = useStores().publishStore;
  const navigate = useNavigate();
  const { onLeftMenuSelect, onActiveMenuChange } = useAppStores().appStore;
  const { onStrategyTabChange } = useSpaceStore().strategyResearchStore;
  const { onFactorTabChange } = useSpaceStore().factorResearchStore;
  const {
    onGroupFactorTabChange,
    getFactorQuartzTeamJob,
    onFactorSelectedTeamChange,
  } = useSpaceStore().groupFactorStore;
  const {
    onGroupStrategyTabChange,
    getStrategyQuartzTeamJob,
    onStrategySelectedTeamChange,
  } = useSpaceStore().groupStrategyStore;
  const { onCurrentTeamIdChange, getShareSpace } = useSpaceStore().shareStore;

  const handleCheckMessage = () => {
    if (!data.event) return;
    updateNotificationRead(data.id);
    const event = strategy(data);
    if (!event) return;
    event.handler((event) => {
      onActiveMenuChange(event.menu);
      setTimeout(() => {
        onLeftMenuSelect(PersonalModule.PublishManage);
        navigate(event.path);
        if (event.type === 3) {
          onActiveTabChange(RecordTab.Approve);
        }

        if (event.type === 4) {
          onLeftMenuSelect(ResearchModule.Strategy);
          onStrategyTabChange(StrategyResearchTabEnum.IncreTracking);
        }

        if (event.type === 5) {
          onLeftMenuSelect(ResearchModule.GroupStrategy);
          onStrategySelectedTeamChange({ id: +data.data, name: "" });
          onGroupStrategyTabChange(StrategyResearchTabEnum.IncreTracking);
          getStrategyQuartzTeamJob({}, parseInt(data.data));
        }

        if (event.type === 6) {
          onLeftMenuSelect(ResearchModule.Factor);
          onFactorTabChange(FactorResearchTabEnum.IncreTracking);
        }

        if (event.type === 7) {
          onLeftMenuSelect(ResearchModule.GroupFactor);
          onFactorSelectedTeamChange({ id: +data.data, name: "" });
          onGroupFactorTabChange(FactorResearchTabEnum.IncreTracking);
          getFactorQuartzTeamJob({}, parseInt(data.data));
        }

        if (event.type === 10 || event.type === 11) {
          onLeftMenuSelect(ResearchModule.ShareSpace);
          onCurrentTeamIdChange(+data.data);
          getShareSpace(+data.data);
        }
        if (event.type === 17) {
          onLeftMenuSelect(ManageCenterModule.EnvManage);
        }
      });
    });
  };

  const getDisableStatus = () => {
    /** 发布通知（设为审核人员）、协作空间 */
    return (
      (data.type === 0 && data.event === 0) ||
      data.type === 3 ||
      !strategy(data)
    );
  };

  return (
    <>
      <Space>
        <Tooltip title="查看">
          <Typography.Link
            onClick={() => handleCheckMessage()}
            disabled={getDisableStatus()}
          >
            <FileSearchOutlined />
          </Typography.Link>
        </Tooltip>
      </Space>
    </>
  );
});
