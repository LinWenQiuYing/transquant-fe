import { clsPrefix } from "@transquant/constants";
import { observer } from "mobx-react";
import { useStores } from "../hooks";

export default observer(function TableComment() {
  const { tableInfo } = useStores().dataResourceStore;

  return (
    <div className={`${clsPrefix}-data-resource-database mb-4`}>
      <div>表注释</div>
      <div>
        <span>表注释：</span>
        <span>{tableInfo?.comment || "暂无表注释"}</span>
      </div>
    </div>
  );
});
