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
  Popover,
  Row,
  Select,
  Space,
  Typography,
} from "antd";
import dayjs from "dayjs";
import { observer } from "mobx-react";
import { useState } from "react";
import { useStores } from "../../hooks";
import { IPublishSearch } from "../application-record/SearchHeader";

const { RangePicker } = DatePicker;

export default observer(function SearchHeader(props: {
  onCollapseChange?: (value: boolean) => void;
}) {
  const {
    getMyAuditList,
    pagination,
    teams,
    publisherList,
    auditorListForAudit,
    onCacheApproveConfigChange,
    onPaginationChange,
  } = useStores().publishStore;
  const [config, setConfig] = useState<Partial<IPublishSearch>>({});
  const [collapse, setCollapse] = useState(true);
  const [popupVisible, setPopupVisible] = useState(false);

  const onSearch = () => {
    getMyAuditList({
      pageNum: 1,
      pageSize: pagination.pageSize,
      ...config,
    });

    onPaginationChange({ pageNum: 1 });
    onCacheApproveConfigChange(config);
  };

  const onSort = () => {
    onSearch();
    setPopupVisible(false);
  };

  const onReset = () => {
    setConfig({ pageNum: 1 });
    onCacheApproveConfigChange({ pageNum: 1 });
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
            value={config.sortColumn}
            onChange={(value) => {
              setConfig({ ...config, sortColumn: value });
            }}
          >
            <Select.Option key="create_time">提交时间</Select.Option>
            <Select.Option key="team_id">发布团队</Select.Option>
            <Select.Option key="type">项目类型</Select.Option>
            <Select.Option key="publisher_id">发布人</Select.Option>
            <Select.Option key="category">审批方式</Select.Option>
            <Select.Option key="auditStatus">审批状态</Select.Option>
            <Select.Option key="status">工单状态</Select.Option>
          </Select>
        </Col>
      </Row>
      <Row>
        <Col span={24}>排序方式：</Col>
        <Col span={24}>
          <Select
            style={{ width: "100%" }}
            placeholder="请选择排序方式"
            value={config.sortType}
            onChange={(value) => {
              setConfig({ ...config, sortType: value });
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
        <Col span={collapse ? 16 : 24}>
          <Descriptions
            column={collapse ? 3 : 4}
            labelStyle={{ alignItems: "center" }}
          >
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
            <Descriptions.Item label="提交时间">
              <RangePicker
                value={[
                  config.commitTime?.[0] ? dayjs(config.commitTime[0]) : null,
                  config.commitTime?.[1] ? dayjs(config.commitTime[1]) : null,
                ]}
                onChange={(_: any, formatting: string[]) => {
                  setConfig({
                    ...config,
                    commitTime:
                      !formatting[0] && !formatting[1] ? undefined : formatting,
                  });
                }}
              />
            </Descriptions.Item>
            <Descriptions.Item label="项目类型">
              <Select
                placeholder="请选择项目类型"
                value={config.projectType}
                style={{ width: "100%" }}
                showSearch={false}
                onChange={(key) => {
                  setConfig({ ...config, projectType: key });
                }}
              >
                <Select.Option value={0} key={0}>
                  因子
                </Select.Option>
                <Select.Option value={1} key={1}>
                  策略
                </Select.Option>
              </Select>
            </Descriptions.Item>
            {!collapse && (
              <Descriptions.Item label="发布团队">
                <Select
                  placeholder="请选择发布团队"
                  value={config.teamId}
                  style={{ width: "100%" }}
                  showSearch={false}
                  onChange={(key) => {
                    setConfig({ ...config, teamId: key });
                  }}
                >
                  {teams.map((item: any) => (
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
            <Descriptions.Item label="发布人">
              <Select
                placeholder="请选择发布人"
                value={config.publisherId}
                style={{ width: "100%" }}
                showSearch={false}
                onChange={(key) => {
                  setConfig({ ...config, publisherId: key });
                }}
              >
                {publisherList.map((item: any) => (
                  <Select.Option value={item.id} key={item.id}>
                    {item.name}
                  </Select.Option>
                ))}
              </Select>
            </Descriptions.Item>
            <Descriptions.Item label="工单状态">
              <Select
                placeholder="请选择工单状态"
                value={config.status}
                style={{ width: "100%" }}
                showSearch={false}
                onChange={(key) => {
                  setConfig({ ...config, status: key });
                }}
              >
                <Select.Option value={0}>审核中</Select.Option>
                <Select.Option value={1}>入库</Select.Option>
                <Select.Option value={2}>驳回</Select.Option>
              </Select>
            </Descriptions.Item>
            <Descriptions.Item label="申请工单">
              <Input
                placeholder="请输入申请工单"
                value={config.code}
                onChange={(e) => setConfig({ ...config, code: e.target.value })}
              />
            </Descriptions.Item>

            <Descriptions.Item label="申请原因">
              <Input
                placeholder="请输入申请原因"
                value={config.reason}
                maxLength={50}
                onChange={(e) =>
                  setConfig({ ...config, reason: e.target.value })
                }
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
        <Col span={18}>
          <Descriptions column={3} labelStyle={{ alignItems: "center" }}>
            <Descriptions.Item label="审批方式">
              <Select
                placeholder="请选择审批方式"
                value={config.category}
                style={{ width: "100%" }}
                showSearch={false}
                onChange={(key) => {
                  setConfig({ ...config, category: key });
                }}
              >
                <Select.Option value={1}>无需审批</Select.Option>
                <Select.Option value={0}>逐层审批</Select.Option>
                <Select.Option value={2}>全部通过</Select.Option>
                <Select.Option value={3}>任一人通过</Select.Option>
              </Select>
            </Descriptions.Item>
            <Descriptions.Item label="审核员">
              <Select
                placeholder="请选择审核员"
                value={config.auditorId}
                style={{ width: "100%" }}
                showSearch={false}
                onChange={(key) => {
                  setConfig({ ...config, auditorId: key });
                }}
              >
                {auditorListForAudit.map((item) => (
                  <Select.Option value={item.id} key={item.id}>
                    {item.name}
                  </Select.Option>
                ))}
              </Select>
            </Descriptions.Item>

            <Descriptions.Item label="审批状态">
              <Select
                placeholder="请选择审批状态"
                value={config.auditStatus}
                style={{ width: "100%" }}
                showSearch={false}
                onChange={(key) => {
                  setConfig({ ...config, auditStatus: key });
                }}
              >
                <Select.Option value={1}>已通过</Select.Option>
                <Select.Option value={2}>未通过</Select.Option>
                <Select.Option value={99}>审批中</Select.Option>
              </Select>
            </Descriptions.Item>
          </Descriptions>
        </Col>
      </Row>
      <Row
        justify="end"
        align="top"
        style={{ display: collapse ? "none" : "flex" }}
      >
        {!collapse && collapseEl}
      </Row>
    </div>
  );
});
