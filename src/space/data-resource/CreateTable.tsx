import { MonacoEditor } from "@transquant/common";
import { clsPrefix } from "@transquant/constants";
import { observer } from "mobx-react";
import { useStores } from "../hooks";

export default observer(function CreateTable() {
  const { tableInfo } = useStores().dataResourceStore;

  return (
    <div className={`${clsPrefix}-data-resource-create-table`}>
      <div>建表语句</div>
      <div style={{ height: 300 }}>
        <MonacoEditor value={tableInfo?.ddl || ""} />
      </div>
    </div>
  );
});
