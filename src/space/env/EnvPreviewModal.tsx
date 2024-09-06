import { Modal } from "antd";
import { getCode, getTradeAnalysis } from "../common/api";
import TransactionAnalysis from "../common/TransactionAnalysis";
// import FactorView from "../resource/factor-view";

interface EnvPreviewModalProps {
  strategyId: number;
  visible: boolean;
  onVisibleChange: (value: boolean) => void;
}

export default function EnvPreviewModal(props: EnvPreviewModalProps) {
  const { visible, onVisibleChange, strategyId } = props;

  return (
    <Modal
      title="交易分析"
      width="80%"
      style={{ height: "80%" }}
      open={visible}
      onCancel={() => onVisibleChange(false)}
      onOk={() => onVisibleChange(false)}
    >
      <TransactionAnalysis
        id={strategyId}
        getCode={getCode}
        getTradeAnalysis={getTradeAnalysis}
      />
    </Modal>
  );
}
