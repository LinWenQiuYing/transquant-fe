import { Form, Input, Modal } from "antd";
import { observer } from "mobx-react";
import { useState } from "react";
import { useStores } from "../hooks";

type BaseUserGroup = {
  visible: boolean;
  onVisibleChange: (value: boolean) => void;
};

type CreateUserGroup = {
  type: "create";
} & BaseUserGroup;

type EditUserGroup = {
  type: "edit";
  data: IUserGroupValue & { id: number };
} & BaseUserGroup;

type UserGroupProps = CreateUserGroup | EditUserGroup;

export type IUserGroupValue = {
  desc: string;
  name: string;
};

const defaultValues: Partial<IUserGroupValue> = {
  name: undefined,
  desc: undefined,
};

export default observer(function UserGroupModal(props: UserGroupProps) {
  const { visible, onVisibleChange, type } = props;
  const { addGroup, updateGroup } = useStores().userGroupStore;

  const [form] = Form.useForm();
  const [formValues] = useState<Partial<IUserGroupValue>>(
    (props as EditUserGroup).data || defaultValues
  );

  const onOk = () => {
    form.validateFields().then((values: IUserGroupValue) => {
      if (type === "create") {
        addGroup(values).then(() => onVisibleChange(false));
      }
      if (type === "edit") {
        updateGroup({ ...values, id: props.data.id }).then(() =>
          onVisibleChange(false)
        );
      }
    });
  };

  return (
    <Modal
      title="添加用户组"
      open={visible}
      onCancel={() => onVisibleChange(false)}
      onOk={onOk}
    >
      <Form
        form={form}
        layout="vertical"
        preserve={false}
        initialValues={formValues}
      >
        <Form.Item
          name="name"
          label="用户组名称"
          rules={[
            {
              required: true,
            },
          ]}
        >
          <Input placeholder="请输入用户组名称" maxLength={15} />
        </Form.Item>
        <Form.Item name="desc" label="用户组描述">
          <Input.TextArea
            placeholder="请输入用户组描述"
            maxLength={100}
            showCount
          />
        </Form.Item>
      </Form>
    </Modal>
  );
});
