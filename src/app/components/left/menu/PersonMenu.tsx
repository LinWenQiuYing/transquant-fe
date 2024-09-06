import { clsPrefix, paths } from "@transquant/constants";
import { IconFont } from "@transquant/ui";
import { useMount } from "ahooks";
import { Menu } from "antd";
import { observer } from "mobx-react-lite";
import { useNavigate } from "react-router-dom";
import { MenuType, useStores } from "../../../hooks";
// import Tools from "./tools";
import "./index.less";

export enum PersonalModule {
  PersonalInformation = "personalInformation",
  PublishManage = "publishManage",
  LabelManage = "labelManage",
  MessageNotice = "messageNotice",
}

const items: MenuType[] = [
  {
    label: "个人信息",
    key: PersonalModule.PersonalInformation,
    icon: <IconFont type="gerenxinxi" />,
    code: "person",
  },
  {
    label: "发布管理",
    key: PersonalModule.PublishManage,
    icon: <IconFont type="fabuguanli" />,
    code: "publish",
  },
  {
    label: "标签管理",
    key: PersonalModule.LabelManage,
    icon: <IconFont type="biaoqianguanli" />,
    code: "label",
  },
  {
    label: "消息通知",
    key: PersonalModule.MessageNotice,
    icon: <IconFont type="xiaoxitongzhi" />,
    code: "message",
  },
];

export default observer(function ResearchMenu() {
  const { appStore } = useStores();
  const { activeMenu, onLeftMenuSelect } = appStore;
  const navigate = useNavigate();
  // TODO: 个人中心暂时不做权限处理
  // const menus = useMenu(items);

  useMount(() => {
    navigate(paths.person);
    onLeftMenuSelect(PersonalModule.PersonalInformation);
  });

  const onMenuSelect = ({ key }: { key: string }) => {
    if (!key) return;

    switch (key) {
      case PersonalModule.PersonalInformation:
        navigate(paths.person);
        break;
      case PersonalModule.PublishManage:
        navigate(paths.publish);
        break;
      case PersonalModule.LabelManage:
        navigate(paths.label);
        break;
      case PersonalModule.MessageNotice:
        navigate(paths.message);
        break;
      default:
        break;
    }

    onLeftMenuSelect(key as PersonalModule);
  };

  return (
    <Menu
      mode="inline"
      onSelect={onMenuSelect}
      className={`${clsPrefix}-left-sider-menu`}
      selectedKeys={[activeMenu]}
      style={{ height: "calc(100vh - 260px)" }}
      items={items}
    />
  );
});
