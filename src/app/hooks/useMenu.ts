import { getAccess, PagePermission } from "@transquant/ui";

export type MenuType = {
  key: string;
  label: string;
  icon?: React.ReactNode;
  code?: PagePermission;
  children?: MenuType[];
};

export default function useMenu(menus: MenuType[]) {
  return menus.filter((item) => {
    if (item.children) {
      item.children = item.children.filter((child) => getAccess(child.code));
      return item.children.length > 0;
    }
    return getAccess(item.code);
  });
}
