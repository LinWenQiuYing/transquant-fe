import { DeleteOutlined, PlusOutlined } from "@ant-design/icons";
import { clsPrefix } from "@transquant/constants";
import {
  queryAllEnvironmentList,
  queryAllWorkerGroups,
} from "@transquant/scheduler/api";
import { useMount } from "ahooks";
import {
  Checkbox,
  DatePicker,
  Form,
  Input,
  Modal,
  Radio,
  Select,
  Typography,
} from "antd";
import dayjs from "dayjs";
import { cloneDeep } from "lodash-es";
import { observer } from "mobx-react";
import { useEffect, useState } from "react";
import { useStores } from "../../hooks";
// import { EditWorkflowTimeType, WorkflowTimeItem } from "../../types";

const { RangePicker } = DatePicker;

interface StartModalProps {
  data: any;
  visible: boolean;
  onVisibleChange: (value: boolean) => void;
}

interface StartFormValueType {
  name: string;
  failStrategy: string;
  priority: string;
  complementData: boolean;
  executeWay: string;
  executeOrder: string;
  parallelism: string;
  scheduleTime: dayjs.Dayjs[];
  globalParams: [];
  email: string;
  workerGroup: string;
  environmentCode?: string;
}

const defaultFormValues: StartFormValueType = {
  name: "",
  failStrategy: "CONTINUE",
  priority: "MEDIUM",
  complementData: false, // false:"START_PROCESS"  true:"COMPLEMENT_DATA"
  executeWay: "RUN_MODE_SERIAL", // 串行
  executeOrder: "DESC_ORDER", // 降序
  parallelism: "",
  scheduleTime: [],
  globalParams: [],
  email: "",
  workerGroup: "default",
  environmentCode: undefined,
};

export default observer(function StartModal(props: StartModalProps) {
  const { visible, onVisibleChange, data } = props;
  // const { handleWorkflowSetTimeRun } = useStores().projectManageStore;
  const [form] = Form.useForm();
  const [formValues, setFormValues] = useState(defaultFormValues);
  const [isParallelism, setIsParallelism] = useState(false);
  const [environment, setEnvironment] = useState([]);
  const [groups, setGroups] = useState([]);

  useMount(async () => {
    const envRes = (await queryAllEnvironmentList()) || [];
    const groupRes = (await queryAllWorkerGroups()) || [];
    const environments = envRes.map(
      (item: { code: string; name: string; workerGroups: string[] }) => ({
        label: item.name,
        value: item.code,
      })
    );
    const groups = groupRes.map((item: string) => ({
      label: item,
      value: item,
    }));

    setEnvironment(environments);
    setGroups(groups);
  });

  const { startProcessInstance } = useStores().projectManageStore;

  const onFormValueChange = (value: any) => {
    setFormValues({ ...formValues, ...value });
  };

  const handleParallelism = (e: any) => {
    setIsParallelism(e.target.checked);
  };

  useEffect(() => {
    if (!data) return;
    setFormValues({
      ...defaultFormValues,
      name: data.name,
      email: data.email,
      failStrategy: "CONTINUE",
      priority: "MEDIUM",
      complementData: false,
      executeWay: "RUN_MODE_SERIAL",
      executeOrder: "DESC_ORDER",
      parallelism: "",
      scheduleTime: [],
      globalParams: [],
      workerGroup: "default",
      environmentCode: undefined,
    });
    form.setFieldsValue({
      ...defaultFormValues,
      name: data.name,
      email: data.email,
      failStrategy: "CONTINUE",
      priority: "MEDIUM",
      complementData: false,
      executeWay: "RUN_MODE_SERIAL",
      executeOrder: "DESC_ORDER",
      parallelism: "",
      scheduleTime: [],
      globalParams: [],
      workerGroup: "default",
      environmentCode: undefined,
    });
  }, [data, visible]);

  const onOk = async () => {
    form
      .validateFields()
      .then(async () => {
        const json = {
          processDefinitionCode: data.code,
          email: formValues.email,
          failureStrategy: formValues.failStrategy,
          processInstancePriority: formValues.priority,
          executionOrder: formValues.executeOrder, // 执行顺序
          execType: formValues.complementData
            ? "COMPLEMENT_DATA"
            : "START_PROCESS",
          runMode: formValues.complementData ? formValues.executeWay : "",
          expectedParallelismNumber:
            isParallelism && formValues.complementData
              ? formValues.parallelism
              : "",
          scheduleTime: JSON.stringify({
            complementStartDate: formValues.scheduleTime.length
              ? dayjs(formValues.scheduleTime[0]).format("YYYY-MM-DD HH:mm:ss")
              : "",
            complementEndDate: formValues.scheduleTime.length
              ? dayjs(formValues.scheduleTime[1]).format("YYYY-MM-DD HH:mm:ss")
              : "",
            workerGroup: formValues.workerGroup,
            environmentCode: formValues?.environmentCode || "",
          }),

          startParams: JSON.stringify(
            formValues.globalParams.reduce((acc: any, curr: any) => {
              acc[curr.key] = curr.value;
              return acc;
            }, {})
          ),
          warningType: "ALL",
          warningGroupId: 1,
        };
        await startProcessInstance(json);
        onVisibleChange(false);
      })
      .catch(() => {});
  };

  return (
    <Modal
      title="启动设置"
      open={visible}
      destroyOnClose
      maskClosable={false}
      onCancel={() => onVisibleChange(false)}
      width={572}
      onOk={onOk}
      className={`${clsPrefix}-start-modal`}
    >
      <Form
        form={form}
        layout="vertical"
        preserve={false}
        onValuesChange={onFormValueChange}
        initialValues={formValues}
        autoComplete="off"
      >
        <Form.Item
          name="name"
          label="工作流名称"
          required
          rules={[
            {
              required: true,
              message: "请输入工作流名称",
            },
          ]}
        >
          <Input
            placeholder="请输入工作流名称"
            maxLength={50}
            showCount
            allowClear
            disabled
          />
        </Form.Item>
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
        <Form.Item name="workerGroup" label="worker分组">
          <Select placeholder="请选择worker分组" options={groups} />
        </Form.Item>
        <Form.Item name="environmentCode" label="环境名称">
          <Select placeholder="请选择环境名称" options={environment} />
        </Form.Item>
        <Form.Item name="complementData" label="补数" valuePropName="checked">
          <Checkbox>是否是补数</Checkbox>
        </Form.Item>
        <Form.Item
          name="executeWay"
          label="执行方式："
          className={formValues.complementData ? "" : "no-item-execute"}
        >
          <Radio.Group>
            <Radio value="RUN_MODE_SERIAL">串行执行</Radio>
            <Radio value="RUN_MODE_PARALLEL">并行执行</Radio>
          </Radio.Group>
        </Form.Item>
        <Form.Item
          name="parallelism"
          label="并行度"
          className={
            formValues.executeWay === "RUN_MODE_PARALLEL"
              ? ""
              : "no-item-execute"
          }
        >
          <div style={{ display: "flex", alignItems: "center" }}>
            <Checkbox onClick={(e) => handleParallelism(e)}>
              自定义并行度
            </Checkbox>
            <Input
              placeholder="请输入并行度"
              allowClear
              disabled={!isParallelism}
            />
          </div>
        </Form.Item>
        <Form.Item
          name="executeOrder"
          label="执行顺序："
          className={formValues.complementData ? "" : "no-item-execute"}
        >
          <Radio.Group>
            <Radio value="DESC_ORDER">按日期降序执行</Radio>
            <Radio value="ASC_ORDER">按日期升序执行</Radio>
          </Radio.Group>
        </Form.Item>
        <Form.Item
          name="scheduleTime"
          label="调度时间："
          className={formValues.complementData ? "" : "no-item-execute "}
        >
          <RangePicker showTime />
        </Form.Item>
        <Form.Item name="email" label="告警邮箱">
          <Input placeholder="请输入告警邮箱，多个邮箱地址则用逗号分隔" />
        </Form.Item>
        <Form.Item label="启动参数">
          {formValues.globalParams?.map(
            (
              item: {
                key: string;
                value: string;
              },
              index
            ) => (
              <div key={index} className="relative w-11/12 mb-2 columns-2">
                <div>
                  <Input
                    placeholder="prop"
                    value={item.key}
                    onChange={(e) => {
                      const globalParams = cloneDeep(formValues.globalParams);
                      const curGlobalParam = globalParams[index] as any;
                      curGlobalParam.key = e.target.value;
                      onFormValueChange({ globalParams });
                    }}
                  />
                </div>
                <div>
                  <Input
                    placeholder="value"
                    value={item.value}
                    onChange={(e) => {
                      const globalParams = cloneDeep(formValues.globalParams);
                      const curGlobalParam = globalParams[index] as any;
                      curGlobalParam.value = e.target.value;
                      onFormValueChange({ globalParams });
                    }}
                  />
                </div>
                <Typography.Link
                  onClick={() => {
                    const globalParams = cloneDeep(formValues.globalParams);
                    globalParams.splice(index, 1);
                    onFormValueChange({ globalParams });
                  }}
                  className="absolute w-6 h-6 text-center rounded-full -right-8 top-1 hover:bg-red-200"
                >
                  <DeleteOutlined />
                </Typography.Link>
              </div>
            )
          )}
          <Typography.Link
            className="block w-8 h-8 p-1 text-center text-red-600 bg-red-200 rounded-full"
            onClick={() => {
              onFormValueChange({
                globalParams: [
                  ...(formValues?.globalParams || []),
                  {
                    key: "",
                    value: "",
                  },
                ],
              });
            }}
          >
            <PlusOutlined />
          </Typography.Link>
        </Form.Item>
      </Form>
    </Modal>
  );
});
