import {
  DownOutlined,
  SearchOutlined,
  SyncOutlined,
  UpOutlined,
} from "@ant-design/icons";
import { clsPrefix } from "@transquant/constants";
import { IconFont } from "@transquant/ui";
import {
  Button,
  Col,
  DatePicker,
  Input,
  Popover,
  Row,
  Select,
  Space,
} from "antd";
import dayjs from "dayjs";
import { observer } from "mobx-react";
import { useEffect, useState } from "react";
import { useStores } from "../../../hooks";
import { TagEnum } from "../../../stores/GroupFactor";
import { GroupIProjectSearch } from "../../../types";

const { RangePicker } = DatePicker;

export default observer(function SearchHeader(props: {
  onCollapseChange?: (value: boolean) => void;
}) {
  const {
    getTeamFactorProject,
    getTeamTagsByType,
    onPaginationChange,
    tags,
    selectedTeam,
    onCacheProjectConfig,
  } = useStores().groupFactorStore;
  const [config, setConfig] = useState<Partial<GroupIProjectSearch>>({});
  const [popupVisible, setPopupVisible] = useState(false);
  const [filterShowAll, setFilterShowAll] = useState(false);
  const displayStyle = { display: filterShowAll ? "flex" : "none" };
  const showText = filterShowAll ? "收起" : "展开";

  useEffect(() => {
    if (selectedTeam.id) {
      getTeamTagsByType(TagEnum.FACTOR_PROJECT);
    }
  }, [selectedTeam]);

  const onSearch = () => {
    onCacheProjectConfig(config);
    onPaginationChange({ pageNum: 1 });
    getTeamFactorProject();
  };

  const onSort = () => {
    onSearch();
    setPopupVisible(false);
  };

  const onReset = () => {
    setConfig({ pageNum: 1 });
    onCacheProjectConfig({ pageNum: 1 });
    onPaginationChange({ pageNum: 1 });
  };

  const dropdownRender = (
    <div style={{ width: "200px" }}>
      <Row>
        <Col span={24}>排序列：</Col>
        <Col span={24}>
          <Select
            style={{ width: "100%" }}
            placeholder="请选择排序列"
            value={config.columnOrderBy}
            onChange={(value) => {
              setConfig({ ...config, columnOrderBy: value });
            }}
          >
            <Select.Option key="folderTime">发布时间</Select.Option>
          </Select>
        </Col>
      </Row>
      <Row>
        <Col span={24}>排序方式：</Col>
        <Col span={24}>
          <Select
            style={{ width: "100%" }}
            placeholder="请选择排序方式"
            value={config.orderBy}
            onChange={(value) => {
              setConfig({ ...config, orderBy: value });
            }}
          >
            <Select.Option key={0}>不排序</Select.Option>
            <Select.Option key={1}>升序</Select.Option>
            <Select.Option key={2}>降序</Select.Option>
          </Select>
        </Col>
      </Row>
      <Row justify="end" style={{ marginTop: 10 }}>
        <Col>
          <Button
            style={{ marginRight: 20 }}
            onClick={() => setPopupVisible(false)}
          >
            取消
          </Button>
          <Button type="primary" onClick={onSort}>
            确认
          </Button>
        </Col>
      </Row>
    </div>
  );

  return (
    <div className={`${clsPrefix}-table-filters`}>
      <div className={`${clsPrefix}-table-filters-item`}>
        <span className="item-label">项目名称：</span>
        <Input
          className="item-input"
          placeholder="项目名称"
          value={config.name}
          maxLength={15}
          onChange={(e) => setConfig({ ...config, name: e.target.value })}
        />
      </div>
      <div className={`${clsPrefix}-table-filters-item`}>
        <span className="item-label">标签：</span>
        <Select
          className="item-input"
          placeholder="标签"
          value={config.tags}
          style={{ width: "100%" }}
          mode="multiple"
          showSearch={false}
          onChange={(keys) => {
            setConfig({ ...config, tags: keys });
          }}
        >
          {tags.map((item) => (
            <Select.Option value={item.id} key={item.id}>
              {item.name}
            </Select.Option>
          ))}
        </Select>
      </div>
      <div className={`${clsPrefix}-table-filters-item`}>
        <span className="item-label">发布人：</span>
        <Input
          className="item-input"
          placeholder="发布人"
          value={config.publisher}
          onChange={(e) => setConfig({ ...config, publisher: e.target.value })}
        />
      </div>
      <div
        className={`${clsPrefix}-table-filters-item long-item`}
        style={displayStyle}
      >
        <span className="item-label">发布时间：</span>
        <RangePicker
          className="item-input"
          value={[
            config.folderTimeStart ? dayjs(config.folderTimeStart) : null,
            config.folderTimeEnd ? dayjs(config.folderTimeEnd) : null,
          ]}
          onChange={(_: any, formatting: string[]) => {
            setConfig({
              ...config,
              folderTimeStart: formatting[0] ? formatting[0] : undefined,
              folderTimeEnd: formatting[1] ? formatting[1] : undefined,
            });
          }}
        />
      </div>
      <div className={`${clsPrefix}-table-filters-item`} style={displayStyle}>
        <span className="item-label">申请工单：</span>
        <Input
          className="item-input"
          placeholder="申请工单"
          value={config.code}
          onChange={(e) => setConfig({ ...config, code: e.target.value })}
        />
      </div>
      <div className={`${clsPrefix}-table-filters-item`} style={displayStyle}>
        <span className="item-label">描述：</span>
        <Input
          className="item-input"
          placeholder="项目描述"
          value={config.comments}
          maxLength={50}
          onChange={(e) => setConfig({ ...config, comments: e.target.value })}
        />
      </div>
      <div className={`${clsPrefix}-table-filters-item`} style={displayStyle} />
      <div className={`${clsPrefix}-table-filters-item long-item`}>
        <Space size="small">
          <Popover
            content={dropdownRender}
            placement="bottom"
            trigger={["click"]}
            open={popupVisible}
          >
            <Button
              className="item-btn"
              icon={<IconFont type="shaixuan" />}
              onClick={() => setPopupVisible(true)}
            >
              排序
            </Button>
          </Popover>
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
