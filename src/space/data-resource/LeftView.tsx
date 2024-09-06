import { SyncOutlined } from "@ant-design/icons";
import { clsPrefix } from "@transquant/constants";
import { InputGroup } from "@transquant/ui";
import { Card, message } from "antd";
import { observer } from "mobx-react";
import { useEffect } from "react";
import { useStores } from "../hooks";
import DataBaseTree from "./DataBaseTree";

export default observer(function LeftView() {
  const { getDBTableInfoByUser } = useStores().dataResourceStore;

  useEffect(() => {
    getDBTableInfoByUser();
  }, []);

  const onInputGroupChange = (value: [string, string[]]) => {
    const [name, labels] = value;

    getDBTableInfoByUser({ name, labels });
  };

  const onRefresh = () => {
    getDBTableInfoByUser().then(() => {
      message.success("刷新成功");
    });
  };

  return (
    <Card
      title="数据库对象资源"
      extra={<SyncOutlined onClick={onRefresh} />}
      className={`${clsPrefix}-data-resource-left`}
    >
      <InputGroup onChange={onInputGroupChange} name="表名" />
      <div style={{ margin: "5px 0" }} />
      <DataBaseTree />
    </Card>
  );
});
