import { Descriptions, Typography } from "antd";
import { observer } from "mobx-react";
import { useMemo, useState } from "react";
import { useStores } from "../../../hooks";
import ConfigModal from "./ConfigModal";

export default observer(function SpaceAndDB() {
  const { selectedGroup } = useStores().organizationStore;
  const [configVisible, setConfigVisible] = useState(false);

  const isOld = useMemo(() => {
    return !selectedGroup?.teamDBName && !selectedGroup?.teamSpaceName;
  }, [selectedGroup]);

  const items = [
    {
      key: "space",
      label: "团队空间",
      children: selectedGroup?.teamSpaceName,
    },
    {
      key: "db",
      label: "团队数据库",
      children: selectedGroup?.teamDBName,
    },
  ];

  const onAdd = () => setConfigVisible(true);

  return (
    <div>
      {isOld ? (
        <div>
          <span className="mr-2 text-gray-400">暂无团队空间和团队数据库</span>
          <Typography.Link onClick={onAdd}>新建</Typography.Link>
        </div>
      ) : (
        <Descriptions size="small" bordered items={items} />
      )}
      <ConfigModal visible={configVisible} onVisibleChange={setConfigVisible} />
    </div>
  );
});
