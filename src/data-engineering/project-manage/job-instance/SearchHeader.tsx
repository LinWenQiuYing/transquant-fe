import {
  DownOutlined,
  SearchOutlined,
  SyncOutlined,
  UpOutlined,
} from "@ant-design/icons";
import { clsPrefix } from "@transquant/constants";
import { Button, DatePicker, Input, Select, Space } from "antd";
import dayjs from "dayjs";
import { observer } from "mobx-react";
import { useState } from "react";
import { useStores } from "../../hooks";
import { JobInstanceSearch } from "../../types";

const { RangePicker } = DatePicker;

export default observer(function SearchHeader(props: {
  onCollapseChange?: (value: boolean) => void;
}) {
  const {
    getJobInstance,
    onJobDefinitionPagination,
    onJobInstanceSearchConfig,
    taskStatusOptions,
  } = useStores().projectManageStore;
  const [filterShowAll, setFilterShowAll] = useState(true);
  const [config, setConfig] = useState<JobInstanceSearch>({
    searchVal: "",
    workflowInstance: "",
    status: undefined,
    startDate: undefined,
    endDate: undefined,
  });
  const displayStyle = { display: filterShowAll ? "flex" : "none" };
  const showText = filterShowAll ? "收起" : "展开";

  const onSearch = () => {
    onJobInstanceSearchConfig(config);
    onJobDefinitionPagination({ pageNum: 1 });
    getJobInstance();
  };

  const onReset = () => {
    onJobInstanceSearchConfig({
      searchVal: "",
      workflowInstance: "",
      status: undefined,
      startDate: undefined,
      endDate: undefined,
    });
    onJobDefinitionPagination({ pageNum: 1 });
    setConfig({
      searchVal: "",
      workflowInstance: "",
      status: undefined,
      startDate: undefined,
      endDate: undefined,
    });
  };

  return (
    <div className={`${clsPrefix}-table-filters`}>
      <div className={`${clsPrefix}-table-filters-item`}>
        <span className="item-label">任务名称：</span>
        <Input
          className="item-input"
          placeholder="任务名称"
          value={config.searchVal}
          onChange={(e) =>
            setConfig({
              ...config,
              searchVal: e.target.value,
            })
          }
        />
      </div>
      <div className={`${clsPrefix}-table-filters-item long-label-item`}>
        <span className="item-label">工作流实例：</span>
        <Input
          className="item-input"
          placeholder="工作流实例"
          value={config.workflowInstance}
          onChange={(e) =>
            setConfig({
              ...config,
              workflowInstance: e.target.value,
            })
          }
        />
      </div>
      <div className={`${clsPrefix}-table-filters-item`} style={displayStyle}>
        <span className="item-label">状态：</span>
        <Select
          allowClear
          className="item-input"
          placeholder="状态"
          value={config.status}
          onChange={(value) => {
            setConfig({ ...config, status: value });
          }}
          options={taskStatusOptions}
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
