/* eslint-disable no-octal-escape */
import { QuestionCircleOutlined } from "@ant-design/icons";
import { useMount } from "ahooks";
import {
  Form,
  Input,
  InputNumber,
  message,
  Modal,
  Radio,
  Select,
  Switch,
  Tooltip,
} from "antd";
import { observer } from "mobx-react";
import { useRef, useState } from "react";
import { When } from "react-if";
import { useStores } from "../hooks";
import ImportTable, { DataType } from "./ImportTable";

interface TableModalProps {
  visible: boolean;
  onVisibleChange: (value: boolean) => void;
  database: string;
}

export type CreateTableType = "TIMELYRE" | "ORC" | "TEXT";

const defaultFormValues = {
  tableName: undefined,
  label: undefined,
  userComment: undefined,
  tableComment: undefined,
  createTableType: "TIMELYRE",
  isTransactional: false,
  bucketCol: undefined,
  bucketCount: undefined,
  hdfsPath: "",
  fieldsTerminatedBy: "",
  linesTerminatedBy: "",
  customSeparator: false,
};

export default observer(function TableModal(props: TableModalProps) {
  const { visible, onVisibleChange, database } = props;
  const { personalTags, getPersonalTags, createTable, resetTableHeaders } =
    useStores().dataResourceStore;

  const [form] = Form.useForm();
  const [formValues, setFormValues] = useState(defaultFormValues);
  const ref = useRef<{ columnParams: DataType[] }>(null);

  useMount(() => {
    getPersonalTags();
  });

  const onFormValueChange = (value: any) => {
    setFormValues({ ...formValues, ...value });
  };

  const onOk = () => {
    if (
      formValues.createTableType === "ORC" ||
      formValues.createTableType === "TEXT"
    ) {
      if (!ref.current?.columnParams?.length) {
        message.info("列信息为必填项，请添加数据");
        return;
      }
    }
    form.validateFields().then(async (values) => {
      createTable({
        ...values,
        columnParams: ref.current?.columnParams,
        dbName: database,
      }).then(() => {
        resetTableHeaders();
        onVisibleChange(false);
      });
    });
  };

  return (
    <Modal
      title="新建表"
      open={visible}
      onCancel={() => onVisibleChange(false)}
      onOk={onOk}
      width={1000}
      destroyOnClose
    >
      <Form
        layout="vertical"
        preserve={false}
        form={form}
        initialValues={formValues}
        onValuesChange={onFormValueChange}
      >
        <div className="grid grid-cols-2 gap-x-6">
          <Form.Item
            name="tableName"
            label="表名称"
            rules={[
              {
                required: true,
                message:
                  "仅支持输入小写字母、数字以及下划线，且不能以数字开头，长度128字符以内",
                pattern: /^[a-z_][a-z0-9_]*$/,
              },
            ]}
          >
            <Input placeholder="请输入表名称" maxLength={128} />
          </Form.Item>
          <Form.Item name="label" label="标签">
            <Select
              placeholder="请选择标签"
              mode="tags"
              tokenSeparators={[","]}
            >
              {personalTags.map((label) => (
                <Select.Option key={label.name}>{label.name}</Select.Option>
              ))}
            </Select>
          </Form.Item>
        </div>
        <Form.Item name="userComment" label="备注">
          <Input.TextArea placeholder="请输入备注" maxLength={100} />
        </Form.Item>
        <Form.Item name="tableComment" label="表注释">
          <Input.TextArea placeholder="请输入表注释" maxLength={4000} />
        </Form.Item>
        <Form.Item name="createTableType" label="表类型">
          <Radio.Group>
            <Radio value="TIMELYRE">timelyre</Radio>
            <Radio value="ORC">ORC</Radio>
            <Radio value="TEXT">text外表</Radio>
          </Radio.Group>
        </Form.Item>
        <ImportTable
          ref={ref}
          createTableType={formValues.createTableType as CreateTableType}
        />
        <When condition={formValues.createTableType === "ORC"}>
          <Form.Item
            name="isTransactional"
            label="事务表"
            valuePropName="checked"
            className="mt-4"
          >
            <Switch checkedChildren="ON" unCheckedChildren="OFF" />
          </Form.Item>
          <When condition={formValues.isTransactional}>
            <div className="grid grid-cols-2 gap-x-6">
              <Form.Item
                name="bucketCol"
                label="分桶列"
                rules={[
                  {
                    required: true,
                  },
                ]}
              >
                <Input placeholder="请输入列名" />
              </Form.Item>
              <Form.Item
                name="bucketCount"
                label="分桶数"
                rules={[
                  {
                    required: true,
                  },
                ]}
              >
                <InputNumber placeholder="请输入分桶数" className="w-full" />
              </Form.Item>
            </div>
          </When>
        </When>
        <When condition={formValues.createTableType === "TEXT"}>
          <div className="grid grid-cols-2 mt-4 gap-x-6">
            <Form.Item
              name="hdfsPath"
              label="hdfs路径"
              rules={[
                {
                  required: true,
                },
              ]}
            >
              <Input placeholder="请输入路径" />
            </Form.Item>
            <Form.Item
              name="customSeparator"
              label={
                <div>
                  自定义分隔符
                  <Tooltip title="不指定时将使用默认分隔符。列分隔符：“\001”；复杂数据类型分隔符：'\002'；MAP类型中键值对分隔符：'\003'；换行符：'\n'">
                    <QuestionCircleOutlined className="ml-2 text-gray-400 cursor-pointer" />
                  </Tooltip>
                </div>
              }
              valuePropName="checked"
            >
              <Switch checkedChildren="ON" unCheckedChildren="OFF" />
            </Form.Item>
          </div>
          <When condition={formValues.customSeparator}>
            <div className="grid grid-cols-2 gap-x-6">
              <Form.Item name="fieldsTerminatedBy" label="列分隔符">
                <Input placeholder="请输入列分隔符" />
              </Form.Item>
              <Form.Item name="linesTerminatedBy" label="换行符">
                <Input placeholder="请输入换行符" />
              </Form.Item>
            </div>
          </When>
        </When>
      </Form>
    </Modal>
  );
});
