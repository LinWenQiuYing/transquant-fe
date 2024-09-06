import { clsPrefix } from "@transquant/constants";
import { useMount, useUnmount } from "ahooks";
import { observer } from "mobx-react";
import { useParams } from "react-router-dom";
import { useStores } from "../../../hooks";
import FactorViewContent from "./FactorViewContent";
import FactorViewHeader from "./FactorViewHeader";
import "./index.less";

export default observer(function FactorView() {
  const params = useParams();
  const { getTeamFactorJsonData, reset } = useStores().groupFactorStore;

  useMount(() => {
    getTeamFactorJsonData(parseInt(params.id || ""));
  });

  useUnmount(() => {
    reset();
  });

  return (
    <div className={`${clsPrefix}-factor-view`}>
      <FactorViewHeader />
      <FactorViewContent />
    </div>
  );
});
