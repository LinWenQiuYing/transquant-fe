import { ajax } from "@transquant/utils";
import { useMount } from "ahooks";
import { Col, Modal, Row, Select, SelectProps } from "antd";
import { observer } from "mobx-react";
import { useState } from "react";
import { useStores } from "../../hooks";

interface EmpowerModalProps {
  projectId: number;
  visible: boolean;
  onVisibleChange: (value: boolean) => void;
}

const getFillback = async (projectId: number) => {
  return await ajax({
    url: `/tqdata/users/authed-userIds-by-project`,
    params: {
      projectId,
    },
  });
};

export default observer(function EmpowerModal(props: EmpowerModalProps) {
  const { visible, onVisibleChange, projectId } = props;
  const { users, grantProject } = useStores().projectManageStore;
  const [selectedKey, setSelectedKey] = useState<number[]>([]);

  const onChange: SelectProps["onChange"] = (key) => {
    setSelectedKey(key);
  };

  useMount(async () => {
    const fillback = await getFillback(projectId);
    setSelectedKey(fillback);
  });

  const onCancel = () => onVisibleChange(false);

  const onOk = () => {
    grantProject({ userIds: selectedKey, projectId }).then(() => {
      onVisibleChange(false);
    });
  };

  return (
    <Modal open={visible} onCancel={onCancel} title="项目授权" onOk={onOk}>
      <Row align="middle">
        <Col span={4}>用户选择：</Col>
        <Col span={20}>
          <Select
            options={users.map((item) => ({
              label: item.userName,
              value: item.id,
            }))}
            style={{ width: "100%" }}
            placeholder="请选择用户"
            value={selectedKey}
            mode="multiple"
            onChange={onChange}
          />
        </Col>
      </Row>
    </Modal>
  );
});
