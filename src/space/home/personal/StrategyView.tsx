import { clsPrefix } from "@transquant/constants";
import { ECOption, Nullable, useEcharts } from "@transquant/utils";
import { Col, Empty, Row } from "antd";
import { observer } from "mobx-react";
import { PersonalStrategyLine, TagItem } from "../../types";
import { grey400, presetColor } from "../helpers";
import { getSubTitle } from "../team/UserView";
import { emptyCenterSylte } from "./FactorView";

interface FactorViewProps {
  personalStrategyLine: Nullable<PersonalStrategyLine>;
  personalStrategyTag: TagItem[];
}

export const emptyStyle = { height: 300, marginTop: 100 };

export default observer(function FactorView(props: FactorViewProps) {
  const { personalStrategyLine, personalStrategyTag } = props;

  const lineOptions: ECOption = {
    title: [
      {
        text: "策略数",
        textStyle: {
          fontSize: 14,
        },
      },
      getSubTitle(40),
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
    legend: {
      icon: "rect",
      itemWidth: 14,
      data: ["个人策略总数", "审核入库策略数"],
      left: "center",
      bottom: 10,
      itemGap: 24,
    },
    grid: {
      left: "6%",
      right: "6%",
    },
    xAxis: {
      type: "category",
      axisLine: {
        lineStyle: {
          color: grey400,
        },
      },
      data: personalStrategyLine?.auditStrategySumList?.map(
        (item) => item.horizon
      ),
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
    series: [
      {
        type: "line",
        name: "个人策略总数",
        symbol: "circle",
        symbolSize: 0,
        lineStyle: {
          color: presetColor[0],
        },
        itemStyle: {
          color: presetColor[0], // 小圆点和线的颜色
        },
        data: personalStrategyLine?.strategySumList?.map((item) => ({
          name: item.horizon,
          value: item.vertical,
        })),
      },
      {
        type: "line",
        name: "审核入库策略数",
        symbol: "circle",
        symbolSize: 0,
        lineStyle: {
          color: presetColor[1],
        },
        itemStyle: {
          color: presetColor[1], // 小圆点和线的颜色
        },
        data: personalStrategyLine?.auditStrategySumList?.map((item) => ({
          name: item.horizon,
          value: item.vertical,
        })),
      },
    ],
  };

  const barEmptyOptions: ECOption = {
    title: {
      text: "标签统计",
      textStyle: {
        fontSize: 14,
      },
    },
  };

  const barOptions: ECOption = {
    title: {
      text: "标签统计",
      textStyle: {
        fontSize: 14,
      },
    },
    tooltip: {
      trigger: "axis",
      axisPointer: {
        type: "shadow",
      },
    },
    grid: {
      left: "6%",
      right: "6%",
    },
    xAxis: {
      type: "category",
      axisLine: {
        lineStyle: {
          color: grey400,
        },
      },
      data: personalStrategyTag?.map((item) => item.tagName),
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
      minInterval: 1,
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
    series: [
      {
        data: personalStrategyTag?.map((item) => item.tagSum),
        type: "bar",
        itemStyle: {
          color: `#E31430`,
        },
      },
    ],
  };

  const { domRef: userRef } = useEcharts<HTMLDivElement>(lineOptions);
  const { domRef: labelRef } = useEcharts<HTMLDivElement>(
    personalStrategyTag.length ? barOptions : barEmptyOptions
  );

  return (
    <div className={`${clsPrefix}-home-personal-strategy`}>
      <Row justify="space-between" align="middle" className="header">
        <Col className="title">策略</Col>
      </Row>
      <div ref={userRef} style={{ height: 300 }} />

      <div style={{ position: "relative" }}>
        <div ref={labelRef} style={{ height: 300 }} />
        {!personalStrategyTag.length && (
          <Empty style={emptyCenterSylte} description="暂无标签" />
        )}
      </div>
    </div>
  );
});
