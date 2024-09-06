import { observer } from "mobx-react-lite";
import { When } from "react-if";
import { useStores } from "../../hooks";
import "./index.less";
import DataEngineering from "./menu/DataEngineering";
import ManageMenu from "./menu/ManageMenu";
import PersonMenu from "./menu/PersonMenu";
import ResearchMenu from "./menu/ResearchMenu";

export default observer(function Left() {
  const { appStore } = useStores();
  const { activeModule } = appStore;

  return (
    <>
      <When condition={activeModule === "research"}>
        <ResearchMenu />
      </When>
      <When condition={activeModule === "data"}>
        <DataEngineering />
      </When>
      <When condition={activeModule === "personal"}>
        <PersonMenu />
      </When>
      <When condition={activeModule === "manage"}>
        <ManageMenu />
      </When>
    </>
  );
});
