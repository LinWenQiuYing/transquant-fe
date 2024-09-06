import { Modal, Select } from "antd";
import { observer } from "mobx-react";
import { useMemo, useState } from "react";
import { useStores } from "../hooks";

type User = {
  label: string;
  value: number;
  key: number;
};

export default observer(function AddMemberModal(props: {
  visible: boolean;
  onVisibleChange: (value: boolean) => void;
}) {
  const { visible, onVisibleChange } = props;
  const { users, addGroupMember } = useStores().userGroupStore;
  const [selectedUsers, setSelectedUsers] = useState<User[]>([]);
  const [searchValue, setSearchValue] = useState("");

  const onSearch = (value: string) => {
    setSearchValue(value);
  };

  const onChange = (value: User[]) => {
    setSelectedUsers(value);
  };

  const onOk = () => {
    const ids = selectedUsers.map((user) => user.value);
    addGroupMember(ids);
    onVisibleChange(false);
  };

  const options = useMemo(() => {
    return users
      .map((user) => ({
        label: user.realName,
        value: user.id,
      }))
      .filter((user) => user.label.includes(searchValue));
  }, [users, searchValue]);

  return (
    <Modal
      title="添加成员"
      open={visible}
      onCancel={() => onVisibleChange(false)}
      onOk={onOk}
    >
      <Select
        className="w-full"
        options={options}
        placeholder="请选择用户"
        value={selectedUsers}
        onSearch={onSearch}
        searchValue={searchValue}
        mode="multiple"
        onChange={onChange}
        showSearch
        filterOption={false}
        labelInValue
      />
    </Modal>
  );
});
