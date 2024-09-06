import { Modal } from "antd";
// import BoardView from "../resource/board-view";
import "./index.less";

interface PreviewModalProps {
  id: number;
  title?: string;
  visible: boolean;
  onVisibleChange: (value: boolean) => void;
}

export default function BacktestPreviewModal(props: PreviewModalProps) {
  const { visible, onVisibleChange, id, title = "结果展示" } = props;

  return (
    <Modal
      title={title}
      width="80%"
      style={{ height: "80%" }}
      open={visible}
      onCancel={() => onVisibleChange(false)}
      onOk={() => onVisibleChange(false)}
      className="backtest-preview-modal"
    >
      {id}BoardView
      {/* <BoardView id={id} showHeader={false} showDocument={false} /> */}
    </Modal>
  );
}
