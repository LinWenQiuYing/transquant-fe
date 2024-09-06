import {
  DownOutlined,
  SearchOutlined,
  SyncOutlined,
  UpOutlined,
} from "@ant-design/icons";
import { IconFont } from "@transquant/ui";
import {
  Button,
  Col,
  DatePicker,
  Descriptions,
  Input,
  InputNumber,
  Popover,
  Row,
  Select,
  Space,
  Typography,
} from "antd";
import dayjs from "dayjs";
import { observer } from "mobx-react";
import { useEffect, useState } from "react";
import { useStores } from "../../../hooks";
import { sync } from "../../../personal/factor-research/factor-lib/SearchHeader";
import { TagEnum } from "../../../stores/FactorResearch";

const { RangePicker } = DatePicker;

type InputNumberType = number | undefined | null;

export interface IStrategyLibSearch {
  projectName: string; // 项目名称
  className: string; // 类名
  name: string; // 策略名称
  tags: number[]; // 标签
  fileUpdateTimeList: string[]; // 修改时间
  triggerTimeList: string[]; // 回测时间
  annStrategyReturnList: InputNumberType[]; // 年化收益率
  alphaList: InputNumberType[]; // alpha
  benchmark: string; // 基准
  annBenchmarkReturnList: InputNumberType[]; // 基准年化收益率

  maxDrawdownList: InputNumberType[]; // 最大回撤
  sharpRatioList: InputNumberType[]; // 夏普比率
  sortinoRatioList: InputNumberType[]; // 索提诺比率
  volatilityList: InputNumberType[]; // 波动率

  publisher: string; // 发布人
  code: string; // 申请工单

  columnOrderBy: string;
  orderBy: number;
  pageNum: number;
  pageSize: number;
}

export default observer(function SearchHeader(props: {
  onCollapseChange?: (value: boolean) => void;
}) {
  const {
    getTeamStrategyResultList,
    getTeamTagsByType,
    pagination,
    tags,
    selectedTeam,
    onPaginationChange,
    onCacheLibConfigChange,
  } = useStores().groupStrategyStore;
  const [config, setConfig] = useState<Partial<IStrategyLibSearch>>({});
  const [collapse, setCollapse] = useState(true);
  const [popupVisible, setPopupVisible] = useState(false);

  useEffect(() => {
    if (selectedTeam.id) {
      getTeamTagsByType(TagEnum.BACKTEST);
    }
  }, [selectedTeam]);

  const onSearch = () => {
    const {
      annStrategyReturnList,
      alphaList,
      annBenchmarkReturnList,
      maxDrawdownList,
      sharpRatioList,
      sortinoRatioList,
      volatilityList,
      ...restConfig
    } = config;

    const _config = {
      ...restConfig,
      ...{ annStrategyReturnList: sync(annStrategyReturnList, "年化收益率") },
      ...{ alphaList: sync(alphaList, "alpha") },
      ...{
        annBenchmarkReturnList: sync(annBenchmarkReturnList, "基准年化收益率"),
      },
      ...{ maxDrawdownList: sync(maxDrawdownList, "最大回撤") },
      ...{ sharpRatioList: sync(sharpRatioList, "夏普比率") },
      ...{ sortinoRatioList: sync(sortinoRatioList, "索提诺比率") },
      ...{ volatilityList: sync(volatilityList, "波动率") },
    };

    getTeamStrategyResultList({
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
            <Select.Option key="annStrategyReturn">年化收益</Select.Option>
            <Select.Option key="alpha">Alpha</Select.Option>
            <Select.Option key="annBenchmarkReturn">基准年化收益</Select.Option>
            <Select.Option key="triggerTime">回测时间</Select.Option>
            <Select.Option key="sharpRatio">夏普率</Select.Option>
            <Select.Option key="sortinoRatio">索提诺比率</Select.Option>
            <Select.Option key="maxDrawdown">最大回撤</Select.Option>
            <Select.Option key="volatility">波动率</Select.Option>
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
    <div className="site-space-compact-wrapper">
      <Row justify="space-between" align="top">
        <Col span={16}>
          <Descriptions column={3} labelStyle={{ alignItems: "center" }}>
            <Descriptions.Item label="项目名称">
              <Input
                placeholder="请输入项目名称"
                value={config.projectName}
                maxLength={15}
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
            <Descriptions.Item label="策略名称">
              <Input
                placeholder="请输入策略名称"
                value={config.name}
                onChange={(e) => setConfig({ ...config, name: e.target.value })}
              />
            </Descriptions.Item>
          </Descriptions>
        </Col>
        {!collapse && (
          <Col span={8}>
            <Descriptions column={1}>
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
            </Descriptions>
          </Col>
        )}
        {collapse && collapseEl}
      </Row>
      <Row
        justify="space-between"
        align="top"
        style={{ display: collapse ? "none" : "flex" }}
      >
        <Col span={16}>
          <Descriptions column={3} labelStyle={{ alignItems: "center" }}>
            <Descriptions.Item label="发布人">
              <Input
                placeholder="发布人"
                value={config.publisher}
                onChange={(e) =>
                  setConfig({ ...config, publisher: e.target.value })
                }
              />
            </Descriptions.Item>
            <Descriptions.Item label="申请工单">
              <Input
                placeholder="申请工单"
                value={config.code}
                onChange={(e) => setConfig({ ...config, code: e.target.value })}
              />
            </Descriptions.Item>
            <Descriptions.Item label="alpha">
              <Space.Compact>
                <InputNumber
                  placeholder="请输入alpha"
                  value={config.alphaList?.[0]}
                  onChange={(value) =>
                    setConfig({
                      ...config,
                      alphaList: [value, config.alphaList?.[1]],
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
                  placeholder="请输入alpha"
                  className="site-input-right"
                  value={config.alphaList?.[1]}
                  onChange={(value) =>
                    setConfig({
                      ...config,
                      alphaList: [config.alphaList?.[0], value],
                    })
                  }
                />
              </Space.Compact>
            </Descriptions.Item>
          </Descriptions>
        </Col>
        <Col span={8}>
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
        <Col span={16}>
          <Descriptions column={3}>
            <Descriptions.Item label="年化收益率">
              <Space.Compact>
                <InputNumber
                  placeholder="请输入年化收益率"
                  value={config.annStrategyReturnList?.[0]}
                  onChange={(value) =>
                    setConfig({
                      ...config,
                      annStrategyReturnList: [
                        value,
                        config.annStrategyReturnList?.[1],
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
                  placeholder="请输入年化收益率"
                  value={config.annStrategyReturnList?.[1]}
                  className="site-input-right"
                  onChange={(value) =>
                    setConfig({
                      ...config,
                      annStrategyReturnList: [
                        config.annStrategyReturnList?.[0],
                        value,
                      ],
                    })
                  }
                />
              </Space.Compact>
            </Descriptions.Item>
            <Descriptions.Item label="基准">
              <Input
                placeholder="请输入基准"
                value={config.benchmark}
                onChange={(e) =>
                  setConfig({ ...config, benchmark: e.target.value })
                }
              />
            </Descriptions.Item>
            <Descriptions.Item label="基准收益率">
              <Space.Compact>
                <InputNumber
                  placeholder="请输入基准收益率"
                  value={config.annBenchmarkReturnList?.[0]}
                  onChange={(value) =>
                    setConfig({
                      ...config,
                      annBenchmarkReturnList: [
                        value,
                        config.annBenchmarkReturnList?.[1],
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
                  placeholder="请输入基准收益率"
                  value={config.annBenchmarkReturnList?.[1]}
                  onChange={(value) =>
                    setConfig({
                      ...config,
                      annBenchmarkReturnList: [
                        config.annBenchmarkReturnList?.[0],
                        value,
                      ],
                    })
                  }
                />
              </Space.Compact>
            </Descriptions.Item>
          </Descriptions>
        </Col>
        <Col span={8}>
          <Descriptions column={1}>
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
          </Descriptions>
        </Col>
      </Row>
      <Row
        justify="space-between"
        align="top"
        style={{ display: collapse ? "none" : "flex" }}
      >
        <Col span={16}>
          <Descriptions column={3} labelStyle={{ alignItems: "center" }}>
            <Descriptions.Item label="最大回撤">
              <Space.Compact>
                <InputNumber
                  placeholder="请输入最大回撤"
                  value={config.maxDrawdownList?.[0]}
                  onChange={(value) =>
                    setConfig({
                      ...config,
                      maxDrawdownList: [value, config.maxDrawdownList?.[1]],
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
                  placeholder="请输入最大回撤"
                  value={config.maxDrawdownList?.[1]}
                  className="site-input-right"
                  onChange={(value) =>
                    setConfig({
                      ...config,
                      maxDrawdownList: [config.maxDrawdownList?.[0], value],
                    })
                  }
                />
              </Space.Compact>
            </Descriptions.Item>
            <Descriptions.Item label="夏普比率">
              <Space.Compact>
                <InputNumber
                  placeholder="请输入夏普比率"
                  value={config.sharpRatioList?.[0]}
                  onChange={(value) =>
                    setConfig({
                      ...config,
                      sharpRatioList: [value, config.sharpRatioList?.[1]],
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
                  placeholder="请输入夏普比率"
                  className="site-input-right"
                  value={config.sharpRatioList?.[1]}
                  onChange={(value) =>
                    setConfig({
                      ...config,
                      sharpRatioList: [config.sharpRatioList?.[0], value],
                    })
                  }
                />
              </Space.Compact>
            </Descriptions.Item>
            <Descriptions.Item label="索提诺比率">
              <Space.Compact>
                <InputNumber
                  placeholder="请输入索提诺比率"
                  value={config.sortinoRatioList?.[0]}
                  onChange={(value) =>
                    setConfig({
                      ...config,
                      sortinoRatioList: [value, config.sortinoRatioList?.[1]],
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
                  placeholder="请输入索提诺比率"
                  className="site-input-right"
                  value={config.sortinoRatioList?.[1]}
                  onChange={(value) =>
                    setConfig({
                      ...config,
                      sortinoRatioList: [config.sortinoRatioList?.[0], value],
                    })
                  }
                />
              </Space.Compact>
            </Descriptions.Item>
          </Descriptions>
        </Col>
        <Col span={8}>
          <Descriptions column={1}>
            <Descriptions.Item label="波动率">
              <Space.Compact>
                <InputNumber
                  placeholder="请输入波动率"
                  value={config.volatilityList?.[0]}
                  onChange={(value) =>
                    setConfig({
                      ...config,
                      volatilityList: [value, config.volatilityList?.[1]],
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
                  placeholder="请输入波动率"
                  value={config.volatilityList?.[1]}
                  onChange={(value) =>
                    setConfig({
                      ...config,
                      volatilityList: [config.volatilityList?.[0], value],
                    })
                  }
                />
              </Space.Compact>
            </Descriptions.Item>
          </Descriptions>
        </Col>
      </Row>
      <Row
        justify="end"
        align="top"
        style={{ display: collapse ? "none" : "flex" }}
      >
        <Col span={16} />
        {collapseEl}
      </Row>
    </div>
  );
});
