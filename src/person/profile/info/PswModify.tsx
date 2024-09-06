import { USER_TOKEN } from "@transquant/constants";
import { encrypt, ls } from "@transquant/utils";
import { useUnmount } from "ahooks";
import { Form, Input, Modal } from "antd";
import { observer } from "mobx-react";
import { useState } from "react";
import { useStores } from "../../hooks";

interface PswModifyProps {
  visible: boolean;
  onVisibleChange: (value: boolean) => void;
}

const PASSWD_REGREXP =
  /^(?![A-Za-z]+$)(?![A-Z\d]+$)(?![A-Z\W_]+$)(?![a-z\d]+$)(?![a-z\W_]+$)(?![\d\W_]+$)\S[^#]{7,15}$/;

// eslint-disable-next-line camelcase
const password_help_message =
  "密码至少由 8 位数构成，需包含大写字母、小写字母、数字和特殊字符(不含#)中的三种";

const defaultValue = {
  oldPassword: "",
  newPassword: "",
  confirmPassword: "",
};

export default observer(function PswModify(props: PswModifyProps) {
  const { visible, onVisibleChange } = props;
  const { changePassword } = useStores().profileStore;

  const [newHelpText, setNewHelpText] = useState("");
  const [confirmHelpText, setConfirmHelpText] = useState("");

  const [form] = Form.useForm();
  const [formValues, setFormValues] = useState(defaultValue);

  useUnmount(() => {
    setFormValues(defaultValue);
    setNewHelpText("");
    setConfirmHelpText("");
    form.setFieldsValue(defaultValue);
  });

  const onFormValueChange = (value: any) => {
    if ("newPassword" in value && formValues.confirmPassword) {
      const values = { ...formValues, ...value, confirmPassword: "" };
      form.setFieldsValue(values);
      setConfirmHelpText("");
      return setFormValues(values);
    }

    if ("newPassword" in value || "oldPassword" in value) {
      if (
        value.newPassword === formValues.oldPassword ||
        value.oldPassword === formValues.newPassword
      ) {
        setNewHelpText("新密码不能和旧密码相同");
      } else {
        setNewHelpText("");
      }
    }

    if ("confirmPassword" in value) {
      if (value.confirmPassword !== formValues.newPassword) {
        setConfirmHelpText("两次新密码输入不一致");
      } else {
        setConfirmHelpText("");
      }
    }

    setFormValues({ ...formValues, ...value });
  };

  const onAddOk = () => {
    form
      .validateFields()
      .then(() => {
        if (formValues.newPassword !== formValues.confirmPassword) {
          return;
        }

        const key = ls.getItem(USER_TOKEN).slice(0, 16);

        const newPassword = encrypt(formValues.newPassword, key);
        const oldPassword = encrypt(formValues.oldPassword, key);

        changePassword({
          newPassword,
          oldPassword,
        }).then(() => {
          onVisibleChange(false);
        });
      })
      .catch(() => {
        if (formValues.newPassword !== formValues.confirmPassword) {
          return;
        }
        setNewHelpText(password_help_message);
        setConfirmHelpText(password_help_message);
      });
  };

  return (
    <Modal
      title="修改密码"
      open={visible}
      destroyOnClose
      maskClosable={false}
      onCancel={() => onVisibleChange(false)}
      width={740}
      onOk={onAddOk}
    >
      <Form
        form={form}
        initialValues={formValues}
        onValuesChange={onFormValueChange}
        labelCol={{ span: 5 }}
        requiredMark={false}
        preserve={false}
      >
        <Form.Item
          name="oldPassword"
          label="原密码"
          rules={[{ required: true, message: "原密码为必填项" }]}
        >
          <Input.Password placeholder="请输入原密码" />
        </Form.Item>
        <Form.Item
          name="newPassword"
          label="新密码"
          validateStatus={newHelpText ? "error" : "validating"}
          help={newHelpText}
          rules={[
            {
              required: true,
              message: password_help_message,
              pattern: PASSWD_REGREXP,
            },
          ]}
        >
          <Input.Password
            placeholder="请输入新密码"
            minLength={8}
            maxLength={16}
          />
        </Form.Item>
        <Form.Item
          name="confirmPassword"
          label="确认新密码"
          validateStatus={confirmHelpText ? "error" : "validating"}
          help={confirmHelpText}
          rules={[
            {
              required: true,
              message: password_help_message,
              pattern: PASSWD_REGREXP,
            },
          ]}
        >
          <Input.Password
            placeholder="请再次输入新密码"
            minLength={8}
            maxLength={16}
          />
        </Form.Item>
      </Form>
    </Modal>
  );
});
