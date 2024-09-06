import { Input, Modal, Row } from "antd";
import { observer } from "mobx-react";
import { useState } from "react";
import { useStores } from "../../hooks";

interface CommitModalProps {
  shareId: string;
  visible: boolean;
  onVisibleChange: (value: boolean) => void;
}

export default observer(function CommitModal(props: CommitModalProps) {
  const { visible, onVisibleChange, shareId } = props;
  const { commitCode } = useStores().shareStore;
  const [remark, setRemark] = useState("");

  const onOk = () => {
    commitCode({ remark, shareId });
    onVisibleChange(false);
  };

  return (
    <Modal
      title="提交代码"
      open={visible}
      onCancel={() => onVisibleChange(false)}
      onOk={onOk}
      destroyOnClose
    >
      <Row>
        <Input.TextArea
          placeholder="请输入代码说明"
          value={remark}
          onChange={(e) => setRemark(e.target.value)}
          maxLength={100}
        />
      </Row>
    </Modal>
  );
});
