import { clsPrefix, PUBLICURL } from "@transquant/constants";
import { Avatar, Card, List, Row, Space } from "antd";
import { PersonalOverview } from "../../types";
import { IStatistic } from "../team/Statistic";

interface StatisticProps {
  data: PersonalOverview;
}

export interface StatisticItemProps {
  statistic: IStatistic;
}

export default function Statistic(props: StatisticProps) {
  const { data } = props;

  const statistics: IStatistic[] = [
    {
      id: 0,
      title: "个人因子总数",
      value: data.factorSum,
      avatarUrl: `${PUBLICURL}/images/home/personal1.png`,
    },
    {
      id: 1,
      title: "审核入库因子数",
      value: data.auditFactorSum,
      avatarUrl: `${PUBLICURL}/images/home/personal2.png`,
    },
    {
      id: 2,
      title: "个人策略总数",
      value: data.strategySum,
      avatarUrl: `${PUBLICURL}/images/home/personal3.png`,
    },
    {
      id: 3,
      title: "审批入库策略数",
      value: data.auditStrategySum,
      avatarUrl: `${PUBLICURL}/images/home/personal4.png`,
    },
  ];

  return (
    <List
      grid={{ gutter: 16, column: statistics.length }}
      dataSource={statistics}
      renderItem={(item) => (
        <List.Item>
          <Statistic.Item statistic={item} />
        </List.Item>
      )}
    />
  );
}

Statistic.Item = (props: StatisticItemProps) => {
  const { statistic } = props;
  return (
    <Card className={`${clsPrefix}-statistic-personal`}>
      <Row justify="space-between" align="middle">
        <Avatar src={statistic.avatarUrl} size={48} />
        <Space direction="vertical" align="end">
          <span>{statistic.title}</span>
          <p>{statistic.value}</p>
        </Space>
      </Row>
    </Card>
  );
};
