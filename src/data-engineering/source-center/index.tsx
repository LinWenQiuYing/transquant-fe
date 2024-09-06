import { Permission } from "@transquant/ui";
import { observer } from "mobx-react";
import SourceCenter from "./SourceCenter";

export default observer(function SourceCenterView() {
  return (
    <Permission code="data_source">
      <SourceCenter readonly />
    </Permission>
  );
});
