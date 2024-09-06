import { clsPrefix } from "@transquant/constants";
import { Permission } from "@transquant/ui";
import { DataType } from "@transquant/utils";
import { Button, Card, Input, Space } from "antd";
import type { SearchProps } from "antd/es/input/Search";
import { observer } from "mobx-react";
import { useState } from "react";
import { useStores } from "../../hooks";
import { EnvironmentListItem } from "../../types";
import EnvironmentModal from "./EnvironmentModal";
import EnvironmentTable from "./EnvironmentTable";
import "./index.less";

const { Search } = Input;

export default observer(function BasePiece() {
  const [environmentModalVisible, setEnvironmentModalVisible] = useState(false);
  const { onEnvironmentSearchConfig, getEnvironmentList } =
    useStores().environmentManageStore;

  const onSearch: SearchProps["onSearch"] = (value) => {
    onEnvironmentSearchConfig({ searchVal: value });
    getEnvironmentList();
  };

  const extraEl = (
    <Space>
      <Search
        placeholder="请输入环境名称"
        allowClear
        onSearch={onSearch}
        style={{ width: 200 }}
      />
      <Permission code="B110101" hidden>
        <Button type="primary" onClick={() => setEnvironmentModalVisible(true)}>
          创建环境
        </Button>
      </Permission>
    </Space>
  );

  return (
    <Card
      title="环境管理"
      extra={extraEl}
      className={`${clsPrefix}-environment-list`}
    >
      <EnvironmentTable />
      {environmentModalVisible && (
        <EnvironmentModal<DataType<EnvironmentListItem>>
          title="创建环境"
          visible={environmentModalVisible}
          onVisibleChange={(value) => setEnvironmentModalVisible(value)}
        />
      )}
    </Card>
  );
});
