import { observer } from "mobx-react-lite";
import { When } from "react-if";
import { useStores } from "../../hooks";
import DocSearch from "./DocSearch";
import "./index.less";
import LeftMenu from "./LeftMenu";
import Logo from "./Logo";
import NavMenu, { ModuleType } from "./NavMenu";
import ToolBox from "./ToolBox";

export default observer(function Left() {
  const { collapsed, activeModule } = useStores().appStore;

  return (
    <div
      className={`flex ${
        collapsed && "-translate-x-[280px]"
      } flex-col justify-between h-full p-5 bg-lightpink transition-all duration-300 w-[280px] z-10`}
    >
      <div>
        <Logo />
        {process.env.NODE_ENV === "development" && <DocSearch />}
        <NavMenu />
        <LeftMenu />
      </div>
      <When condition={activeModule !== "manage"}>
        <ToolBox activeModule={activeModule as Exclude<ModuleType, "manage">} />
      </When>
    </div>
  );
});
