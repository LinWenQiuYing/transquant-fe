import { FilterOutlined, LeftOutlined, RightOutlined } from "@ant-design/icons";
import { DataType } from "@transquant/utils";
import {
  Button,
  Col,
  DatePicker,
  DatePickerProps,
  Input,
  Popover,
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
import { PositionTable } from "../../../types";

interface IPositionSearch {
  code: string;
  date: string;
  flag: string;
}

export const DATE_FORMAT = "YYYY-MM-DD";

const SearchHeader = observer(() => {
  const {
    getTeamPositionDetail,
    currentJob,
    onStrategyViewPositionSearchValueChange,
  } = useStores().groupStrategyStore;
  const [popupVisible, setPopupVisible] = useState(false);
  const [config, setConfig] = useState<Partial<IPositionSearch>>({
    date: dayjs().format(DATE_FORMAT),
  });
  const params = useParams();
  const strategyId = parseInt(params.id || "");

  const onSearch = (config: Partial<IPositionSearch>) => {
    getTeamPositionDetail({ ...config, strategyId });
    onStrategyViewPositionSearchValueChange(config);
  };

  const onChange: DatePickerProps["onChange"] = (date, dateString) => {
    setConfig({ ...config, date: dateString });
    onSearch({ date: dateString });
  };

  const onPrev = () => {
    const _config = {
      ...config,
      date: dayjs(config.date).subtract(1, "days").format(DATE_FORMAT),
    };
    setConfig(_config);
    onSearch(_config);
  };

  const onNext = () => {
    const _config = {
      ...config,
      date: dayjs(config.date).add(1, "days").format(DATE_FORMAT),
    };
    setConfig(_config);
    onSearch(_config);
  };

  const onReset = () => {
    setConfig({
      ...config,
      code: undefined,
      flag: undefined,
    });
  };

  const nextBtnDisabled = dayjs().format(DATE_FORMAT) === config.date;

  const dropdownRender = (
    <div style={{ width: "300px" }}>
      <Row align="middle">
        <Col style={{ textAlign: "right" }} span={6}>
          合约代码：
        </Col>
        <Col span={18}>
          <Input
            placeholder="请输入合约代码"
            value={config.code}
            onChange={(e) => {
              setConfig({ ...config, code: e.target.value });
            }}
          />
        </Col>
      </Row>
      <Row align="middle" style={{ marginTop: 10, marginBottom: 10 }}>
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
            value={config.flag}
            onChange={(value) => {
              setConfig({ ...config, flag: value });
            }}
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
          <DatePicker
            value={dayjs(config.date)}
            onChange={onChange}
            allowClear={false}
            disabledDate={(current) => {
              return (
                current > dayjs(currentJob?.endTime) ||
                current < dayjs(currentJob?.startTime)
              );
            }}
          />
          <Button icon={<LeftOutlined />} onClick={onPrev} />
          <Button
            icon={<RightOutlined />}
            disabled={nextBtnDisabled}
            onClick={onNext}
          />
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

export default observer(function PositionView() {
  const { positionTableLoading, positionTable } =
    useStores().groupStrategyStore;

  const columns: ColumnsType<DataType<PositionTable>> = [
    {
      title: "日期",
      dataIndex: "datetime",
      key: "datetime",
      width: 200,
      ellipsis: true,
      fixed: "left",
    },
    {
      title: "合约代码",
      dataIndex: "code",
      key: "code",
      width: 200,
      ellipsis: true,
    },
    {
      title: "最新价",
      key: "settle",
      dataIndex: "settle",
      width: 200,
    },
    {
      title: "方向",
      dataIndex: "flag",
      key: "flag",
      width: 200,
      ellipsis: true,
    },
    {
      title: "仓位",
      dataIndex: "net_pos",
      key: "net_pos",
      width: 200,
      ellipsis: true,
    },
    {
      title: "市值",
      dataIndex: "net_equity",
      key: "net_equity",
      width: 200,
      ellipsis: true,
    },
    {
      title: "累计盈亏",
      dataIndex: "pnl",
      key: "pnl",
      width: 200,
      ellipsis: true,
    },
    {
      title: "保证金",
      key: "occ_margin",
      dataIndex: "occ_margin",
      width: 200,
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
        dataSource={useDataSource<PositionTable>(positionTable)}
        size="small"
        loading={positionTableLoading}
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
