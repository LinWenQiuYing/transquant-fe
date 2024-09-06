import {
  BenchData,
  DefaultEvaluator,
  sectorData,
} from "@transquant/space/types";
import { Form } from "antd";
import { toJS } from "mobx";
import {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from "react";
import BenchConf from "./BenchConf";
import {
  getEvaluatorFormConf,
  indicator,
  nearterm,
  perfAnalysis,
  risk,
  robustness,
  turnover,
  _return,
} from "./config";
import SectorConf from "./SectorConf";

type IEvaluatorConf = DefaultEvaluator;

interface EvaluatorConfProps {
  propData?: DefaultEvaluator | null;
}

export default forwardRef(function EvaluatorDefault(
  props: EvaluatorConfProps,
  ref
) {
  let { propData } = props;
  const benchRef = useRef<{
    benchDataList: () => Promise<BenchData[]>;
  }>(null);
  const sectorRef = useRef<{
    sectorDataList: () => Promise<sectorData[]>;
  }>(null);

  const [form] = Form.useForm();
  const [formValues] =
    useState<
      Partial<Omit<IEvaluatorConf, "benchDataList" | "sectorDataList">>
    >();

  useEffect(() => {
    propData = toJS(propData);
    const values = {
      returnList: propData?.returnList || _return,
      riskList: propData?.riskList || risk,
      indicatorList: propData?.indicatorList || indicator,
      robustnessList: propData?.robustnessList || robustness,
      nearTermList: propData?.nearTermList || nearterm,
      perfAnalysisList: propData?.perfAnalysisList || perfAnalysis,
      turnoverList: propData?.turnoverList || turnover,
    };
    form.setFieldsValue(values);
  }, [propData]);

  const validateFields = async () => {
    const values = await form.validateFields();
    return values;
  };

  useImperativeHandle(ref, () => ({
    validateFields,
    benchDataList: () => benchRef.current?.benchDataList,
    sectorDataList: () => sectorRef.current?.sectorDataList,
  }));

  const indicatorConf = getEvaluatorFormConf();
  const indicatorValues = Object.values(indicatorConf);

  return (
    <>
      <BenchConf ref={benchRef} propData={propData?.benchDataList} />
      <SectorConf ref={sectorRef} propData={propData?.sectorDataList} />
      <Form
        form={form}
        layout="vertical"
        preserve={false}
        initialValues={formValues}
      >
        {indicatorValues.map((indicator) => (
          <Form.Item
            name={indicator.name}
            key={indicator.name}
            label={indicator.label}
          >
            {indicator.children}
          </Form.Item>
        ))}
      </Form>
    </>
  );
});
