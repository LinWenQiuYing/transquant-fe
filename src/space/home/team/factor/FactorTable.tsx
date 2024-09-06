import { DataType } from "@transquant/utils";
import { Col, Row, Select, SelectProps, Table, Typography } from "antd";
import type { ColumnsType } from "antd/es/table";
import { observer } from "mobx-react";
import { useDataSource, useStores } from "../../../hooks";
import { TeamMetricOrder } from "../../../types";

const columns: ColumnsType<DataType<TeamMetricOrder>> = [
  {
    title: "排名",
    dataIndex: "index",
    key: "index",
    ellipsis: true,
    width: "10%",
  },
  {
    title: "因子名",
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
    title: "IC",
    dataIndex: "ic",
    key: "ic",
    ellipsis: true,
    width: "20%",
  },
  {
    title: "IR",
    dataIndex: "ir",
    key: "ir",
    ellipsis: true,
    width: "20%",
  },
  {
    title: "年化收益率",
    dataIndex: "annFactorReturn",
    key: "annFactorReturn",
    ellipsis: true,
    width: "20%",
  },
];

const options: SelectProps["options"] = [
  {
    label: "IC",
    value: "ic",
  },
  {
    label: "IR",
    value: "ir",
  },
  {
    label: "年化收益率",
    value: "ann_factor_return",
  },
];

export function getCamelCase(str: string = "") {
  return str.replace(/_([a-z])/g, function (_, i) {
    return i.toUpperCase();
  });
}

export default observer(function FactorTable() {
  const {
    teamFactorMetricOrder,
    getTeamFactorMetricOrder,
    selectedTeamIds,
    factorIndex,
    onFactorIndexChange,
  } = useStores().homeStore;

  const onIndexChange = async (value: string) => {
    await getTeamFactorMetricOrder({
      teamIdList: selectedTeamIds,
      metricName: value,
    });
    onFactorIndexChange(value);
  };

  return (
    <>
      <Row justify="space-between" align="middle" style={{ marginBottom: 20 }}>
        <Col className="title">指标排名</Col>
        <Col>
          <Select
            options={options}
            value={factorIndex}
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
          restColumns.find((item) => item.key === getCamelCase(factorIndex)) ||
            []
        )}
        dataSource={useDataSource<TeamMetricOrder>(teamFactorMetricOrder)}
        pagination={false}
      />
    </>
  );
});
