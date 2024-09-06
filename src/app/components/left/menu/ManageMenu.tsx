import { clsPrefix, paths } from "@transquant/constants";
import { IconFont } from "@transquant/ui";
import { useMount } from "ahooks";
import { Menu } from "antd";
import { observer } from "mobx-react-lite";
import { useNavigate } from "react-router-dom";
import { MenuType, useMenu, useStores } from "../../../hooks";
// import Tools from "./tools";
import "./index.less";

export enum ManageCenterModule {
  UserManage = "userManage",
  UserGroupManage = "userGroupManage",
  OrganizationManage = "organizationManage",
  ApprovalManage = "approvalManage",
  EnvManage = "envManage",
  AuditLog = "auditLog",
  SystemSetting = "systemSetting",
  DataManage = "dataManage",
  DataSourceManage = "dataSourceManage",
  EmpowerManage = "empowerManage",
}
const items: MenuType[] = [
  {
    key: ManageCenterModule.UserManage,
    label: "用户管理",
    icon: <IconFont type="yonghuguanli" />,
    code: "user",
  },
  {
    key: ManageCenterModule.UserGroupManage,
    label: "用户组管理",
    icon: <IconFont type="yonghuzuguanli" />,
    code: "group",
  },
  {
    key: ManageCenterModule.OrganizationManage,
    label: "组织管理",
    icon: <IconFont type="zuzhiguanli" />,
    code: "organization",
  },
  {
    key: ManageCenterModule.ApprovalManage,
    label: "审批日志",
    icon: <IconFont type="shenpirizhi " />,
    code: "approval",
  },
  {
    key: ManageCenterModule.EnvManage,
    label: "环境管理",
    icon: <IconFont type="huanjingguanli" />,
    code: "envManage",
  },
  {
    key: ManageCenterModule.AuditLog,
    label: "审计日志",
    icon: <IconFont type="shenjirizhi" />,
    code: "log",
  },
  {
    key: ManageCenterModule.SystemSetting,
    label: "系统设置",
    icon: <IconFont type="xitongshezhi" />,
    code: "system",
  },
  {
    key: ManageCenterModule.DataManage,
    label: "数据工程管理",
    icon: <IconFont type="shujuyuanguanli" />,
    children: [
      {
        key: ManageCenterModule.DataSourceManage,
        label: "数据源管理",
        code: "dataSourceManage",
      },
      {
        key: ManageCenterModule.EmpowerManage,
        label: "项目授权管理",
        code: "etlProjectManage",
      },
    ],
  },
];

export default observer(function ManageMenu() {
  const { appStore } = useStores();
  const { activeMenu, onLeftMenuSelect } = appStore;
  const navigate = useNavigate();
  const menus = useMenu(items);

  useMount(() => {
    navigate(paths.user);
    onLeftMenuSelect(ManageCenterModule.UserManage);
  });

  const onMenuSelect = ({ key }: { key: string }) => {
    if (!key) return;

    switch (key) {
      case ManageCenterModule.UserManage:
        navigate(paths.user);
        break;
      case ManageCenterModule.UserGroupManage:
        navigate(paths.userGroup);
        break;
      case ManageCenterModule.OrganizationManage:
        navigate(paths.organization);
        break;
      case ManageCenterModule.ApprovalManage:
        navigate(paths.approval);
        break;
      case ManageCenterModule.EnvManage:
        navigate(paths.environment);
        break;
      case ManageCenterModule.AuditLog:
        navigate(paths.log);
        break;
      case ManageCenterModule.SystemSetting:
        navigate(paths.system);
        break;
      case ManageCenterModule.DataSourceManage:
        navigate(paths.datasource);
        break;
      case ManageCenterModule.EmpowerManage:
        navigate(paths.empower);
        break;
      default:
        break;
    }

    onLeftMenuSelect(key as ManageCenterModule);
  };

  return (
    <Menu
      mode="inline"
      onSelect={onMenuSelect}
      className={`${clsPrefix}-left-sider-menu`}
      selectedKeys={[activeMenu]}
      items={menus}
      style={{ height: "calc(100vh - 220px)" }}
    />
  );
});
