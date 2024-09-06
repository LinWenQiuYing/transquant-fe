import {
  DownOutlined,
  SearchOutlined,
  SyncOutlined,
  UpOutlined,
} from "@ant-design/icons";
import { clsPrefix } from "@transquant/constants";
import { useMount } from "ahooks";
import { Button, DatePicker, Input, Select, Space } from "antd";
import dayjs from "dayjs";
import { observer } from "mobx-react";
import { useState } from "react";
import { useStores } from "../../hooks";
import { WorkflowInstanceSearch } from "../../types";

const { RangePicker } = DatePicker;

export default observer(function SearchHeader(props: {
  onCollapseChange?: (value: boolean) => void;
}) {
  const {
    getWorkflowInstance,
    onWorkflowInstancePagination,
    onWorkflowInstanceSearchConfig,
    getWorkFlowDefinitionList,
    flowStatusOptions,
  } = useStores().projectManageStore;
  const [config, setConfig] = useState<WorkflowInstanceSearch>({
    stateType: "",
  });
  const [filterShowAll, setFilterShowAll] = useState(true);
  const [flowOptions, setFlowOptions] = useState([]);
  const displayStyle = { display: filterShowAll ? "flex" : "none" };
  const showText = filterShowAll ? "收起" : "展开";

  const onSearch = () => {
    onWorkflowInstanceSearchConfig(config);
    onWorkflowInstancePagination({ pageNum: 1 });
    getWorkflowInstance();
  };

  const onReset = () => {
    onWorkflowInstanceSearchConfig({});
    onWorkflowInstancePagination({ pageNum: 1 });
    setConfig({ stateType: "" });
  };

  useMount(async () => {
    let list = await getWorkFlowDefinitionList();
    list = list.map((item: any) => {
      return {
        value: item.code,
        label: item.name,
      };
    });
    setFlowOptions(list);
  });

  return (
    <div className={`${clsPrefix}-table-filters`}>
      <div className={`${clsPrefix}-table-filters-item`}>
        <span className="item-label">工作流：</span>
        <Select
          className="item-input"
          placeholder="工作流"
          value={config.processDefineCode}
          onChange={(value) => {
            setConfig({ ...config, processDefineCode: value });
          }}
          options={flowOptions}
        />
      </div>
      <div className={`${clsPrefix}-table-filters-item`}>
        <span className="item-label">实例名称：</span>
        <Input
          className="item-input"
          placeholder="实例名称"
          value={config.searchVal}
          onChange={(e) =>
            setConfig({
              ...config,
              searchVal: e.target.value,
            })
          }
        />
      </div>
      <div className={`${clsPrefix}-table-filters-item`} style={displayStyle}>
        <span className="item-label">状态：</span>
        <Select
          className="item-input"
          placeholder="状态"
          value={config.stateType}
          onChange={(value) => {
            setConfig({ ...config, stateType: value });
          }}
          options={flowStatusOptions}
        />
      </div>
      <div
        className={`${clsPrefix}-table-filters-item long-item`}
        style={displayStyle}
      >
        <span className="item-label">时间：</span>
        <RangePicker
          className="item-input"
          value={[
            config.startDate ? dayjs(config.startDate) : null,
            config.endDate ? dayjs(config.endDate) : null,
          ]}
          onChange={(_: any, formatting: string[]) => {
            setConfig({
              ...config,
              startDate: formatting[0]
                ? `${formatting[0]} 00:00:00`
                : undefined,
              endDate: formatting[1] ? `${formatting[1]} 00:00:00` : undefined,
            });
          }}
        />
      </div>
      <div className={`${clsPrefix}-table-filters-item`}>
        <Space size="small">
          <Button
            className="item-btn"
            icon={<SyncOutlined />}
            onClick={onReset}
          >
            重置
          </Button>
          <Button
            className="item-btn"
            icon={<SearchOutlined />}
            type="primary"
            onClick={onSearch}
          >
            查询
          </Button>
          <span
            className="show-text"
            onClick={() => {
              setFilterShowAll(!filterShowAll);
              props.onCollapseChange?.(filterShowAll);
            }}
          >
            {showText}
            {filterShowAll ? <UpOutlined /> : <DownOutlined />}
          </span>
        </Space>
      </div>
    </div>
  );
});
