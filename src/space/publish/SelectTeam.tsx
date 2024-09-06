import { Form, Input, Select } from "antd";
import { observer } from "mobx-react";
import { forwardRef, useEffect, useImperativeHandle, useState } from "react";
import { useStores } from "../hooks";

export type SelectTeamState = {
  targetProjectName: string;
  teamId: number;
};

export interface SelectTeamProps {
  data: Partial<SelectTeamState>;
}

const defaultValues = {
  targetProjectName: "",
  teamId: undefined,
};

export default observer(
  forwardRef(function SelectTeam(props: SelectTeamProps, ref) {
    const { data } = props;
    const { teams } = useStores().publishStore;

    const [form] = Form.useForm();
    const [formValues, setFormValues] =
      useState<Partial<SelectTeamState>>(defaultValues);

    useEffect(() => {
      if (!data) return;
      setFormValues(data);
      form.setFieldsValue(data);
    }, [data]);

    const validate = async () => {
      const values = await form.validateFields();
      return values;
    };

    useImperativeHandle(ref, () => ({
      validate,
    }));

    return (
      <Form form={form} layout="vertical" initialValues={formValues}>
        <Form.Item
          name="targetProjectName"
          label="项目名称"
          rules={[
            {
              required: true,
              message:
                "名称不能为空且不能为纯数字，且只允许中文、英文、数字、和'_'",
              pattern: /^(?![0-9]+$)[\u4300-\u9fa5_a-zA-Z0-9]+$/,
            },
          ]}
        >
          <Input maxLength={15} placeholder="请输入项目名称" />
        </Form.Item>
        <Form.Item
          name="teamId"
          label="选择团队"
          rules={[{ required: true, message: "请选择团队" }]}
        >
          <Select placeholder="请选择团队">
            {teams.map((team) => (
              <Select.Option key={team.id}>{team.name}</Select.Option>
            ))}
          </Select>
        </Form.Item>
      </Form>
    );
  })
);
