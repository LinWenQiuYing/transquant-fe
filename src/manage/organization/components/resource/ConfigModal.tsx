import {
  nameRegMessageWithoutUppercase,
  nameWithoutChineseReg,
  nameWithoutChineseRegAndUppercase,
  nameWithoutChineseRegMessage,
} from "@transquant/constants";
import { Form, Input, Modal } from "antd";
import { observer } from "mobx-react";
import { useState } from "react";
import { useStores } from "../../../hooks";

type GroupProps = {
  visible: boolean;
  onVisibleChange: (value: boolean) => void;
};

export type IGroupConfigValue = {
  dbName: string;
  teamId: number;
  spaceName: string;
};

export default observer(function ConfigModal(props: GroupProps) {
  const { visible, onVisibleChange } = props;
  const { updateTeamDBAndSpace, selectedGroup } = useStores().organizationStore;

  const [form] = Form.useForm();
  const [formValues] = useState<Partial<IGroupConfigValue>>();

  const onOk = () => {
    form.validateFields().then((values: IGroupConfigValue) => {
      updateTeamDBAndSpace({ ...values, teamId: selectedGroup!.id }).then(() =>
        onVisibleChange(false)
      );
    });
  };

  return (
    <Modal
      title="配置团队空间、团队数据库"
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
          <Input placeholder="请输入团队空间名称" maxLength={100} />
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
          <Input placeholder="请输入团队数据库名称" maxLength={100} />
        </Form.Item>
      </Form>
    </Modal>
  );
});
