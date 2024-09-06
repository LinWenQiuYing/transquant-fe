import {
  DownOutlined,
  SearchOutlined,
  SyncOutlined,
  UpOutlined,
} from "@ant-design/icons";
import { range } from "@transquant/space/incre-tracking-modal";
import { IconFont } from "@transquant/ui";
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
  TimePicker,
  Typography,
} from "antd";
import dayjs from "dayjs";
import { cloneDeep } from "lodash-es";
import { observer } from "mobx-react";
import { useEffect, useState } from "react";
import { useStores } from "../../../hooks";

const { RangePicker } = DatePicker;

export interface IJobsLibSearch {
  pageNum: number;
  pageSize: number;
  jobName: string;
  className: string;
  columnOrderBy: string;
  name: string;
  tags: number[];
  createTimeList: string[];
  runStatus: number;
  startTimeList: string[];
  scheduleTimeList: string[];
  lastSuccessTimeList: string[];
  orderBy: number;
}

export default observer(function SearchHeader(props: {
  onCollapseChange?: (value: boolean) => void;
}) {
  const {
    getFactorQuartzTeamJob,
    getQuartzTeamJobTags,
    teamTags,
    selectedTeam,
    pagination,
    onCacheJobsConfig,
    onPaginationChange,
  } = useStores().groupFactorStore;
  const [config, setConfig] = useState<Partial<IJobsLibSearch>>({});
  const [collapse, setCollapse] = useState(true);
  const [popupVisible, setPopupVisible] = useState(false);

  useEffect(() => {
    getQuartzTeamJobTags();
  }, [selectedTeam.id]);

  const onSearch = () => {
    const { ...restConfig } = config;
    const _config = {
      ...restConfig,
    };

    getFactorQuartzTeamJob({
      pageNum: 1,
      pageSize: pagination.pageSize,
      ..._config,
    });

    onPaginationChange({ pageNum: 1 });
    onCacheJobsConfig(_config);
  };

  const onSort = () => {
    onSearch();
    setPopupVisible(false);
  };

  const onReset = () => {
    setConfig({ pageNum: 1 });
    onCacheJobsConfig({ pageNum: 1 });
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
            <Select.Option key="createTime">创建时间</Select.Option>
            <Select.Option key="lastSuccessTime">
              上次计算成功时间
            </Select.Option>
            <Select.Option key="startTime">历史回测开始时间</Select.Option>
            <Select.Option key="scheduleFrequency">调度频率</Select.Option>
            <Select.Option key="scheduleTime">调度时间</Select.Option>
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
            <Descriptions.Item label="任务名称">
              <Input
                placeholder="请输入任务名称"
                maxLength={15}
                value={config.jobName}
                onChange={(e) =>
                  setConfig({ ...config, jobName: e.target.value })
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
                  {teamTags.map((item) => (
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
            <Descriptions.Item label="创建时间">
              <RangePicker
                value={[
                  config.createTimeList?.[0]
                    ? dayjs(config.createTimeList[0])
                    : null,
                  config.createTimeList?.[1]
                    ? dayjs(config.createTimeList[1])
                    : null,
                ]}
                onChange={(_: any, formatting: string[]) => {
                  setConfig({
                    ...config,
                    createTimeList:
                      !formatting[0] && !formatting[1] ? undefined : formatting,
                  });
                }}
              />
            </Descriptions.Item>
            <Descriptions.Item label="状态">
              <Select
                placeholder="请选择状态"
                value={config.runStatus}
                style={{ width: "100%" }}
                showSearch={false}
                onChange={(key) => {
                  setConfig({ ...config, runStatus: key });
                }}
              >
                <Select.Option value={0}>运行中</Select.Option>
                <Select.Option value={1}>已停止</Select.Option>
                <Select.Option value={2}>已结束</Select.Option>
              </Select>
            </Descriptions.Item>
            <Descriptions.Item label="历史回测开始时间">
              <RangePicker
                value={[
                  config.startTimeList?.[0]
                    ? dayjs(config.startTimeList[0])
                    : null,
                  config.startTimeList?.[1]
                    ? dayjs(config.startTimeList[1])
                    : null,
                ]}
                onChange={(_: any, formatting: string[]) => {
                  setConfig({
                    ...config,
                    startTimeList:
                      !formatting[0] && !formatting[1] ? undefined : formatting,
                  });
                }}
              />
            </Descriptions.Item>
            <Descriptions.Item label="调度时间">
              <TimePicker.RangePicker
                style={{ width: "100%" }}
                disabledTime={() => ({
                  disabledHours: () => range(0, 24).slice(9, 17),
                })}
                format="HH:mm"
                showNow={false}
                value={[
                  config.scheduleTimeList?.[0]
                    ? cloneDeep(dayjs(config.scheduleTimeList[0], "HH:mm"))
                    : null,
                  config.scheduleTimeList?.[1]
                    ? cloneDeep(dayjs(config.scheduleTimeList[1], "HH:mm"))
                    : null,
                ]}
                onChange={(_: any, formatting: string[]) => {
                  setConfig({
                    ...config,
                    scheduleTimeList:
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
        <Col span={6}>
          <Descriptions column={1}>
            <Descriptions.Item label="上次计算成功时间">
              <RangePicker
                value={[
                  config.lastSuccessTimeList?.[0]
                    ? dayjs(config.lastSuccessTimeList[0])
                    : null,
                  config.lastSuccessTimeList?.[1]
                    ? dayjs(config.lastSuccessTimeList[1])
                    : null,
                ]}
                onChange={(_: any, formatting: string[]) => {
                  setConfig({
                    ...config,
                    lastSuccessTimeList:
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
