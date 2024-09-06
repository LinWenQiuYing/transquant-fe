import { Permission } from "@transquant/ui";
import { useUnmount } from "ahooks";
import { Col, Radio, Row, Select } from "antd";
import { toJS } from "mobx";
import { observer } from "mobx-react";
import { useStores } from "../../hooks";

export enum TimeType {
  THREE_MONTH,
  SIX_MONTH,
  ONE_YEAR,
  ALL_TIME,
}

export default observer(function TitleView() {
  const {
    selectedTeamIds,
    onTeamSelect,
    timeType,
    onTimeTypeChange,
    filterAllTeams,
    onTeamSearch,
  } = useStores().homeStore;

  useUnmount(() => {
    onTimeTypeChange(TimeType.THREE_MONTH);
  });

  return (
    <Row justify="space-between">
      <Col span={12}>
        <Permission code="B010101" hidden>
          选择团队：
          <Select
            value={toJS(selectedTeamIds)}
            onChange={onTeamSelect}
            allowClear
            style={{ width: 240 }}
            placeholder="请选择团队"
            mode="multiple"
            maxTagCount={0}
            onSearch={onTeamSearch}
            showSearch
            filterOption={false}
            options={filterAllTeams.map((item) => ({
              label: item.name,
              value: item.id,
            }))}
          />
        </Permission>
      </Col>
      <Col span={12} style={{ textAlign: "right" }}>
        <Permission code="B010102" hidden>
          <Radio.Group
            value={timeType}
            buttonStyle="solid"
            onChange={(e) => onTimeTypeChange(e.target.value)}
          >
            <Radio.Button value={TimeType.THREE_MONTH}>近三月</Radio.Button>
            <Radio.Button value={TimeType.SIX_MONTH}>近六月</Radio.Button>
            <Radio.Button value={TimeType.ONE_YEAR}>近一年</Radio.Button>
            <Radio.Button value={TimeType.ALL_TIME}>全部</Radio.Button>
          </Radio.Group>
        </Permission>
      </Col>
    </Row>
  );
});
