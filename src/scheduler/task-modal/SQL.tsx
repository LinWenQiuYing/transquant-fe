import { DeleteOutlined, PlusOutlined } from "@ant-design/icons";
import { MonacoEditor } from "@transquant/common";
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
import { queryDataSourceList } from "../api";
import { EditWorkflowDefinition } from "../dag/types";
import {
  datasourceTypes,
  DIRECT_LIST,
  DISPLAY_ROWS,
  priorityOptions,
  SQL_TYPES,
  TYPE_LIST,
} from "./config";

interface SQLProps {
  data: any;
  definition: EditWorkflowDefinition;
}

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
  delayTime: undefined,
  supportedDatasourceType: undefined,
  datasource: undefined,
  sqlType: undefined,
  displayRows: undefined,
  sql: "",
  localParams: [],
  preStatements: [],
  postStatements: [],
  preTasks: [],
};

export default observer(
  forwardRef(function SQL(props: SQLProps, ref) {
    const { data, definition } = props;
    const [form] = Form.useForm();

    const [formValues, setFormValues] = useState(defaultFormValues);
    const [datasourceOptions, setDatasourceOptions] = useState([]);

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

      if (data.taskParams?.type) {
        queryDataSourceList({
          type: data.taskParams.type,
        }).then((value) => {
          setDatasourceOptions(
            value.map((item: any) => ({
              value: item.id,
              label: item.name,
            }))
          );
        });
      }
      const preTasks = getPreTasks();

      const values = {
        name: data.name,
        preTasks,
        flag: data.flag || "YES",
        description: data.description,
        taskPriority: data.taskPriority,
        timeoutFlag: data.timeoutFlag === "OPEN",
        failRetryTimes: data.failRetryTimes,
        failRetryInterval: data.failRetryInterval,
        delayTime: data.delayTime,
        supportedDatasourceType: data.taskParams?.type,
        datasource: data.taskParams?.datasource,
        sqlType: data.taskParams?.sqlType,
        displayRows: data.taskParams?.displayRows,
        sql: data.taskParams?.sql,
        localParams: data.taskParams?.localParams || [],
        preStatements: data.taskParams?.preStatements,
        postStatements: data.taskParams?.postStatements,
      } as any;
      setFormValues(values);
      form.setFieldsValue(values);
    }, [data]);

    const onFormValueChange = async (value: any) => {
      if ("supportedDatasourceType" in value) {
        const res = await queryDataSourceList({
          type: value.supportedDatasourceType,
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
        displayRows,
        sql,
        sqlType,
        timeoutFlag,
        supportedDatasourceType,
        datasource,
        ...restValues
      } = values;
      values = {
        ...restValues,
        taskType: "SQL",
        timeoutFlag: timeoutFlag ? "OPEN" : "CLOSE",
        environmentCode: -1,
        isCache: "NO",
        taskExecuteType: "BATCH",
        taskParams: {
          displayRows,
          localParams: formValues.localParams,
          postStatements: formValues.postStatements,
          preStatements: formValues.preStatements,
          sql,
          sqlType,
          datasource,
          type: supportedDatasourceType,
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
        <Form.Item name="delayTime" label="延迟执行时间">
          <InputNumber
            placeholder="请输入时长"
            suffix="分"
            className="w-full"
          />
        </Form.Item>
        <Form.Item className="columns-2">
          <Form.Item
            name="supportedDatasourceType"
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
            name="datasource"
            label="数据源实例"
            required
            rules={[
              {
                required: true,
                message: "请选择数据源实例",
              },
            ]}
          >
            <Select
              placeholder="请选择数据源实例"
              options={datasourceOptions}
            />
          </Form.Item>
        </Form.Item>
        <Form.Item className="columns-2">
          <Form.Item name="sqlType" label="SQL类型" required>
            <Select placeholder="请选择SQL类型" options={SQL_TYPES} />
          </Form.Item>
          <Form.Item name="displayRows" label="日志显示（行查询结果）">
            <Select placeholder="请选择日志显示" options={DISPLAY_ROWS} />
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
        <Form.Item label="前置SQL语句">
          {formValues?.preStatements?.map((item, index) => (
            <div key={index} className="relative mb-2">
              <Input
                className="w-11/12"
                placeholder="请输入前置SQL语句"
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
        <Form.Item label="后置SQL语句">
          {formValues?.postStatements?.map((item, index) => (
            <div key={index} className="relative mb-2">
              <Input
                className="w-11/12"
                placeholder="请输入后置SQL语句"
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
