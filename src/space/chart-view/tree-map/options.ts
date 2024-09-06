import { Theme } from "@transquant/constants";
import { chunk } from "lodash-es";
import { toJS } from "mobx";

function getWeekDay(value?: string) {
  const weekDay = [
    "星期天",
    "星期一",
    "星期二",
    "星期三",
    "星期四",
    "星期五",
    "星期六",
  ];
  const date = value ? new Date(Date.parse(value)) : new Date();
  const week = date.getDay();

  return weekDay[week];
}

// 绿 -> 红 渐近(12个)
const darkGreenColors = [
  "#157D40",
  "#116433",
  "#0F582D",
  "#0D4B26",
  "#0B3F20",
  "#08321A",
];

const darkRedColors = [
  "#520E0D",
  "#681219",
  "#7D161D",
  "#8C1921",
  "#991B24",
  "#BA212C",
];

const lightGreenColors = [
  "#187D3D",
  "#269244",
  "#2CAC50",
  "#41BC64",
  "#4DCE75",
  "#7ADB95",
];

const lightRedColors = [
  "#FF8080",
  "#FF6969",
  "#FC4F4F",
  "#FF2E2E",
  "#FF0D1B",
  "#EA252F",
];

const getChunkProfits = (data: any[], theme: Theme) => {
  const greenColors = theme === Theme.Dark ? darkGreenColors : lightGreenColors;
  const redColors = theme === Theme.Dark ? darkRedColors : lightRedColors;
  const profitValues: number[] = [];
  const negative: number[] = []; // 负数
  const positive: number[] = []; // 正数
  data.forEach((item) => {
    item.children.forEach((child: any) => {
      child.children.forEach((subChild: any) => {
        profitValues.push(subChild.cumsumProfit);
      });
    });
  });

  profitValues.forEach((item) => {
    if (item <= 0) {
      negative.push(item);
    } else {
      positive.push(item);
    }
  });

  const sortNegativeProfits = negative.sort((a, b) => a - b);
  const sortPositiveProfits = positive.sort((a, b) => a - b);

  // 数据个数少于颜色个数分为一个组
  const chunkNegativeProfits =
    sortNegativeProfits.length > greenColors.length - 1
      ? chunk(
          sortNegativeProfits,
          sortNegativeProfits.length / (greenColors.length - 1)
        )
      : [sortNegativeProfits];

  const chunkPositiveProfits =
    sortPositiveProfits.length > redColors.length - 1
      ? chunk(
          sortPositiveProfits,
          sortPositiveProfits.length / (redColors.length - 1)
        )
      : [sortPositiveProfits];

  return [chunkNegativeProfits, chunkPositiveProfits];
};

const formatData = (data: any[] = [], theme: Theme) => {
  const greenColors = theme === Theme.Dark ? darkGreenColors : lightGreenColors;
  const redColors = theme === Theme.Dark ? darkRedColors : lightRedColors;
  const [chunkNegativeProfits, chunkPositiveProfits] = getChunkProfits(
    data,
    theme
  );

  const result = toJS(data).map((item) => {
    item.children = item.children.map((child: any) => {
      child.children = child.children.map((c: any) => {
        let index = 0;
        const { cumsumProfit } = c;
        if (cumsumProfit <= 0) {
          index = chunkNegativeProfits.findIndex((item: any[]) =>
            item.includes(c.cumsumProfit)
          );
        } else {
          index = chunkPositiveProfits.findIndex((item: any[]) =>
            item.includes(c.cumsumProfit)
          );
        }

        return {
          ...c,
          value: c.positionMarketValue,
          // value: c.cumsumProfit,
          labelValue: cumsumProfit,
          itemStyle: {
            color: cumsumProfit <= 0 ? greenColors[index] : redColors[index],
          },
        };
      });
      return child;
    });
    return item;
  });

  return result;
};

function getLevelOption(theme: Theme) {
  const greenColors = theme === Theme.Dark ? darkGreenColors : lightGreenColors;
  const redColors = theme === Theme.Dark ? darkRedColors : lightRedColors;
  return [
    {
      itemStyle: {
        borderColor: theme === "light" ? "#fff" : "#000",
        borderWidth: 0,
        gapWidth: 2,
      },
      upperLabel: {
        show: false,
      },
    },
    {
      color: [...greenColors, ...redColors],
      itemStyle: {
        borderColor: theme === "light" ? "#d5d5d5" : "#333",
        borderWidth: 0,
        gapWidth: 2,
      },
      upperLabel: {
        show: true,
        position: "insideTopLeft",
        distance: 16,
        height: 20,
        offset: [-14, -6],
      },
      emphasis: {
        upperLabel: {
          show: true,
          position: "insideTopLeft",
          distance: 16,
          offset: [-14, -6],
        },
      },
    },
    {
      itemStyle: {
        borderColor: theme === "light" ? "#f0f2f5" : "#555",
        borderWidth: 0,
        gapWidth: 2,
      },
      upperLabel: {
        show: true,
        position: "insideTopLeft",
        distance: 16,
        height: 20,
        offset: [-14, -6],
      },
      emphasis: {
        upperLabel: {
          show: true,
          position: "insideTopLeft",
          distance: 16,
          offset: [-14, -6],
        },
      },
    },
  ];
}

function getTooltip() {
  return {
    className: `echarts-tooltip-${Theme.Light}`,
    axisPointer: {
      lineStyle: {
        color: {
          type: "linear",
          x: 0,
          y: 0,
          x2: 0,
          y2: 1,
          colorStops: [
            {
              offset: 0,
              color: "rgba(0, 255, 233,0)",
            },
            {
              offset: 0.5,
              color: "rgba(255, 255, 255,1)",
            },
            {
              offset: 1,
              color: "rgba(0, 255, 233,0)",
            },
          ],
          global: false,
        },
      },
    },
    formatter(info: any) {
      const { name, code, positionMarketValue, timestamp, cumsumProfit } =
        info.data;
      if (info.data.children) {
        return "";
      }

      return [
        `<div class="tooltip-title">${name}</div>`,
        `<span class="tooltip-code">${code}</span>`,
        `<div class="tooltip-time"><span>${String(timestamp).replace(
          /-/g,
          "/"
        )}</span><span>${getWeekDay(timestamp)}</span></div>`,
        `<div class="tooltip-position"><span>持仓市值：</span><span>${positionMarketValue}</span></div>`,
        `<div class="tooltip-profit"><span>累计实现盈亏额：</span><span>${cumsumProfit}</span></div>`,
      ].join("");
    },
  };
}

export const getOptions = ({ data }: { data?: any }) => {
  const option = {
    tooltip: getTooltip(),
    series: [
      {
        name: "概况",
        type: "treemap",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        visibleMin: 300,
        roam: false,
        label: {
          show: true,
          fontSize: 12,
          position: "insideTopLeft",
          formatter(params: any) {
            if ("children" in params.data) {
              return;
            }

            return `${params.name}

${params.data.labelValue}`;
          },
        },
        itemStyle: {
          borderColor: "#fff",
        },
        upperLabel: {
          show: true,
          height: 30,
        },
        levels: getLevelOption(Theme.Light),
        data: formatData(data, Theme.Light),
      },
    ],
  };
  return option;
};

export default {};
