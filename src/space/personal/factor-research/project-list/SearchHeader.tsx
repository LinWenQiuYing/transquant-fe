import { SearchOutlined, SyncOutlined } from "@ant-design/icons";
import { IconFont } from "@transquant/ui";
import { useMount } from "ahooks";
import {
  Button,
  Col,
  DatePicker,
  Descriptions,
  Input,
  Popover,
  Row,
  Select,
  Space,
} from "antd";
import dayjs from "dayjs";
import { observer } from "mobx-react";
import { useState } from "react";
import { useStores } from "../../../hooks";
import { TagEnum } from "../../../stores/FactorResearch";

const { RangePicker } = DatePicker;

export interface IProjectSearch {
  name: string;
  tags: number[];
  comments: string;
  folderTimeStart: string;
  folderTimeEnd: string;
  columnOrderBy: string;
  orderBy: number;
  pageNum: number;
  pageSize: number;
}

export default observer(function SearchHeader() {
  const {
    getFactorProject,
    getTagsByType,
    pagination,
    onPaginationChange,
    tags,
    onCacheProjectConfig,
  } = useStores().factorResearchStore;
  const [config, setConfig] = useState<Partial<IProjectSearch>>({});
  const [popupVisible, setPopupVisible] = useState(false);

  useMount(() => {
    getTagsByType(TagEnum.FACTOR_PROJECT);
  });

  const onSearch = () => {
    getFactorProject({
      pageNum: 1,
      pageSize: pagination.pageSize,
      ...config,
    });

    onPaginationChange({ pageNum: 1 });

    onCacheProjectConfig(config);
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
            <Select.Option key="folderTime">创建时间</Select.Option>
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
    <div className="site-space-compact-wrapper-personal-project">
      <Row justify="space-between" align="top" wrap>
        <Col span={18}>
          <Descriptions column={4} labelStyle={{ alignItems: "center" }}>
            <Descriptions.Item label="项目名称">
              <Input
                placeholder="请输入项目名称"
                maxLength={15}
                value={config.name}
                onChange={(e) => setConfig({ ...config, name: e.target.value })}
              />
            </Descriptions.Item>
            <Descriptions.Item label="备注信息">
              <Input
                placeholder="请输入备注信息"
                value={config.comments}
                maxLength={50}
                onChange={(e) =>
                  setConfig({ ...config, comments: e.target.value })
                }
              />
            </Descriptions.Item>
            <Descriptions.Item label="标签">
              <Select
                placeholder="请选择标签"
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
            </Descriptions.Item>
            <Descriptions.Item label="创建时间">
              <RangePicker
                value={[
                  config.folderTimeStart ? dayjs(config.folderTimeStart) : null,
                  config.folderTimeStart ? dayjs(config.folderTimeEnd) : null,
                ]}
                onChange={(_: any, formatting: string[]) => {
                  setConfig({
                    ...config,
                    folderTimeStart: formatting[0] ? formatting[0] : undefined,
                    folderTimeEnd: formatting[1] ? formatting[1] : undefined,
                  });
                }}
              />
            </Descriptions.Item>
          </Descriptions>
        </Col>
        <Col span={6} style={{ textAlign: "right" }}>
          <Space>
            <Popover
              content={dropdownRender}
              placement="bottom"
              trigger={["click"]}
              open={popupVisible}
            >
              <Button
                icon={<IconFont type="shaixuan" />}
                onClick={() => setPopupVisible(true)}
              >
                排序
              </Button>
            </Popover>
            <Button icon={<SyncOutlined />} onClick={onReset}>
              重置
            </Button>
            <Button icon={<SearchOutlined />} type="primary" onClick={onSearch}>
              查询
            </Button>
          </Space>
        </Col>
      </Row>
    </div>
  );
});
