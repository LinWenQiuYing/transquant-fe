import { clsPrefix } from "@transquant/constants";
import { Permission } from "@transquant/ui";
import { DataType } from "@transquant/utils";
import { Button, Card, Input, Space } from "antd";
import type { SearchProps } from "antd/es/input/Search";
import { observer } from "mobx-react";
import { useState } from "react";
import { useStores } from "../../hooks";
import { SourceListItem } from "../../types";
import "./index.less";
import SourceModal from "./SourceModal";
import SourceTable from "./SourceTable";

const { Search } = Input;

export default observer(function BasePiece({
  readonly,
}: {
  readonly: boolean;
}) {
  const [sourceModalVisible, setSourceModalVisible] = useState(false);
  const { onSourceSearchConfig, getSourceList } = useStores().sourceCenterStore;

  const onSearch: SearchProps["onSearch"] = (value) => {
    onSourceSearchConfig({ searchVal: value });
    getSourceList(readonly);
  };

  const extraEl = (
    <Space>
      <Search
        placeholder="请输入关键字"
        allowClear
        onSearch={onSearch}
        style={{ width: 200 }}
      />
      {readonly ? null : (
        <Permission code="B200101" hidden>
          <Button type="primary" onClick={() => setSourceModalVisible(true)}>
            创建源
          </Button>
        </Permission>
      )}
    </Space>
  );

  return (
    <Card title="源中心" extra={extraEl} className={`${clsPrefix}-source-list`}>
      <SourceTable readonly={readonly} />
      {sourceModalVisible && (
        <SourceModal<DataType<SourceListItem>>
          title="创建数据源"
          visible={sourceModalVisible}
          onVisibleChange={(value) => setSourceModalVisible(value)}
          readonly={readonly}
        />
      )}
    </Card>
  );
});
