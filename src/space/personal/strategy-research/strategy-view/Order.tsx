import { FilterOutlined } from "@ant-design/icons";
import { DataType, usePagination } from "@transquant/utils";
import {
  Button,
  Col,
  DatePicker,
  Input,
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
import { useParams } from "react-router-dom";
import { useDataSource, useStores } from "../../../hooks";
import { OrderItem } from "../../../types";

export interface IncreOrderSearch {
  buySell: string;
  code: string;
  endTime: string;
  openClose: string;
  pageNum: number;
  pageSize: number;
  startTime: string;
  timeRangeType: number;
}

const SearchHeader = observer(() => {
  const {
    getOrderDetail,
    pagination,
    onCacheOrderConfig,
    onStrategyOrderSearchValueChange,
    onPaginationChange,
    currentJob,
  } = useStores().strategyResearchStore;
  const [config, setConfig] = useState<Partial<IncreOrderSearch>>({
    timeRangeType: 0,
  });
  const [popupVisible, setPopupVisible] = useState(false);
  const params = useParams();
  const strategyId = parseInt(params.id || "");

  const onSearch = (config: Partial<IncreOrderSearch>) => {
    const _config = {
      pageNum: 1,
      pageSize: pagination.pageSize,
      strategyId,
      ...config,
    };
    getOrderDetail(_config);
    onCacheOrderConfig(config);
    onPaginationChange({ pageNum: 1 });
    onStrategyOrderSearchValueChange(config);
  };

  const onTimeRangeChange: RadioGroupProps["onChange"] = (e) => {
    const timeRangeType = e.target.value;
    const _config = { ...config, timeRangeType };
    setConfig(_config);
    if (timeRangeType !== 3) {
      onSearch(_config);
    }
  };

  const onReset = () => {
    setConfig({
      ...config,
      code: undefined,
      openClose: undefined,
      buySell: undefined,
    });
  };

  const dropdownRender = (
    <div style={{ width: "300px" }}>
      <Row align="middle" style={{ marginBottom: 10 }}>
        <Col span={6} style={{ textAlign: "right" }}>
          合约代码：
        </Col>
        <Col span={18}>
          <Input
            placeholder="请输入合约代码"
            value={config.code}
            onChange={(e) => setConfig({ ...config, code: e.target.value })}
          />
        </Col>
      </Row>
      <Row>
        <Col span={6} style={{ textAlign: "right" }}>
          方向：
        </Col>
        <Col span={18}>
          <Select
            options={[
              { value: "buy", label: "买" },
              { value: "sell", label: "卖" },
              { value: "even", label: "平" },
            ]}
            placeholder="请选择方向"
            style={{ width: "100%" }}
            value={config.buySell}
            onChange={(value) => setConfig({ ...config, buySell: value })}
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
              disabledDate={(current) =>
                current >
                  dayjs((currentJob as { endTime?: string })?.endTime) ||
                current <
                  dayjs((currentJob as { startTime?: string })?.startTime)
              }
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

export default observer(function OrderView() {
  const {
    orderTable,
    orderTableLoading,
    pagination,
    onPaginationChange,
    getOrderDetail,
  } = useStores().strategyResearchStore;
  const params = useParams();
  const strategyId = parseInt(params.id || "");

  const columns: ColumnsType<DataType<OrderItem>> = [
    {
      title: "时间",
      dataIndex: "datetime",
      key: "dateTime",
      width: 200,
      ellipsis: true,
      fixed: "left",
    },
    {
      title: "交易日",
      key: "trade_date",
      dataIndex: "trade_date",
      width: 200,
    },
    {
      title: "合约代码",
      dataIndex: "code",
      key: "code",
      width: 200,
      ellipsis: true,
    },
    {
      title: "方向",
      dataIndex: "buy_sell",
      key: "buy_sell",
      width: 200,
      ellipsis: true,
    },
    {
      title: "开/平",
      key: "open_close",
      dataIndex: "open_close",
      width: 200,
    },
    {
      title: "成交价",
      dataIndex: "price",
      key: "price",
      width: 200,
      ellipsis: true,
    },
    {
      title: "成交量",
      dataIndex: "volume",
      key: "volume",
      width: 200,
      ellipsis: true,
    },
    {
      title: "费用",
      dataIndex: "fee",
      key: "fee",
      width: 200,
      ellipsis: true,
    },
  ];

  return (
    <div>
      <Table
        columns={columns}
        dataSource={useDataSource<OrderItem>(orderTable?.datas)}
        size="small"
        loading={orderTableLoading}
        scroll={{ x: 1100, y: "calc(100vh - 460px)" }}
        pagination={{
          ...usePagination({
            total: orderTable?.total,
            IPageNum: pagination.pageNum,
            IPageSize: pagination.pageSize,
            onPaginationChange,
            onRequest(pageIndex, pageSize) {
              getOrderDetail({
                strategyId,
                pageNum: pageIndex,
                pageSize,
              });
            },
          }),
        }}
        title={() => <SearchHeader />}
      />
    </div>
  );
});
