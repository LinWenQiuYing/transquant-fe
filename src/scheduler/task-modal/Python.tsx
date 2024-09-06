import { DeleteOutlined, PlusOutlined } from "@ant-design/icons";
import { MonacoEditor } from "@transquant/common";
import { useMount } from "ahooks";
import {
  Form,
  Input,
  InputNumber,
  Radio,
  Select,
  Switch,
  Typography,
} from "antd";
import { cloneDeep } from "lodash-es";
import { observer } from "mobx-react";
import { forwardRef, useEffect, useImperativeHandle, useState } from "react";
import {
  queryAllEnvironmentList,
  queryDataSourceList,
  queryResourceList,
} from "../api";
import { EditWorkflowDefinition } from "../dag/types";
import {
  datasourceTypes,
  jobSpeedByteOptions,
  jobSpeedRecordOptions,
  priorityOptions,
} from "./config";

interface PythonProps {
  data: any;
  definition: EditWorkflowDefinition;
}

const TYPE_LIST = [
  {
    value: "VARCHAR",
    label: "VARCHAR",
  },
  {
    value: "INTEGER",
    label: "INTEGER",
  },
  {
    value: "LONG",
    label: "LONG",
  },
  {
    value: "FLOAT",
    label: "FLOAT",
  },
  {
    value: "DOUBLE",
    label: "DOUBLE",
  },
  {
    value: "DATE",
    label: "DATE",
  },
  {
    value: "TIME",
    label: "TIME",
  },
  {
    value: "TIMESTAMP",
    label: "TIMESTAMP",
  },
  {
    value: "BOOLEAN",
    label: "BOOLEAN",
  },
  {
    value: "LIST",
    label: "LIST",
  },
  {
    value: "FILE",
    label: "FILE",
  },
];

const DIRECT_LIST = [
  {
    value: "IN",
    label: "IN",
  },
  {
    value: "OUT",
    label: "OUT",
  },
];

const getDatasourceTypes = () => {
  return datasourceTypes
    .filter((item) => {
      if (item.disabled) {
        return false;
      }
      return true;
    })
    .map((item) => ({
      label: item.code === "INCEPTOR" ? "TIMELYRE" : item.code,
      value: item.code,
    }));
};

const defaultFormValues = {
  name: "",
  flag: "YES",
  description: "",
  taskPriority: "MEDIUM",
  timeoutFlag: false,
  timeout: undefined,
  failRetryTimes: undefined,
  failRetryInterval: undefined,
  cpuQuota: undefined,
  memoryMax: undefined,
  delayTime: undefined,
  dsType: undefined,
  dataSource: undefined,
  dtType: undefined,
  environmentCode: undefined,
  dataTarget: undefined,
  targetTable: undefined,
  customConfig: true,
  localParams: [],
  rawScript: "",
  sql: "",
  preStatements: [],
  postStatements: [],
  preTasks: undefined,
  jobSpeedByte: 0,
  jobSpeedRecord: 1000,
};

export default observer(
  forwardRef(function Python(props: PythonProps, ref) {
    const { data, definition } = props;

    const [form] = Form.useForm();

    const [formValues, setFormValues] = useState(defaultFormValues);
    const [datasourceOptions, setDatasourceOptions] = useState([]);
    const [envList, setEnvList] = useState([]);
    const [fileList, setFileList] = useState([]);

    useMount(async () => {
      const envs = await queryAllEnvironmentList();
      const files = await queryResourceList({ type: "FILE", fullName: "" });
      setEnvList(envs);
      setFileList(files);
    });

    const getPreTasks = () => {
      const preTasks: number[] = [];
      definition.processTaskRelationList.forEach(
        (relation: { preTaskCode: number; postTaskCode: number }) => {
          if (
            relation.postTaskCode === data.code &&
            relation.preTaskCode !== 0
          ) {
            preTasks.push(relation.preTaskCode);
          }
        }
      );

      return preTasks;
    };

    useEffect(() => {
      if (!data) return;

      const preTasks = getPreTasks();
      const values = {
        ...data,
        preTasks,
        rawScript: data?.taskParams?.rawScript,
        customConfig: true,
        localParams: data?.taskParamList,
        resourceList: data?.taskParams?.resourceList?.map(
          (item: { resourceName: string }) => item.resourceName
        ),
      };

      setFormValues(values);
      form.setFieldsValue(values);
    }, [data]);

    const onFormValueChange = async (value: any) => {
      if ("dsType" in value) {
        const res = await queryDataSourceList({
          type: value.dsType,
        });
        setDatasourceOptions(
          res.map((item: any) => ({
            value: item.id,
            label: item.name,
          }))
        );
      }

      setFormValues({ ...formValues, ...value });
    };

    const validate = async () => {
      let values = await form.validateFields();

      const {
        customConfig,
        dsType,
        dtType,
        jobSpeedByte,
        jobSpeedRecord,
        postStatements,
        preStatements,
        sql,
        targetTable,
        cpuQuota,
        delayTime,
        failRetryInterval,
        failRetryTimes,
        memoryMax,
        timeout,
        timeoutFlag,
        rawScript,
        resourceList,
        ...restValues
      } = values;
      values = {
        ...restValues,
        taskType: "DATAX",
        cpuQuota: cpuQuota || -1,
        delayTime: delayTime || "0",
        failRetryInterval: failRetryInterval || "1",
        failRetryTimes: failRetryTimes || "0",
        isCache: "NO",
        memoryMax: memoryMax || -1,
        timeoutFlag: timeoutFlag ? "OPEN" : "CLOSE",
        timeout: timeout || 0,
        timeoutNotifyStrategy: "",
        workerGroup: "default",
        taskParams: {
          customConfig: customConfig ? 1 : 0,
          dsType,
          dtType,
          jobSpeedByte,
          jobSpeedRecord,
          localParams: formValues.localParams || [],
          resourceList: resourceList?.map((item: string) => ({
            resourceName: item,
          })),
          preStatements,
          postStatements,
          sql,
          targetTable,
          rawScript,
        },
      };

      return values;
    };

    useImperativeHandle(ref, () => ({
      validate,
    }));

    const getPreTask = () => {
      if (!definition?.taskDefinitionList) return [];
      const res: { value: string | number; label: string }[] = [];
      definition.taskDefinitionList.forEach((task) => {
        if (task.code === data.code) return;
        res.push({
          value: task.code,
          label: task.name,
        });
      });
      return res;
    };

    const defaultTemplate = (
      <Form.Item>
        <Form.Item className="columns-2">
          <Form.Item
            name="dsType"
            label="数据源类型"
            required
            rules={[
              {
                required: true,
                message: "请选择数据源类型",
              },
            ]}
          >
            <Select
              placeholder="请选择数据源类型"
              options={getDatasourceTypes()}
            />
          </Form.Item>
          <Form.Item
            name="dataSource"
            label="数据源实例"
            // required
            // rules={[
            //   {
            //     required: true,
            //     message: "请选择数据源实例",
            //   },
            // ]}
          >
            <Select
              placeholder="请选择数据源实例"
              options={datasourceOptions}
            />
          </Form.Item>
        </Form.Item>
        <Form.Item
          name="sql"
          required
          label="SQL语句"
          rules={[
            {
              required: true,
              message: "请输入脚本（必填）",
            },
          ]}
        >
          <div className="border border-gray-200 border-solid">
            <MonacoEditor
              value={formValues.sql}
              onChange={(value) => {
                onFormValueChange({ sql: value });

                form.setFieldValue("sql", value);
              }}
            />
          </div>
        </Form.Item>
        <Form.Item className="columns-3">
          <Form.Item
            name="dsType"
            label="数据源类型"
            required
            rules={[
              {
                required: true,
                message: "请选择数据源类型",
              },
            ]}
          >
            <Select
              placeholder="请选择数据源类型"
              options={getDatasourceTypes()}
            />
          </Form.Item>
          <Form.Item
            name="dataSource"
            label="数据源实例"
            // required
            // rules={[
            //   {
            //     required: true,
            //     message: "请选择数据源实例",
            //   },
            // ]}
          >
            <Select
              placeholder="请选择数据源实例"
              options={datasourceOptions}
            />
          </Form.Item>
          <Form.Item
            name="targetTable"
            required
            label="目标表"
            rules={[
              {
                required: true,
                message: "请输入目标表",
              },
            ]}
          >
            <Input placeholder="请输入目标表" />
          </Form.Item>
        </Form.Item>
        <Form.Item label="目标库前置SQL">
          {formValues?.preStatements?.map((item, index) => (
            <div key={index} className="relative mb-2">
              <Input
                className="w-11/12"
                placeholder="请输入非查询SQL语句"
                value={item}
                key={index}
                onChange={(e) => {
                  const preStatements = cloneDeep(
                    formValues.preStatements
                  ) as string[];
                  preStatements.splice(index, 1, e.target.value);
                  onFormValueChange({ preStatements });
                }}
              />
              <Typography.Link
                onClick={() => {
                  const preStatements = cloneDeep(formValues.preStatements);
                  preStatements.splice(index, 1);

                  onFormValueChange({ preStatements });
                }}
                className="absolute w-6 h-6 text-center rounded-full right-4 top-1 hover:bg-red-200"
              >
                <DeleteOutlined />
              </Typography.Link>
            </div>
          ))}
          <Typography.Link
            className="block w-8 h-8 p-1 text-center text-red-600 bg-red-200 rounded-full"
            onClick={() => {
              onFormValueChange({
                preStatements: [...(formValues?.preStatements || []), ""],
              });
            }}
          >
            <PlusOutlined />
          </Typography.Link>
        </Form.Item>
        <Form.Item label="目标库后置SQL">
          {formValues?.postStatements?.map((item, index) => (
            <div key={index} className="relative mb-2">
              <Input
                className="w-11/12"
                placeholder="请输入非查询SQL语句"
                value={item}
                key={index}
                onChange={(e) => {
                  const postStatements = cloneDeep(
                    formValues.postStatements
                  ) as string[];
                  postStatements.splice(index, 1, e.target.value);
                  onFormValueChange({ postStatements });
                }}
              />
              <Typography.Link
                onClick={() => {
                  const postStatements = cloneDeep(formValues.postStatements);
                  postStatements.splice(index, 1);

                  onFormValueChange({ postStatements });
                }}
                className="absolute w-6 h-6 text-center rounded-full right-4 top-1 hover:bg-red-200"
              >
                <DeleteOutlined />
              </Typography.Link>
            </div>
          ))}
          <Typography.Link
            className="block w-8 h-8 p-1 text-center text-red-600 bg-red-200 rounded-full"
            onClick={() => {
              onFormValueChange({
                postStatements: [...(formValues?.postStatements || []), ""],
              });
            }}
          >
            <PlusOutlined />
          </Typography.Link>
        </Form.Item>
        <Form.Item className="columns-2">
          <Form.Item name="jobSpeedByte" label="限流（字节数）">
            <Select placeholder="请选择" options={jobSpeedByteOptions} />
          </Form.Item>
          <Form.Item name="jobSpeedRecord" label="限流（记录数）">
            <Select placeholder="请选择" options={jobSpeedRecordOptions} />
          </Form.Item>
        </Form.Item>
      </Form.Item>
    );

    const customTemplate = (
      <Form.Item>
        <Form.Item
          name="rawScript"
          required
          label="脚本"
          rules={[
            {
              required: true,
              message: "请输入脚本（必填）",
            },
          ]}
        >
          <div className="border border-gray-200 border-solid">
            <MonacoEditor
              value={formValues.rawScript}
              onChange={(value) => {
                onFormValueChange({ rawScript: value });

                form.setFieldValue("rawScript", value);
              }}
            />
          </div>
        </Form.Item>
      </Form.Item>
    );

    return (
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
          label="节点名称"
          required
          rules={[
            {
              required: true,
              message: "请输入节点名称",
            },
          ]}
        >
          <Input
            placeholder="请输入节点名称"
            maxLength={50}
            showCount
            allowClear
          />
        </Form.Item>
        <Form.Item name="flag" label="运行标志">
          <Radio.Group>
            <Radio value="YES">正常</Radio>
            <Radio value="NO">禁止执行</Radio>
          </Radio.Group>
        </Form.Item>
        <Form.Item name="description" label="描述">
          <Input.TextArea placeholder="请输入描述" />
        </Form.Item>
        <Form.Item
          name="taskPriority"
          label="任务优先级"
          required
          rules={[
            {
              required: true,
              message: "请选择任务优先级",
            },
          ]}
        >
          <Select placeholder="请选择任务优先级" options={priorityOptions} />
        </Form.Item>
        <Form.Item className="columns-2">
          <Form.Item
            name="timeoutFlag"
            label="超时失败"
            valuePropName="checked"
          >
            <Switch />
          </Form.Item>
          <Form.Item
            name="timeout"
            label="超时时长"
            className={`${formValues.timeoutFlag ? "opacity-1" : "opacity-0"}`}
          >
            <InputNumber placeholder="请输入时长" className="w-full" />
          </Form.Item>
        </Form.Item>
        <Form.Item name="environmentCode" label="环境名称">
          <Select
            placeholder="请选择环境名称"
            options={envList.map((env: { name: string; code: number }) => ({
              label: env.name,
              value: env.code,
            }))}
          />
        </Form.Item>
        <Form.Item className="columns-2">
          <Form.Item name="failRetryTimes" label="失败重试次数">
            <InputNumber
              placeholder="请输入次数"
              suffix="次"
              className="w-full"
            />
          </Form.Item>
          <Form.Item name="failRetryInterval" label="失败重试时间间隔">
            <InputNumber
              placeholder="请输入时长"
              suffix="分"
              className="w-full"
            />
          </Form.Item>
        </Form.Item>
        <Form.Item className="columns-2">
          <Form.Item name="cpuQuota" label="CPU配额">
            <InputNumber
              placeholder="请输入CPU配额"
              suffix="%"
              className="w-full"
            />
          </Form.Item>
          <Form.Item name="memoryMax" label="最大内存">
            <InputNumber
              placeholder="请输入最大内存"
              suffix="MB"
              className="w-full"
            />
          </Form.Item>
        </Form.Item>
        <Form.Item name="delayTime" label="延迟执行时间">
          <InputNumber
            placeholder="请输入时长"
            suffix="分"
            className="w-full"
          />
        </Form.Item>
        <Form.Item
          style={{ display: "none" }}
          name="customConfig"
          label="自定义模版"
          valuePropName="checked"
        >
          <Switch />
        </Form.Item>
        {formValues.customConfig ? customTemplate : defaultTemplate}
        <Form.Item name="resourceList" label="资源文件">
          <Select
            placeholder="请选择资源文件"
            mode="multiple"
            options={fileList.map(
              (file: { name: string; fullName: string }) => ({
                label: file.name,
                value: file.fullName,
              })
            )}
          />
        </Form.Item>
        <Form.Item label="自定义参数">
          {formValues.localParams?.map(
            (
              item: {
                prop: string;
                direct: string;
                type: string;
                value: string;
              },
              index
            ) => (
              <div key={index} className="relative w-11/12 mb-2 columns-4">
                <div>
                  <Input
                    placeholder="prop(必填)"
                    value={item.prop}
                    onChange={(e) => {
                      const localParams = cloneDeep(formValues.localParams);
                      const curLocalParam = localParams[index] as any;
                      curLocalParam.prop = e.target.value;
                      onFormValueChange({ localParams });
                    }}
                  />
                </div>
                <div>
                  <Select
                    options={DIRECT_LIST}
                    value={item.direct}
                    onChange={(value) => {
                      const localParams = cloneDeep(formValues.localParams);
                      const curLocalParam = localParams[index] as any;
                      curLocalParam.direct = value;
                      onFormValueChange({ localParams });
                    }}
                  />
                </div>
                <div>
                  <Select
                    options={TYPE_LIST}
                    value={item.type}
                    onChange={(value) => {
                      const localParams = cloneDeep(formValues.localParams);
                      const curLocalParam = localParams[index] as any;
                      curLocalParam.type = value;
                      onFormValueChange({ localParams });
                    }}
                  />
                </div>
                <div>
                  <Input
                    placeholder="prop(必填)"
                    value={item.value}
                    onChange={(e) => {
                      const localParams = cloneDeep(formValues.localParams);
                      const curLocalParam = localParams[index] as any;
                      curLocalParam.value = e.target.value;
                      onFormValueChange({ localParams });
                    }}
                  />
                </div>
                <Typography.Link
                  onClick={() => {
                    const localParams = cloneDeep(formValues.localParams);
                    localParams.splice(index, 1);

                    onFormValueChange({ localParams });
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
                localParams: [
                  ...(formValues?.localParams || []),
                  {
                    prop: "",
                    direct: "IN",
                    type: "VARCHAR",
                    value: "",
                  },
                ],
              });
            }}
          >
            <PlusOutlined />
          </Typography.Link>
        </Form.Item>
        <Form.Item name="preTasks" label="前置任务">
          <Select
            placeholder="请选择前置任务"
            mode="multiple"
            options={getPreTask()}
          />
        </Form.Item>
      </Form>
    );
  })
);
