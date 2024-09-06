import { OLD_PASSWORD } from "@transquant/constants";
import { DataType } from "@transquant/utils";
import { Button, Form, Input, Modal, Popconfirm, Select } from "antd";
import { observer } from "mobx-react";
import { useEffect, useState } from "react";
import { Else, If, Then, When } from "react-if";
import { useStores } from "../hooks";
import { UserItem } from "../types";
import { UserStatus } from "./UserTable";

interface UserModalProps {
  title?: string;
  data?: DataType<UserItem>;
  visible: boolean;
  onVisibleChange: (value: boolean) => void;
}

interface UserInfo {
  username: string;
  password: string;
  team: number | undefined;
  roles: undefined | number[];
  name: string;
  status?: UserStatus;
  email: string;
  telephone?: string;
  position?: number;
}

const statusOptions = [
  { id: 0, value: "正常" },
  // { id: 1, value: "删除" },
  { id: 2, value: "停用" },
  { id: 3, value: "挂起" },
];

const defaultFormValues: UserInfo = {
  username: "",
  password: OLD_PASSWORD,
  team: undefined,
  roles: undefined,
  status: UserStatus.停用,
  name: "",
  email: "",
  telephone: "",
};

export default observer(function UserModal(props: UserModalProps) {
  const { title, data, visible, onVisibleChange } = props;

  const { createUser, updateUser, resetPassword, createLoading } =
    useStores().userStore;
  const isEdit = "data" in props;

  const [form] = Form.useForm();
  const [formValues] = useState(defaultFormValues);

  useEffect(() => {
    if (isEdit) {
      form.setFieldsValue({
        ...defaultFormValues,
        ...data,
        ...{ name: data?.realName },
      });
    }
  }, [data, visible]);

  const onConfirm = () => {
    if (data) {
      resetPassword(data.id);
    }
  };

  const onOk = async () => {
    form.validateFields().then(async (values) => {
      if (isEdit) {
        await updateUser({ ...values, id: data?.id });
      } else {
        await createUser(values);
      }
      onVisibleChange(false);
    });
  };

  return (
    <Modal
      title={title}
      open={visible}
      destroyOnClose
      maskClosable={false}
      onCancel={() => onVisibleChange(false)}
      width={500}
      onOk={onOk}
      confirmLoading={createLoading}
    >
      <Form
        labelCol={{ span: 4 }}
        wrapperCol={{ span: 20 }}
        form={form}
        initialValues={formValues}
        preserve={false}
      >
        <Form.Item
          name="username"
          label="用户名"
          rules={[
            {
              required: true,
              message: "用户名不能使用中文和空格且长度不能小于4",
              pattern: /^[_a-zA-Z0-9]{4,}$/,
            },
          ]}
        >
          <Input
            placeholder="请输入用户名"
            disabled={isEdit}
            autoComplete="off"
            maxLength={15}
          />
        </Form.Item>
        <Form.Item name="password" label="密码">
          <If condition={!isEdit}>
            <Then>
              <Input disabled value={formValues.password} />
            </Then>
            <Else>
              <Popconfirm
                title="确定要重置该用户密码吗？"
                onConfirm={onConfirm}
              >
                <Button type="primary" style={{ marginRight: 8 }}>
                  重置
                </Button>
              </Popconfirm>
              <span>(重置后密码：{OLD_PASSWORD})</span>
            </Else>
          </If>
        </Form.Item>
        <When condition={isEdit}>
          <Form.Item name="status" label="用户状态">
            <Select value={formValues.roles} placeholder="请选择用户状态">
              {statusOptions.map((status) => (
                <Select.Option value={status.id} key={status.id}>
                  {status.value}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
        </When>
        <Form.Item
          name="name"
          label="姓名"
          getValueFromEvent={(e) =>
            e.target.value.replace(/(^\s*)|(\s*$)/g, "")
          }
          rules={[{ required: true, message: "姓名为必填项" }]}
        >
          <Input placeholder="请输入姓名" autoComplete="off" maxLength={15} />
        </Form.Item>
        <Form.Item
          name="email"
          label="邮箱"
          rules={[
            {
              required: true,
              message: "请输入有效邮箱",
              type: "email",
            },
          ]}
        >
          <Input placeholder="请输入邮箱" autoComplete="off" />
        </Form.Item>
        <Form.Item
          name="telephone"
          label="电话"
          rules={[
            {
              message: "请输入有效手机号",
              pattern: /^1[3-9][0-9]{9}$/,
            },
          ]}
        >
          <Input placeholder="请输入电话" autoComplete="off" />
        </Form.Item>
      </Form>
    </Modal>
  );
});
