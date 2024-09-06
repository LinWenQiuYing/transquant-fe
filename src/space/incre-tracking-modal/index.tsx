import { nameReg, nameRegMessage } from "@transquant/constants";
import { ImageInstance } from "@transquant/manage";
import { ajax } from "@transquant/utils";
import {
  Col,
  DatePicker,
  Form,
  Input,
  Modal,
  Radio,
  Row,
  Select,
  TimePicker,
} from "antd";
import dayjs from "dayjs";
import { observer } from "mobx-react";
import { useState } from "react";

interface IncreTrackingModalProps {
  title?: string;
  projects?: { id: number; name: string }[];
  imageInstances: ImageInstance[];
  addQuartzJob: (data: Partial<IncreTrackingValue>) => Promise<void>;
  visible: boolean;
  onVisibleChange: (value: boolean) => void;
}

export type IncreTrackingValue = {
  envId: number;
  isSolid: 0 | 1;
  jobName: string;
  projectId: number;
  scheduleFrequency: number;
  scheduleTime: string;
  startDate: string;
  yamlPath: string;
  warningMail: string;
};

const defaultFormValues: Partial<IncreTrackingValue> = {
  envId: undefined,
  isSolid: 0,
  jobName: "",
  projectId: undefined,
  scheduleFrequency: 0,
  scheduleTime: undefined,
  startDate: undefined,
  yamlPath: undefined,
};

export const range = (start: number, end: number) => {
  const result = [];
  for (let i = start; i < end; i++) {
    result.push(i);
  }
  return result;
};

const getYamlPathOptions = (paths: string[]) => {
  return paths.map((item) => ({
    label: item,
    value: item,
  }));
};

const getImageOptions = (imageInstances: ImageInstance[]) => {
  return imageInstances.map((item) => ({
    label: `${item.imageName}(${item.name})`,
    value: item.id,
  }));
};

const getYamlPath = async (projectId: number) => {
  return await ajax({
    url: `/tqlab/quartzjob/getYamlPath`,
    params: { projectId },
  });
};

export default observer(function IncreTrackingModal(
  props: IncreTrackingModalProps
) {
  const {
    title = "因子增量跟踪",
    visible,
    onVisibleChange,
    imageInstances,
    addQuartzJob,
    projects,
  } = props;

  const [form] = Form.useForm();
  const [formValues, setFormValues] =
    useState<Partial<IncreTrackingValue>>(defaultFormValues);

  const [yamlPaths, setYamlPaths] = useState([]);

  const onFormValueChange = async (value: any) => {
    if ("projectId" in value) {
      const res = await getYamlPath(value.projectId);
      setYamlPaths(res);
    }

    if ("startDate" in value) {
      setFormValues({
        ...formValues,
        startDate: dayjs(value.startDate).format("YYYY-MM-DD"),
      });
    } else if ("scheduleTime" in value) {
      setFormValues({
        ...formValues,
        scheduleTime: dayjs(value.scheduleTime).format("HH:mm"),
      });
    } else {
      setFormValues({ ...formValues, ...value });
    }
  };

  const onOk = async () => {
    form.validateFields().then(async () => {
      addQuartzJob({ ...formValues }).then(() => {
        onVisibleChange(false);
      });
    });
  };

  return (
    <Modal
      title={title}
      open={visible}
      onCancel={() => onVisibleChange(false)}
      destroyOnClose
      width={500}
      onOk={onOk}
    >
      <Form
        form={form}
        preserve={false}
        layout="vertical"
        initialValues={formValues}
        onValuesChange={onFormValueChange}
      >
        <Form.Item
          name="projectId"
          label="项目选择"
          rules={[
            {
              required: true,
            },
          ]}
        >
          <Select
            placeholder="请选择项目"
            options={projects?.map((item) => ({
              label: item.name,
              value: item.id,
            }))}
          />
        </Form.Item>
        <Form.Item
          name="jobName"
          label="任务名称"
          rules={[
            {
              required: true,
              message: nameRegMessage,
              pattern: nameReg,
            },
          ]}
        >
          <Input placeholder="请输入任务名称" maxLength={30} />
        </Form.Item>
        <Form.Item
          name="yamlPath"
          label="指定入口文件"
          rules={[
            {
              required: true,
              message: "请选择入口文件",
            },
          ]}
        >
          <Select
            options={getYamlPathOptions(yamlPaths)}
            disabled={!formValues.projectId}
            placeholder="请选择入口文件"
          />
        </Form.Item>
        <Form.Item
          name="envId"
          label="环境"
          rules={[
            {
              required: true,
              message: "请选择环境",
            },
          ]}
        >
          <Select
            options={getImageOptions(imageInstances)}
            placeholder="请选择环境"
          />
        </Form.Item>
        <Form.Item name="isSolid" label="是否固化">
          <Radio.Group>
            <Radio value={1}>固化</Radio>
            <Radio value={0}>不固化</Radio>
          </Radio.Group>
        </Form.Item>
        <Form.Item
          name="startDate"
          label="历史回测开始时间"
          rules={[
            {
              required: true,
              message: "请选择历史回测时间",
            },
          ]}
        >
          <DatePicker
            style={{ width: "100%" }}
            disabledDate={(current) =>
              current && current > dayjs().endOf("day")
            }
          />
        </Form.Item>
        <Form.Item>
          <Row justify="space-between">
            <Col span={11}>
              <Form.Item
                name="scheduleFrequency"
                label="调度频率"
                rules={[
                  {
                    required: true,
                    message: "请选择调度频率",
                  },
                ]}
              >
                <Select disabled>
                  <Select.Option value={0}>每日</Select.Option>
                </Select>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="scheduleTime"
                label="调度时间"
                rules={[
                  {
                    required: true,
                    message: "请选择调度时间",
                  },
                ]}
              >
                <TimePicker
                  style={{ width: "100%" }}
                  disabledTime={() => ({
                    disabledHours: () => range(0, 24).slice(9, 17),
                  })}
                  format="HH:mm"
                  showNow={false}
                />
              </Form.Item>
            </Col>
          </Row>
        </Form.Item>
        <Form.Item name="warningMail" label="告警邮箱">
          <Input placeholder="请输入告警邮箱，多个邮箱地址则用逗号分隔" />
        </Form.Item>
      </Form>
    </Modal>
  );
});
