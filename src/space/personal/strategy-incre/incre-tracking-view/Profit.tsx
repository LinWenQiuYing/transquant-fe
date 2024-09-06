import { clsPrefix } from "@transquant/constants";
import { ECOption, Nullable, useEcharts } from "@transquant/utils";
import { Col, Empty, Row, Space, Statistic } from "antd";
import { observer } from "mobx-react";
import { useEffect } from "react";
import { useStores } from "../../../hooks";
import { StrategyKPI } from "../../../types";

export const grey400 = "#97A3B7";

export const presetColor = "#268AFF";
export const presetShadowColor = "#7ab3f5";

export const emptyCenterSylte: React.CSSProperties = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
};

const placeholder = "/";

const ProfitKPI = (props: { strategyKPI: Nullable<StrategyKPI> }) => {
  const { strategyKPI } = props;
  return (
    <Row className={`${clsPrefix}-incre-tracking-view-profit`}>
      <Col span={5}>
        <Statistic
          title="总权益"
          value={strategyKPI?.total_equity || placeholder}
          suffix="元"
        />
      </Col>
      <Col span={5}>
        <Statistic
          title="累计收益"
          value={strategyKPI?.accum_gain || placeholder}
          suffix="元"
        />
      </Col>
      <Col span={5}>
        <Statistic
          title="累计收益率"
          value={`${strategyKPI?.accum_ret || placeholder}`}
          suffix="%"
        />
      </Col>
      <Col span={5}>
        <Statistic
          title="夏普率"
          value={`${strategyKPI?.sharpe || placeholder}`}
        />
      </Col>
      <Col span={4}>
        <Statistic
          title="最大回撤"
          value={`${strategyKPI?.max_dd || placeholder}`}
          suffix="%"
        />
      </Col>
    </Row>
  );
};

export default observer(function ProfitView() {
  const { strategyKPI, strategyPnlList, strategyReturnList } =
    useStores().strategyResearchStore;

  const lineReturnEmptyOptions: ECOption = {
    title: {
      text: "累计收益率",
      textStyle: {
        fontSize: 14,
      },
    },
  };

  const lineReturnOptions: ECOption = {
    title: {
      text: "累计收益率",
      textStyle: {
        fontSize: 14,
      },
    },
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
      data: strategyReturnList.map((item) => item.datetime),
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
      max: "100",
      axisLabel: {
        formatter: "{value}%",
      },
    },
    series: {
      type: "line",
      name: "累计收益率",
      symbol: "circle",
      symbolSize: 6,
      lineStyle: {
        color: presetColor,
      },
      itemStyle: {
        color: presetColor,
        shadowColor: presetShadowColor,
        shadowBlur: 10,
      },
      data: strategyReturnList.map((item) => item.accum_ret),
    },
  };

  const linePnlEmptyOptions: ECOption = {
    title: {
      text: "每日损益",
      textStyle: {
        fontSize: 14,
      },
    },
  };
  const linePnlOptions: ECOption = {
    title: {
      text: "每日损益",
      textStyle: {
        fontSize: 14,
      },
    },
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
      bottom: 0,
    },
    grid: {
      left: "10%",
      right: "6%",
    },
    xAxis: {
      type: "category",
      axisLine: {
        lineStyle: {
          color: grey400,
        },
      },
      data: strategyPnlList.map((item) => item.datetime),
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
    dataZoom: [
      {
        type: "slider",
        width: "94%",
        start: 0,
        end: 100,
        showDataShadow: false,
        fillerColor: "#D6DBE3",
        borderRadius: "50%",
        borderColor: "transparent",
        moveHandleSize: 0,
        moveHandleStyle: {},
        left: "3%",
        right: "3%",
        height: 12,
        handleSize: "80%",
        handleIcon:
          "path://M512,512m-448,0a448,448,0,1,0,896,0a448,448,0,1,0,-896,0Z",
        handleStyle: {
          borderWidth: 0,
          color: "#D6DBE3",
        },
      },
      {
        type: "inside",
      },
    ],
    series: {
      type: "line",
      name: "每日损益",
      symbol: "circle",
      symbolSize: 6,
      lineStyle: {
        color: presetColor,
      },
      itemStyle: {
        color: presetColor, // 小圆点和线的颜色
        shadowColor: presetShadowColor,
        shadowBlur: 6,
      },
      data: strategyPnlList.map((item) => item.daily_pnl),
    },
  };

  const _lineUserOptions = strategyReturnList.length
    ? lineReturnOptions
    : lineReturnEmptyOptions;
  const _lineActiveOptions = strategyPnlList.length
    ? linePnlOptions
    : linePnlEmptyOptions;

  const { domRef: userRef, update: userRefUpdate } =
    useEcharts<HTMLDivElement>(_lineUserOptions);
  const { domRef: activeRadioRef, update: activeRadioRefUpdate } =
    useEcharts<HTMLDivElement>(_lineActiveOptions);

  useEffect(() => {
    userRefUpdate(_lineUserOptions);
    activeRadioRefUpdate(_lineActiveOptions);
  }, [strategyReturnList, strategyPnlList]);

  return (
    <Space direction="vertical" style={{ width: "100%" }} size={20}>
      <ProfitKPI strategyKPI={strategyKPI} />
      <Row justify="space-between" className="chart-content">
        <Col span={24} style={{ position: "relative" }}>
          <Col span={24} ref={userRef} style={{ height: 300 }} />
          {!strategyReturnList.length && (
            <Empty style={emptyCenterSylte} description="暂无数据" />
          )}
        </Col>
      </Row>
      <Row>
        <Col span={24} style={{ position: "relative" }}>
          <Col span={24} ref={activeRadioRef} style={{ height: 300 }} />
          {!strategyPnlList.length && (
            <Empty style={emptyCenterSylte} description="暂无数据" />
          )}
        </Col>
      </Row>
    </Space>
  );
});
