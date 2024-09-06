import { CloseOutlined, PoweroffOutlined } from "@ant-design/icons";
import { ManageCenterModule } from "@transquant/app/components/left/menu/ManageMenu";
import { PersonalModule } from "@transquant/app/components/left/menu/PersonMenu";
import { ResearchModule } from "@transquant/app/components/left/menu/ResearchMenu";
import { useStores as useAppStores } from "@transquant/app/hooks";
import { ImageInstance } from "@transquant/app/types";
import SolidifyModal from "@transquant/common/solidify-modal";
import { clsPrefix, paths } from "@transquant/constants";
import { IconFont } from "@transquant/ui";
import { ajax } from "@transquant/utils";
import { Avatar, Modal, Spin } from "antd";
import { observer } from "mobx-react";
import { useState } from "react";
import { When } from "react-if";
import { useNavigate } from "react-router-dom";
import { FactorResearchTabEnum } from "../../space/group/factor/TabView";
import { StrategyResearchTabEnum } from "../../space/group/strategy/TabView";
import { useStores as useSpaceStore } from "../../space/hooks";
import { useStores } from "../hooks";
import { RecordTab } from "../publish/TabView";
import { Message } from "../types";
import { strategy } from "./event";
import "./modal.less";

interface MessageModalProps {
  open: boolean;
  onVisibleChange: (value: boolean) => void;
}

export default observer(function MessageModal(props: MessageModalProps) {
  const { open, onVisibleChange } = props;
  const { userInfo } = useStores().profileStore;
  const { UnReadedMessages, readAll, listLoading, updateNotificationRead } =
    useStores().messageStore;
  const { onActiveTabChange } = useStores().publishStore;
  const {
    onLeftMenuSelect,
    onActiveMenuChange,
    logout: _logout,
  } = useAppStores().appStore;
  const navigate = useNavigate();
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
  const { onEnvWebSocketClose } = useSpaceStore().imageStore;
  const [solidifyVisible, setSolidifyVisible] = useState(false);

  // 关闭弹窗
  const onCancel = () => {
    onVisibleChange(false);
  };

  // 全部已读
  const onReadAll = () => {
    readAll();
  };

  const checkMessage = (item: Message) => {
    onCancel();
    updateNotificationRead(item.id);
    const event = strategy(item);
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
          onStrategySelectedTeamChange({ id: +item.data, name: "" });
          onGroupStrategyTabChange(StrategyResearchTabEnum.IncreTracking);
          getStrategyQuartzTeamJob({}, parseInt(item.data));
        }

        if (event.type === 6) {
          onLeftMenuSelect(ResearchModule.Factor);
          onFactorTabChange(FactorResearchTabEnum.IncreTracking);
        }

        if (event.type === 7) {
          onLeftMenuSelect(ResearchModule.GroupFactor);
          onFactorSelectedTeamChange({ id: +item.data, name: "" });
          onGroupFactorTabChange(FactorResearchTabEnum.IncreTracking);
          getFactorQuartzTeamJob({}, parseInt(item.data));
        }
        if (event.type === 17) {
          onLeftMenuSelect(ManageCenterModule.EnvManage);
        }
      });
    });
  };

  const logout = (solidify: number) => {
    onEnvWebSocketClose();
    _logout(solidify).then(() => {
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

  return (
    <>
      <Modal
        open={open}
        mask={false}
        maskClosable
        footer={null}
        destroyOnClose
        closable={false}
        onCancel={onCancel}
        width={413}
        className={`${clsPrefix}-layout-avatar-modal`}
      >
        <div className={`${clsPrefix}-layout-avatar-modal-title`}>
          <div className="left">
            <Avatar
              icon={<IconFont type="logo_TransQuant" />}
              className="left-img"
            />
            <div className="left-title">{userInfo?.userInfo.user.realName}</div>
          </div>
          <div className="right" onClick={preHandle}>
            <PoweroffOutlined className="right-img" />
            <div className="right-title">退出登录</div>
          </div>
        </div>
        <Spin tip="正在查询" spinning={listLoading}>
          <When condition={UnReadedMessages.length}>
            <div className={`${clsPrefix}-layout-avatar-modal-content`}>
              {UnReadedMessages.map((item) => (
                <div key={item.id} className="content">
                  <div className="left">
                    <div className="left-top">{item.message}</div>
                    <div className="left-bottom">{item.createTime}</div>
                  </div>
                  <div className="right">
                    <div onClick={() => checkMessage(item)} className="view">
                      {strategy(item) && <span>查看</span>}
                    </div>
                    <CloseOutlined
                      className="img"
                      onClick={() => updateNotificationRead(item.id)}
                    />
                  </div>
                </div>
              ))}
            </div>
          </When>
          <When condition={!UnReadedMessages.length}>
            <div className={`${clsPrefix}-layout-avatar-modal-content`}>
              <div className="no-content">暂无未读消息</div>
            </div>
          </When>
        </Spin>

        <div className={`${clsPrefix}-layout-avatar-modal-bottom`}>
          <div className="left" onClick={onReadAll}>
            全部已读
          </div>
          <div
            className="right"
            onClick={() => {
              onVisibleChange(false);
              onActiveMenuChange("personal");
              setTimeout(() => {
                navigate(paths.message);
                onLeftMenuSelect(PersonalModule.MessageNotice);
              }, 0);
            }}
          >
            更多
          </div>
        </div>
      </Modal>
      {solidifyVisible && (
        <SolidifyModal
          onOk={logout}
          visible={solidifyVisible}
          onVisibleChange={(value) => setSolidifyVisible(value)}
        />
      )}
    </>
  );
});
