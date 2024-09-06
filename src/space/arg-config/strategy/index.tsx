import {
  CalculateForStrategy,
  CustomEvaluator,
  DefaultEvaluator,
  SignalAnalysis,
  StrategyMatrix,
  StrategyYaml,
} from "@transquant/space/types";
import { Divider, message, Modal } from "antd";
import { useRef } from "react";
import PanelHeader from "../PanelHeader";
import CalculateConf from "./CalculateConf";
import EvaluatorConf from "./EvaluatorConf";
import MatrixConf from "./MatrixConf";

interface StrategyArgConfigProps {
  id: number;
  propData: StrategyYaml | null;
  visible: boolean;
  onVisibleChange: (value: boolean) => void;
  update: (data: Partial<StrategyYaml>, id: number) => Promise<void>;
}

export default function StrategyArgConfig(props: StrategyArgConfigProps) {
  const { visible, onVisibleChange, propData, update, id } = props;
  const matrixRef = useRef<{
    validateFields: () => Promise<Partial<StrategyMatrix>>;
    signalAnalysis: () => SignalAnalysis[];
  }>(null);
  const calculateRef = useRef<{ calculateList: CalculateForStrategy[] }>(null);
  const evaluatorRef = useRef<{
    evaluator: () => DefaultEvaluator | CustomEvaluator;
    evaluatorFlag: () => number;
  }>(null);

  const onOk = async () => {
    const signalAnalysisList = matrixRef.current?.signalAnalysis();
    let matrix = await matrixRef.current?.validateFields();
    matrix = { ...matrix, signalAnalysisList };
    const calculateList = calculateRef.current?.calculateList;

    const evaluator = await evaluatorRef.current?.evaluator();
    const evaluatorFlag = evaluatorRef.current?.evaluatorFlag();

    let valid = true;

    calculateList?.forEach((item) => {
      if (
        !item.argsList ||
        !item.className ||
        !item.filePathName ||
        !item.strategyName
      ) {
        valid = false;
      }
    });

    signalAnalysisList?.forEach((item) => {
      if (!item.dataCol || !item.strategyName) {
        valid = false;
      }
    });

    if (valid) {
      update({ matrix, calculateList, ...evaluator, evaluatorFlag }, id).then(
        () => {
          onVisibleChange(false);
        }
      );
    } else {
      message.info("请检查输入是否有误");
    }
  };

  return (
    <Modal
      title="策略配置"
      open={visible}
      onCancel={() => onVisibleChange(false)}
      onOk={onOk}
      width={1200}
      forceRender
    >
      <PanelHeader
        name={`Matrix引擎配置（研究模式：${propData?.matrix?.mode}）`}
      />
      <MatrixConf ref={matrixRef} propData={propData?.matrix} />
      <Divider />
      <PanelHeader name="策略组件配置" />
      <CalculateConf ref={calculateRef} propData={propData?.calculateList} />
      <PanelHeader name="评价组件配置" />
      <EvaluatorConf ref={evaluatorRef} propData={propData} />
    </Modal>
  );
}
