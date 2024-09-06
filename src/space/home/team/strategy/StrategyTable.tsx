import { DataType } from "@transquant/utils";
import { Col, Row, Select, SelectProps, Table, Typography } from "antd";
import type { ColumnsType } from "antd/es/table";
import { observer } from "mobx-react";
import { useDataSource, useStores } from "../../../hooks";
import { TeamMetricOrder } from "../../../types";
import { getCamelCase } from "../factor/FactorTable";

const columns: ColumnsType<DataType<TeamMetricOrder>> = [
  {
    title: "排名",
    dataIndex: "index",
    key: "index",
    ellipsis: true,
    width: "10%",
  },
  {
    title: "策略名",
    dataIndex: "name",
    key: "name",
    ellipsis: true,
    width: "20%",
    render(value: string) {
      return <Typography.Text>{value}</Typography.Text>;
    },
  },
  {
    title: "团队名",
    dataIndex: "teamName",
    key: "teamName",
    ellipsis: true,
    width: "30%",
  },
  {
    title: "发布人",
    dataIndex: "publisher",
    key: "publisher",
    ellipsis: true,
    width: "20%",
  },
];
const restColumns: ColumnsType<DataType<TeamMetricOrder>> = [
  {
    title: "年化收益率",
    dataIndex: "annStrategyReturn",
    key: "annStrategyReturn",
    width: "20%",
    ellipsis: true,
    render(annStrategyReturn) {
      return `${(annStrategyReturn * 100).toFixed(2)}%`;
    },
  },
  {
    title: "夏普率",
    dataIndex: "sharpRatio",
    key: "sharpRatio",
    width: "20%",
    ellipsis: true,
  },
  {
    title: "索提诺比率",
    dataIndex: "sortinoRatio",
    key: "sortinoRatio",
    width: "20%",
    ellipsis: true,
  },
  {
    title: "波动率",
    dataIndex: "volatility",
    key: "volatility",
    width: "20%",
    ellipsis: true,
  },
];

const options: SelectProps["options"] = [
  {
    label: "年化收益率",
    value: "ann_strategy_return",
  },
  {
    label: "夏普率",
    value: "sharp_ratio",
  },
  {
    label: "索提诺比率",
    value: "sortino_ratio",
  },
  {
    label: "波动率",
    value: "volatility",
  },
];

export default observer(function StrategyTable() {
  const {
    teamStrategyMetricOrder,
    getTeamStrategyMetricOrder,
    selectedTeamIds,
    strategyIndex,
    onStrategyIndexChange,
  } = useStores().homeStore;

  const onIndexChange = async (value: string) => {
    await getTeamStrategyMetricOrder({
      teamIdList: selectedTeamIds,
      metricName: value,
    });
    onStrategyIndexChange(value);
  };

  return (
    <>
      <Row justify="space-between" align="middle" style={{ marginBottom: 20 }}>
        <Col className="title">指标排名</Col>
        <Col>
          <Select
            options={options}
            value={strategyIndex}
            onChange={onIndexChange}
            style={{ width: 200 }}
            placeholder="请选择指标"
            allowClear
          />
        </Col>
      </Row>
      <Table
        size="small"
        columns={columns.concat(
          restColumns.find(
            (item) => item.key === getCamelCase(strategyIndex)
          ) || []
        )}
        dataSource={useDataSource<TeamMetricOrder>(teamStrategyMetricOrder)}
        pagination={false}
      />
    </>
  );
});
