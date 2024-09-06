import { Modal } from "antd";
// import FactorView from "../resource/factor-view";

interface FactorPreviewModalProps {
  id: number;
  inspectionUUID?: number;
  title?: string;
  visible: boolean;
  onVisibleChange: (value: boolean) => void;
}

export default function FactorPreviewModal(props: FactorPreviewModalProps) {
  const {
    visible,
    onVisibleChange,
    // id,
    title = "结果展示",
    // inspectionUUID = -1,
  } = props;

  return (
    <Modal
      title={title}
      width="80%"
      style={{ height: "80%" }}
      open={visible}
      onCancel={() => onVisibleChange(false)}
      onOk={() => onVisibleChange(false)}
    >
      factorView
      {/* <FactorView
        id={id}
        showHeader={false}
        inspectionUUID={inspectionUUID}
        showDocument={false}
      /> */}
    </Modal>
  );
}
