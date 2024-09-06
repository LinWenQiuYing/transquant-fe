import {
  Calculate,
  FactorEvaluator,
  FactorMatrix,
  FactorYaml,
} from "@transquant/space/types";
import { Divider, message, Modal } from "antd";
import { isEmpty } from "lodash-es";
import { useRef } from "react";
import PanelHeader from "../PanelHeader";
import CalculateConf from "./CalculateConf";
import EvaluatorConf from "./EvaluatorConf";
import MatrixConf from "./MatrixConf";

interface FactorArgConfigProps {
  id: number;
  propData: FactorYaml | null;
  visible: boolean;
  onVisibleChange: (value: boolean) => void;
  update: (data: Partial<FactorYaml>, id: number) => Promise<void>;
}

export default function FactorArgConfig(props: FactorArgConfigProps) {
  const { visible, onVisibleChange, propData, update, id } = props;
  const matrixRef = useRef<{ validateFields: () => Promise<FactorMatrix> }>(
    null
  );
  const calculateRef = useRef<{ calculateList: Calculate[] }>(null);
  const evaluatorRef = useRef<{
    validateFields: () => Promise<FactorEvaluator>;
  }>(null);

  const onOk = async () => {
    const matrix = await matrixRef.current?.validateFields();
    const calculateList = calculateRef.current?.calculateList;
    const factorEvaluator = await evaluatorRef.current?.validateFields();

    let valid = true;

    calculateList?.forEach((item) => {
      if (
        !item.argsList ||
        !item.className ||
        !item.filePathName ||
        !item.factorName
      ) {
        valid = false;
      }
    });

    if (valid) {
      update(
        {
          matrix,
          factorEvaluator: isEmpty(factorEvaluator) ? null : factorEvaluator,
          calculateList,
        },
        id
      ).then(() => {
        onVisibleChange(false);
      });
    } else {
      message.info("请检查输入是否有误");
    }
  };

  return (
    <Modal
      title="因子配置"
      open={visible}
      onCancel={() => onVisibleChange(false)}
      onOk={onOk}
      width={1200}
      forceRender
    >
      <PanelHeader
        name={`Matrix引擎配置（研究模式：${propData?.matrix.mode}）`}
      />
      <MatrixConf ref={matrixRef} propData={propData?.matrix} />

      <Divider dashed />

      <PanelHeader name="因子计算组件配置" />
      <CalculateConf ref={calculateRef} propData={propData?.calculateList} />

      <Divider />

      <PanelHeader name="评价组件配置" />
      <EvaluatorConf ref={evaluatorRef} propData={propData?.factorEvaluator} />
    </Modal>
  );
}
