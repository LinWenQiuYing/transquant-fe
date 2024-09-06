import { clsPrefix } from "@transquant/constants";
import { DataType, isJson } from "@transquant/utils";
import { Button, Form, Input, InputNumber, message, Modal, Select } from "antd";
import { observer } from "mobx-react";
import { useEffect, useState } from "react";

import { useStores } from "../../hooks";
import { SourceFormValueType, SourceListItem } from "../../types";

interface SourceModalProps<T> {
  title?: string;
  data?: T;
  visible: boolean;
  onVisibleChange: (value: boolean) => void;
  readonly: boolean;
}

const defaultFormValues: SourceFormValueType = {
  dataSource: undefined,
  sourceName: "",
  desc: "",
  ip: "",
  port: "",
  user: "",
  psw: "",
  dataBase: "",
  jdbcParams: "",
};

export default observer(function SourceModal<
  T extends DataType<SourceListItem>
>(props: SourceModalProps<T>) {
  const { title, visible, onVisibleChange, data, readonly } = props;
  const {
    sourceOptions,
    createSource,
    editSource,
    testConnect,
    getSourceList,
  } = useStores().sourceCenterStore;

  const [form] = Form.useForm();
  const [formValues, setFormValues] = useState(defaultFormValues);
  const isEdit = title === "编辑数据源";

  const onFormValueChange = (value: any) => {
    setFormValues({ ...formValues, ...value });
  };

  useEffect(() => {
    if (!data) return;
    if (isEdit) {
      setFormValues({
        dataSource: data.type,
        sourceName: data.name,
        desc: data.desc,
        ip: data.ip as string,
        port: data.port as string,
        user: data.user as string,
        psw: data.psw as string,
        dataBase: data.dataBase as string,
        jdbcParams: data.jdbcParams,
      });
      form.setFieldsValue({
        dataSource: data.type,
        sourceName: data.name,
        desc: data.desc,
        ip: data.ip as string,
        port: data.port as string,
        user: data.user as string,
        psw: data.psw as string,
        dataBase: data.dataBase as string,
        jdbcParams: data.jdbcParams,
      });
    }
  }, [data, visible]);

  const onOk = async () => {
    form
      .validateFields()
      .then(async () => {
        if (isEdit && data) {
          await editSource(data.id, formValues)
            .then(() => {
              getSourceList(readonly);
            })
            .catch(() => {});
        } else {
          await createSource(formValues)
            .then(() => {
              getSourceList(readonly);
            })
            .catch(() => {});
        }
        onVisibleChange(false);
      })
      .catch(() => {});
  };

  const handleTest = () => {
    form
      .validateFields()
      .then(async () => {
        await testConnect(formValues)
          .then(() => {
            message.success("连接成功！");
          })
          .catch(() => {});
      })
      .catch(() => {});
  };

  return (
    <Modal
      title={title}
      open={visible}
      destroyOnClose
      maskClosable={false}
      onCancel={() => onVisibleChange(false)}
      width={572}
      onOk={onOk}
      className={`${clsPrefix}-source-modal`}
      footer={[
        <Button key="back" onClick={() => onVisibleChange(false)}>
          取消
        </Button>,
        <Button key="test" type="primary" onClick={handleTest}>
          测试连接
        </Button>,
        <Button key="submit" type="primary" onClick={onOk}>
          确定
        </Button>,
      ]}
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
          name="dataSource"
          label="数据源："
          required
          rules={[
            {
              required: true,
              message: "请选择数据源！",
            },
          ]}
        >
          <Select placeholder="请选择数据源" options={sourceOptions} />
        </Form.Item>
        <Form.Item
          name="sourceName"
          label="源名称："
          required
          rules={[
            {
              required: true,
              message: "请输入源名称！",
            },
          ]}
        >
          <Input
            placeholder="请输入源名称"
            maxLength={50}
            showCount
            allowClear
          />
        </Form.Item>
        <Form.Item name="desc" label="描述：">
          <Input.TextArea
            placeholder="请输入描述"
            maxLength={200}
            showCount
            allowClear
          />
        </Form.Item>
        <Form.Item
          name="ip"
          label="IP主机名："
          required
          rules={[
            {
              required: true,
              message: "请输入IP主机名！",
            },
          ]}
        >
          <Input placeholder="请输入IP主机名" allowClear />
        </Form.Item>
        <Form.Item
          name="port"
          label="端口："
          required
          rules={[
            {
              required: true,
              message: "请输入端口！",
            },
          ]}
        >
          <InputNumber
            placeholder="请输入端口"
            min={1}
            style={{ width: "100%" }}
          />
        </Form.Item>
        <Form.Item
          name="user"
          label="用户名："
          required
          rules={[
            {
              required: true,
              message: "请输入用户名！",
            },
          ]}
        >
          <Input placeholder="请输入用户名" allowClear autoComplete="off" />
        </Form.Item>
        <Form.Item name="psw" label="密码：">
          <Input.Password
            placeholder="请输入密码"
            allowClear
            autoComplete="new-password"
          />
        </Form.Item>
        <Form.Item
          name="dataBase"
          label="数据库名："
          required
          rules={[
            {
              required: true,
              message: "请输入数据库名！",
            },
          ]}
        >
          <Input placeholder="请输入数据库名" allowClear />
        </Form.Item>
        <Form.Item
          name="jdbcParams"
          label="jdbc连接参数："
          required={formValues.dataSource === "DOLPHINDB"}
          rules={[
            () => ({
              validator(_, value) {
                if (
                  (value || formValues.dataSource === "DOLPHINDB") &&
                  !isJson(value)
                ) {
                  return Promise.reject(
                    new Error("jdbc连接参数不是一个正确的JSON格式")
                  );
                }
                return Promise.resolve();
              },
            }),
          ]}
        >
          <Input.TextArea
            placeholder='请输入格式为{"key1":"value1","key2":"value2"}连接参数'
            autoSize={{ minRows: 2, maxRows: 6 }}
            allowClear
          />
        </Form.Item>
      </Form>
    </Modal>
  );
});
