import { Card } from "antd";
import { observer } from "mobx-react";
import InstallFile from "./InstallFile";
import InstallShell from "./InstallShell";
import NoticeRecord from "./NoticeRecord";

export default observer(function TransmatrixInstall() {
  return (
    <Card title="TransMatrix安装">
      <InstallShell />
      <InstallFile />
      <NoticeRecord />
    </Card>
  );
});
