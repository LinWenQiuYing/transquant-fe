import { Form, Input, Modal } from "antd";
import { observer } from "mobx-react";
import { useState } from "react";
import { useStores } from "../../../hooks";

interface RoleModalProps {
  title?: string;
  visible: boolean;
  onVisibleChange: (visible: boolean) => void;
}

export type IRoleFormValue = {
  description: string;
  name: string;
  teamId: number;
};

export default observer(function RoleModal(props: RoleModalProps) {
  const { visible, onVisibleChange, title } = props;
  const { addRoleOfTeam, selectedGroup } = useStores().organizationStore;

  const [form] = Form.useForm();
  const [formValues] = useState<Partial<IRoleFormValue>>();

  const onAddOk = () => {
    form.validateFields().then((values) => {
      addRoleOfTeam({ ...values, teamId: selectedGroup!.id }).then(() =>
        onVisibleChange(false)
      );
    });
  };

  return (
    <Modal
      title={title}
      open={visible}
      destroyOnClose
      maskClosable={false}
      onCancel={() => onVisibleChange(false)}
      width={600}
      onOk={onAddOk}
    >
      <Form
        layout="vertical"
        form={form}
        initialValues={formValues}
        preserve={false}
      >
        <Form.Item
          name="name"
          label="角色名称"
          rules={[{ required: true, message: "请输入角色名称" }]}
        >
          <Input placeholder="请输入角色名称" />
        </Form.Item>
        <Form.Item name="description" label="角色描述">
          <Input placeholder="请输入角色描述" />
        </Form.Item>
      </Form>
    </Modal>
  );
});
