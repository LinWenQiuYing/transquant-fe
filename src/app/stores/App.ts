import { IMAGE_INSTANCE, USER_INFO } from "@transquant/constants";

import { ajax, ls } from "@transquant/utils";
import { observable } from "mobx";
import { AppType } from "../components/left/Logo";
import { DataEngineeringModule } from "../components/left/menu/DataEngineering";
import { ManageCenterModule } from "../components/left/menu/ManageMenu";
import { PersonalModule } from "../components/left/menu/PersonMenu";
import { ResearchModule } from "../components/left/menu/ResearchMenu";
import { ModuleType } from "../components/left/NavMenu";

export type AllModule =
  | ResearchModule
  | PersonalModule
  | ManageCenterModule
  | DataEngineeringModule;

export default class AppStore {
  @observable activeApp: AppType = "TransMatrix";

  @observable activeModule: ModuleType = "research";

  @observable activeMenu: AllModule = ResearchModule.Home;

  @observable collapsed: boolean = false;

  onActiveAppChange = (activeApp: AppType) => {
    this.activeApp = activeApp;
  };

  onActiveMenuChange = async (activeMenu: ModuleType) => {
    this.activeModule = activeMenu;
  };

  onLeftMenuSelect = async (activeMenu: AllModule) => {
    this.activeMenu = activeMenu;
  };

  onCollapsedChanged = (collapsed: boolean) => {
    this.collapsed = collapsed;
  };

  logout = (isSolidify: number) => {
    return ajax({
      url: "tquser/user/logout",
      params: { isSolidify },
      success: () => {
        ls.removeItem(IMAGE_INSTANCE);
        ls.removeItem(USER_INFO);
        this.onReset();
      },
    });
  };

  onReset = () => {
    this.activeModule = "research";
    this.activeMenu = ResearchModule.Home;
  };
}
