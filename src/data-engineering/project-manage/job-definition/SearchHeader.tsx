import { SearchOutlined, SyncOutlined } from "@ant-design/icons";
import { clsPrefix } from "@transquant/constants";
import { Button, Input, Select, Space } from "antd";
import { observer } from "mobx-react";
import { useState } from "react";
import { useStores } from "../../hooks";
import { JobDefinitionSearch } from "../../types";

export default observer(function SearchHeader() {
  const {
    getJobDefinition,
    onJobDefinitionPagination,
    onJobDefinitionSearchConfig,
    jobTypeOptionsMap,
  } = useStores().projectManageStore;
  const [config, setConfig] = useState<JobDefinitionSearch>({
    searchVal: "",
    jobType: undefined,
  });
  const disabledTaskType = ["CONDITIONS", "SWITCH"];
  const options = Object.keys(jobTypeOptionsMap).map((option: string) => ({
    label: option,
    value: option,
    disabled: disabledTaskType.includes(option),
  }));

  const onSearch = () => {
    onJobDefinitionSearchConfig(config);
    onJobDefinitionPagination({ pageNum: 1 });
    getJobDefinition();
  };

  const onReset = () => {
    onJobDefinitionSearchConfig({
      searchVal: "",
      jobType: undefined,
    });
    onJobDefinitionPagination({ pageNum: 1 });
    setConfig({
      searchVal: "",
      jobType: undefined,
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
      <div className={`${clsPrefix}-table-filters-item`}>
        <span className="item-label">任务类型：</span>
        <Select
          className="item-input"
          placeholder="任务类型"
          value={config.jobType}
          onChange={(value) => {
            setConfig({ ...config, jobType: value });
          }}
          options={options}
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
        </Space>
      </div>
    </div>
  );
});
