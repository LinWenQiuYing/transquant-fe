import { Permission } from "@transquant/ui";
import SourceCenter from "@transqunat/data-engineering/source-center/SourceCenter";

export default function Datasource() {
  return (
    <Permission code="dataSourceManage">
      <SourceCenter readonly={false} />
    </Permission>
  );
}
