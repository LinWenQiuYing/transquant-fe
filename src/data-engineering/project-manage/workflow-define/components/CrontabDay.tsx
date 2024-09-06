import { clsPrefix } from "@transquant/constants";
import type { SelectProps } from "antd";
import { InputNumber, Radio, Select, Space } from "antd";
import { observer } from "mobx-react";
import { useEffect, useState } from "react";

export default observer(function CrontabTime(props: any) {
  const { onCrantabTimeChange, crontabTime } = props;
  const [activeValue, setActiveValue] = useState("everyDay");

  const [config, setConfig] = useState({
    interval1: 2,
    interval2: 1,
    startInterval1: 2,
    startInterval2: 1,
    specificNum1: ["SUN"],
    specificNum2: [1],
    specificNum3: "?",
    specificNum4: 1,
    specificNum5: 1,
    specificNum6: 1,
    specificNum7: [1],
  });

  const changeCrontabTime = (day: string, week: string) => {
    const cron = crontabTime.split(" ");
    const secondRef = cron[0];
    const minuteRef = cron[1];
    const hourRef = cron[2];
    const dayRef = day || cron[3];
    const monthRef = cron[4];
    const weekRef = week || cron[5];
    const yearRef = cron[6];
    const crontabValue = `${secondRef} ${minuteRef} ${hourRef} ${dayRef} ${monthRef} ${weekRef} ${yearRef}`;
    onCrantabTimeChange(crontabValue);
  };

  const onChange = (value: string) => {
    switch (value) {
      case "everyDay":
        changeCrontabTime("?", "*");
        break;
      case "intervalWeek":
        changeCrontabTime("?", `${config.startInterval1}/${config.interval1}`);
        break;
      case "intervalDay":
        changeCrontabTime(`${config.startInterval2}/${config.interval2}`, "?");
        break;
      case "specificWeek":
        changeCrontabTime(
          "?",
          config.specificNum1.length ? config.specificNum1.join(",") : "*"
        );
        break;
      case "specificDay":
        changeCrontabTime(
          config.specificNum2.length ? config.specificNum2.join(",") : "*",
          "?"
        );
        break;
      case "monthLastDays":
        changeCrontabTime("L", "?");
        break;
      case "monthLastWorkingDays":
        changeCrontabTime("LW", "?");
        break;
      case "monthLastWeeks":
        changeCrontabTime(config.specificNum3, "1L");
        break;
      case "monthTailBefore":
        changeCrontabTime(`L-${config.specificNum4}`, "?");
        break;
      case "recentlyWorkingDaysMonth":
        changeCrontabTime(`${config.specificNum5}W`, "?");
        break;
      case "monthNumWeeks":
        changeCrontabTime("?", `${config.specificNum7}#${config.specificNum6}`);
        break;
      default:
        break;
    }
  };

  useEffect(() => {
    onChange(activeValue);
  }, [config]);

  const handleRadioChange = (e) => {
    setActiveValue(e.target.value);
    onChange(e.target.value);
  };

  // intervalWeek
  const lastWeeks = [
    {
      label: "星期天",
      value: "?",
    },
    {
      label: "星期一",
      value: "2L",
    },
    {
      label: "星期二",
      value: "3L",
    },
    {
      label: "星期三",
      value: "4L",
    },
    {
      label: "星期四",
      value: "5L",
    },
    {
      label: "星期五",
      value: "6L",
    },
    {
      label: "星期六",
      value: "7L",
    },
  ];
  const lastWeekOptions = lastWeeks.map((v) => ({
    label: v.label,
    value: v.value,
  }));
  const week = [
    {
      label: "星期天",
      value: 1,
    },
    {
      label: "星期一",
      value: 2,
    },
    {
      label: "星期二",
      value: 3,
    },
    {
      label: "星期三",
      value: 4,
    },
    {
      label: "星期四",
      value: 5,
    },
    {
      label: "星期五",
      value: 6,
    },
    {
      label: "星期六",
      value: 7,
    },
  ];
  const weekOptions = week.map((v) => ({
    label: v.label,
    value: v.value,
  }));

  // WkspecificWeek
  const specificWeek = [
    {
      label: "SUN",
      value: "SUN",
    },
    {
      label: "MON",
      value: "MON",
    },
    {
      label: "TUE",
      value: "TUE",
    },
    {
      label: "WED",
      value: "WED",
    },
    {
      label: "THU",
      value: "THU",
    },
    {
      label: "FRI",
      value: "FRI",
    },
    {
      label: "SAT",
      value: "SAT",
    },
  ];

  // specificDay
  const specificDay: SelectProps["options"] = [];
  for (let i = 1; i < 31; i++) {
    specificDay.push({
      label: i,
      value: i,
    });
  }

  // specificTime  具体
  const options: SelectProps["options"] = [];
  for (let i = 0; i < 60; i++) {
    options.push({
      label: i,
      value: i,
    });
  }

  return (
    <Radio.Group
      onChange={handleRadioChange}
      value={activeValue}
      className={`${clsPrefix}-day-radio`}
    >
      <Space direction="vertical">
        <Radio value="everyDay">每一天</Radio>
        <div className="radio-content">
          <Radio value="intervalWeek" />
          <div className="wk-interval-time radio-item">
            <div>每隔</div>
            <InputNumber
              className="item-input"
              value={config.interval1}
              onChange={(value) => {
                setConfig({
                  ...config,
                  interval1: value || config.interval1,
                });
              }}
            />
            <div>天执行，从</div>
            <Select
              mode="multiple"
              allowClear
              value={config.startInterval1}
              onChange={(value) => {
                setConfig({
                  ...config,
                  startInterval1: value || config.startInterval1,
                });
              }}
              options={weekOptions}
              className="item-select"
            />
            <div>开始</div>
          </div>
        </div>
        <div className="radio-content">
          <Radio value="intervalDay" />
          <div className="interval-day radio-item">
            <div>每隔</div>
            <InputNumber
              className="item-input"
              value={config.interval2}
              onChange={(value) => {
                setConfig({
                  ...config,
                  interval2: value || config.interval2,
                });
              }}
            />
            <div>天执行，从</div>
            <InputNumber
              className="item-input"
              value={config.startInterval2}
              onChange={(value) => {
                setConfig({
                  ...config,
                  startInterval2: value || config.startInterval2,
                });
              }}
            />
            <div>天开始</div>
          </div>
        </div>
        <div className="radio-content">
          <div className="wk-specific-Week radio-item">
            <Radio value="specificWeek" />
            <div>具体星期几（可多选）</div>
            <Select
              mode="multiple"
              allowClear
              defaultValue={config.specificNum1}
              onChange={(value) => {
                setConfig({
                  ...config,
                  specificNum1: value || config.specificNum1,
                });
              }}
              options={specificWeek}
              className="week-select"
              placeholder="请选择（可多选）"
            />
          </div>
        </div>
        <div className="radio-content">
          <div className="wk-specific-week radio-item">
            <Radio value="specificDay" />
            <div>具体天数（可多选）</div>
            <Select
              mode="multiple"
              allowClear
              defaultValue={config.specificNum2}
              onChange={(value) => {
                setConfig({
                  ...config,
                  specificNum2: value || config.specificNum2,
                });
              }}
              options={specificDay}
              className="week-select"
              placeholder="请选择（可多选）"
            />
          </div>
        </div>
        <Radio value="monthLastDays">在这个月的最后一天</Radio>
        <Radio value="monthLastWorkingDays">在这个月的最后一个工作日</Radio>
        <div className="radio-content">
          <div className="month-last-weeks radio-item">
            <Radio value="monthLastWeeks" />
            <div>在这个月的最后一个</div>
            <Select
              allowClear
              defaultValue={config.specificNum3}
              onChange={(value) => {
                setConfig({
                  ...config,
                  specificNum3: value || config.specificNum3,
                });
              }}
              options={lastWeekOptions}
              className="week-select"
            />
          </div>
        </div>
        <div className="radio-content">
          <Radio value="monthTailBefore" />
          <div className="month-tail-before radio-item">
            <div>在本月底前</div>
            <InputNumber
              className="item-input"
              value={config.specificNum4}
              onChange={(value) => {
                setConfig({
                  ...config,
                  specificNum4: value || config.specificNum4,
                });
              }}
            />
            <div>天</div>
          </div>
        </div>
        <div className="radio-content">
          <Radio value="recentlyWorkingDaysMonth" />
          <div className="recently-working-days-month radio-item">
            <div>最近的工作日至本月</div>
            <InputNumber
              className="item-input"
              value={config.specificNum5}
              onChange={(value) => {
                setConfig({
                  ...config,
                  specificNum5: value || config.specificNum5,
                });
              }}
            />
            <div>日</div>
          </div>
        </div>
        <div className="radio-content">
          <Radio value="monthNumWeeks" />
          <div className="wk-month-num-weeks radio-item">
            <div>在这个月的第</div>
            <InputNumber
              className="item-input"
              value={config.specificNum6}
              onChange={(value) => {
                setConfig({
                  ...config,
                  specificNum6: value || config.specificNum6,
                });
              }}
            />
            <div>个</div>
            <Select
              mode="multiple"
              allowClear
              defaultValue={config.specificNum7}
              onChange={(value) => {
                setConfig({
                  ...config,
                  specificNum7: value || config.specificNum7,
                });
              }}
              options={weekOptions}
              className="item-select"
            />
          </div>
        </div>
      </Space>
    </Radio.Group>
  );
});
