import { QuestionCircleOutlined } from "@ant-design/icons";
import {
  BenchData,
  CustomEvaluator,
  DefaultEvaluator,
  sectorData,
  StrategyYaml,
} from "@transquant/space/types";
import { Radio, Tooltip } from "antd";
import {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from "react";
import EvaluatorCustom from "./EvaluatorCustom";
import EvaluatorDefault from "./EvaluatorDefault";

interface EvaluatorConfProps {
  propData?: StrategyYaml | null;
}

export default forwardRef(function EvaluatorConf(
  props: EvaluatorConfProps,
  ref
) {
  const { propData } = props;
  const [evaluator, setEvaluator] = useState(1);
  const evaluatorDefaultRef = useRef<{
    validateFields: () => Promise<
      Omit<DefaultEvaluator, "benchDataList" | "sectorDataList">
    >;
    benchDataList: () => BenchData[];
    sectorDataList: () => sectorData[];
  }>(null);
  const evaluatorCustomRef = useRef<{
    validateFields: () => Promise<CustomEvaluator>;
  }>(null);

  useEffect(() => {
    if (!propData) return;
    setEvaluator(propData.evaluatorFlag);
  }, [propData]);

  const getEvaluator = async () => {
    if (evaluator === 1) {
      const baseIndicator = await evaluatorDefaultRef.current?.validateFields();
      const benchDataList = evaluatorDefaultRef.current?.benchDataList();
      const sectorDataList = evaluatorDefaultRef.current?.sectorDataList();
      return {
        defaultEvaluator: { ...baseIndicator, benchDataList, sectorDataList },
      };
    }
    if (evaluator === 2) {
      return {
        customEvaluator: await evaluatorCustomRef.current?.validateFields(),
      };
    }
    if (evaluator === 0) {
      return null;
    }
  };

  useImperativeHandle(ref, () => ({
    evaluator: getEvaluator,
    evaluatorFlag: () => evaluator,
  }));

  return (
    <div>
      <div className="mb-4">
        <span className="mr-2">评价组件配置：</span>
        <Radio.Group
          value={evaluator}
          onChange={(e) => setEvaluator(e.target.value)}
        >
          <Radio value={1}>默认评价</Radio>
          <Radio value={2}>自定义评价</Radio>
          <Radio value={0}>不评价</Radio>
        </Radio.Group>
        <Tooltip title="若选择不评价则只做回测，不对回测结果进行评价">
          <QuestionCircleOutlined className="-ml-2 text-gray-400 cursor-pointer " />
        </Tooltip>
      </div>
      {evaluator === 1 && (
        <EvaluatorDefault
          ref={evaluatorDefaultRef}
          propData={propData?.defaultEvaluator}
        />
      )}
      {evaluator === 2 && (
        <EvaluatorCustom
          ref={evaluatorCustomRef}
          propData={propData?.customEvaluator}
        />
      )}
    </div>
  );
});
