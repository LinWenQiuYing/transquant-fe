import { Permission } from "@transquant/ui";
import { observer } from "mobx-react";
import "./index.less";
import Space from "./Space";

export default observer(function ResearchSpace() {
  return (
    <Permission code="env">
      <Space />
    </Permission>
  );
});
