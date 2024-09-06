import { clsPrefix, paths } from "@transquant/constants";
import { IconFont } from "@transquant/ui";
import { useMount } from "ahooks";
import { Menu } from "antd";
import { observer } from "mobx-react-lite";
import { useNavigate } from "react-router-dom";
import { MenuType, useMenu, useStores } from "../../../hooks";
// import Tools from "./tools";
import "./index.less";

export enum DataEngineeringModule {
  SourceCenter = "sourceCenter",
  DataManage = "dataManage",
  ProjectManage = "projectManage",
  EnvironmentManage = "environmentManage",
}

const items: MenuType[] = [
  {
    label: "源中心",
    key: DataEngineeringModule.SourceCenter,
    icon: <IconFont type="shujuyuan" />,
    code: "data_source",
  },
  {
    label: "文件管理",
    key: DataEngineeringModule.DataManage,
    icon: <IconFont type="wenjianguanli" />,
    code: "etl_file",
  },
  {
    label: "项目管理",
    key: DataEngineeringModule.ProjectManage,
    icon: <IconFont type="xiangmuguanli" />,
    code: "etl_project",
  },
  {
    label: "环境管理",
    key: DataEngineeringModule.EnvironmentManage,
    icon: <IconFont type="huanjingguanli" />,
    code: "etl_env",
  },
];

export default observer(function DataEngineeringMenu() {
  const { appStore } = useStores();
  const { activeMenu, onLeftMenuSelect } = appStore;
  const navigate = useNavigate();
  const menus = useMenu(items);

  useMount(() => {
    navigate(paths.source);
    onLeftMenuSelect(DataEngineeringModule.SourceCenter);
  });

  const onMenuSelect = ({ key }: { key: string }) => {
    if (!key) return;

    switch (key) {
      case DataEngineeringModule.SourceCenter:
        navigate(paths.source);
        break;
      case DataEngineeringModule.DataManage:
        navigate(paths.dataManage);
        break;
      case DataEngineeringModule.ProjectManage:
        navigate(paths.projectManage);
        break;
      case DataEngineeringModule.EnvironmentManage:
        navigate(paths.environmentManage);
        break;
      default:
        break;
    }

    onLeftMenuSelect(key as DataEngineeringModule);
  };

  return (
    <Menu
      mode="inline"
      onSelect={onMenuSelect}
      className={`${clsPrefix}-left-sider-menu`}
      selectedKeys={[activeMenu]}
      style={{ height: "calc(100vh - 260px)" }}
      items={menus}
    />
  );
});
