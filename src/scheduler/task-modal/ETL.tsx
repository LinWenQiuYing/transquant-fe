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
  queryAllWorkerGroups,
  queryDataSourceList,
} from "../api";
import { EditWorkflowDefinition } from "../dag/types";
import {
  datasourceTypes,
  filedTypeOptions,
  jobSpeedByteOptions,
  memoryLimitOptions,
  priorityOptions,
} from "./config";

interface ETLProps {
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
  dataTarget: undefined,
  targetTable: undefined,
  customConfig: true,
  localParams: [],
  json: "",
  sql: "",
  preStatements: [],
  postStatements: [],
  preTasks: undefined,
  jobSpeedByte: 0,
  jobSpeedRecord: 1000,
  xms: 1,
  xmx: 1,
  splitColumn: undefined,
  fetchSize: undefined,
  timelyreColumn: [],
  dirtyRecord: undefined,
  dirtyPercentage: undefined,
  jobSpeedChannel: undefined,
  protectLevel: undefined,
  dataEncrypt: undefined,
  storePath: undefined,
  fileName: undefined,
  writeMode: undefined,
  fieldDelimiter: undefined,
  hdfsColumn: [{ name: undefined, type: undefined }],
};

export default observer(
  forwardRef(function ETL(props: ETLProps, ref) {
    const { data, definition } = props;
    const [form] = Form.useForm();

    const [formValues, setFormValues] = useState(defaultFormValues);
    const [datasourceOptions, setDatasourceOptions] = useState([]);
    const [dtOptions, setDtOptions] = useState([]);
    const [environment, setEnvironment] = useState([]);
    const [groups, setGroups] = useState([]);

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

    const backfillDataSource = () => {
      if (data?.taskParams?.dsType) {
        queryDataSourceList({
          type: data.taskParams.dsType,
        }).then((res) => {
          setDatasourceOptions(
            res.map((item: any) => ({
              value: item.id,
              label: item.name,
            }))
          );
        });
      }
      if (data?.taskParams?.dtType === "INCEPTOR") {
        queryDataSourceList({
          type: data.taskParams.dtType,
        }).then((res) => {
          setDtOptions(
            res.map((item: any) => ({
              value: item.id,
              label: item.name,
            }))
          );
        });
      }
    };

    const backfillHdfsValueFiled = (
      hdfs: { name: string; type: string }[],
      values: Record<string, any>
    ) => {
      return hdfs.reduce((acc, cur, index) => {
        acc[`hdfsColumn${index}`] = cur.name;
        return acc;
      }, values);
    };

    useEffect(() => {
      if (!data) return;

      if (data.taskParams?.dsType) {
        backfillDataSource();
      }
      const preTasks = getPreTasks();

      let values = {
        ...data,
        ...(data.taskParams || {}),
        hdfsColumn:
          data?.taskParams?.hdfsColumn || defaultFormValues.hdfsColumn,
        preTasks,
        customConfig:
          data.taskParams?.frontCustomConfig === undefined
            ? data.taskParams?.customConfig
            : data.taskParams?.frontCustomConfig,
      };

      values = backfillHdfsValueFiled(
        data.taskParams?.hdfsColumn || [],
        values
      );

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
      if ("dtType" in value && value.dtType === "INCEPTOR") {
        const res = await queryDataSourceList({
          type: value.dtType,
        });
        setDtOptions(
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
        sql,
        targetTable,
        xms,
        xmx,
        cpuQuota,
        delayTime,
        failRetryInterval,
        failRetryTimes,
        memoryMax,
        timeout,
        timeoutFlag,
        json,
        dataSource,
        dataTarget,
        dirtyPercentage,
        dirtyRecord,
        fetchSize,
        fieldDelimiter,
        fileType,
        jobSpeedChannel,
        protectLevel,
        splitColumn,
        storePath,
        writeMode,
        dataEncrypt,
        fileName,
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
          dataEncrypt,
          dsType,
          dtType,
          jobSpeedByte,
          jobSpeedRecord,
          localParams: formValues.localParams || [],
          resourceList: [],
          preStatements: formValues.preStatements,
          postStatements: formValues.postStatements,
          timelyreColumn: formValues.timelyreColumn,
          hdfsColumn: formValues.hdfsColumn,
          sql,
          targetTable,
          dataSource,
          dataTarget,
          dirtyPercentage,
          dirtyRecord,
          fetchSize,
          fieldDelimiter,
          fileType,
          fileName,
          jobSpeedChannel,
          protectLevel,
          splitColumn,
          storePath,
          writeMode,
          xms,
          xmx,
          json,
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
      <Form.Item className="mb-0">
        <div className="flex items-center mb-2">
          <div className="w-[2px] h-4 mr-2 bg-red-600 float-start" />
          <span className="font-bold">reader</span>
        </div>
        <Form.Item className="mb-0 columns-2">
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
        <Form.Item className="mb-0 columns-2">
          <Form.Item name="splitColumn" label="数据切分字段">
            <Input placeholder="请输入数据切分字段" />
          </Form.Item>
          <Form.Item name="fetchSize" label="批量数据获取条数">
            <InputNumber
              suffix="条"
              className="w-full"
              placeholder="请输入批量数据获取条数"
            />
          </Form.Item>
        </Form.Item>
        <div className="flex items-center mb-2">
          <div className="w-[2px] h-4 mr-2 bg-red-600 float-start" />
          <span className="font-bold">writer</span>
        </div>
        <Form.Item className="mb-0 columns-2">
          <Form.Item
            name="dtType"
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
              options={[
                {
                  label: "TIMELYRE",
                  value: "INCEPTOR",
                },
                {
                  label: "HDFSWRITER",
                  value: "HDFSWRITER",
                },
              ]}
            />
          </Form.Item>
          {formValues.dtType !== "HDFSWRITER" ? (
            <Form.Item
              name="dataTarget"
              label="数据源实例"
              rules={[
                {
                  required: true,
                  message: "请选择数据源实例",
                },
              ]}
            >
              <Select placeholder="请选择数据源实例" options={dtOptions} />
            </Form.Item>
          ) : (
            <Form.Item
              name="fileType"
              label="文件类型"
              rules={[
                {
                  required: true,
                  message: "请选择文件类型",
                },
              ]}
            >
              <Select
                placeholder="请选择文件类型"
                options={[
                  {
                    label: "text",
                    value: "text",
                  },
                  {
                    label: "orc",
                    value: "orc",
                  },
                ]}
              />
            </Form.Item>
          )}
        </Form.Item>
        {formValues.dtType === "HDFSWRITER" && (
          <>
            <Form.Item className="mb-0 columns-2">
              <Form.Item
                name="protectLevel"
                label="数据传输保护级别"
                rules={[
                  {
                    required: true,
                    message: "请选择数据传输保护级别",
                  },
                ]}
              >
                <Select
                  placeholder="请选择数据传输保护级别"
                  options={[
                    {
                      label: "authentication",
                      value: "authentication",
                    },
                    {
                      label: "privacy",
                      value: "privacy",
                    },
                    {
                      label: "integrity",
                      value: "integrity",
                    },
                  ]}
                />
              </Form.Item>
              <Form.Item
                name="dataEncrypt"
                label="数据传输加密"
                rules={[
                  {
                    required: true,
                    message: "请选择数据传输加密",
                  },
                ]}
              >
                <Select
                  placeholder="请选择数据传输加密"
                  options={[
                    {
                      label: "true",
                      value: "true",
                    },
                    {
                      label: "false",
                      value: "false",
                    },
                  ]}
                />
              </Form.Item>
            </Form.Item>
            <Form.Item className="mb-0 columns-2">
              <Form.Item
                name="storePath"
                label="存储路径"
                rules={[
                  {
                    required: true,
                    message: "请输入存储路径",
                  },
                ]}
              >
                <Input placeholder="请输入存储路径" />
              </Form.Item>
              <Form.Item
                name="fileName"
                label="文件名"
                rules={[
                  {
                    required: true,
                    message: "请输入文件名",
                  },
                ]}
              >
                <Input placeholder="请输入文件名" />
              </Form.Item>
            </Form.Item>
          </>
        )}

        {formValues.dtType !== "HDFSWRITER" && (
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
        )}
        {formValues.dtType !== "HDFSWRITER" && (
          <Form.Item label="列信息">
            {formValues?.timelyreColumn?.map((item, index) => (
              <div key={index} className="relative mb-2">
                <Input
                  className="w-11/12"
                  placeholder="请输入列信息"
                  value={item}
                  key={index}
                  onChange={(e) => {
                    const timelyreColumn = cloneDeep(
                      formValues.timelyreColumn
                    ) as string[];
                    timelyreColumn.splice(index, 1, e.target.value);
                    onFormValueChange({ timelyreColumn });
                  }}
                />
                <Typography.Link
                  onClick={() => {
                    const timelyreColumn = cloneDeep(formValues.timelyreColumn);
                    timelyreColumn.splice(index, 1);

                    onFormValueChange({ timelyreColumn });
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
                  timelyreColumn: [...(formValues?.timelyreColumn || []), ""],
                });
              }}
            >
              <PlusOutlined />
            </Typography.Link>
          </Form.Item>
        )}
        {formValues.dtType === "HDFSWRITER" && (
          <Form.Item label="列信息">
            {formValues.hdfsColumn?.map(
              (
                item: {
                  name?: string;
                  type?: string;
                },
                index
              ) => (
                <div key={index} className="relative w-11/12 mb-2 columns-2">
                  <Form.Item
                    name={`hdfsColumn${index}`}
                    rules={[
                      {
                        required: true,
                        pattern: /^[a-z_][a-z0-9_]*$/,
                        message:
                          "仅支持输入字母、数字及下划线‘_’，且不能以数字开头，统一为小写",
                      },
                    ]}
                  >
                    <Input
                      placeholder="请输入字段名"
                      value={item.name}
                      onChange={(e) => {
                        const hdfsColumn = cloneDeep(formValues.hdfsColumn);
                        const curHdfsColumn = hdfsColumn[index] as any;
                        curHdfsColumn.name = e.target.value;
                        onFormValueChange({ hdfsColumn });
                      }}
                    />
                  </Form.Item>
                  <div>
                    <Select
                      options={filedTypeOptions}
                      value={item.type}
                      placeholder="请选择字段类型"
                      onChange={(value) => {
                        const hdfsColumn = cloneDeep(formValues.hdfsColumn);
                        const curHdfsColumn = hdfsColumn[index] as any;
                        curHdfsColumn.type = value;
                        onFormValueChange({ hdfsColumn });
                      }}
                    />
                  </div>

                  <Typography.Link
                    onClick={() => {
                      const hdfsColumn = cloneDeep(formValues.hdfsColumn);
                      hdfsColumn.splice(index, 1);

                      onFormValueChange({ hdfsColumn });
                    }}
                    disabled={formValues.hdfsColumn.length === 1}
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
                  hdfsColumn: [
                    ...(formValues?.hdfsColumn || []),
                    {
                      value: undefined,
                      type: undefined,
                    },
                  ],
                });
              }}
            >
              <PlusOutlined />
            </Typography.Link>
          </Form.Item>
        )}
        {formValues.dtType === "HDFSWRITER" && (
          <Form.Item className="mb-0 columns-2">
            <Form.Item
              name="writeMode"
              label="写入数据前清理模式"
              rules={[
                {
                  required: true,
                  message: "请选择写入数据前清理模式",
                },
              ]}
            >
              <Select
                placeholder="请选择写入数据前清理模式"
                options={[
                  {
                    label: "truncate",
                    value: "truncate",
                  },
                  {
                    label: "none",
                    value: "none",
                  },
                ]}
              />
            </Form.Item>
            <Form.Item
              name="fieldDelimiter"
              label="字段分隔符"
              rules={[
                {
                  required: true,
                  message: "请输入字段分隔符",
                },
              ]}
            >
              <Input placeholder="请输入字段分隔符" />
            </Form.Item>
          </Form.Item>
        )}
        {formValues.dtType !== "HDFSWRITER" && (
          <>
            <Form.Item label="前置SQL">
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
              {!formValues.preStatements?.length && (
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
              )}
            </Form.Item>
            <Form.Item label="后置SQL">
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
                      const postStatements = cloneDeep(
                        formValues.postStatements
                      );
                      postStatements.splice(index, 1);

                      onFormValueChange({ postStatements });
                    }}
                    className="absolute w-6 h-6 text-center rounded-full right-4 top-1 hover:bg-red-200"
                  >
                    <DeleteOutlined />
                  </Typography.Link>
                </div>
              ))}
              {!formValues.postStatements?.length && (
                <Typography.Link
                  className="block w-8 h-8 p-1 text-center text-red-600 bg-red-200 rounded-full"
                  onClick={() => {
                    onFormValueChange({
                      postStatements: [
                        ...(formValues?.postStatements || []),
                        "",
                      ],
                    });
                  }}
                >
                  <PlusOutlined />
                </Typography.Link>
              )}
            </Form.Item>
          </>
        )}
        <div className="flex items-center mb-2">
          <div className="w-[2px] h-4 mr-2 bg-red-600 float-start" />
          <span className="font-bold">setting</span>
        </div>
        <Form.Item className="mb-0 columns-2">
          <Form.Item name="jobSpeedByte" label="限流（字节数）">
            <Select
              placeholder="请选择限流字节数"
              options={jobSpeedByteOptions}
            />
          </Form.Item>
          <Form.Item name="jobSpeedChannel" label="限流（并发数）">
            <InputNumber placeholder="请输入限流并发数" className="w-full" />
          </Form.Item>
        </Form.Item>
        <Form.Item className="mb-0 columns-2">
          <Form.Item name="dirtyRecord" label="脏数据最大记录数">
            <InputNumber
              placeholder="请输入脏数据最大记录数"
              className="w-full"
            />
          </Form.Item>
          <Form.Item name="dirtyPercentage" label="脏数据最大占比">
            <InputNumber
              placeholder="请输入脏数据最大占比"
              className="w-full"
              suffix="%"
            />
          </Form.Item>
        </Form.Item>
      </Form.Item>
    );

    const customTemplate = (
      <Form.Item
        name="json"
        required
        label="JSON"
        rules={[
          {
            required: true,
            message: "请输入脚本（必填）",
          },
        ]}
      >
        <div className="border border-gray-200 border-solid">
          <MonacoEditor
            value={formValues.json}
            onChange={(value) => {
              onFormValueChange({ json: value });

              form.setFieldValue("json", value);
            }}
          />
        </div>
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
        <Form.Item className="columns-2">
          <Form.Item name="environmentCode" label="环境名称">
            <Select placeholder="请选择环境名称" options={environment} />
          </Form.Item>
          <Form.Item name="workerGroup" label="worker分组">
            <Select placeholder="请选择worker分组" options={groups} />
          </Form.Item>
        </Form.Item>
        <Form.Item
          name="customConfig"
          label="自定义模版"
          valuePropName="checked"
        >
          <Switch />
        </Form.Item>
        {formValues.customConfig ? customTemplate : defaultTemplate}
        <Form.Item className="mb-0 columns-2">
          <Form.Item name="xms" label="最小内存">
            <Select placeholder="请选择" options={memoryLimitOptions} />
          </Form.Item>
          <Form.Item name="xmx" label="最大内存">
            <Select placeholder="请选择" options={memoryLimitOptions} />
          </Form.Item>
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
