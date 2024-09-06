import { clsPrefix } from "@transquant/constants";
import { ECOption, useEcharts } from "@transquant/utils";
import { Col, Empty, Row } from "antd";
import { observer } from "mobx-react";
import { useEffect } from "react";
import { useStores } from "../../../hooks";
import { grey400, presetColor } from "../../helpers";
import { emptyCenterSylte } from "../../personal/FactorView";
import { getAxias, getSubTitle } from "../UserView";
import "./index.less";
import FactorTable from "./StrategyTable";

export default observer(function StrategyView() {
  const { strategySumList, strategyPieChart } = useStores().homeStore;

  const total = strategyPieChart.reduce((sum, curr) => {
    sum += curr.sum;
    return sum;
  }, 0);

  const pieEmptyRadioOptions: ECOption = {
    title: {
      show: false,
    },
  };
  const pieRadioOptions: ECOption = {
    title: {
      text: `${total}`,
      subtext: "总数",
      left: "76px",
      top: "120px",
      textAlign: "center",
      textStyle: {
        fontSize: 28,
      },
    },
    color: presetColor,
    tooltip: {
      show: false,
      trigger: "none",
    },
    grid: {
      left: 10,
    },
    legend: {
      type: "scroll",
      top: "center",
      left: "150px",
      align: "left",
      itemWidth: 14,
      itemHeight: 14,
      orient: "vertical",
      formatter(name) {
        let total = 0;
        let target = 0;
        for (let i = 0; i < strategyPieChart.length; i++) {
          total += strategyPieChart[i].sum;
          if (strategyPieChart[i].teamName === name) {
            target = strategyPieChart[i].sum;
          }
        }
        const arr = [
          `{a|${name.length > 6 ? name.slice(0, 6).concat("...") : name} | ${(
            (target / total) *
            100
          ).toFixed(2)}%}`,
          `{b|${target}}`,
        ];
        return arr.join("   ");
      },
      textStyle: {
        padding: [2, 0, 0, 0],
        rich: {
          a: {
            fontSize: 14,
            width: 150,
            color: grey400,
          },
          b: {
            fontSize: 14,
            width: 40,
          },
        },
      },
    },
    series: [
      {
        type: "pie",
        center: ["80px", "150px"],
        radius: ["30%", "40%"],
        label: {
          show: false,
        },
        tooltip: {
          show: false,
        },
        avoidLabelOverlap: false,
        labelLine: {
          show: false,
        },
        data: strategyPieChart.map((item) => ({
          value: item.sum,
          name: item.teamName,
        })),
      },
    ],
  };
  const lineEmptyFactorOptions: ECOption = {
    title: {
      text: "团队策略数",
      textStyle: {
        fontSize: 14,
      },
    },
  };
  const lineFactorOptions: ECOption = {
    title: [
      {
        text: "团队策略数",
        textStyle: {
          fontSize: 14,
        },
      },
      getSubTitle(70),
    ],
    color: presetColor,
    tooltip: {
      show: true,
      trigger: "axis",
      className: `echarts-tooltip-light`,
      axisPointer: {
        type: "cross",
      },
      confine: true,
    },
    legend: {
      type: "scroll",
      orient: "horizontal",
      icon: "rect",
      itemWidth: 14,
      left: "center",
      bottom: 20,
    },
    grid: {
      left: "8%",
      right: "6%",
    },
    xAxis: {
      type: "category",
      axisLine: {
        lineStyle: {
          color: grey400,
        },
      },
      data: getAxias(strategySumList, "teamLineChartList"),
    },
    axisTick: {
      lineStyle: {
        color: grey400,
      },
    },
    axisLabel: {
      color: grey400,
    },
    yAxis: {
      type: "value",
      splitNumber: 4,
    },
    series: strategySumList.map((item, index) => {
      const color = presetColor[index];
      return {
        type: "line",
        name: item.teamName,
        symbol: "circle",
        symbolSize: 0,
        lineStyle: {
          color,
        },
        data: item.teamLineChartList?.map((item) => [
          item.horizon,
          item.vertical,
        ]),
      };
    }),
  };

  const _pieRadioOptions = strategyPieChart.length
    ? pieRadioOptions
    : pieEmptyRadioOptions;
  const _lineFactorOptions = strategySumList.length
    ? lineFactorOptions
    : lineEmptyFactorOptions;

  const {
    domRef: pieRef,
    update: pieRefUpdate,
    chart: pieChart,
  } = useEcharts<HTMLDivElement>(_pieRadioOptions);
  const { domRef: activeRadioRef, update: activeRadioRefUpdate } =
    useEcharts<HTMLDivElement>(_lineFactorOptions);

  pieChart?.on("legendselectchanged", function (params: any) {
    const selectedTeams = Object.entries(params?.selected)
      .filter((item) => item[1])
      .map((item) => item[0]);

    const total = strategyPieChart.reduce((sum, curr) => {
      if (selectedTeams.includes(curr.teamName)) {
        sum += curr.sum;
      } else {
        sum += 0;
      }
      return sum;
    }, 0);

    pieChart.setOption({
      title: {
        text: total,
      },
    });
  });

  useEffect(() => {
    pieRefUpdate(_pieRadioOptions);
    activeRadioRefUpdate(_lineFactorOptions);
  }, [strategySumList, strategyPieChart]);

  return (
    <div className={`${clsPrefix}-home-team-strategy`}>
      <Row justify="space-between" align="middle" className="header">
        <Col className="title">策略</Col>
      </Row>
      <Row justify="space-between" className="chart-content">
        <Col span={12} style={{ position: "relative" }}>
          <Col
            span={24}
            ref={pieRef}
            style={{ height: 300 }}
            className="team-radio"
          />
          {!strategyPieChart.length && (
            <Empty style={emptyCenterSylte} description="暂无数据" />
          )}
        </Col>
        <Col span={12} style={{ position: "relative" }}>
          <Col span={24} ref={activeRadioRef} style={{ height: 300 }} />
          {!strategySumList.length && (
            <Empty style={emptyCenterSylte} description="暂无数据" />
          )}
        </Col>
      </Row>
      <FactorTable />
    </div>
  );
});
