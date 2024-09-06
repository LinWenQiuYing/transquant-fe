import { Col, Input, Modal, Row } from "antd";
import { observer } from "mobx-react";
import { useState } from "react";
import { useStores } from "../../hooks";

interface RejectModalProps {
  visible: boolean;
  onVisibleChange: (value: boolean) => void;
}

export default observer(function RejectModal(props: RejectModalProps) {
  const { visible, onVisibleChange } = props;
  const { rejectApproval, approvalInfo } = useStores().publishStore;

  const [rejectComment, setRejectComment] = useState("");

  const onOk = async () => {
    await rejectApproval({
      comment: rejectComment,
      processInstanceId: approvalInfo!.id,
    });
    onVisibleChange(false);
  };

  return (
    <Modal
      title="驳回"
      open={visible}
      onCancel={() => onVisibleChange(false)}
      onOk={onOk}
    >
      <Row>
        <Col span={3}>原因：</Col>
        <Col span={21}>
          <Input.TextArea
            value={rejectComment}
            onChange={(e) => setRejectComment(e.target.value)}
            placeholder="请输入驳回原因"
          />
        </Col>
      </Row>
    </Modal>
  );
});
