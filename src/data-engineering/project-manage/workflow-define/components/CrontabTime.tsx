import { clsPrefix } from "@transquant/constants";
import type { SelectProps } from "antd";
import { InputNumber, Radio, Select, Space } from "antd";
import { observer } from "mobx-react";
import { useEffect, useState } from "react";

export default observer(function CrontabTime(props: any) {
  const {
    unit,
    unitAll,
    onCrantabTimeChange,
    activeTab,
    crontabTime,
    timeWay,
  } = props;
  const [activeValue, setActiveValue] = useState(timeWay);

  const [config, setConfig] = useState({
    interval: 5,
    startInterval: 3,
    specificNum: ["0"],
    cycleStart: 1,
    cycleEnd: 1,
  });

  const changeCrontabTime = (val: any) => {
    const cron = crontabTime.split(" ");
    let secondRef = cron[0];
    let minuteRef = cron[1];
    let hourRef = cron[2];
    const dayRef = cron[3];
    let monthRef = cron[4];
    const weekRef = cron[5];
    let yearRef = cron[6];
    switch (activeTab) {
      case "sec":
        secondRef = val;
        break;
      case "min":
        minuteRef = val;
        break;
      case "hour":
        hourRef = val;
        break;
      case "month":
        monthRef = val;
        break;
      case "year":
        yearRef = val;
        break;
      default:
        break;
    }
    const crontabValue = `${secondRef} ${minuteRef} ${hourRef} ${dayRef} ${monthRef} ${weekRef} ${yearRef}`;
    onCrantabTimeChange(crontabValue);
  };

  const onChange = (value: string) => {
    switch (value) {
      case "everyTime":
        changeCrontabTime("*");
        break;
      case "intervalTime":
        changeCrontabTime(`${config.startInterval}/${config.interval}`);
        break;
      case "specificTime":
        changeCrontabTime(config.specificNum.toString());
        break;
      case "cycleTime":
        changeCrontabTime(`${config.cycleStart}-${config.cycleEnd}`);
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

  // specificTime  具体
  const options: SelectProps["options"] = [];
  for (let i = 0; i < 60; i++) {
    options.push({
      label: i.toString(),
      value: i.toString(),
    });
  }

  return (
    <Radio.Group
      onChange={handleRadioChange}
      value={activeValue}
      className={`${clsPrefix}-time-radio`}
    >
      <Space direction="vertical">
        <Radio value="everyTime">每一{unitAll}</Radio>
        <div className="radio-item">
          <Radio value="intervalTime" />
          <div className="interval-time">
            <div>每隔</div>
            <InputNumber
              className="time-input"
              value={config.interval}
              onChange={(value) => {
                setConfig({
                  ...config,
                  interval: value || config.interval,
                });
              }}
            />
            <div>{unit}执行，从</div>
            <InputNumber
              className="time-input"
              value={config.startInterval}
              onChange={(value) => {
                setConfig({
                  ...config,
                  startInterval: value || config.startInterval,
                });
              }}
            />
            <div>{unit}开始</div>
          </div>
        </div>
        <div className="radio-item">
          <Radio value="specificTime" />
          <div className="specific-time">
            <div>具体{unitAll}数（可多选）</div>
            <Select
              mode="multiple"
              allowClear
              defaultValue={config.specificNum}
              onChange={(value) => {
                setConfig({
                  ...config,
                  specificNum: value || config.specificNum,
                });
              }}
              options={options}
              className="time-select"
            />
          </div>
        </div>
        <div className="radio-item">
          <Radio value="cycleTime" />
          <div className="cycle-time">
            <div>周期，从</div>
            <InputNumber
              className="time-input"
              value={config.cycleStart}
              onChange={(value) => {
                setConfig({
                  ...config,
                  cycleStart: value || config.cycleStart,
                });
              }}
            />
            <div>到</div>
            <InputNumber
              className="time-input"
              value={config.cycleEnd}
              onChange={(value) => {
                setConfig({
                  ...config,
                  cycleEnd: value || config.cycleEnd,
                });
              }}
            />
            <div>{unit}</div>
          </div>
        </div>
      </Space>
    </Radio.Group>
  );
});
