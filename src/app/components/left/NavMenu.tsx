import { getAccess, IconFont, PagePermission } from "@transquant/ui";
import { observer } from "mobx-react";
import { useMemo } from "react";
import { useStores } from "../../hooks";

export type ModuleType = "research" | "personal" | "manage" | "data";

interface Menu {
  module: ModuleType;
  name: string;
  icon: React.ReactNode;
}

const items: Menu[] = [
  {
    module: "research",
    name: "开始研究",
    icon: <IconFont type="kaishiyanjiu" />,
  },
  {
    module: "data",
    name: "数据工程",
    icon: <IconFont type="shujugongcheng" />,
  },
  {
    module: "personal",
    name: "个人中心",
    icon: <IconFont type="gerenzhongxin" />,
  },
  {
    module: "manage",
    name: "管理中心",
    icon: <IconFont type="guanlizhongxin" />,
  },
];

export default observer(function NavMenu() {
  const { activeModule, onActiveMenuChange } = useStores().appStore;

  const hasDataEngineer = useMemo(() => {
    const dataEngineerCodes: PagePermission[] = [
      "data_source",
      "etl_file",
      "etl_project",
      "etl_env",
    ];
    return dataEngineerCodes.some((code) => getAccess(code));
  }, []);

  const menus = useMemo(() => {
    return items.filter((item) => {
      if (item.module === "data" && !hasDataEngineer) return false;
      return true;
    });
  }, [hasDataEngineer]);

  return (
    <ul className="flex items-center justify-around p-0 m-0 mb-5 list-none">
      {menus.map((menu) => (
        <li
          key={menu.module}
          onClick={() => onActiveMenuChange(menu.module)}
          className={`flex flex-col items-center  ${
            activeModule === menu.module ? "text-red-500" : "text-gray-500"
          } cursor-pointer`}
        >
          <span className="mb-1 text-xl leading-9 text-center bg-white rounded-md shadow-md w-9 h-9">
            {menu.icon}
          </span>
          <span className="text-xs">{menu.name}</span>
        </li>
      ))}
    </ul>
  );
});
