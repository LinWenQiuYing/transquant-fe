import { clsPrefix } from "@transquant/constants";
import { useMount } from "ahooks";
import type { TabsProps } from "antd";
import {
  Button,
  DatePicker,
  Form,
  Input,
  Modal,
  Popover,
  Radio,
  Select,
  Tabs,
} from "antd";
import dayjs from "dayjs";
import { observer } from "mobx-react";
import { useState } from "react";
import { useStores } from "../../hooks";
import { EditWorkflowTimeType } from "../../types";
import CrontabDay from "../workflow-define/components/CrontabDay";
import CrontabTime from "../workflow-define/components/CrontabTime";

const { RangePicker } = DatePicker;

interface TimeModalProps {
  data: any;
  visible: boolean;
  onVisibleChange: (value: boolean) => void;
}

interface TimeFormValueType {
  startStopTime: dayjs.Dayjs[];
  crontabValue: string;
  failStrategy: string;
  priority: string;
  email: string;
}

export default observer(function TimeModal(props: TimeModalProps) {
  const { visible, onVisibleChange, data } = props;
  const { previewTime, timeList, resetTimeList, handleWorkflowSetTimeRun } =
    useStores().projectManageStore;

  const [activeTab, setActiveTab] = useState("sec");

  const defaultFormValues: TimeFormValueType = {
    startStopTime: [dayjs(), dayjs().add(1, "day")],
    crontabValue: "0 0 * * * ? *",
    failStrategy: "CONTINUE",
    priority: "MEDIUM",
    email: "",
  };

  const [form] = Form.useForm();
  const [formValues, setFormValues] = useState(defaultFormValues);

  const onFormValueChange = (value: any) => {
    setFormValues({ ...formValues, ...value });
  };

  const onCrantabTimeChange = (value: string) => {
    onFormValueChange({
      crontabValue: value,
    });
    form.setFieldsValue({
      ...formValues,
      crontabValue: value,
    });
  };

  useMount(() => {
    if (!data) return;

    const startStopTime = data.schedule
      ? [dayjs(data.schedule?.startTime), dayjs(data.schedule?.endTime)]
      : [dayjs(), dayjs().add(1, "day")];
    setFormValues({
      startStopTime,
      crontabValue: data.crontab || "0 0 * * * ? *",
      failStrategy: data.failStrategy || "CONTINUE",
      priority: data.priority || "MEDIUM",
      email: data.email,
    });
    form.setFieldsValue({
      startStopTime,
      crontabValue: data.crontab || "0 0 * * * ? *",
      failStrategy: data.failStrategy || "CONTINUE",
      priority: data.priority || "MEDIUM",
      email: data.email,
    });
    resetTimeList();
  });

  const onOk = async () => {
    form
      .validateFields()
      .then(async () => {
        const json: EditWorkflowTimeType = {
          id: data.id,
          schedule: JSON.stringify({
            startTime: dayjs(formValues.startStopTime[0]).format(
              "YYYY-MM-DD HH:mm:ss"
            ),
            endTime: dayjs(formValues.startStopTime[1]).format(
              "YYYY-MM-DD HH:mm:ss"
            ),
            crontab: formValues.crontabValue,
            timezoneId: "Asia/Shanghai",
          }),
          // warningType: data.warningType,
          warningType: "ALL",
          // warningGroupId: data.warningGroupId,
          warningGroupId: 1,
          failureStrategy: formValues.failStrategy,
          workerGroup: data.workerGroup,
          tenantCode: data.tenantCode,
          environmentCode:
            data.environmentCode === -1 ? "" : data.environmentCode,
          processInstancePriority: formValues.priority,
          email: formValues.email,
        };
        await handleWorkflowSetTimeRun(json);
        onVisibleChange(false);
      })
      .catch(() => {});
  };

  const handleExecuteTime = () => {
    const schedule = JSON.stringify({
      startTime: dayjs(formValues.startStopTime[0]).format(
        "YYYY-MM-DD HH:mm:ss"
      ),
      endTime: dayjs(formValues.startStopTime[1]).format("YYYY-MM-DD HH:mm:ss"),
      crontab: formValues.crontabValue,
      timezoneId: "Asia/Shanghai",
    });
    previewTime(schedule);
  };

  const onChange = (key: string) => {
    setActiveTab(key);
  };
  const items: TabsProps["items"] = [
    {
      key: "sec",
      label: "秒",
      children: (
        <CrontabTime
          unit="秒"
          unitAll="秒钟"
          timeWay="specificTime"
          activeTab={activeTab}
          crontabTime={formValues.crontabValue}
          onCrantabTimeChange={onCrantabTimeChange}
        />
      ),
    },
    {
      key: "min",
      label: "分",
      children: (
        <CrontabTime
          unit="分"
          unitAll="分钟"
          timeWay="specificTime"
          activeTab={activeTab}
          crontabTime={formValues.crontabValue}
          onCrantabTimeChange={onCrantabTimeChange}
        />
      ),
    },
    {
      key: "hour",
      label: "时",
      children: (
        <CrontabTime
          unit="时"
          unitAll="小时"
          timeWay="everyTime"
          activeTab={activeTab}
          crontabTime={formValues.crontabValue}
          onCrantabTimeChange={onCrantabTimeChange}
        />
      ),
    },
    {
      key: "day",
      label: "天",
      children: (
        <CrontabDay
          crontabTime={formValues.crontabValue}
          onCrantabTimeChange={onCrantabTimeChange}
        />
      ),
    },
    {
      key: "month",
      label: "月",
      children: (
        <CrontabTime
          unit="月"
          unitAll="月"
          timeWay="everyTime"
          activeTab={activeTab}
          crontabTime={formValues.crontabValue}
          onCrantabTimeChange={onCrantabTimeChange}
        />
      ),
    },
    {
      key: "year",
      label: "年",
      children: (
        <CrontabTime
          unit="年"
          unitAll="年"
          timeWay="everyTime"
          activeTab={activeTab}
          crontabTime={formValues.crontabValue}
          onCrantabTimeChange={onCrantabTimeChange}
        />
      ),
    },
  ];

  const crontab = (
    <Tabs
      activeKey={activeTab}
      items={items}
      onChange={onChange}
      className="modal-time-tabs"
    />
  );

  return (
    <Modal
      title="定时运行设置"
      open={visible}
      destroyOnClose
      maskClosable={false}
      onCancel={() => onVisibleChange(false)}
      width={572}
      onOk={onOk}
      className={`${clsPrefix}-time-modal`}
    >
      <Form
        form={form}
        layout="vertical"
        preserve={false}
        onValuesChange={onFormValueChange}
        autoComplete="off"
      >
        <Form.Item
          name="startStopTime"
          label="起止时间："
          rules={[
            {
              type: "array" as const,
              required: true,
              message: "请选择起止时间！",
            },
          ]}
          className="time-item"
        >
          <RangePicker showTime />
        </Form.Item>
        <Form.Item label="定时：">
          <Popover content={crontab} trigger="click" placement="bottom">
            <Form.Item name="crontabValue" className="crontab-item">
              <Input placeholder="定时" allowClear readOnly />
            </Form.Item>
          </Popover>

          <Button type="primary" onClick={handleExecuteTime}>
            执行时间
          </Button>
        </Form.Item>
        {timeList.length > 0 && (
          <Form.Item name="failStrategy" label="接下来五次执行时间">
            {timeList.map((item, index) => (
              <p key={index}>{item}</p>
            ))}
          </Form.Item>
        )}
        <Form.Item name="failStrategy" label="失败策略：">
          <Radio.Group>
            <Radio value="CONTINUE">继续</Radio>
            <Radio value="END">结束</Radio>
          </Radio.Group>
        </Form.Item>
        <Form.Item name="priority" label="流程优先级：">
          <Select>
            <Select.Option key="HIGHEST">HIGHEST</Select.Option>
            <Select.Option key="HIGH">HIGH</Select.Option>
            <Select.Option key="MEDIUM">MEDIUM</Select.Option>
            <Select.Option key="LOW">LOW</Select.Option>
            <Select.Option key="LOWEST">LOWEST</Select.Option>
          </Select>
        </Form.Item>
        <Form.Item name="email" label="告警邮箱">
          <Input placeholder="请输入告警邮箱，多个邮箱地址则用逗号分隔" />
        </Form.Item>
      </Form>
    </Modal>
  );
});
