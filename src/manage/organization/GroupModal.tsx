import {
  nameReg,
  nameRegMessage,
  nameRegMessageWithoutUppercase,
  nameWithoutChineseReg,
  nameWithoutChineseRegAndUppercase,
  nameWithoutChineseRegMessage,
} from "@transquant/constants";
import { Form, Input, Modal } from "antd";
import { observer } from "mobx-react";
import { useMemo, useState } from "react";
import { useStores } from "../hooks";

type BaseGroup = {
  visible: boolean;
  onVisibleChange: (value: boolean) => void;
};

type CreateGroup = {
  parentTeamId: number;
  type: "create";
} & BaseGroup;

type EditGroup = {
  type: "edit";
  teamId: number;
  data: IGroupValue;
} & BaseGroup;

type GroupProps = CreateGroup | EditGroup;

export type IGroupValue = {
  contacter: string;
  contacterInfo: string;
  dbName: string;
  description: string;
  name: string;
  parentTeamId: number;
  teamId: number;
  spaceName: string;
};

const defaultFormValues: Partial<IGroupValue> = {};

export default observer(function GroupModal(props: GroupProps) {
  const { visible, onVisibleChange, type } = props;
  const { addTeam, updateTeam } = useStores().organizationStore;

  const isEdit = useMemo(() => type === "edit", [type]);

  const [form] = Form.useForm();
  const [formValues] = useState<Partial<IGroupValue>>(
    (props as EditGroup).data || defaultFormValues
  );

  const onOk = () => {
    form.validateFields().then((values: IGroupValue) => {
      if (type === "create") {
        addTeam({ ...values, parentTeamId: props.parentTeamId }).then(() =>
          onVisibleChange(false)
        );
      }
      if (type === "edit") {
        updateTeam({ ...values, teamId: props.teamId }).then(() =>
          onVisibleChange(false)
        );
      }
    });
  };

  return (
    <Modal
      title={type === "create" ? "添加团队" : "编辑团队"}
      open={visible}
      onCancel={() => onVisibleChange(false)}
      onOk={onOk}
    >
      <Form
        form={form}
        preserve={false}
        layout="vertical"
        initialValues={formValues}
      >
        <Form.Item
          name="name"
          label="团队名称"
          rules={[
            {
              required: true,
              message: nameRegMessage,
              pattern: nameReg,
            },
          ]}
        >
          <Input
            placeholder="请输入团队名称"
            maxLength={20}
            disabled={isEdit}
          />
        </Form.Item>
        <Form.Item
          name="spaceName"
          label="团队空间名称"
          rules={[
            {
              required: true,
              message: nameWithoutChineseRegMessage,
              pattern: nameWithoutChineseReg,
            },
          ]}
        >
          <Input
            placeholder="请输入团队空间名称"
            maxLength={100}
            disabled={isEdit}
          />
        </Form.Item>
        <Form.Item
          name="dbName"
          label="团队数据库名称"
          rules={[
            {
              required: true,
              pattern: nameWithoutChineseRegAndUppercase,
              message: nameRegMessageWithoutUppercase,
            },
          ]}
        >
          <Input
            placeholder="请输入团队数据库名称"
            maxLength={100}
            disabled={isEdit}
          />
        </Form.Item>
        <Form.Item name="contacter" label="团队联系人">
          <Input placeholder="请输入团队联系人" maxLength={100} />
        </Form.Item>
        <Form.Item name="contacterInfo" label="团队联系人联系方式">
          <Input placeholder="请输入团队联系人联系方式" maxLength={100} />
        </Form.Item>
        <Form.Item name="description" label="团队介绍">
          <Input.TextArea
            placeholder="请输入团队介绍"
            maxLength={100}
            showCount
          />
        </Form.Item>
      </Form>
    </Modal>
  );
});
