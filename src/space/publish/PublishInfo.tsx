import {
  Col,
  Form,
  Input,
  Row,
  Select,
  TreeSelect,
  TreeSelectProps,
} from "antd";
import { observer } from "mobx-react";
import { forwardRef, useEffect, useImperativeHandle, useState } from "react";
import { useStores } from "../hooks";

export type PersonalAuth = {
  auth: 0 | 1;
  userId: number;
};

export type PublishInfoState = {
  authType: 0 | 1;
  comment: string;
  paths: string[];
  personalAuth: PersonalAuth[];
  reason: string;
  sourceProjectId: number;
  tags: string[];
};

interface PublishInfoProps {
  data: Partial<PublishInfoState>;
  type: 0 | 1;
  projectId: number;
}

const defaultValues: Partial<PublishInfoState> = {
  authType: 0,
  comment: "",
  paths: [],
  personalAuth: undefined,
  reason: "",
  sourceProjectId: undefined,
  tags: [],
};

export default observer(
  forwardRef(function PublishInfo(props: PublishInfoProps, ref) {
    const { data, type, projectId } = props;
    const { personalFiles, teamTags, getPersonalFolder } =
      useStores().publishStore;

    const [form] = Form.useForm();

    const [formValues, setFormValues] =
      useState<Partial<PublishInfoState>>(defaultValues);

    useEffect(() => {
      if (!data) return;
      setFormValues(data);
      form.setFieldsValue(data);
    }, [data]);

    const validate = async () => {
      let values = await form.validateFields();

      values = { ...values, ...{ personalAuth: formValues.personalAuth } };
      return values;
    };

    useImperativeHandle(ref, () => ({
      validate,
    }));

    const onFormValueChange = (value: any) => {
      if ("authType" in value) {
        value = { authType: +value.authType };
      }

      setFormValues({ ...formValues, ...value });
    };

    const onLoadData: TreeSelectProps["loadData"] = async ({ id }) => {
      await getPersonalFolder({ type, projectId, path: id });
      return new Promise((resolve) => {
        resolve(undefined);
      });
    };

    return (
      <Form form={form} layout="vertical" onValuesChange={onFormValueChange}>
        <Row justify="space-between">
          <Col span={11}>
            <Form.Item name="paths" label="文件列表">
              <TreeSelect
                treeData={personalFiles}
                placeholder="文件列表"
                loadData={onLoadData}
                treeDataSimpleMode
              />
            </Form.Item>
          </Col>
          <Col span={11}>
            <Form.Item
              name="reason"
              label="申请原因"
              rules={[{ required: true }]}
            >
              <Input placeholder="请输入申请原因" maxLength={50} />
            </Form.Item>
          </Col>
        </Row>
        <Form.Item name="tags" label="标签">
          <Select placeholder="请选择标签" mode="tags" tokenSeparators={[","]}>
            {teamTags.map((item) => (
              <Select.Option key={item.name}>{item.name}</Select.Option>
            ))}
          </Select>
        </Form.Item>
        <Form.Item name="comment" label="发布备注">
          <Input.TextArea placeholder="请输入发布备注" maxLength={50} />
        </Form.Item>
      </Form>
    );
  })
);
