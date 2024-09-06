import { DataType, isArray } from "@transquant/utils";
import { Form, Modal, Select } from "antd";
import { observer } from "mobx-react";
import { useEffect, useState } from "react";
import { useStores } from "../../../hooks";
import { MemberItem } from "../../../types";

const { Option } = Select;

interface MemberModalProps {
  title?: string;
  data?: DataType<MemberItem>;
  visible: boolean;
  onVisibleChange: (visible: boolean) => void;
}

const defaultFormValues = {
  roleId: undefined,
  userIds: undefined,
};

export default observer(function MemberModal(props: MemberModalProps) {
  const { visible, onVisibleChange, title, data } = props;
  const { organizationStore } = useStores();
  const {
    roleList,
    filterAllUsers,
    addMemberOfTeam,
    allUsersSearchValue,
    onAllUsersSearchValueChange,
    selectedGroup,
    updateUserRole,
  } = organizationStore;

  const isEdit = "data" in props;

  const [form] = Form.useForm();
  const [formValues] = useState(defaultFormValues);

  useEffect(() => {
    if (isEdit) {
      form.setFieldsValue({
        ...defaultFormValues,
        ...{ roleId: data?.roles.map((item) => item.id) },
      });
    }
  }, [data, visible]);

  const onAddOk = () => {
    form.validateFields().then((values) => {
      if (isEdit) {
        updateUserRole({
          roleId: isArray(values.roleId) ? values.roleId[0] : values.roleId,
          userId: data!.id,
        });
      } else {
        const userIds = values.userIds.map(
          (item: { value: number }) => item.value
        );
        addMemberOfTeam({
          ...values,
          userIds,
          teamId: selectedGroup!.id,
        });
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
      width={550}
      onOk={onAddOk}
    >
      <Form
        layout="vertical"
        form={form}
        initialValues={formValues}
        preserve={false}
      >
        {!isEdit && (
          <Form.Item
            name="userIds"
            label="选择添加的用户"
            rules={[{ required: true, message: "请选择添加的用户" }]}
          >
            <Select
              placeholder="请选择添加的用户"
              onSearch={onAllUsersSearchValueChange}
              searchValue={allUsersSearchValue}
              filterOption={false}
              labelInValue
              showSearch
              mode="multiple"
            >
              {filterAllUsers.map((item) => (
                <Option value={item.id} key={item.id}>
                  {`${item.realName}`}
                </Option>
              ))}
            </Select>
          </Form.Item>
        )}
        <Form.Item
          name="roleId"
          label="选择赋予的角色"
          rules={[{ required: true, message: "请选择赋予的角色" }]}
        >
          <Select placeholder="请选择赋予的角色">
            {roleList.map((item) => (
              <Option value={item.id} key={item.id}>
                {item.name}
              </Option>
            ))}
          </Select>
        </Form.Item>
      </Form>
    </Modal>
  );
});
