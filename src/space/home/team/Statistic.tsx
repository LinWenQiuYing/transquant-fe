import { CaretDownOutlined, CaretUpOutlined } from "@ant-design/icons";
import { clsPrefix, PUBLICURL } from "@transquant/constants";
import { Avatar, Card, List, Row, Space } from "antd";
import { Else, If, Then } from "react-if";
import { TeamOverview } from "../../types";

interface StatisticProps {
  data: TeamOverview;
}

export interface IStatistic {
  id: number;
  title: string;
  value: number | string;
  footer?: {
    name: string;
    value: number;
  };
  showIcon?: boolean;
  avatarUrl: string;
}

export interface StatisticItemProps {
  statistic: IStatistic;
}

export default function Statistic(props: StatisticProps) {
  const { data } = props;

  const statistics: IStatistic[] = [
    {
      id: 0,
      title: "昨日用户登录数",
      value: data.userLoginYest,
      footer: {
        name: "用户总数",
        value: data.userSum,
      },
      avatarUrl: `${PUBLICURL}/images/home/team1.png`,
    },
    {
      id: 1,
      title: "因子总数",
      value: data.factorSum,
      footer: {
        name: "昨日新增",
        value: data.factorAddYest,
      },
      showIcon: true,
      avatarUrl: `${PUBLICURL}/images/home/team2.png`,
    },
    {
      id: 2,
      title: "策略总数",
      value: data.strategySum,
      footer: {
        name: "昨日新增",
        value: data.strategyAddYest,
      },
      showIcon: true,
      avatarUrl: `${PUBLICURL}/images/home/team3.png`,
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
    <Card
      className={`${clsPrefix}-statistic-team mt-5 [&>.trans-quant-antd-card-body]:p-2.5 [&>.trans-quant-antd-card-body>div>div>div>p]:font-semibold`}
    >
      <Row justify="space-between" align="middle">
        <Avatar src={statistic.avatarUrl} size={48} />
        <Space direction="vertical" align="end" size={0}>
          <span>{statistic.title}</span>
          <p>{statistic.value ?? "-"}</p>
          <div className="[&>span]:text-gray-400 [&>span:first-of-type]:pr-[3px]">
            <span>{statistic.footer?.name}：</span>

            <If condition={statistic.showIcon}>
              <Then>
                {statistic.footer && statistic.footer.value >= 0 ? (
                  <span style={{ color: "var(--lime-600)" }}>
                    <CaretUpOutlined />
                    {statistic.footer?.value ?? "-"}
                  </span>
                ) : (
                  <span style={{ color: "var(--red-600)" }}>
                    <CaretDownOutlined />
                    {statistic.footer?.value ?? "-"}
                  </span>
                )}
              </Then>
              <Else>
                <span>{statistic.footer?.value ?? "-"}</span>
              </Else>
            </If>
          </div>
        </Space>
      </Row>
    </Card>
  );
};
