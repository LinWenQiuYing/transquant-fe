import {
  SignalAnalysis as SignalAnalysisType,
  StrategyMatrix,
} from "@transquant/space/types";
import { ajax } from "@transquant/utils";
import { useMount } from "ahooks";
import { Form } from "antd";
import dayjs, { Dayjs } from "dayjs";
import { toJS } from "mobx";
import {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from "react";
import { getFormConf } from "./config";
import SignalAnalysis from "./SignalAnalysis";

type IMatrixConf = StrategyMatrix;

interface MatrixConfProps {
  propData?: Partial<IMatrixConf>;
}

const defaultFormValues: Partial<IMatrixConf> = {
  mode: "",
  span: [],
  codes: "",
  universe: "",
  iniCash: undefined,
  configEnum: 0,
  buyFee: undefined,
  sellFee: undefined,
  feeRate: undefined,
  stampTax: undefined,
  declarationFee: 0,
  marginRate: "auto",
  latency: undefined,
  backend: "ipython",
  marketName: "",
  marketDB: "",
  marketTable: "",
  marketMatcher: "bar",
  marketAccount: "",
  prefProfile: 0,
  analysisFlag: 0,
};

const dateFormat = "YYYY-MM-DD";

const getDataBase = async () => {
  return await ajax({
    url: `/tqlab/strategy/getDataBase`,
  });
};

const getTables = async (dbName: string) => {
  return await ajax({
    url: `/tqlab/strategy/getTables`,
    params: { dbName },
  });
};

export default forwardRef(function MatrixConf(props: MatrixConfProps, ref) {
  const { propData } = props;
  const [form] = Form.useForm();
  const baseProps: Partial<IMatrixConf> = {
    ...toJS(propData),
    span: propData?.span
      ? [
          dayjs(propData?.span?.[0], dateFormat),
          dayjs(propData?.span?.[1], dateFormat),
        ]
      : undefined,
  };
  const mergeProps = { ...defaultFormValues, ...baseProps };
  const [formValues, setFormValues] =
    useState<Partial<IMatrixConf>>(mergeProps);
  const signalAnalysisRef = useRef<{
    signalAnalysisList: SignalAnalysisType[];
  }>(null);
  const [database, setDatabase] = useState([]);
  const [tables, setTables] = useState([]);

  useMount(async () => {
    const dbs = await getDataBase();
    setDatabase(dbs);
  });

  const validateFields = async () => {
    const values = await form.validateFields();
    const span = values.span.map((item: Dayjs) =>
      dayjs(item).format(dateFormat)
    );
    return {
      ...values,
      span,
    };
  };

  useEffect(() => {
    setFormValues(mergeProps);
    form.setFieldsValue(mergeProps);
  }, [propData]);

  useImperativeHandle(ref, () => ({
    validateFields,
    signalAnalysis: () => signalAnalysisRef.current?.signalAnalysisList,
  }));

  const onFormValueChange = async (value: any) => {
    if ("marketDB" in value) {
      const _tables = await getTables(value.marketDB);
      setTables(_tables);
    }

    if ("marketName" in value && formValues.marketAccount === "detail_t0") {
      setFormValues({ ...formValues, marketAccount: undefined });
      form.setFieldValue("marketAccount", undefined);
    }

    setFormValues({ ...formValues, ...value });
  };

  const {
    span,
    codes,
    universe,
    iniCash,
    configEnum,
    feeRate,
    buyFee,
    sellFee,
    stampTax,
    declarationFee,
    marginRate,
    latency,
    backend,
    marketName,
    marketDB,
    marketTable,
    marketMatcher,
    marketAccount,
    prefProfile,
    analysisFlag,
  } = getFormConf(formValues, database, tables);

  return (
    <div>
      <Form
        form={form}
        layout="vertical"
        preserve={false}
        initialValues={formValues}
        onValuesChange={onFormValueChange}
      >
        <div className="columns-2">
          <Form.Item name={span.name} label={span.label} rules={span.rules}>
            {span.children}
          </Form.Item>
          <Form.Item name={codes.name} label={codes.label} rules={codes.rules}>
            {codes.children}
          </Form.Item>
        </div>
        <div className="columns-2">
          <Form.Item
            name={universe.name}
            rules={universe.rules}
            label={universe.label}
          >
            {universe.children}
          </Form.Item>
          <Form.Item
            name={iniCash.name}
            label={iniCash.label}
            rules={iniCash.rules}
          >
            {iniCash.children}
          </Form.Item>
        </div>
        <div className="columns-2">
          <Form.Item name={configEnum.name} label={configEnum.label}>
            {configEnum.children}
          </Form.Item>
          {formValues.configEnum === 0 ? (
            <Form.Item name={feeRate.name} label={feeRate.label}>
              {feeRate.children}
            </Form.Item>
          ) : (
            <div className="columns-2">
              <Form.Item name={buyFee.name} label={buyFee.label}>
                {buyFee.children}
              </Form.Item>
              <Form.Item name={sellFee.name} label={sellFee.label}>
                {sellFee.children}
              </Form.Item>
            </div>
          )}
        </div>
        <div className="columns-2">
          <Form.Item name={stampTax.name} label={stampTax.label}>
            {stampTax.children}
          </Form.Item>
          <Form.Item name={declarationFee.name} label={declarationFee.label}>
            {declarationFee.children}
          </Form.Item>
        </div>
        <div className="columns-2">
          <Form.Item name={marginRate.name} label={marginRate.label}>
            {marginRate.children}
          </Form.Item>
          <Form.Item name={latency.name} label={latency.label}>
            {latency.children}
          </Form.Item>
        </div>
        <div className="columns-2">
          <Form.Item name={backend.name} label={backend.label}>
            {backend.children}
          </Form.Item>
          <Form.Item className="opacity-0" />
        </div>
        <div className="columns-2">
          <Form.Item
            name={marketName.name}
            rules={marketName.rules}
            label={marketName.label}
          >
            {marketName.children}
          </Form.Item>
          <div className="columns-2">
            <Form.Item
              name={marketDB.name}
              rules={marketDB.rules}
              label={marketDB.label}
            >
              {marketDB.children}
            </Form.Item>
            <Form.Item
              name={marketTable.name}
              rules={marketTable.rules}
              label={marketTable.label}
            >
              {marketTable.children}
            </Form.Item>
          </div>
        </div>
        <div className="columns-2">
          <Form.Item
            name={marketMatcher.name}
            rules={marketMatcher.rules}
            label={marketMatcher.label}
          >
            {marketMatcher.children}
          </Form.Item>
          <Form.Item
            name={marketAccount.name}
            rules={marketAccount.rules}
            label={marketAccount.label}
          >
            {marketAccount.children}
          </Form.Item>
        </div>
        <div className="columns-2">
          <Form.Item name={prefProfile.name} label={prefProfile.label}>
            {prefProfile.children}
          </Form.Item>
          <Form.Item name={analysisFlag.name} label={analysisFlag.label}>
            {analysisFlag.children}
          </Form.Item>
        </div>
      </Form>
      {formValues.analysisFlag ? (
        <SignalAnalysis
          ref={signalAnalysisRef}
          propData={propData?.signalAnalysisList}
        />
      ) : null}
    </div>
  );
});
