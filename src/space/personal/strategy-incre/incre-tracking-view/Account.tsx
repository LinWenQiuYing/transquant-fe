import { FilterOutlined } from "@ant-design/icons";
import { DataType } from "@transquant/utils";
import {
  Button,
  Col,
  DatePicker,
  Popover,
  Radio,
  RadioGroupProps,
  Row,
  Select,
  Space,
  Table,
} from "antd";
import type { ColumnsType } from "antd/es/table";
import dayjs from "dayjs";
import { observer } from "mobx-react";
import { useState } from "react";
import { useDataSource, useStores } from "../../../hooks";
import { Account } from "../../../types";

interface IAccountSearch {
  date: string;
  type: string;
  startTime: string;
  endTime: string;
  timeRangeType: number;
}

const SearchHeader = observer(() => {
  const { getAccountList, onStrategyViewAccountSearchValueChange } =
    useStores().strategyResearchStore;
  const [popupVisible, setPopupVisible] = useState(false);
  const [config, setConfig] = useState<Partial<IAccountSearch>>({
    timeRangeType: 0,
  });

  const onSearch = (config: Partial<IAccountSearch>) => {
    getAccountList(config);
    onStrategyViewAccountSearchValueChange(config);
  };

  const onReset = () => {
    setConfig({
      ...config,
      type: undefined,
    });
  };

  const dropdownRender = (
    <div style={{ width: "300px" }}>
      <Row style={{ marginTop: 10, marginBottom: 10 }} align="middle">
        <Col span={6} style={{ textAlign: "right" }}>
          账户类别：
        </Col>
        <Col span={18}>
          <Select
            options={[
              { value: "stock", label: "股票" },
              { value: "future", label: "期货" },
            ]}
            value={config.type}
            placeholder="请选择账户类别"
            style={{ width: "100%" }}
            onChange={(value) => setConfig({ ...config, type: value })}
          />
        </Col>
      </Row>
      <Row justify="end" style={{ marginTop: 10 }}>
        <Col>
          <Button
            onClick={() => {
              setPopupVisible(false);
              onReset();
            }}
          >
            取消
          </Button>
          <Button style={{ marginRight: 10, marginLeft: 10 }} onClick={onReset}>
            重置
          </Button>
          <Button type="primary" onClick={() => onSearch(config)}>
            查询
          </Button>
        </Col>
      </Row>
    </div>
  );

  const onTimeRangeChange: RadioGroupProps["onChange"] = (e) => {
    const timeRangeType = e.target.value;
    const _config = { ...config, timeRangeType };
    setConfig(_config);
    if (timeRangeType !== 3) {
      onSearch(_config);
    }
  };

  return (
    <Row justify="space-between">
      <Col>
        <Space>
          <Radio.Group
            buttonStyle="solid"
            value={config.timeRangeType || 0}
            onChange={onTimeRangeChange}
          >
            <Radio.Button value={0}>近三月</Radio.Button>
            <Radio.Button value={1}>近六月</Radio.Button>
            <Radio.Button value={2}>近一年</Radio.Button>
            <Radio.Button value={3}>自定义</Radio.Button>
          </Radio.Group>
          {config.timeRangeType === 3 && (
            <DatePicker.RangePicker
              allowClear={false}
              value={[
                config.startTime ? dayjs(config.startTime) : null,
                config.endTime ? dayjs(config.endTime) : null,
              ]}
              onChange={(_any, formatting: string[]) => {
                const _config = {
                  ...config,
                  startTime: formatting[0],
                  endTime: formatting[1],
                };
                setConfig(_config);
                onSearch(_config);
              }}
            />
          )}
        </Space>
      </Col>
      <Col>
        <Popover
          content={dropdownRender}
          placement="bottom"
          trigger={["click"]}
          open={popupVisible}
        >
          <Button
            icon={<FilterOutlined />}
            onClick={() => setPopupVisible(true)}
          >
            筛选
          </Button>
        </Popover>
      </Col>
    </Row>
  );
});

export default observer(function AccountView() {
  const { accounts, accountsLoading } = useStores().strategyResearchStore;

  const columns: ColumnsType<DataType<Account>> = [
    {
      title: "日期",
      dataIndex: "datetime",
      key: "dateTime",
      width: 200,
      ellipsis: true,
      fixed: "left",
    },
    {
      title: "账户类别",
      dataIndex: "type",
      key: "type",
      width: 200,
      ellipsis: true,
    },
    {
      title: "总权益",
      dataIndex: "euqity",
      key: "euqity",
      width: 200,
      ellipsis: true,
    },
    {
      title: "保证金",
      key: "margin",
      dataIndex: "margin",
      width: 200,
    },
    {
      title: "可用资金",
      dataIndex: "cash",
      key: "cash",
      width: 200,
      ellipsis: true,
    },
    {
      title: "市值",
      dataIndex: "holding_mv",
      key: "holding_mv",
      width: 200,
      ellipsis: true,
    },
    {
      title: "当日盈亏",
      dataIndex: "pnl",
      key: "pnl",
      width: 200,
      ellipsis: true,
    },
    {
      title: "申报费",
      dataIndex: "declare_fees",
      key: "declare_fees",
      width: 200,
      ellipsis: true,
    },
    {
      title: "费用",
      dataIndex: "fees",
      key: "fees",
      width: 200,
      ellipsis: true,
    },
  ];

  return (
    <div>
      <Table
        columns={columns}
        dataSource={useDataSource<Account>(accounts)}
        size="small"
        loading={accountsLoading}
        scroll={{ x: 1100, y: "calc(100vh - 460px)" }}
        pagination={{
          size: "small",
          showTotal: (total) => `总共${total}条记录`,
          showSizeChanger: true,
          showQuickJumper: true,
          pageSizeOptions: ["10", "15", "30", "50"],
        }}
        title={() => <SearchHeader />}
      />
    </div>
  );
});
