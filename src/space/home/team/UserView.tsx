import { QuestionCircleOutlined } from "@ant-design/icons";
import { clsPrefix } from "@transquant/constants";
import { ECOption, useEcharts } from "@transquant/utils";
import { Col, Empty, Row, Tooltip } from "antd";
import { TitleOption } from "echarts/types/dist/shared";
import { toJS } from "mobx";
import { observer } from "mobx-react";
import { useEffect } from "react";
import { useStores } from "../../hooks";
import { grey400, presetColor } from "../helpers";
import { emptyCenterSylte } from "../personal/FactorView";

export const getSubTitle: (left: number) => TitleOption = (left) => ({
  text: "（每日凌晨更新昨日数据，非交易日不更新）",
  left,
  textStyle: {
    color: grey400,
    fontSize: 12,
    fontWeight: "normal",
  },
});

export const getAxias = (data: any[] = [], prop: string = "") => {
  let axias = [];
  let maxLength = 0;
  let index = 0;

  if (!data.length) {
    return;
  }
  data.forEach((item: any[], idx) => {
    maxLength = Math.max(item.length, maxLength);
    index = idx;
  });

  axias = data[index]?.[prop]?.map((item: any) => item.horizon) || [];
  return axias;
};

export default observer(function UserView() {
  const { userSumList, activeRatioSumList } = useStores().homeStore;

  const lineUserEmptyOptions: ECOption = {
    title: {
      text: "团队人员总数",
      textStyle: {
        fontSize: 14,
      },
    },
  };

  const lineUserOptions: ECOption = {
    title: [
      {
        text: "团队人员总数",
        textStyle: {
          fontSize: 14,
        },
      },
      getSubTitle(80),
    ],
    tooltip: {
      show: true,
      trigger: "axis",
      className: `echarts-tooltip-light`,
      axisPointer: {
        type: "cross",
      },
      confine: true,
    },
    color: presetColor,
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
      data: getAxias(toJS(userSumList), "teamLineChartList"),
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
    series: userSumList.map((item, index) => {
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

  const lineActiveEmptyOptions: ECOption = {
    title: {
      text: "活跃比例",
      textStyle: {
        fontSize: 14,
      },
    },
  };
  const lineActiveOptions: ECOption = {
    title: [
      {
        text: "活跃比例",
        textStyle: {
          fontSize: 14,
        },
      },
      getSubTitle(72),
    ],
    tooltip: {
      show: true,
      trigger: "axis",
      className: `echarts-tooltip-light`,
      axisPointer: {
        type: "cross",
      },
      confine: true,
    },
    color: presetColor,
    legend: {
      type: "scroll",
      orient: "horizontal",
      icon: "rect",
      itemWidth: 14,
      left: "center",
      bottom: 20,
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
      data: getAxias(toJS(activeRatioSumList), "teamActiveLineChartList"),
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
    series: activeRatioSumList.map((item, index) => {
      const color = presetColor[index];
      return {
        type: "line",
        name: item.teamName,
        symbol: "circle",
        symbolSize: 0,
        lineStyle: {
          color,
        },
        data: item.teamActiveLineChartList?.map((item) => [
          item.horizon,
          item.vertical === null ? null : (item.vertical * 100).toFixed(2),
        ]) as any,
      };
    }),
  };

  const _lineUserOptions = userSumList.length
    ? lineUserOptions
    : lineUserEmptyOptions;
  const _lineActiveOptions = activeRatioSumList.length
    ? lineActiveOptions
    : lineActiveEmptyOptions;

  const { domRef: userRef, update: userRefUpdate } =
    useEcharts<HTMLDivElement>(_lineUserOptions);
  const { domRef: activeRadioRef, update: activeRadioRefUpdate } =
    useEcharts<HTMLDivElement>(_lineActiveOptions);

  useEffect(() => {
    userRefUpdate(_lineUserOptions);
    activeRadioRefUpdate(_lineActiveOptions);
  }, [userSumList, activeRatioSumList]);

  return (
    <div className={`${clsPrefix}-home-team-user`}>
      <Row justify="space-between" align="middle" className="header">
        <Col className="title">用户数</Col>
      </Row>
      <Row justify="space-between" className="chart-content">
        <Col span={12} style={{ position: "relative" }}>
          <Col span={24} ref={userRef} style={{ height: 300 }} />
          {!userSumList.length && (
            <Empty style={emptyCenterSylte} description="暂无数据" />
          )}
        </Col>
        <Col span={12} style={{ position: "relative" }}>
          {activeRatioSumList.length !== 0 && (
            <Tooltip title="团队用户登录数与团队用户总数比值">
              <QuestionCircleOutlined className="relative top-[2px] left-[64px] text-gray-400 z-10 cursor-pointer" />
            </Tooltip>
          )}
          <Col
            span={24}
            ref={activeRadioRef}
            style={{ height: 300, marginTop: "-20px" }}
          />
          {!activeRatioSumList.length && (
            <Empty style={emptyCenterSylte} description="暂无数据" />
          )}
        </Col>
      </Row>
    </div>
  );
});
