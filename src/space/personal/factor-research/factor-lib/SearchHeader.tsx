import {
  DownOutlined,
  SearchOutlined,
  SyncOutlined,
  UpOutlined,
} from "@ant-design/icons";
import { IconFont } from "@transquant/ui";
import { useMount } from "ahooks";
import {
  Button,
  Col,
  DatePicker,
  Descriptions,
  Input,
  InputNumber,
  message,
  Popover,
  Row,
  Select,
  Space,
  Typography,
} from "antd";
import dayjs from "dayjs";
import { observer } from "mobx-react";
import { useState } from "react";
import { useStores } from "../../../hooks";
import { TagEnum } from "../../../stores/FactorResearch";

const { RangePicker } = DatePicker;

type InputNumberType = number | undefined | null;

export interface IFactorLibSearch {
  annFactorReturnList: InputNumberType[];
  className: string;
  columnOrderBy: string;
  fileUpdateTimeList: string[];
  icList: InputNumberType[];
  irList: InputNumberType[];
  name: string;
  orderBy: number;
  pageNum: number;
  pageSize: number;
  projectName: string;
  tags: number[];
  triggerTimeList: string[];
}

// 范围输入仅输入一个值时做同步
export const sync = <T extends InputNumberType>(
  list?: T[],
  columnName?: string
): undefined | T[] => {
  let result: T[] = list as T[];
  if (!list) {
    return undefined;
  }
  const start = list[0];
  const end = list[1];

  if ((start || start === 0) && (end === undefined || end === null)) {
    result = [start, start];
    message.info(`${columnName}最大值未输入`);
  }
  if ((start === undefined || start === null) && (end || end === 0)) {
    result = [end, end];
    message.info(`${columnName}最小值未输入`);
  }

  if (!start && !end) {
    return undefined;
  }

  return result;
};

export default observer(function SearchHeader(props: {
  onCollapseChange?: (value: boolean) => void;
}) {
  const {
    getFactorResultList,
    getTagsByType,
    tags,
    pagination,
    onCacheLibConfigChange,
    onPaginationChange,
  } = useStores().factorResearchStore;
  const [config, setConfig] = useState<Partial<IFactorLibSearch>>({});
  const [collapse, setCollapse] = useState(true);
  const [popupVisible, setPopupVisible] = useState(false);

  useMount(() => {
    getTagsByType(TagEnum.FACTOR);
  });

  const onSearch = () => {
    const { icList, irList, annFactorReturnList, ...restConfig } = config;
    const _config = {
      ...restConfig,
      ...{ icList: sync(icList, "IC") },
      ...{ irList: sync(irList, "IR") },
      ...{ annFactorReturnList: sync(annFactorReturnList, "年化收益率") },
    };

    getFactorResultList({
      pageNum: 1,
      pageSize: pagination.pageSize,
      ..._config,
    });

    onPaginationChange({ pageNum: 1 });
    onCacheLibConfigChange(_config);
  };

  const onSort = () => {
    onSearch();
    setPopupVisible(false);
  };

  const onReset = () => {
    setConfig({ pageNum: 1 });
    onCacheLibConfigChange({ pageNum: 1 });
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
            <Select.Option key="triggerTime">回测时间</Select.Option>
            <Select.Option key="ic">IC</Select.Option>
            <Select.Option key="ir">IR</Select.Option>
            <Select.Option key="annFactorReturn">因子年化收益率</Select.Option>
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

  const collapseEl = (
    <Col span={8} style={{ textAlign: "right" }}>
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
        <Typography.Link
          onClick={() => {
            setCollapse(!collapse);
            props.onCollapseChange?.(!collapse);
          }}
        >
          {collapse ? "展开" : "折叠"}
          {collapse ? <DownOutlined /> : <UpOutlined />}
        </Typography.Link>
      </Space>
    </Col>
  );

  return (
    <div className="site-space-compact-wrapper-personal-factor">
      <Row justify="space-between" align="top">
        <Col span={collapse ? 16 : 24}>
          <Descriptions
            column={collapse ? 3 : 4}
            labelStyle={{ alignItems: "center" }}
          >
            <Descriptions.Item label="项目名称">
              <Input
                placeholder="请输入项目名称"
                maxLength={15}
                value={config.projectName}
                onChange={(e) =>
                  setConfig({ ...config, projectName: e.target.value })
                }
              />
            </Descriptions.Item>
            <Descriptions.Item label="类名">
              <Input
                placeholder="请输入类名"
                value={config.className}
                onChange={(e) =>
                  setConfig({ ...config, className: e.target.value })
                }
              />
            </Descriptions.Item>
            <Descriptions.Item label="因子名称">
              <Input
                placeholder="请输入因子名称"
                value={config.name}
                onChange={(e) => setConfig({ ...config, name: e.target.value })}
              />
            </Descriptions.Item>
            {!collapse && (
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
            )}
          </Descriptions>
        </Col>
        {collapse && collapseEl}
      </Row>
      <Row
        justify="space-between"
        align="top"
        style={{ display: collapse ? "none" : "flex" }}
      >
        <Col span={24}>
          <Descriptions column={4} labelStyle={{ alignItems: "center" }}>
            <Descriptions.Item label="回测时间">
              <RangePicker
                value={[
                  config.triggerTimeList?.[0]
                    ? dayjs(config.triggerTimeList[0])
                    : null,
                  config.triggerTimeList?.[1]
                    ? dayjs(config.triggerTimeList[1])
                    : null,
                ]}
                onChange={(_: any, formatting: string[]) => {
                  setConfig({
                    ...config,
                    triggerTimeList:
                      !formatting[0] && !formatting[1] ? undefined : formatting,
                  });
                }}
              />
            </Descriptions.Item>
            <Descriptions.Item label="IC">
              <Space.Compact>
                <InputNumber
                  placeholder="请输入IC"
                  value={config.icList?.[0]}
                  onChange={(value) =>
                    setConfig({
                      ...config,
                      icList: [value, config.icList?.[1]],
                    })
                  }
                />
                <Input
                  className="site-input-split"
                  style={{
                    width: 30,
                    borderLeft: 0,
                    borderRight: 0,
                    pointerEvents: "none",
                  }}
                  placeholder="~"
                  disabled
                />
                <InputNumber
                  placeholder="请输入IC"
                  value={config.icList?.[1]}
                  className="site-input-right"
                  onChange={(value) =>
                    setConfig({
                      ...config,
                      icList: [config.icList?.[0], value],
                    })
                  }
                />
              </Space.Compact>
            </Descriptions.Item>
            <Descriptions.Item label="IR">
              <Space.Compact>
                <InputNumber
                  placeholder="请输入IR"
                  value={config.irList?.[0]}
                  onChange={(value) =>
                    setConfig({
                      ...config,
                      irList: [value, config.irList?.[1]],
                    })
                  }
                />
                <Input
                  className="site-input-split"
                  style={{
                    width: 30,
                    borderLeft: 0,
                    borderRight: 0,
                    pointerEvents: "none",
                  }}
                  placeholder="~"
                  disabled
                />
                <InputNumber
                  placeholder="请输入IR"
                  className="site-input-right"
                  value={config.irList?.[1]}
                  onChange={(value) =>
                    setConfig({
                      ...config,
                      irList: [config.irList?.[0], value],
                    })
                  }
                />
              </Space.Compact>
            </Descriptions.Item>

            <Descriptions.Item label="年化收益率">
              <Space.Compact>
                <InputNumber
                  placeholder="请输入年化收益率"
                  value={config.annFactorReturnList?.[0]}
                  onChange={(value) =>
                    setConfig({
                      ...config,
                      annFactorReturnList: [
                        value,
                        config.annFactorReturnList?.[1],
                      ],
                    })
                  }
                />
                <Input
                  className="site-input-split"
                  style={{
                    width: 30,
                    borderLeft: 0,
                    borderRight: 0,
                    pointerEvents: "none",
                  }}
                  placeholder="~"
                  disabled
                />
                <InputNumber
                  className="site-input-right"
                  placeholder="请输入年化收益率"
                  value={config.annFactorReturnList?.[1]}
                  onChange={(value) =>
                    setConfig({
                      ...config,
                      annFactorReturnList: [
                        config.annFactorReturnList?.[0],
                        value,
                      ],
                    })
                  }
                />
              </Space.Compact>
            </Descriptions.Item>
          </Descriptions>
        </Col>
      </Row>
      <Row
        justify="space-between"
        align="top"
        style={{ display: collapse ? "none" : "flex" }}
      >
        <Col span={6}>
          <Descriptions column={1}>
            <Descriptions.Item label="修改时间">
              <RangePicker
                value={[
                  config.fileUpdateTimeList?.[0]
                    ? dayjs(config.fileUpdateTimeList[0])
                    : null,
                  config.fileUpdateTimeList?.[1]
                    ? dayjs(config.fileUpdateTimeList[1])
                    : null,
                ]}
                onChange={(_: any, formatting: string[]) => {
                  setConfig({
                    ...config,
                    fileUpdateTimeList:
                      !formatting[0] && !formatting[1] ? undefined : formatting,
                  });
                }}
              />
            </Descriptions.Item>
          </Descriptions>
        </Col>
        {!collapse && collapseEl}
      </Row>
    </div>
  );
});
